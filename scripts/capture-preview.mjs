import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('docs/qa',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const results=[];
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const [label,route] of [['home','/'],['menu','/menu/#lunch'],['events','/events-catering/'],['gallery','/gallery/'],['about','/about/']]){
  await page.goto('http://127.0.0.1:3000'+route,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.querySelectorAll('img[loading="lazy"]').forEach(img=>img.setAttribute('loading','eager')));
  await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
  await page.screenshot({path:`docs/qa/${label}-${name}.png`,fullPage:label!=='menu'});
  results.push({viewport:name,route,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),images:await page.locator('img').evaluateAll(images=>images.map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0}))),errors:[...errors]});
 }
 await page.close();
}
await browser.close();
await writeFile('docs/qa/browser-audit.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results.map(({viewport,route,overflow,errors,images})=>({viewport,route,overflow,errors,broken:images.filter(i=>!i.loaded)})),null,2));
