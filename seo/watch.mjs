// 切换后监控:301 抽查 + 排名词对比基线。用法: node seo/watch.mjs [--live]
// --live 打真实域名;不带则打本地 out/(仅结构检查)
import fs from 'fs';
const LIVE = process.argv.includes('--live');
const base = 'https://zenramensushiny.com';
const old = fs.readFileSync('seo/old-urls-2026-09-20.txt','utf8').trim().split('\n');
if(LIVE){
  // 1) 抽查 20 条旧 URL:应 200(同URL页)或 301/308 到非首页
  const sample = old.filter((_,i)=>i%8===0).slice(0,20);
  let bad=0;
  for(const u of sample){
    const r = await fetch(u,{redirect:'manual'}).catch(()=>null);
    const st = r?.status||0; const loc = r?.headers.get('location')||'';
    const ok = st===200 || ((st===301||st===308) && loc && new URL(loc,base).pathname!=='/');
    if(!ok){console.log('❌',st,u,'->',loc);bad++;}
  }
  console.log(bad===0?`301抽查 PASS (${sample.length}条)`:`301抽查 FAIL x${bad}`);
  for(const p of ['/','/sitemap.xml','/robots.txt','/happy-hour/']){
    const r=await fetch(base+p).catch(()=>null);
    console.log(r?.status===200?'✅':'❌', p, r?.status);
  }
  console.log('\n排名词对比: treg call dataforseo.google.domain.ranked_keywords --data \'[{"target":"zenramensushiny.com","location_code":2840,"language_code":"en","limit":1000}]\'');
  console.log('基线=570词(seo/ranked-before-2026-09-20.json)。新值<456(掉20%)即报警。');
}else{
  console.log('本地模式:跑 npm run seo 即可,--live 供切换后用。');
}
