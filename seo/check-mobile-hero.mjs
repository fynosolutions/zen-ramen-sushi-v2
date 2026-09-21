import {chromium} from '@playwright/test';
const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844}});const p=await c.newPage();
await p.addInitScript(()=>sessionStorage.setItem('zen-intro-v2','1'));
await p.goto('http://127.0.0.1:3001/',{waitUntil:'networkidle'});
const vis=await p.evaluate(()=>{const r=document.querySelector('.hero-photo').getBoundingClientRect();return Math.max(0,Math.min(844,r.bottom)-Math.max(0,r.top));});
console.log(vis>=120?`MHERO PASS ${Math.round(vis)}px`:`MHERO FAIL ${Math.round(vis)}px`);
await b.close();
