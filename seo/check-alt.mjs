import fs from 'fs'; import path from 'path';
const pages=[]; const walk=d=>{for(const f of fs.readdirSync(d)){const p=path.join(d,f);if(fs.statSync(p).isDirectory())walk(p);else if(f==='index.html')pages.push(p);}};
walk('out'); let fail=0, total=0;
for(const p of pages){
  const h=fs.readFileSync(p,'utf8');
  for(const img of h.match(/<img[^>]*>/g)||[]){ total++;
    if(!/\salt=/.test(img)){console.log('缺alt:',p,img.slice(0,80));fail++;}
  }
}
console.log(fail===0?`ALT PASS (${total}个img全有alt)`:'ALT FAIL x'+fail);
