import {chromium} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
const origin='https://zen-ramen-sushi-v2.vercel.app';
const browser=await chromium.launch({channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[];const results=[];
page.on('pageerror',e=>errors.push(e.message));
try {
 const config=JSON.parse(await readFile('vercel.json','utf8'));
 const redirects=config.redirects.map(rule=>({route:rule.source+(rule.has?'?'+new URLSearchParams(rule.has.map(q=>[q.key,q.value])):''),destination:rule.destination}));
 for(const {route,destination} of [...['/','/menu/','/about/','/events-catering/','/gallery/','/privacy-policy/','/terms-conditions/'].map(route=>({route})),...redirects]){
  const response=await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:30000});
  results.push({route,status:response.status(),finalUrl:page.url(),title:await page.title()});
  if(destination){const actual=new URL(page.url());const expected=new URL(destination,origin);if(actual.pathname!==expected.pathname||actual.hash!==expected.hash)errors.push(`Redirect mismatch: ${route} -> ${page.url()}`);}
 }
 await page.goto(origin,{waitUntil:'networkidle'});
 const pdfs=await page.evaluate(async()=>Promise.all(['/menus/dinner.pdf','/menus/lunch.pdf','/menus/happy-hour.pdf'].map(async route=>{const r=await fetch(route,{method:'HEAD'});return{route,status:r.status,type:r.headers.get('content-type')};})));
 results.push(...pdfs);
 await page.screenshot({path:'docs/qa/online-desktop.png'});
 const robots=await page.locator('meta[name=robots]').getAttribute('content');
 await page.getByRole('link',{name:'EXPLORE OUR MENU'}).click();await page.waitForURL('**/menu/');await page.getByRole('tab',{name:'Lunch'}).click();
 const lunchActive=await page.getByRole('tab',{name:'Lunch'}).getAttribute('aria-selected');
 await page.setViewportSize({width:390,height:844});await page.goto(origin,{waitUntil:'networkidle'});await page.screenshot({path:'docs/qa/online-mobile.png'});
 const report={date:new Date().toISOString(),origin,robots,lunchActive,results,errors};
 await writeFile('docs/qa/online-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 if(results.some(r=>r.status!==200)||errors.length)process.exitCode=1;
}finally{await browser.close();}
