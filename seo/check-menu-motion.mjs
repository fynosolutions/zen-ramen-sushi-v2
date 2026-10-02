// 菜品图动效验收(2026-10-02):悬浮只在看得见时跑、鼠标移上放大 7%、减少动态效果时全停、触屏不触发悬停、
// 不遮挡文字/下单、不引起版面跳动。用法: node seo/check-menu-motion.mjs   (CTA_BASE=网址 可测线上)
import {spawn} from 'child_process'; import {chromium, devices} from 'playwright';
const PORT = 3073, BASE = process.env.CTA_BASE || `http://127.0.0.1:${PORT}`; const fail = []; const ok = (c,m) => { if(!c) fail.push(m); };
const srv = process.env.CTA_BASE ? {kill(){}} : spawn('node',['scripts/serve.mjs'],{env:{...process.env,PORT:String(PORT)},stdio:'ignore'});
for (let i=0;i<40;i++){ try{ if((await fetch(BASE+'/')).ok) break; }catch{} await new Promise(r=>setTimeout(r,250)); }
const b = await chromium.launch();
const skipIntro = c => c.addInitScript(()=>{try{sessionStorage.setItem('zen-intro-v2','1')}catch{}});
const num = s => parseFloat(String(s).split(' ')[0]);
try {
  // ── 桌面(鼠标):晚市页开胃菜那一排 ──
  { const ctx = await b.newContext({viewport:{width:1440,height:900}}); await skipIntro(ctx); const p = await ctx.newPage();
    await p.goto(BASE+'/menu/',{waitUntil:'networkidle'});
    const tile = p.locator('#dinner--appetizers .featured-dish').nth(1); ok(await tile.count()===1,'找不到开胃菜第 2 张菜品图');
    await tile.scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
    const st = await tile.evaluate(t => { const i=t.querySelector('img'), cs=getComputedStyle(i); return {inn:t.classList.contains('is-in'),anim:cs.animationName,play:cs.animationPlayState,scale:cs.scale,rotate:cs.rotate,anims:i.getAnimations().length}; });
    ok(st.inn,'看得见的菜品没有 is-in'); ok(st.anim.includes('dish-float') && st.play==='running','看得见的菜品没在悬浮'); ok(st.anims>=1,'没有运行中的动画');
    // 看不见的格子不能动(省电)
    const far = await p.evaluate(()=>{ const t=document.querySelector('#dinner--rice-dishes .featured-dish'); const i=t.querySelector('img'); const r=t.getBoundingClientRect(); return {visible:r.bottom>0&&r.top<innerHeight,inn:t.classList.contains('is-in'),anims:i.getAnimations().length}; });
    ok(far.visible || (!far.inn && far.anims===0),'屏幕外的菜品还在动(应暂停)');
    // 鼠标移上:放大 7%、仍在格子内、文字没被盖、版面不跳
    const before = await tile.evaluate(t => ({h:t.getBoundingClientRect().height, sh:document.documentElement.scrollHeight, rest:parseFloat(getComputedStyle(t.querySelector('img')).scale)}));
    await tile.locator('.featured-photo').hover(); await p.waitForTimeout(420);
    const hov = await tile.evaluate(t => { const i=t.querySelector('img'), cs=getComputedStyle(i), ph=t.querySelector('.featured-photo').getBoundingClientRect(), cap=t.querySelector('figcaption strong').getBoundingClientRect(); const mid=document.elementFromPoint(cap.left+cap.width/2, cap.top+cap.height/2); return {scale:parseFloat(cs.scale), h:t.getBoundingClientRect().height, sh:document.documentElement.scrollHeight, capOk:!!mid && !!mid.closest('figcaption'), photoBottom:ph.bottom, capTop:cap.top}; });
    ok(Math.abs(hov.scale/before.rest-1.07)<0.012, `悬停放大倍数不对(${(hov.scale/before.rest).toFixed(3)}≠1.07)`); ok(hov.scale<=1.15,'放大后可能超出格子');
    ok(Math.abs(hov.h-before.h)<0.6 && hov.sh===before.sh, '悬停时版面高度变了(跳动)'); ok(hov.capOk,'悬停时图注文字被盖住'); ok(hov.photoBottom<=hov.capTop+0.5,'图片区压到了图注');
    await p.mouse.move(5,5); await p.waitForTimeout(420);
    const after = await tile.evaluate(t => parseFloat(getComputedStyle(t.querySelector('img')).scale)); ok(Math.abs(after-before.rest)<0.01,'鼠标移开后没有恢复原大小');
    // 菜单页顶部下单按钮不被图遮挡
    await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(200);
    const cta = await p.evaluate(()=>{ const a=document.querySelector('[data-cta="menu-top-order"]'); if(!a) return null; const r=a.getBoundingClientRect(); const e=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2); return !!e && (e===a||a.contains(e)); }); ok(cta===true,'菜单页顶部 ORDER ONLINE 被挡住或不存在');
    // 同屏正在跑的动画数有上限
    const total = await p.evaluate(()=>document.getAnimations().filter(a=>a.animationName==='dish-float').length); ok(total<=12, `同时在跑的悬浮动画 ${total} 个(>12)`);
    await ctx.close(); }
  // ── 减少动态效果:全停 ──
  { const ctx = await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}); await skipIntro(ctx); const p = await ctx.newPage();
    await p.goto(BASE+'/menu/',{waitUntil:'networkidle'}); const t = p.locator('#dinner--appetizers .featured-dish').first(); await t.scrollIntoViewIfNeeded(); await p.waitForTimeout(700);
    const r = await t.evaluate(t => { const i=t.querySelector('img'), cs=getComputedStyle(i); return {anim:cs.animationName,anims:i.getAnimations().length,tr:cs.transitionDuration}; });
    ok(r.anim==='none' && r.anims===0,'开了「减少动态效果」菜品图仍在动'); await ctx.close(); }
  // ── 手机(触屏):不触发悬停放大,不溢出 ──
  { const ctx = await b.newContext({...devices['iPhone 13']}); await skipIntro(ctx); const p = await ctx.newPage();
    await p.goto(BASE+'/menu/',{waitUntil:'networkidle'}); const t = p.locator('#dinner--appetizers .featured-dish').first(); await t.scrollIntoViewIfNeeded(); await p.waitForTimeout(700);
    const r = await t.evaluate(t => ({hover:matchMedia('(hover:hover) and (pointer:fine)').matches, scale:parseFloat(getComputedStyle(t.querySelector('img')).scale), rest:getComputedStyle(t).getPropertyValue('--rest'), sw:document.documentElement.scrollWidth, iw:innerWidth}));
    ok(!r.hover,'测试环境不是触屏'); ok(Math.abs(r.scale-parseFloat(r.rest||'1'))<0.01,'触屏上出现了悬停放大'); ok(r.sw<=r.iw,'手机横向溢出'); await ctx.close(); }
} finally { await b.close(); try{srv.kill()}catch{} }
console.log(fail.length ? `MENU-MOTION FAIL: ${fail.join(' | ')}` : 'MENU-MOTION PASS'); process.exit(fail.length?1:0);
