import { GitHubStore, HttpError } from './github.mjs';
const encoder=new TextEncoder();
const hex=bytes=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
export async function digest(s){return hex(await crypto.subtle.digest('SHA-256',encoder.encode(s)));}
export async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:encoder.encode(salt),iterations:100000},key,256));}
export function equal(a,b){let result=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)result|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return result===0;}
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function body(request,limit){const reader=request.body?.getReader();if(!reader)throw new HttpError(400,'درخواست خالی است.');let size=0;const chunks=[];for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw new HttpError(413,'حجم درخواست بیش از حد است.');}chunks.push(value);}const data=new Uint8Array(size);let offset=0;for(const chunk of chunks){data.set(chunk,offset);offset+=chunk.length;}try{return JSON.parse(new TextDecoder().decode(data));}catch{throw new HttpError(400,'ساختار درخواست معتبر نیست.');}}
export class CmsStore {
  constructor(ctx,env){this.ctx=ctx;this.env=env;this.github=new GitHubStore(env);}
  async throttle(key,max,period){const now=Date.now();if(!await this.ctx.storage.getAlarm())await this.ctx.storage.setAlarm(now+3600000);return this.ctx.storage.transaction(async tx=>{let entry=await tx.get(key);if(!entry||entry.exp<=now)entry={count:0,exp:now+period};if(entry.count>=max)return false;entry.count++;await tx.put(key,entry);return true;});}
  async alarm(){const entries=await this.ctx.storage.list();const expired=[...entries].filter(([,v])=>v.exp<Date.now()).map(([k])=>k);if(expired.length)await this.ctx.storage.delete(expired);await this.ctx.storage.setAlarm(Date.now()+3600000);}
  async fetch(request){try{
    const p=new URL(request.url).pathname;
    if(!this.env.ADMIN_USERNAME||!this.env.ADMIN_PASSWORD_HASH||!this.env.ADMIN_PASSWORD_SALT||!this.env.GITHUB_TOKEN)throw new HttpError(503,'اتصال امن پنل هنوز پیکربندی نشده است.');
    if(request.method==='POST'&&!request.headers.get('Content-Type')?.startsWith('application/json'))throw new HttpError(415,'نوع درخواست معتبر نیست.');
    if(p==='/login'&&request.method==='POST'){
      const ip=await digest(request.headers.get('CF-Connecting-IP')||'unknown');
      if(!await this.throttle('ip:'+ip,5,15*60000)||!await this.throttle('login:global',60,15*60000))throw new HttpError(429,'تلاش‌های ورود زیاد است. پانزده دقیقه بعد دوباره امتحان کنید.');
      const d=await body(request,2048);if(typeof d.username!=='string'||typeof d.password!=='string'||d.password.length>200)throw new HttpError(400,'اطلاعات ورود نامعتبر است.');
      const hash=await passwordHash(d.password,this.env.ADMIN_PASSWORD_SALT);
      if(!equal(hash,this.env.ADMIN_PASSWORD_HASH)||!equal(d.username,this.env.ADMIN_USERNAME))throw new HttpError(401,'نام کاربری یا رمز عبور صحیح نیست.');
      const token=hex(crypto.getRandomValues(new Uint8Array(32)));const exp=Date.now()+2*3600000;
      await this.ctx.storage.put('session:'+await digest(token),{exp});await this.ctx.storage.setAlarm(Date.now()+3600000);
      return json({token,expiresAt:exp});
    }
    const token=request.headers.get('Authorization')?.replace(/^Bearer /,'');if(!token||!/^[a-f0-9]{64}$/.test(token))throw new HttpError(401,'ابتدا وارد پنل شوید.');
    const sessionKey='session:'+await digest(token);const session=await this.ctx.storage.get(sessionKey);if(!session||session.exp<Date.now())throw new HttpError(401,'نشست شما منقضی شده است؛ دوباره وارد شوید.');
    if(p==='/logout'&&request.method==='POST'){await this.ctx.storage.delete(sessionKey);return json({ok:true});}
    if(p==='/content'&&request.method==='GET')return json(await this.github.read());
    if(p==='/publish'&&request.method==='POST'){
      if(!await this.throttle('publish',10,60000))throw new HttpError(429,'کمی صبر کنید و دوباره منتشر کنید.');
      const input=await body(request,9*1024*1024);return json(await this.github.publish(input));
    }
    if(p==='/status'&&request.method==='GET')return json(await this.github.status(new URL(request.url).searchParams.get('sha')||''));
    throw new HttpError(404,'مسیر پیدا نشد.');
  }catch(error){return json({error:error.status?error.message:'پردازش انجام نشد. محتوا یا تنظیمات اتصال را بررسی کنید.'},error.status||400);}}
}
export default {async fetch(request,env){
  const origin=request.headers.get('Origin');const allowed=(env.ALLOWED_ORIGINS||'').split(',');
  if(!origin||!allowed.includes(origin))return json({error:'مبدأ درخواست مجاز نیست.'},403);
  const cors={'Access-Control-Allow-Origin':origin,'Vary':'Origin','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Max-Age':'600'};
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  const response=await env.CMS.get(env.CMS.idFromName('owner')).fetch(request);const headers=new Headers(response.headers);for(const [k,v] of Object.entries(cors))headers.set(k,v);return new Response(response.body,{status:response.status,headers});
}};
