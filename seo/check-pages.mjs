import fs from 'fs';
const req=[['out/happy-hour/index.html',800],['out/near-madison-square-garden/index.html',350],['out/near-penn-station/index.html',350]];
let fail=0;
for(const [f,min] of req){
  if(!fs.existsSync(f)){console.log('页面缺失:',f);fail++;continue;}
  const h=fs.readFileSync(f,'utf8');
  const main=(h.match(/<main[^>]*>([\s\S]*?)<\/main>/)||[,''])[1];
  const words=main.replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').trim().split(/\s+/).length;
  const tel=h.includes('tel:+16468707509'); const nav=h.includes('primary-navigation');
  if(words<min){console.log(`${f} 仅${words}词(需≥${min})`);fail++;}
  if(!tel){console.log(f,'无tel链接');fail++;}
  if(!nav){console.log(f,'无导航');fail++;}
  console.log(`${f}: ${words}词 tel:${tel} nav:${nav}`);
}
console.log(fail===0?'PAGES PASS':'PAGES FAIL x'+fail);
