import { z } from 'zod';
import template from '../content/schema-template.json' with { type: 'json' };
export const safeUrl = value => value === '' || /^(\/(?!\/)[a-zA-Z0-9_/?#%=&.\-]*|#[a-zA-Z0-9_-]+|https:\/\/[^\s<>"\\]+|tel:\+?[0-9]+|mailto:[^\s<>]+)$/.test(value);
const text = z.string().max(8000);
const url = text.refine(safeUrl,'لینک باید مسیر داخلی یا نشانی امن https باشد.');
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(70);
function shape(value, key = '') {
  if (typeof value === 'boolean') return z.boolean();
  if (typeof value === 'number') return z.number().finite().min(0).max(100000);
  if (typeof value === 'string') return ['image','before','after','video','hero','portrait','heroVideo','tariffPdf','instagram','whatsapp'].includes(key) ? url : text;
  if (Array.isArray(value)) return z.array(value.length ? shape(value[0]) : z.object({name:text,text,role:text}).strict()).max(500);
  return z.object(Object.fromEntries(Object.entries(value).map(([k,v])=>[k,shape(v,k)]))).strict();
}
const work = z.object({id:slug,title:text,category:text,image:url,width:z.number().int().min(1).max(30000),height:z.number().int().min(1).max(30000),alt:text,description:text,featured:z.boolean().optional(),video:url.optional(),before:url.optional(),after:url.optional()}).strict();
export const cmsSchema = shape(template).extend({
  version:z.literal(1), works:z.array(work).max(500),
  nav:z.array(z.tuple([url,text])).min(1).max(20),
  links:z.object(Object.fromEntries(Object.keys(template.links).map(k=>[k,url]))).strict(),
  categories:z.array(z.string().min(1).max(80)).min(1).max(30),
  services:z.array(shape(template.services[0]).extend({slug})).min(1).max(100),
  pricingCategories:z.array(z.string().min(1).max(100)).min(1).max(30),
}).superRefine((v,ctx)=>{
  if(v.categories[0]!== 'همه آثار')ctx.addIssue({code:'custom',path:['categories',0],message:'دستهٔ نخست باید «همه آثار» باشد.'});
  for(const [key,items] of [['works',v.works.map(x=>x.id)],['services',v.services.map(x=>x.slug)],['categories',v.categories]]) if(new Set(items).size!==items.length)ctx.addIssue({code:'custom',path:[key],message:'شناسه یا عنوان تکراری وجود دارد.'});
  v.works.forEach((w,i)=>{if(!v.categories.includes(w.category))ctx.addIssue({code:'custom',path:['works',i,'category'],message:'دستهٔ این اثر در فهرست دسته‌ها نیست.'});});
});
export function validateContent(content){const r=cmsSchema.safeParse(content);if(!r.success)throw new Error(r.error.issues.map(x=>`${x.path.join('.')}: ${x.message}`).slice(0,6).join('\n'));return r.data;}
export const imagePath = /^\/images\/[a-z0-9-]+\.webp$/;
export function validateUpload(asset){
  if(!asset||typeof asset.path!=='string'||!/^\/images\/cms-[a-f0-9-]{36}\.webp$/.test(asset.path) || typeof asset.base64!=='string' || asset.base64.length>2800000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(asset.base64))throw new Error('فایل تصویر نامعتبر است.');
  const bytes=Uint8Array.from(atob(asset.base64),c=>c.charCodeAt(0));
  if(bytes.length<20||bytes.length>2*1024*1024||new TextDecoder().decode(bytes.slice(0,4))!=='RIFF'||new TextDecoder().decode(bytes.slice(8,12))!=='WEBP')throw new Error('فقط تصویر WebP تا دو مگابایت پذیرفته می‌شود.');
  if(new DataView(bytes.buffer).getUint32(4,true)!==bytes.length-8||!['VP8 ','VP8L','VP8X'].includes(new TextDecoder().decode(bytes.slice(12,16))))throw new Error('ساختار WebP معتبر نیست.');
  return {path:asset.path,base64:asset.base64};
}
