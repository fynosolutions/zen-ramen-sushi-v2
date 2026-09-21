import fs from 'fs';
const old = fs.readFileSync('seo/old-urls-2026-09-20.txt','utf8').trim().split('\n').map(u=>u.replace('https://zenramensushiny.com',''));
const v = JSON.parse(fs.readFileSync('vercel.json','utf8'));
const exists = p => p==='/' || fs.existsSync('out'+p.replace(/\/$/,'')+'/index.html');
let fail=0, toHome=0;
for(const p of old){
  if(exists(p)) continue;
  const r = v.redirects.find(r=>!r.has && r.source===p.replace(/\/$/,'')+'/');
  if(!r){console.log('无去处:',p);fail++;continue;}
  const destPath = r.destination.split('#')[0] || '/';
  if(destPath==='/' && p!=='/' && !r.destination.includes('#')) toHome++;
  if(!exists(destPath==='' ? '/' : destPath)){console.log('目的地不存在:',p,'->',r.destination);fail++;}
}
console.log(fail===0 && toHome===0 ? 'MAPPING PASS' : `MAPPING FAIL 无去处/坏目的地:${fail} 非法打首页:${toHome}`);
