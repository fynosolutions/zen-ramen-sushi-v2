// 用真 Apache 验证 .htaccess 与 vercel.json 行为一致(搬家可行性的硬证据)
import fs from 'fs'; import {execSync} from 'child_process';
const BASE='http://127.0.0.1:8911';
const v=JSON.parse(fs.readFileSync('vercel.json','utf8'));
const old=fs.readFileSync('seo/old-urls-2026-09-20.txt','utf8').trim().split('\n').map(u=>u.replace('https://zenramensushiny.com',''));
const exists=p=>p==='/'||fs.existsSync('out'+p.replace(/\/$/,'')+'/index.html');
let ok=0,bad=[];
for(const p of old){
  const r=execSync(`curl -s -o /dev/null -w "%{http_code}|%{redirect_url}" "${BASE}${p}"`,{encoding:'utf8'});
  const [code,loc]=r.split('|');
  if(exists(p)){ if(code==='200')ok++; else bad.push(`${p} 应200实为${code}`); continue; }
  const rule=v.redirects.find(x=>!x.has&&x.source===p.replace(/\/$/,'')+'/');
  if(!rule){bad.push(`${p} vercel无规则`);continue;}
  if(code!=='301'){bad.push(`${p} 应301实为${code}`);continue;}
  const got=loc.replace(BASE,'');
  if(got!==rule.destination){bad.push(`${p} 目标不符: ${got} ≠ ${rule.destination}`);continue;}
  ok++;
}
// 查询参数型
for(const r of v.redirects.filter(x=>x.has)){
  const url=`${BASE}${r.source}?${r.has[0].key}=${r.has[0].value}`;
  const res=execSync(`curl -s -o /dev/null -w "%{http_code}|%{redirect_url}" "${url}"`,{encoding:'utf8'});
  const [code,loc]=res.split('|');
  if(code==='301'&&loc.replace(BASE,'')===r.destination)ok++;
  else bad.push(`${r.source}?${r.has[0].key}=${r.has[0].value} → ${code} ${loc.replace(BASE,'')}`);
}
console.log(bad.length?`PORTABILITY FAIL ${bad.length}条\n  `+bad.slice(0,8).join('\n  '):`PORTABILITY PASS (Apache 实测 ${ok} 条跳转/页面与 vercel.json 行为一致)`);
