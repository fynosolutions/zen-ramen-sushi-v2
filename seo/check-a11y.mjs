// 无障碍验收(2026-10-29):axe-core 按 WCAG 2.1 AA 扫全站主要页面(电脑+手机)和展开后的状态,再查两条 axe 查不到的规矩。
// 用法: node seo/check-a11y.mjs     (CTA_BASE=网址 测线上)。任何一条违规 = 红灯。
// axe 只能抓到约三到四成的无障碍问题;键盘操作、暂停键这类由下面 ③④ 补,改了交互组件要自己再用键盘走一遍。
import {spawn} from 'child_process'; import fs from 'fs'; import {chromium} from 'playwright';
const PORT = 3081 + (process.pid % 400),
      BASE = process.env.CTA_BASE || `http://127.0.0.1:${PORT}`;
const srv = process.env.CTA_BASE ? {kill(){}} : spawn('node',['scripts/serve.mjs'],{env:{...process.env,PORT:String(PORT)},stdio:'ignore'});
for (let i=0;i<40;i++){ try{ if((await fetch(BASE+'/')).ok) break; }catch{} await new Promise(r=>setTimeout(r,250)); }
const AXE = fs.readFileSync('node_modules/axe-core/axe.min.js','utf8');
const TAGS = ['wcag2a','wcag2aa','wcag21a','wcag21aa'];
const PAGES = ['/','/menu/','/lunch-specials/','/happy-hour/','/events-catering/','/location/','/about/','/gallery/','/blog/','/near-penn-station/','/near-madison-square-garden/','/zrm-menu/?menu=dinner-menu','/privacy-policy/','/terms-conditions/','/accessibility/'];
/* 展开后的状态:页面初始态扫不到弹层/页签/报错信息 */
const STATES = [
  ['phone','/','手机导航展开', p=>p.click('.nav-toggle')],
  ['desktop','/menu/','Lunch 页签', p=>p.getByRole('tab',{name:/lunch/i}).click()],
  ['desktop','/menu/','Happy Hour 页签', p=>p.getByRole('tab',{name:/happy/i}).click()],
  ['desktop','/menu/','Catering 页签', p=>p.getByRole('tab',{name:/catering/i}).click()],
  ['phone','/gallery/','相册大图', p=>p.locator('.gallery-tile').first().click()],
  ['desktop','/zrm-menu/?menu=dinner-menu','菜品选项展开', async p=>{const m=p.locator('.pm-more:visible').first();await m.scrollIntoViewIfNeeded();await m.click();}],
  ['phone','/events-catering/','询单表单空提交(报错信息)', p=>p.locator('form.inquiry-form button[type=submit]').click()],
];
const VP = {desktop:{width:1440,height:900}, phone:{width:390,height:844}};
const fail = [];
const b = await chromium.launch();
const open = async (vp,path) => { const c = await b.newContext({viewport:VP[vp]}); await c.addInitScript(()=>{try{sessionStorage.setItem('zen-intro-v2','1')}catch{}}); const p = await c.newPage(); await p.goto(BASE+path,{waitUntil:'networkidle'}); await p.waitForTimeout(500); return [c,p]; };
const axe = async (p,where) => { await p.addScriptTag({content:AXE}); const r = await p.evaluate(t=>axe.run(document,{runOnly:{type:'tag',values:t}}),TAGS);
  for (const v of r.violations) for (const n of v.nodes.slice(0,2)) fail.push(`${where} ${v.id}: ${n.target.join(' ')} — ${(n.failureSummary||'').split('\n')[1]?.trim()||v.help}`); };
try {
  // ① 页面初始态
  for (const vp of ['desktop','phone']) for (const path of PAGES) { const [c,p] = await open(vp,path); await axe(p,`${vp} ${path}`); await c.close(); }
  // ② 展开后的状态
  for (const [vp,path,label,act] of STATES) { const [c,p] = await open(vp,path); try { await act(p); await p.waitForTimeout(600); await axe(p,`${vp} ${path} [${label}]`); } catch(e) { fail.push(`${vp} ${path} [${label}] 操作失败: ${e.message.split('\n')[0]}`); } await c.close(); }
  // ③ 自动动的东西必须能暂停(WCAG 2.2.2):首页视频、红色滚动字条
  { const [c,p] = await open('desktop','/'); await p.evaluate(()=>document.querySelector('.home-film').scrollIntoView({block:'center'})); await p.waitForTimeout(3000);
    if (!await p.locator('.home-film-pause').isVisible()) fail.push('首页视频自动播时没有暂停键');
    else { await p.click('.home-film-pause'); await p.waitForTimeout(300); if (!await p.evaluate(()=>document.querySelector('.home-film video').paused)) fail.push('首页视频暂停键按了没停'); }
    if (!await p.locator('.ticker-pause').isVisible()) fail.push('红色滚动字条没有暂停键');
    else { await p.click('.ticker-pause'); await p.waitForTimeout(400);   /* 刚点完动画还在走最后一帧,等它停稳再量 */
      const x = ()=>p.evaluate(()=>document.querySelector('.ticker>div').getBoundingClientRect().left); const a = await x(); await p.waitForTimeout(600);
      if (Math.abs(a - await x()) > 0.5) fail.push('红色滚动字条暂停键按了没停'); }
    await c.close(); }
  // ④ 键盘:手机导航 Enter 打开、Esc 关闭并回到按钮;菜单页签方向键切换
  { const [c,p] = await open('phone','/'); await p.focus('.nav-toggle'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
    if (await p.getAttribute('.nav-toggle','aria-expanded')!=='true') fail.push('手机导航 Enter 打不开');
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    if (await p.getAttribute('.nav-toggle','aria-expanded')!=='false' || !await p.evaluate(()=>document.activeElement.matches('.nav-toggle'))) fail.push('手机导航 Esc 没关上或焦点没回到按钮');
    await c.close(); }
  { const [c,p] = await open('desktop','/menu/'); await p.focus('[role=tab][aria-selected=true]'); const t0 = await p.evaluate(()=>document.activeElement.innerText); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
    if (t0 === await p.evaluate(()=>document.querySelector('[role=tab][aria-selected=true]').innerText)) fail.push('菜单页签方向键切不动'); await c.close(); }
} finally { await b.close(); try{srv.kill()}catch{} }
console.log(fail.length ? `A11Y FAIL x${fail.length}:\n - ${fail.join('\n - ')}` : `A11Y PASS (WCAG 2.1 AA: ${PAGES.length} 页 × 电脑/手机 + ${STATES.length} 个展开状态 + 暂停键 + 键盘)`); process.exit(fail.length?1:0);
