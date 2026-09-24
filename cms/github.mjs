import { validateContent, validateUpload, imagePath } from './schema.mjs';
export class HttpError extends Error { constructor(status,message){super(message);this.status=status;} }
export class GitHubStore {
  constructor(env,fetcher=fetch){this.env=env;this.fetcher=fetcher;this.root=`https://api.github.com/repos/${env.GITHUB_REPOSITORY}`;}
  async api(path,method='GET',body){
    const r=await this.fetcher(this.root+path,{method,headers:{'Authorization':`Bearer ${this.env.GITHUB_TOKEN}`,'User-Agent':'Ehsan-Portfolio-CMS','Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2026-03-10',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
    if(!r.ok)throw new HttpError(r.status===409||r.status===422?409:502,r.status===409||r.status===422?'نسخهٔ مخزن تغییر کرده است. ابتدا محتوا را دوباره دریافت کنید.':'ارتباط با مخزن انجام نشد. تنظیمات دسترسی سرور را بررسی کنید.');
    return r.status===204?null:r.json();
  }
  async head(){return (await this.api('/git/ref/heads/main')).object.sha;}
  async read(){
    const sha=await this.head();const commit=await this.api(`/git/commits/${sha}`);
    const [file,tree]=await Promise.all([this.api(`/contents/content/site.json?ref=${sha}`),this.api(`/git/trees/${commit.tree.sha}?recursive=1`)]);
    if(tree.truncated)throw new HttpError(502,'فهرست فایل‌ها ناقص است.');
    const content=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(file.content.replace(/\s/g,'')),c=>c.charCodeAt(0))));
    const media=tree.tree.filter(x=>x.type==='blob'&&imagePath.test(x.path.replace(/^public/,''))).map(x=>({path:x.path.replace(/^public/,''),size:x.size,url:`https://raw.githubusercontent.com/${this.env.GITHUB_REPOSITORY}/${sha}/${x.path}`}));
    return {sha,content,media};
  }
  async publish(input){
    const content=validateContent(input.content);
    if(!/^[a-f0-9]{40}$/.test(input.sha||''))throw new HttpError(400,'نسخهٔ محتوا نامعتبر است.');
    if(!Array.isArray(input.assets||[])||!Array.isArray(input.deletes||[]))throw new HttpError(400,'فهرست تصاویر نامعتبر است.');
    const assets=(input.assets||[]).map(validateUpload);const deletes=input.deletes||[];
    if(assets.length>3||deletes.length>100||new Set(assets.map(a=>a.path)).size!==assets.length)throw new HttpError(400,'حداکثر سه تصویر در هر انتشار اضافه کنید.');
    const current=await this.head();if(current!==input.sha)throw new HttpError(409,'شخص یا نشست دیگری محتوا را تغییر داده است. ابتدا نسخهٔ جدید را دریافت کنید.');
    const commit=await this.api(`/git/commits/${current}`);const oldTree=await this.api(`/git/trees/${commit.tree.sha}?recursive=1`);
    if(oldTree.truncated)throw new HttpError(502,'فهرست فایل‌های مخزن ناقص است.');
    const existing=new Set(oldTree.tree.map(x=>x.path));const serialized=JSON.stringify(content,null,2)+'\n';
    if(new TextEncoder().encode(serialized).length>900000)throw new HttpError(400,'حجم محتوا بیش از حد است.');
    const available=new Set([...existing].map(p=>p.replace(/^public/,'')));assets.forEach(a=>available.add(a.path));
    const checkImages=v=>{if(Array.isArray(v))v.forEach(checkImages);else if(v&&typeof v==='object')Object.entries(v).forEach(([k,x])=>{if(['image','hero','portrait','before','after'].includes(k)&&typeof x==='string'&&x.startsWith('/images/')&&!available.has(x))throw new HttpError(400,'تصویر انتخاب‌شده در کتابخانه وجود ندارد: '+x);checkImages(x);});};checkImages(content);
    const files=[{path:'content/site.json',mode:'100644',type:'blob',content:serialized}];
    for(const d of deletes){if(typeof d!=='string'||!imagePath.test(d)||serialized.includes(d))throw new HttpError(400,'تصویر هنوز در محتوا استفاده می‌شود یا مسیر آن نامعتبر است.');
      const main='public'+d;if(!existing.has(main))throw new HttpError(400,'تصویر حذف‌شده در مخزن وجود ندارد.');
      for(const p of [main,...[320,640,960,1440,1920].map(w=>`public/images/responsive/${d.split('/').pop().replace('.webp','')}-${w}.webp`)])if(existing.has(p))files.push({path:p,mode:'100644',type:'blob',sha:null});
    }
    for(const a of assets){if(existing.has('public'+a.path))throw new HttpError(409,'نام تصویر تکراری است.');const b=await this.api('/git/blobs','POST',{content:a.base64,encoding:'base64'});files.push({path:'public'+a.path,mode:'100644',type:'blob',sha:b.sha});}
    // Commit only content and validated media. No workflow, executable or arbitrary path writes.
    const tree=await this.api('/git/trees','POST',{base_tree:commit.tree.sha,tree:files});
    const next=await this.api('/git/commits','POST',{message:'content: publish changes from private CMS',tree:tree.sha,parents:[current]});
    await this.api('/git/refs/heads/main','PATCH',{sha:next.sha,force:false});
    return {sha:next.sha,url:`https://github.com/${this.env.GITHUB_REPOSITORY}/commit/${next.sha}`};
  }
  async status(sha){if(!/^[a-f0-9]{40}$/.test(sha))throw new HttpError(400,'شناسه نامعتبر است.');
    const result=await this.api(`/actions/workflows/pages.yml/runs?head_sha=${sha}&per_page=1`);const run=result.workflow_runs[0];return run?{status:run.status,conclusion:run.conclusion,url:run.html_url}:{status:'queued',conclusion:null};}
}
