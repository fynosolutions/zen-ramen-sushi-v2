import fs from 'fs';
const old = fs.readFileSync('seo/old-urls-2026-09-20.txt','utf8').trim().split('\n').map(u=>u.replace('https://zenramensushiny.com',''));
const v = JSON.parse(fs.readFileSync('vercel.json','utf8'));
const etv = JSON.parse(fs.readFileSync('seo/blog-etv-2026-09-23.json','utf8'));
const WRONG = /gainesville|dahlonega|greenville|noblesville/i;
const exists = p => p==='/' || fs.existsSync('out'+p.replace(/\/$/,'')+'/index.html');
const isBlog = p => /^\/\d{4}\/\d{2}\/\d{2}\//.test(p);
// 策略:有排名(etv>=1)且非错城市的必须有去处;其余故意下线(404)
const mustKeep = p => !isBlog(p) || ((etv[p]?.etv ?? 0) >= 1 && !WRONG.test(p));
let fail=0, kept=0, retired=0, savedEtv=0, lostEtv=0, wrongCityEtv=0;
for(const p of old){
  const rule = v.redirects.find(r=>!r.has && r.source===p.replace(/\/$/,'')+'/');
  const has = exists(p) || !!rule;
  const e = etv[p]?.etv ?? 0;
  if(mustKeep(p)){
    if(!has){console.log('❌ 该保却没去处:',p,`etv=${e}`);fail++;} else {kept++; savedEtv+=e;}
    if(rule){const d=rule.destination.split('#')[0]||'/'; if(d==='/'&&p!=='/'){console.log('❌ 倒向首页:',p);fail++;}
      if(!exists(d===''?'/':d)){console.log('❌ 目的地不存在:',p,'->',rule.destination);fail++;}}
  } else {
    if(has){console.log('❌ 该下线却仍有跳转:',p);fail++;}
    else {retired++; if(WRONG.test(p)) wrongCityEtv+=e; else lostEtv+=e;}
  }
}
const total=savedEtv+lostEtv;
const pct = total? savedEtv/total*100 : 100;
if(pct < 99) {console.log(`❌ 流量保全率仅 ${pct.toFixed(1)}%`); fail++;}
console.log(fail===0
  ? `MAPPING PASS (承接 ${kept} / 下线 ${retired} 条薄内容 · 本店博客流量保全 ${savedEtv.toFixed(0)}/${total.toFixed(0)} = ${pct.toFixed(1)}% · 另弃 ${wrongCityEtv.toFixed(0)} 写错城市流量)`
  : `MAPPING FAIL x${fail}`);
