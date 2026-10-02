// 手机版多重验证(2026-10-02):4 种手机配置 × 全站,覆盖「展开信息 / 动态 / 图片 / 按钮落点」。
// 用法: node seo/check-mobile.mjs     (CTA_BASE=网址 测线上;SHOTS=目录 顺便存关键截图给独立审稿)
import {spawn} from 'child_process'; import fs from 'fs'; import {chromium, webkit, devices} from 'playwright';
import {site} from '../content/site.ts';
const PORT = 3081 + (process.pid % 400),   /* 每次运行用自己的端口,避免两次检查同时跑时互相关掉对方的服务器 */
      BASE = process.env.CTA_BASE || `http://127.0.0.1:${PORT}`, SHOTS = process.env.SHOTS;
const srv = process.env.CTA_BASE ? {kill(){}} : spawn('node',['scripts/serve.mjs'],{env:{...process.env,PORT:String(PORT)},stdio:'ignore'});
for (let i=0;i<40;i++){ try{ if((await fetch(BASE+'/')).ok) break; }catch{} await new Promise(r=>setTimeout(r,250)); }
const touch = (w,h,ua) => ({...devices['Pixel 5'], viewport:{width:w,height:h}, screen:{width:w,height:h}, isMobile:true, hasTouch:true, deviceScaleFactor:2});
const PROFILES = [
  ['iPhone13·WebKit', webkit, devices['iPhone 13']],
  ['Pixel7·Chromium', chromium, devices['Pixel 7']],
  ['360×740·Chromium', chromium, touch(360,740)],
  ['320×568·Chromium', chromium, touch(320,568)],
];
const PAGES = ['/','/menu/','/about/','/gallery/','/happy-hour/','/events-catering/','/near-penn-station/','/near-madison-square-garden/','/privacy-policy/','/terms-conditions/'];
const fail = []; let P = ''; const ok = (c,m) => { if(!c) fail.push(`[${P}] ${m}`); };
const skip = c => c.addInitScript(()=>{try{sessionStorage.setItem('zen-intro-v2','1')}catch{}});
const shot = async (p,name) => { if(SHOTS && P.startsWith('iPhone')) { fs.mkdirSync(SHOTS,{recursive:true}); await p.screenshot({path:`${SHOTS}/${name}.png`}); } };
const settle = (p,ms=350) => p.waitForTimeout(ms);
// 慢慢滚到底,触发懒加载
const scrollAll = async p => { const h = await p.evaluate(()=>document.documentElement.scrollHeight), vh = await p.evaluate(()=>innerHeight); for (let y=0;y<h;y+=Math.round(vh*0.8)) { await p.evaluate(y=>window.scrollTo(0,y),y); await p.waitForTimeout(60); } await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(300); };
// 横向溢出:文档宽度,以及没被「可横滑容器」裁住却超出屏幕的元素
const overflow = p => p.evaluate(()=>{ const iw=innerWidth, bad=[]; const clipped=e=>{ for(let a=e.parentElement;a&&a!==document.body;a=a.parentElement){const o=getComputedStyle(a).overflowX; if(o==='auto'||o==='scroll'||o==='hidden'||o==='clip') return true;} return false; };
  for(const e of document.querySelectorAll('body *')){ const cs=getComputedStyle(e); if(cs.display==='none'||cs.visibility==='hidden'||e.closest('[hidden]')) continue; const r=e.getBoundingClientRect(); if(r.width<=0||r.height<=0) continue; if(r.right>iw+1&&!clipped(e)&&getComputedStyle(e).position!=='fixed'){ bad.push((e.className||e.tagName).toString().slice(0,40)+':'+Math.round(r.right)); if(bad.length>=3) break; } }
  return {sw:document.documentElement.scrollWidth,iw,bad}; });
// 可见图片:加载成功、不糊(原图宽 ≥ 显示宽)、有 alt
const images = p => p.evaluate(()=>{ const out=[]; for(const i of document.querySelectorAll('img')){ if(i.closest('[hidden]')) continue; const r=i.getBoundingClientRect(); if(r.width<=0||r.height<=0||getComputedStyle(i).display==='none') continue; const loaded=i.complete&&i.naturalWidth>0; out.push({src:(i.currentSrc||i.src).split('/').pop().slice(0,40),loaded,ratio:loaded?i.naturalWidth/r.width:0,w:Math.round(r.width),alt:i.hasAttribute('alt')}); } return out; });
const checkImages = async (p,tag) => { const im = await images(p); for(const i of im){ ok(i.loaded,`${tag} 图片没加载成功: ${i.src}`); ok(i.alt,`${tag} 图片缺 alt: ${i.src}`); if(i.loaded&&i.w>100) ok(i.ratio>=1,`${tag} 图片偏糊(原图只有显示宽度的 ${i.ratio.toFixed(2)} 倍): ${i.src} 显示 ${i.w}px`); } return im.length; };
// 粘性/固定栏在顶部占到哪儿
const stickyBottom = p => p.evaluate(()=>{ let m=0; for(const e of document.querySelectorAll('header,nav,div,section')){ const cs=getComputedStyle(e); if((cs.position==='sticky'||cs.position==='fixed')&&cs.visibility!=='hidden'&&cs.display!=='none'){ const r=e.getBoundingClientRect(); if(r.height>0&&r.width>innerWidth*0.5&&r.top<=2&&r.top>-5&&r.bottom<innerHeight*0.6) m=Math.max(m,r.bottom); } } return m; });
const landed = async (p,id,tag) => { await p.waitForTimeout(500); const st = await p.evaluate(id=>{const r=document.getElementById(id)?.getBoundingClientRect();return r?{top:Math.round(r.top),h:Math.round(r.height)}:null;},id); const sb = await stickyBottom(p); const vh = await p.evaluate(()=>innerHeight);
  ok(!!st,`${tag} 找不到区块 #${id}`); if(st){ ok(st.top>=sb-2,`${tag} #${id} 被顶部粘性栏盖住(区块顶 ${st.top}px < 粘性栏底 ${Math.round(sb)}px)`); ok(st.top<vh*0.6,`${tag} #${id} 落点太靠下(顶 ${st.top}px,视口 ${vh}px)`); } };

try {
  for (const [name,eng,opt] of PROFILES.filter(p=>!process.env.ONLY||p[0].includes(process.env.ONLY))) {   // ONLY=iPhone 只跑一种配置(做负向对照时省时间)
    P = name; const b = await eng.launch(); const errs = [], bad = [];
    try {
    const mk = async (extra={}) => { const c = await b.newContext({...opt,...extra}); const p = await c.newPage(); p.on('pageerror',e=>errs.push(String(e).slice(0,100))); p.on('console',m=>{ if(m.type()==='error' && !/Button failed to load, iconName/.test(m.text())) errs.push('console: '+m.text().slice(0,100)); }); /* WebKit 自带视频控件图标在无头模式下的噪音,与站点无关 */ p.on('response',r=>{ if(r.status()>=400&&r.url().startsWith(BASE)) bad.push(r.status()+' '+r.url().replace(BASE,'')); }); return [c,p]; };
    // ── 图片 + 溢出:每个页面(菜单页每个页签) ──
    { const [c,p] = await mk(); await skip(c);
      for (const path of PAGES) {
        await p.goto(BASE+path,{waitUntil:'networkidle'}); await settle(p);
        if (path==='/menu/') { for (const tab of ['Dinner','Lunch','Happy Hour']) { await p.getByRole('tab',{name:tab}).tap(); await settle(p,250); await scrollAll(p); const n = await checkImages(p,`/menu/ ${tab}`); ok(n>=3,`/menu/ ${tab} 可见图片只有 ${n} 张`); const o = await overflow(p); ok(o.sw<=o.iw&&o.bad.length===0,`/menu/ ${tab} 横向溢出 ${o.sw}>${o.iw} ${o.bad}`); } }
        else { await scrollAll(p); await checkImages(p,path); const o = await overflow(p); ok(o.sw<=o.iw&&o.bad.length===0,`${path} 横向溢出 ${o.sw}>${o.iw} ${o.bad}`); }
      }
      await c.close(); }
    // ── 展开信息 ──
    { const [c,p] = await mk(); await skip(c);
      await p.goto(BASE+'/',{waitUntil:'networkidle'}); await settle(p,600); await shot(p,'01-home-fold');
      // 导航展开/收起(点按)
      const tg = p.locator('.nav-toggle'); await tg.tap(); await settle(p,300);
      ok(await tg.getAttribute('aria-expanded')==='true','点 MENU 没有展开导航'); await shot(p,'02-nav-open');
      const navItems = await p.evaluate(()=>[...document.querySelectorAll('#primary-navigation a,#primary-navigation button')].filter(e=>e.getBoundingClientRect().height>0).map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.replace(/\s+/g,' ').trim().slice(0,30),h:Math.round(r.height),inView:r.left>=0&&r.right<=innerWidth}}));
      ok(navItems.length>=6,`展开的导航只有 ${navItems.length} 项`); for(const i of navItems){ ok(i.inView,`导航项「${i.t}」超出屏幕`); ok(i.h>=40,`导航项「${i.t}」点击区高度 ${i.h}px(<40)`); }
      // ORDER ONLINE 下拉(点按)
      await p.getByRole('button',{name:/ORDER ONLINE/}).first().tap(); await settle(p,250);
      const dd = await p.evaluate(()=>[...document.querySelectorAll('#delivery-links a')].map(a=>[a.innerText.replace(/\s*↗\s*/,'').trim(),a.getAttribute('href'),Math.round(a.getBoundingClientRect().height)]));
      ok(JSON.stringify(dd.map(x=>x[0]))==='["ORDER DIRECT","UBER EATS","DOORDASH","GRUBHUB"]',`下拉内容不对: ${dd.map(x=>x[0])}`); ok(dd.every(x=>x[2]>=40),`下拉点击区太矮: ${dd.map(x=>x[2])}`); ok(dd[0]?.[1]===site.order,'下拉第一项不是 Toast 直订'); await shot(p,'03-order-dropdown');
      // 下拉展开后,最下面的 RESERVE TODAY 仍能滚到并露在底部栏之上
      const reach = await p.evaluate(()=>{ const r=document.querySelector('#primary-navigation .nav-reserve'); r.scrollIntoView({block:'center'}); const b=r.getBoundingClientRect(), bar=document.querySelector('.mobile-actionbar').getBoundingClientRect(); const e=document.elementFromPoint(b.left+b.width/2,b.top+b.height/2); return {top:Math.round(b.top),bottom:Math.round(b.bottom),barTop:Math.round(bar.top),hit:!!e&&(e===r||r.contains(e))}; });
      ok(reach.top>=0&&reach.bottom<=reach.barTop&&reach.hit,`下拉展开后 RESERVE TODAY 够不着(top ${reach.top} bottom ${reach.bottom} 底栏 ${reach.barTop} hit ${reach.hit})`);
      await tg.tap(); await settle(p,250); ok(await tg.getAttribute('aria-expanded')==='false','再点一次没有收起导航');
      // 底部操作栏:不盖住页脚最后一行
      await p.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight)); await settle(p,400); await shot(p,'04-page-bottom');
      const bar = await p.evaluate(()=>{ const b=document.querySelector('.mobile-actionbar'); const br=b.getBoundingClientRect(); const links=[...b.querySelectorAll('a')].map(a=>[a.innerText.trim(),a.getAttribute('href'),Math.round(a.getBoundingClientRect().height)]); const last=[...document.querySelectorAll('.footer-bottom *')].filter(e=>e.getBoundingClientRect().height>0).map(e=>e.getBoundingClientRect().bottom); return {barTop:br.top,lastBottom:Math.max(...last),links}; });
      ok(bar.lastBottom<=bar.barTop+1,`页脚最后一行被底部操作栏盖住(${Math.round(bar.lastBottom)}>${Math.round(bar.barTop)})`); ok(bar.links.length===3&&bar.links[0][1]===site.phoneHref&&bar.links[1][1]===site.order&&bar.links[2][1]===site.reserve,`底部栏三键去向不对: ${JSON.stringify(bar.links)}`); ok(bar.links.every(l=>l[2]>=44),'底部栏按键高度 <44px');
      // 首页 CTA 条
      await p.evaluate(()=>window.scrollTo(0,0)); await p.locator('.cta-band').evaluate(e=>e.scrollIntoView({block:'center'})); await settle(p,300); await shot(p,'05-cta-band');
      const cta = await p.evaluate(()=>[...document.querySelectorAll('.cta-band a')].map(a=>{const r=a.getBoundingClientRect();return [a.innerText.replace(/\s+/g,' ').trim().slice(0,24),Math.round(r.height),r.left>=0&&r.right<=innerWidth]})); ok(cta.length===4&&cta.every(x=>x[1]>=40&&x[2]),`CTA 条按键尺寸/位置不对: ${JSON.stringify(cta)}`);
      // 地图切换
      await p.locator('.map-frame').evaluate(e=>e.scrollIntoView({block:'center'})); const h0 = await p.locator('.map-frame').evaluate(e=>e.getBoundingClientRect().height);
      await p.getByRole('button',{name:'LIVE MAP',exact:true}).tap(); await settle(p,600); ok(/150.*36th/i.test(decodeURIComponent(await p.locator('.map-frame iframe').getAttribute('src')||'')),'手机上 LIVE MAP 不是 150 W 36th St'); await shot(p,'06-live-map');
      await p.getByRole('button',{name:'STREET GUIDE',exact:true}).tap(); await settle(p,300); ok(Math.abs(h0-await p.locator('.map-frame').evaluate(e=>e.getBoundingClientRect().height))<1,'地图切换后高度变了(跳动)');
      await c.close(); }
    // 菜单页签 / 分类导航 / 锚点落点(粘性栏)
    { const [c,p] = await mk(); await skip(c);
      await p.goto(BASE+'/menu/',{waitUntil:'networkidle'}); await settle(p,500);
      for (const [tab,id] of [['Lunch','panel-lunch'],['Happy Hour','panel-happy-hour'],['Dinner','panel-dinner']]) { await p.getByRole('tab',{name:tab}).tap(); await settle(p,300); const vis = await p.evaluate(()=>[...document.querySelectorAll('[role=tabpanel]')].filter(x=>!x.hidden).map(x=>x.id)); ok(vis.length===1&&vis[0]===id,`手机点「${tab}」页签后显示 ${vis}`); }
      const catNav = p.locator('#panel-dinner .category-navigation a',{hasText:/^Ramen Noodles$/}).first(); await catNav.scrollIntoViewIfNeeded().catch(()=>{}); await catNav.tap(); await p.waitForFunction(()=>{const r=document.getElementById('dinner--ramen-noodles').getBoundingClientRect();return r.top<innerHeight*0.6&&r.top>-50;},null,{timeout:6000}).catch(()=>{}); await landed(p,'dinner--ramen-noodles','点分类「Ramen Noodles」'); await shot(p,'07-menu-ramen');
      // 配图排版:每排排满(奇数张时最后一张占整行:左图右字),每张图都是同样大小的方图,图注不出现「单词单独掉一行」
      for (const [tab,ids] of [['Dinner',['dinner--ramen-noodles','dinner--appetizers','dinner--bento-box']],['Lunch',['lunch--bento-box','lunch--sushi-bar']]]) { await p.getByRole('tab',{name:tab}).tap(); await settle(p,300);
        for (const id of ids) { const g = await p.evaluate(id=>{ const tiles=[...document.querySelectorAll('#'+id+' .featured-dish')]; const cont=document.querySelector('#'+id+' .featured-dishes').getBoundingClientRect(); const rows={}; for(const t of tiles){const r=t.getBoundingClientRect(); const k=Math.round(r.top); (rows[k]=rows[k]||[]).push(r.width);} const gaps=Object.values(rows).filter(ws=>ws.reduce((a,b)=>a+b,0)<cont.width*0.9).length; const caps=tiles.map(t=>{const s=t.querySelector('figcaption strong'); const lh=parseFloat(getComputedStyle(s).lineHeight)||18; return Math.round(s.getBoundingClientRect().height/lh);}); const ph=tiles.map(t=>t.querySelector('.featured-photo').getBoundingClientRect()); const odd=ph.filter(r=>Math.abs(r.width-r.height)>2||Math.abs(r.width-ph[0].width)>2).length; return {n:tiles.length,gaps,odd,maxLines:Math.max(...caps)}; },id);
          ok(g.gaps===0,`${tab} #${id}: 配图有 ${g.gaps} 排没排满(留空格)`); ok(g.odd===0,`${tab} #${id}: 有 ${g.odd} 张配图不是同样大小的方图`); ok(g.maxLines<=2,`${tab} #${id}: 图注超过 2 行`); } }
      await p.getByRole('tab',{name:'Dinner'}).tap(); await settle(p,300);
      for (const hash of ['dinner--ramen-noodles','dinner--bento-box','lunch--bento-box','lunch--rice-dishes','happy-hour--sushi-rolls']) { await p.goto('about:blank'); await p.goto(BASE+'/menu/#'+hash,{waitUntil:'networkidle'}); await landed(p,hash,`直接打开 /menu/#${hash}`); if(hash==='lunch--bento-box') await shot(p,'08-menu-lunch-bento'); }
      await c.close(); }
    // 相册大图
    { const [c,p] = await mk(); await skip(c); await p.goto(BASE+'/gallery/',{waitUntil:'networkidle'}); await scrollAll(p);
      { const holes = await p.evaluate(()=>{ const g=document.querySelector('.gallery-grid').getBoundingClientRect(); const rows={}; for(const t of document.querySelectorAll('.gallery-tile')){const r=t.getBoundingClientRect(); const k=Math.round(r.top); rows[k]=(rows[k]||0)+r.width;} return Object.values(rows).filter(w=>w<g.width*0.9).length; }); ok(holes===0,`相册有 ${holes} 排没排满(留空格)`); }
      await p.locator('.gallery-tile').first().tap(); await settle(p,500); ok(await p.getByRole('dialog').isVisible(),'手机点相册图没打开大图'); await shot(p,'09-gallery-lightbox');
      const lb = await p.evaluate(()=>{const i=document.querySelector('.lightbox-content img').getBoundingClientRect();const c=document.querySelector('.lightbox-controls').getBoundingClientRect();return {iw:Math.round(i.width),vw:innerWidth,imgIn:i.left>=-1&&i.right<=innerWidth+1,ctlIn:c.bottom<=innerHeight+1&&c.left>=-1&&c.right<=innerWidth+1,sw:document.documentElement.scrollWidth};}); ok(lb.imgIn&&lb.ctlIn&&lb.sw<=lb.vw,`大图/按钮超出屏幕 ${JSON.stringify(lb)}`);
      await p.getByRole('button',{name:/Next image/}).tap(); await settle(p,200); ok(/2 \/ \d+/.test(await p.locator('.lightbox-controls').innerText()),'大图「下一张」没切到第 2 张'); await p.getByRole('button',{name:/Close image/}).tap(); await settle(p,250); ok(!(await p.getByRole('dialog').isVisible()),'大图 CLOSE 没关闭'); await c.close(); }
    // 活动页表单
    { const [c,p] = await mk(); await skip(c); await p.goto(BASE+'/events-catering/',{waitUntil:'networkidle'}); await p.evaluate(()=>{window.__nav=[];if(window.navigation)navigation.addEventListener('navigate',e=>{window.__nav.push(e.destination.url);if(/^mailto:/.test(e.destination.url))e.preventDefault();});});
      await p.getByRole('button',{name:'OPEN EMAIL APP'}).tap(); await settle(p,250); ok(await p.locator('.field-error').count()>0,'手机空表单提交没报错');
      const ids = await p.evaluate(()=>[...document.querySelectorAll('[id^=inquiry-]')].map(e=>e.id.replace('inquiry-','')).filter(x=>x!=='message')); const day = new Date(Date.now()+2*864e5).toISOString().slice(0,10);
      for (const id of ids) { const el=p.locator('#inquiry-'+id); if((await el.evaluate(e=>e.tagName))==='SELECT') await el.selectOption({index:1}); else await el.fill(id==='email'?'test@example.com':id==='phone'?'6465550101':id==='guests'?'12':id==='date'?day:id==='time'?'12:00':'Test'); }
      await p.getByRole('button',{name:'OPEN EMAIL APP'}).tap(); await settle(p,500); const hasNav = await p.evaluate(()=>!!window.navigation);
      if (hasNav) { const mail = (await p.evaluate(()=>window.__nav)).find(u=>u.startsWith('mailto:')); ok(!!mail&&mail.startsWith('mailto:'+site.cateringEmail+'?'),`手机表单没把邮件发往 ${site.cateringEmail}`); } else ok(await p.locator('.field-error').count()===0,'手机表单填好后仍报错');
      await c.close(); }
    // ── 动态 ──
    { const [c,p] = await mk(); await skip(c); await p.goto(BASE+'/menu/',{waitUntil:'networkidle'});
      const tile = p.locator('#dinner--appetizers .featured-dish').nth(1); await tile.evaluate(e=>e.scrollIntoView({block:'center'})); await settle(p,900);
      const m = await tile.evaluate(t=>{const i=t.querySelector('img'),cs=getComputedStyle(i);return {hover:matchMedia('(hover:hover)').matches,scale:parseFloat(cs.scale),rest:parseFloat(getComputedStyle(t).getPropertyValue('--rest')||'1'),anims:i.getAnimations().length,anim:cs.animationName};});
      ok(!m.hover,'这个手机配置不是触屏(hover:hover 为真)'); ok(Math.abs(m.scale-m.rest)<0.01,'触屏上出现了悬停放大'); ok(m.anims>=1&&m.anim.includes('dish-float'),`触屏上看得见的菜品没在悬浮(动画 ${m.anims})`);
      await tile.locator('.featured-photo').tap(); await settle(p,400); ok(Math.abs(await tile.evaluate(t=>parseFloat(getComputedStyle(t.querySelector('img')).scale))-m.rest)<0.01+0.0,'点按菜品图后留下了放大状态(触屏不该有悬停残留)');
      await p.goto(BASE+'/',{waitUntil:'networkidle'}); await p.locator('.home-film').evaluate(e=>e.scrollIntoView({block:'center'})); await settle(p,500);
      ok(await p.evaluate(()=>document.querySelector('.home-film video').paused),'手机上视频不该自动播放(省流量)'); await p.getByRole('button',{name:/PLAY THE FILM|WATCH WITH SOUND/}).tap(); await settle(p,2200);
      ok(await p.evaluate(()=>{const v=document.querySelector('.home-film video');return !v.paused&&!v.muted&&v.currentTime>0.3&&!v.error;}),'手机点「看视频」后没有带声音播放');
      // 页头不抖(慢速下滚过阈值)
      await p.goto(BASE+'/menu/',{waitUntil:'networkidle'}); await p.evaluate(()=>{window.__s=[];let last=document.documentElement.hasAttribute('data-scrolled');new MutationObserver(()=>{const v=document.documentElement.hasAttribute('data-scrolled');if(v!==last){window.__s.push(v);last=v;}}).observe(document.documentElement,{attributes:true,attributeFilter:['data-scrolled']});window.__y=[];});
      for(let i=0;i<30;i++){ await p.evaluate(()=>{window.scrollBy(0,7);window.__y.push(scrollY);}); await p.waitForTimeout(60); } await settle(p,500);
      const hs = await p.evaluate(()=>({sw:window.__s.length,y:window.__y})); let back=0; for(let i=1;i<hs.y.length;i++) if(hs.y[i]<hs.y[i-1]-2) back++; ok(hs.sw<=1,`手机页头状态切换了 ${hs.sw} 次(抖动)`); ok(back===0,`手机向下滚时 scrollY 被拨回 ${back} 次`);
      await c.close(); }
    { const [c,p] = await mk({reducedMotion:'reduce'}); await p.goto(BASE+'/menu/',{waitUntil:'networkidle'}); const t = p.locator('#dinner--appetizers .featured-dish').first(); await t.evaluate(e=>e.scrollIntoView({block:'center'})); await settle(p,700);
      ok(await t.evaluate(t=>t.querySelector('img').getAnimations().length)===0,'开了「减少动态效果」手机上菜品图仍在动'); await p.goto(BASE+'/',{waitUntil:'networkidle'}); ok(await p.locator('.intro').count()===0,'开了「减少动态效果」仍有开场动画'); await c.close(); }
    { const [c,p] = await mk(); await p.goto(BASE+'/',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(500); const hadIntro = await p.locator('.intro').count();
      if (hadIntro) { await p.locator('.intro-skip').tap(); await p.waitForTimeout(400); }
      await p.waitForFunction(()=>!document.querySelector('.intro'),null,{timeout:5000}).catch(()=>{}); ok(await p.locator('.intro').count()===0,'开场动画没有在 5 秒内结束/没能跳过'); ok(await p.evaluate(()=>getComputedStyle(document.body).overflow!=='hidden'),'开场动画结束后页面仍被锁住不能滚动'); await c.close(); }
    } catch (e) { fail.push(`[${P}] 检查中途出错(通常是元素被挡住点不到或版面坏了): ${String(e).split('\n')[0].slice(0,160)}`); }
    ok(errs.length===0,`控制台/页面报错: ${[...new Set(errs)].slice(0,3).join(' ; ')}`); ok(bad.length===0,`同源请求失败: ${[...new Set(bad)].slice(0,4).join(' ; ')}`);
    await b.close();
  }
} finally { try{srv.kill()}catch{} }
console.log(fail.length ? `MOBILE FAIL x${fail.length}:\n - ${fail.join('\n - ')}` : `MOBILE PASS (${PROFILES.filter(p=>!process.env.ONLY||p[0].includes(process.env.ONLY)).length} 种手机配置 × ${PAGES.length} 页 + 展开/动态/图片/落点)`); process.exit(fail.length?1:0);
