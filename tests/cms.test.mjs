import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import worker,{CmsStore,passwordHash} from '../cms/worker.mjs';
import {validateContent,safeUrl,validateUpload} from '../cms/schema.mjs';
import {GitHubStore} from '../cms/github.mjs';
const content=JSON.parse(readFileSync(new URL('../content/site.json',import.meta.url),'utf8'));
const head='a'.repeat(40), next='b'.repeat(40);
const env={ADMIN_USERNAME:'test-owner',ADMIN_PASSWORD_SALT:'test-salt',ADMIN_PASSWORD_HASH:await passwordHash('test-only-password','test-salt'),GITHUB_TOKEN:'test-only',GITHUB_REPOSITORY:'owner/repo',ALLOWED_ORIGINS:'https://owner.github.io'};
class Storage{map=new Map();alarm=null;async get(k){return this.map.get(k);}async put(k,v){this.map.set(k,v);}async delete(k){for(const x of Array.isArray(k)?k:[k])this.map.delete(x);}async list(){return this.map;}async setAlarm(a){this.alarm=a;}async getAlarm(){return this.alarm;}async transaction(fn){return fn(this);}}
function fixture(){const storage=new Storage();const store=new CmsStore({storage},env);store.github={read:async()=>({sha:head,content}),publish:async()=>({sha:next})};return {storage,store};}
function req(path,body,token){return new Request('https://cms.example'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});}
test('CMS schema accepts shipped content and rejects executable URLs, duplicate IDs, missing categories',()=>{
 assert.deepEqual(validateContent(content),content);
 for(const v of ['javascript:alert(1)','data:text/html,x','//evil.example','https://host/\"x','https://host/\\x'])assert.equal(safeUrl(v),false,v);
 for(const v of ['/portfolio?category=food','https://example.com/p','tel:09173673306'])assert.equal(safeUrl(v),true);
 const duplicate=structuredClone(content);duplicate.works.push(duplicate.works[0]);assert.throws(()=>validateContent(duplicate));
 const wrong=structuredClone(content);wrong.works[0].category='unknown';assert.throws(()=>validateContent(wrong));
 const extra=structuredClone(content);extra.secret='no';assert.throws(()=>validateContent(extra));
});
test('CMS WebP upload validation rejects traversal, fake images and large requests',()=>{
 const base64=readFileSync(new URL('../public/images/portrait.webp',import.meta.url)).toString('base64');
 const path='/images/cms-12345678-1234-1234-1234-123456789abc.webp';
 assert.equal(validateUpload({path,base64}).path,path);
 assert.throws(()=>validateUpload({path:'/images/../../x.webp',base64}));
 assert.throws(()=>validateUpload({path,base64:Buffer.from('not an image').toString('base64')}));
 assert.throws(()=>validateUpload({path,base64:'a'.repeat(2800001)}));
});
test('CMS login, bearer sessions, expiration and logout protect content',async()=>{
 const {store,storage}=fixture();assert.equal((await store.fetch(req('/content'))).status,401);
 assert.equal((await store.fetch(req('/login',{username:env.ADMIN_USERNAME,password:'wrong'}))).status,401);
 const login=await store.fetch(req('/login',{username:env.ADMIN_USERNAME,password:'test-only-password'}));assert.equal(login.status,200);const {token}=await login.json();
 assert.equal((await store.fetch(req('/content',null,token))).status,200);
 assert.equal((await store.fetch(req('/logout',{},token))).status,200);
 assert.equal((await store.fetch(req('/content',null,token))).status,401);
 assert.ok(storage.alarm);
});
test('CMS invalid login throttling persists and schedules cleanup',async()=>{
 const {store,storage}=fixture();for(let i=0;i<5;i++)assert.equal((await store.fetch(req('/login',{username:'test',password:'wrong'}))).status,401);
 assert.equal((await store.fetch(req('/login',{username:'test',password:'wrong'}))).status,429);
 const restarted=new CmsStore({storage},env);assert.equal((await restarted.fetch(req('/login',{username:'test',password:'wrong'}))).status,429);
 assert.ok(storage.alarm);await storage.put('expired',{exp:0});await store.alarm();assert.equal(await storage.get('expired'),undefined);
});
test('CMS rejects other origins and allows explicit CORS preflight',async()=>{
 assert.equal((await worker.fetch(new Request('https://cms.example/content',{headers:{Origin:'https://evil.example'}}),env)).status,403);
 const r=await worker.fetch(new Request('https://cms.example/login',{method:'OPTIONS',headers:{Origin:env.ALLOWED_ORIGINS}}),env);assert.equal(r.status,204);assert.equal(r.headers.get('Access-Control-Allow-Origin'),env.ALLOWED_ORIGINS);
});
function githubFixture(){const calls=[];const store=new GitHubStore(env,async(url,options)=>{const p=new URL(url).pathname;const data=options.body?JSON.parse(options.body):null;calls.push({p,method:options.method,data});let result={};if(p.endsWith('/git/ref/heads/main'))result={object:{sha:head}};else if(p.includes('/git/commits/')&&options.method==='GET')result={tree:{sha:'tree'}};else if(p.endsWith('/git/trees/tree'))result={tree:readdirSync(new URL('../public/images',import.meta.url)).map(path=>({path:'public/images/'+path,type:'blob'}))};else if(p.endsWith('/git/trees'))result={sha:'newtree'};else if(p.endsWith('/git/commits'))result={sha:next};else if(p.endsWith('/git/blobs'))result={sha:'blob'};return Response.json(result);});return{store,calls};}
test('CMS publishes atomic content-only commits and never forces main',async()=>{const{store,calls}=githubFixture();const result=await store.publish({sha:head,content,assets:[],deletes:[]});assert.equal(result.sha,next);const tree=calls.find(x=>x.p.endsWith('/git/trees'));assert.deepEqual(tree.data.tree.map(x=>x.path),['content/site.json']);assert.deepEqual(calls.at(-1).data,{sha:next,force:false});});
test('CMS conflicts and deletion of used images cannot mutate repository',async()=>{const{store,calls}=githubFixture();await assert.rejects(store.publish({sha:next,content}),e=>e.status===409);assert.ok(calls.every(x=>x.method==='GET'));await assert.rejects(store.publish({sha:head,content,deletes:[content.site.portrait]}),e=>e.status===400);assert.ok(calls.every(x=>x.method==='GET'));const broken=structuredClone(content);broken.site.portrait='/images/missing.webp';await assert.rejects(store.publish({sha:head,content:broken}),e=>e.status===400);});
