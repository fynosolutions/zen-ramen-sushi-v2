import fs from 'fs'; import path from 'path';
const pages=[]; const walk=d=>{for(const f of fs.readdirSync(d)){const p=path.join(d,f);if(fs.statSync(p).isDirectory())walk(p);else if(f==='index.html')pages.push(p);}};
walk('out');
const titles={},descs={}; let fail=0;
for(const p of pages){
  if(p.includes('404')||p.includes('_not-found')) continue;
  const h=fs.readFileSync(p,'utf8');
  const t=(h.match(/<title>([^<]*)<\/title>/)||[])[1]||'';
  const d=(h.match(/<meta name="description" content="([^"]*)"/)||[])[1]||'';
  if(!t){console.log('无title:',p);fail++;}
  if(t.length>60){console.log(`title ${t.length}字符:`,p,'|',t);fail++;}
  if(!d){console.log('无description:',p);fail++;}
  if(d.length>160){console.log(`desc ${d.length}字符:`,p);fail++;}
  if(titles[t]){console.log('title重复:',t,'@',p,'与',titles[t]);fail++;} titles[t]=p;
  if(d && descs[d]){console.log('desc重复:',p,'与',descs[d]);fail++;} if(d)descs[d]=p;
}
console.log(fail===0?'META PASS ('+pages.length+'页)':'META FAIL x'+fail);
