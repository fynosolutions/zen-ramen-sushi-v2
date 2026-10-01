// CTA / 转化验收(2026-10-01):对 out/ 起真服务器 + Playwright 实测。用法: node seo/check-cta.mjs <mode>
// modes: hero-desktop | hero-mobile | pages | overflow | tracking | status | perf
import fs from 'fs'; import path from 'path'; import {spawn} from 'child_process';
import {chromium, devices} from 'playwright';
const mode = process.argv[2]; const PORT = 3071; const REMOTE = process.env.CTA_BASE;   // 设了 CTA_BASE 就测线上(也用于负向对照)
const BASE = REMOTE || `http://127.0.0.1:${PORT}`; const OUT = process.env.CTA_OUT || 'out';
const TOAST = 'toasttab.com/local/order/zen-ramen-sushi-takeout-150-w-36th-street';
const fail = []; const ok = (c, m) => { if(!c) fail.push(m); };
const done = name => { console.log(fail.length ? `${name} FAIL: ${fail.join(' | ')}` : `${name} PASS`); process.exit(fail.length ? 1 : 0); };

if (mode === 'about-image') {   // 首页 About 区块与 /about/ 页用猪骨 Tonkotsu 实拍,不再是鸡排拉面
  for (const [f,n,want] of [[OUT+'/index.html','首页','shot-about-tonkotsu.webp'],[OUT+'/about/index.html','/about/','shot-about-tonkotsu-square.webp']]) { const h = fs.readFileSync(f,'utf8'); ok(h.includes(want),`${n}: 没用 ${want}`); ok(!h.includes('shot-about-chicken-ramen'),`${n}: 还在引用鸡排拉面旧图`); }
  for (const x of ['shot-about-tonkotsu.webp','shot-about-tonkotsu-square.webp']) ok(fs.existsSync('public/images/'+x),'缺 '+x); ok(!fs.existsSync('public/images/shot-about-chicken-ramen.webp'),'旧图文件还在(应删)');
  done('CTA-ABOUT-IMAGE');
}
if (mode === 'pages' || mode === 'perf') {
  if (mode === 'perf') {
    const files = []; const walk = d => fs.readdirSync(d,{withFileTypes:true}).forEach(e => e.isDirectory() ? walk(path.join(d,e.name)) : /\.(js|css)$/.test(e.name) && files.push(path.join(d,e.name)));
    walk(OUT+'/_next/static'); const total = files.reduce((s,f)=>s+fs.statSync(f).size,0);
    const BASELINE = 843358, LIMIT = Math.round(BASELINE*1.05);   // 2026-10-01 改前实测 843,358 B
    ok(total <= LIMIT, `JS+CSS ${total} B 超预算 ${LIMIT} B(基线 ${BASELINE})`);
    console.log(`  JS+CSS=${total} B (基线 ${BASELINE}, 上限 ${LIMIT})`); done('CTA-PERF');
  }
  const need = ['index','menu','about','gallery','happy-hour','near-penn-station','near-madison-square-garden','events-catering'];
  const band = ['index','menu','about','gallery','happy-hour','near-penn-station','near-madison-square-garden']; // 活动页有自己的表单,不放
  for (const p of need) {
    const f = p === 'index' ? `${OUT}/index.html` : `${OUT}/${p}/index.html`; const h = fs.readFileSync(f,'utf8');
    ok(/ORDER ONLINE/.test(h), `${p}: 页头没有「ORDER ONLINE」`);
    const min = p === 'events-catering' ? 1 : 2;   // 活动页只要求底栏那一处
    ok((h.match(new RegExp(TOAST.replace(/[.\-\/]/g,'\\$&'),'g'))||[]).length >= min, `${p}: Toast 直订链接 <${min} 处`);
    if (band.includes(p)) ok(/data-cta="band-order"/.test(h) && /data-cta="band-reserve"/.test(h) && /data-cta="band-call"/.test(h), `${p}: 缺页尾 CTA 条(band-order/reserve/call)`);
  }
  const home = fs.readFileSync(OUT+'/index.html','utf8');
  for (const id of ['hero-order','hero-reserve','hero-call','hero-directions','hero-menu','menu-order']) ok(home.includes(`data-cta="${id}"`), `首页缺 data-cta="${id}"`);
  const menu = fs.readFileSync(OUT+'/menu/index.html','utf8'); ok(/data-cta="menu-top-order"/.test(menu), '菜单页顶部缺 ORDER ONLINE(menu-top-order)');
  done('CTA-PAGES');
}

const srv = REMOTE ? {kill(){}} : spawn('node',['scripts/serve.mjs'],{env:{...process.env,PORT:String(PORT)},stdio:'ignore'});
const stop = () => { try{srv.kill()}catch{} };
process.on('exit',stop);
for (let i=0;i<40;i++){ try{ const r=await fetch(BASE+'/'); if(r.ok) break; }catch{} await new Promise(r=>setTimeout(r,250)); }
const skipIntro = ctx => ctx.addInitScript(() => { try{ sessionStorage.setItem('zen-intro-v2','1'); }catch{} });
const b = await chromium.launch();
try {
  if (mode === 'header-stable') {   // 慢慢往下滚过阈值:页头只能切换一次、scrollY 不能被拨回(2026-10-01 抖动回归)
    const {webkit} = await import('playwright');
    for (const [name,eng] of [['chromium',chromium],['webkit',webkit]]) {
      const bb = name==='chromium' ? b : await eng.launch(); const ctx = await bb.newContext({viewport:{width:1440,height:900}}); await skipIntro(ctx); const p = await ctx.newPage();
      for (const u of ['/','/menu/']) {
        await p.goto(BASE+u,{waitUntil:'networkidle'}); await p.waitForTimeout(400);
        await p.evaluate(()=>{window.__log=[];let last=null;const rec=()=>{const s=document.documentElement.hasAttribute('data-scrolled');const y=Math.round(scrollY);if(s!==last){window.__log.push(['s',s,y]);last=s}window.__ys=(window.__ys||[]);window.__ys.push(y);requestAnimationFrame(rec)};rec();});
        await p.mouse.move(700,500);
        for (let i=0;i<16;i++){ await p.mouse.wheel(0,12); await p.waitForTimeout(90); }
        await p.waitForTimeout(800);
        const r = await p.evaluate(()=>({sw:window.__log.length-1,ys:window.__ys}));
        let backs=0; for(let i=1;i<r.ys.length;i++) if(r.ys[i] < r.ys[i-1]-2) backs++;
        ok(r.sw<=1,`${name} ${u}: 页头状态切换了 ${r.sw} 次(>1)`); ok(backs===0,`${name} ${u}: 向下滚时 scrollY 被拨回 ${backs} 次`);
      }
      await ctx.close(); if(name!=='chromium') await bb.close();
    }
    done('CTA-HEADER-STABLE');
  }
  if (mode === 'hero-desktop') {
    const ctx = await b.newContext({viewport:{width:1440,height:900}}); await skipIntro(ctx); const p = await ctx.newPage();
    await p.goto(BASE+'/',{waitUntil:'networkidle'}); await p.waitForTimeout(600);
    const r = await p.evaluate(() => { const out={}; for (const id of ['hero-order','hero-reserve','hero-call','hero-directions','hero-menu']) { const e=document.querySelector(`.hero [data-cta="${id}"]`); if(!e){out[id]=null;continue;} const b=e.getBoundingClientRect(); out[id]={href:e.getAttribute('href'),top:b.top,bottom:b.bottom,right:b.right,w:b.width,h:b.height,red:e.classList.contains('button-red')}; } const first=document.querySelector('.hero .hero-actions a'); out.firstCta=first?.getAttribute('data-cta'); out.vh=innerHeight; return out; });
    for (const id of ['hero-order','hero-reserve','hero-call','hero-directions','hero-menu']) { const x=r[id]; ok(!!x,`首屏缺 ${id}`); if(x) ok(x.bottom<=r.vh && x.top>=0,`${id} 不在首屏内(bottom=${Math.round(x.bottom)})`); }
    ok(r['hero-order']?.href?.includes(TOAST),'hero-order 没指向 Toast 直订');
    ok(r['hero-order']?.red,'hero-order 不是主按钮(red)'); ok(r.firstCta==='hero-order','主按钮不是第一个');
    ok(r['hero-order']?.h>=44 && r['hero-reserve']?.h>=44,'按钮高度 <44px');
    done('CTA-HERO-DESKTOP');
  }
  if (mode === 'hero-mobile') {
    for (const [w,h,needReserve] of [[390,844,true],[360,740,true],[390,664,false]]) {   // 390×664 = 真 iPhone 13 Safari 可视高度,只强制 ORDER
      const ctx = await b.newContext({...devices['iPhone 13'],viewport:{width:w,height:h}}); await skipIntro(ctx); const p = await ctx.newPage();
      await p.goto(BASE+'/',{waitUntil:'networkidle'}); await p.waitForTimeout(600);
      const r = await p.evaluate(() => { const bar=document.querySelector('.mobile-actionbar').getBoundingClientRect(); const img=document.querySelector('.hero-photo img').getBoundingClientRect(); const o=document.querySelector('.hero [data-cta="hero-order"]').getBoundingClientRect(); const rs=document.querySelector('.hero [data-cta="hero-reserve"]').getBoundingClientRect(); const top=Math.max(img.top,0), bot=Math.min(img.bottom,bar.top); return {barTop:bar.top,imgVisible:Math.max(0,bot-top),orderBottom:o.bottom,orderTop:o.top,reserveBottom:rs.bottom,orderH:o.height}; });
      ok(r.imgVisible>=140,`${w}x${h}: 首屏能看到的菜品照片只有 ${Math.round(r.imgVisible)}px(<140)`);
      ok(r.orderBottom<=r.barTop,`${w}x${h}: ORDER ONLINE 被底栏挡住(bottom ${Math.round(r.orderBottom)} > 底栏 ${Math.round(r.barTop)})`);
      if(needReserve) ok(r.reserveBottom<=r.barTop,`${w}x${h}: RESERVE 被底栏挡住`);
      ok(r.orderH>=44,`${w}x${h}: ORDER 按钮高度 <44px`);
      await ctx.close();
    }
    done('CTA-HERO-MOBILE');
  }
  if (mode === 'overflow') {
    for (const w of [320,390,768,1024,1440]) {
      const ctx = await b.newContext({viewport:{width:w,height:900}}); await skipIntro(ctx); const p = await ctx.newPage();
      for (const u of ['/','/menu/','/happy-hour/']) {
        await p.goto(BASE+u,{waitUntil:'networkidle'}); await p.waitForTimeout(300);
        const o = await p.evaluate(() => ({sw:document.documentElement.scrollWidth,iw:innerWidth,bad:[...document.querySelectorAll('.hero .button,.hero-quick a,.cta-band .button')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).length}));
        ok(o.sw<=o.iw,`${w}px ${u}: 横向溢出 ${o.sw}>${o.iw}`); ok(o.bad===0,`${w}px ${u}: ${o.bad} 个 CTA 超出屏幕`);
      }
      await ctx.close();
    }
    done('CTA-OVERFLOW');
  }
  if (mode === 'tracking') {
    const ctx = await b.newContext({viewport:{width:1440,height:900}}); await skipIntro(ctx);
    const errs=[]; const p = await ctx.newPage(); p.on('pageerror',e=>errs.push(String(e)));
    await p.goto(BASE+'/',{waitUntil:'networkidle'});
    await p.evaluate(()=>{ document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a'); if(a) e.preventDefault();},true); });
    await p.click('.hero [data-cta="hero-reserve"]');   // 没装 gtag:不许报错
    ok(errs.length===0,'没有 gtag 时点击报错: '+errs.join(';'));
    await p.evaluate(()=>{ window.__ev=[]; window.gtag=(...a)=>window.__ev.push(a); });
    await p.click('.hero [data-cta="hero-order"]'); await p.click('.hero [data-cta="hero-call"]'); await p.click('.hero [data-cta="hero-directions"]');
    const ev = await p.evaluate(()=>window.__ev);
    const has=(name,id)=>ev.some(e=>e[0]==='event'&&e[1]===name&&(!id||e[2]?.cta_id===id));
    ok(has('cta_click','hero_order'),'hero-order 没记 cta_click'); ok(has('click_to_call'),'点电话没记 click_to_call'); ok(has('get_directions'),'点导航没记 get_directions');
    ok(ev.every(e=>e[2]?.cta_location),'事件缺 cta_location');
    done('CTA-TRACKING');
  }
  if (mode === 'status') {
    for (const [iso,wantLabel,wantDetail] of [['2026-10-05T16:00:00Z','OPEN NOW','UNTIL 11 PM'],['2026-10-06T03:30:00Z','CLOSED','OPENS TOMORROW 11:30 AM'],['2026-10-09T03:30:00Z','OPEN NOW','UNTIL 12 AM']]) {
      const ctx = await b.newContext({viewport:{width:1440,height:900}}); await skipIntro(ctx); const p = await ctx.newPage();
      await p.clock.install({time:new Date(iso)}); await p.goto(BASE+'/',{waitUntil:'load'}); await p.waitForTimeout(500);
      const t = (await p.locator('.hero .open-status').innerText()).replace(/\s+/g,' ').toUpperCase();
      ok(t.includes(wantLabel)&&t.includes(wantDetail),`${iso}: 期望含「${wantLabel} · ${wantDetail}」,实际「${t}」`); await ctx.close();
    }
    done('CTA-STATUS');
  }
  fail.push('未知 mode '+mode); done('CTA');
} finally { await b.close(); stop(); }
