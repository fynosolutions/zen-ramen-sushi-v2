import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--remote-debugging-port=9222']});
try {
 const args=['--yes','lighthouse','http://127.0.0.1:3001','--port=9222','--output=json','--output-path=docs/qa/lighthouse-mobile.json','--only-categories=performance,accessibility,best-practices,seo','--quiet'];
 const exitCode=await new Promise((resolve,reject)=>{const child=spawn(process.platform==='win32'?'npx.cmd':'npx',args,{shell:process.platform==='win32',windowsHide:true,stdio:'inherit'});child.on('error',reject);child.on('exit',resolve);});
 process.exitCode=Number(exitCode);
} finally {await browser.close();}
