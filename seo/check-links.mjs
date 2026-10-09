// 全站按钮/链接审计(2026-10-02):每个链接的「按钮文字」与「去向」是否一致;内部链接能打开、#锚点真的落在对的菜单页签/区块;
// 外部链接只许出现「已人工在真实浏览器核对过」的那几个网址;下拉/页签/相册/地图切换/表单等按钮真的做它写的事。
// 用法: node seo/check-links.mjs        (CTA_BASE=网址 测线上)
import {spawn} from 'child_process'; import {chromium, devices} from 'playwright';
import {site} from '../content/site.ts';
const PORT = 3078, BASE = process.env.CTA_BASE || `http://127.0.0.1:${PORT}`; const fail = []; const ok = (c,m) => { if(!c) fail.push(m); };
const srv = process.env.CTA_BASE ? {kill(){}} : spawn('node',['scripts/serve.mjs'],{env:{...process.env,PORT:String(PORT)},stdio:'ignore'});
for (let i=0;i<40;i++){ try{ if((await fetch(BASE+'/')).ok) break; }catch{} await new Promise(r=>setTimeout(r,250)); }

// ── 已人工核对过的外部网址(2026-10-02,真实浏览器打开并读到店名/地址;机器人请求会被 Cloudflare 拦,所以不能靠 curl) ──
const VERIFIED = {
  [site.order]:      'Toast「Zen Ramen & Sushi - Takeout 150 W 36th street」在线点餐页(旧站用的 …/zen-ramen-sushi-takeout 是 404)',
  [site.reserve]:    'Resy「Zen Ramen & Sushi」订位页,Midtown',
  [site.directions]: 'Google 地图路线,终点 Zen Ramen & Sushi, 150 W 36th St, New York, NY 10018',
  [site.reviews]:    'Google 地图地点页「Zen Ramen & Sushi」(cid=0x259be4c56c369c55,评分与评论)',
  'https://www.ubereats.com/store/zen-ramen-%26-sushi-midtown-west/B4a3zZiTTaemuC9tPhqbLQ': 'Uber Eats「Zen Ramen & Sushi」150 W 36th St',
  'https://www.doordash.com/store/zen-ramen-sushi-new-york-64843/111425951/':                'DoorDash「Zen Ramen Sushi」150 West 36th Street(页面结构化数据)',
  'https://www.grubhub.com/restaurant/zen-ramen-and-sushi-150-w-36th-st-new-york/327291':   'Grubhub「Zen Ramen and Sushi」150 W 36th St',
  'https://www.instagram.com/zenramen_sushi/': '店家 IG @zenramen_sushi',
};
const PHONE = 'tel:+16468707509', IG_REEL = /^https:\/\/www\.instagram\.com\/zenramen_sushi\/reel\/[\w-]+\/$/;
// 「文字 → 去向」规则:按顺序匹配,第一条命中即判定
const RULES = [
  [/^SKIP TO CONTENT$/i, h=>h==='#main'],
  [/Google reviews/i, h=>h===site.reviews],
  [/GET DIRECTIONS|SEE YOU ON 36TH|^150 W 36th St$/i, h=>h===site.directions],
  [/^UBER EATS/i, h=>h.includes('ubereats.com/store/zen-ramen')],
  [/^DOORDASH/i, h=>h.includes('doordash.com/store/zen-ramen')],
  [/^GRUBHUB/i, h=>h.includes('grubhub.com/restaurant/zen-ramen')],
  [/^(ORDER ONLINE|ORDER DIRECT|ORDER)\b/i, h=>h===site.order],
  [/RESERVE/i, h=>h===site.reserve],
  [/^(CALL\b|\(646\) 870-7509|Call us at)/i, h=>h===PHONE],
  [/^info@/i, h=>h==='mailto:'+site.email], [/^catering@/i, h=>h==='mailto:'+site.cateringEmail],
  [/^FOLLOW ALONG/i, h=>h==='https://www.instagram.com/zenramen_sushi/'], [/^WATCH ON INSTAGRAM/i, h=>IG_REEL.test(h)],
  [/^SEE THE FULL HAPPY HOUR MENU|^…and \d+ more on the full menu/i, h=>h==='/menu/#happy-hour'],
  [/^lunch menu$/i, h=>h==='/menu/#lunch'],
  /* 2026-10-06 新增的三页(午市套餐 / 地址 / 文章目录)及其入口 */
  [/^(Lunch Specials\b|lunch specials( menu)?$)/i, h=>h==='/lunch-specials/'], [/^FULL LUNCH MENU/, h=>h==='/menu/#lunch'],
  [/^location (&|and) hours$|^Location & Hours\b/i, h=>h==='/location/'], [/^(Journal\b|ALL GUIDES|ZEN JOURNAL)/, h=>h==='/blog/'],
  [/^near Penn Station$/, h=>h==='/near-penn-station/'], [/^near Madison Square Garden$/, h=>h==='/near-madison-square-garden/'], [/^happy hour$/i, h=>h==='/happy-hour/'],
  /* 首页三张菜单卡(整张卡是一个链接,文字=标题+副标题;箭头现在是 SVG 图标,不再是文字) */
  [/^Dinner Ramen, sushi/, h=>h==='/menu/#dinner'], [/^Lunch Monday/, h=>h==='/menu/#lunch'], [/^Happy Hour 4–8 PM · Appetizers/, h=>h==='/menu/#happy-hour'],
  [/^(HAPPY HOUR\b|Happy Hour\b|SEE THE DEAL|daily happy hour|happy hour \()/, h=>h==='/happy-hour/'],
  [/^(SEE THE CATERING MENU)/, h=>h==='/zrm-menu/'], [/^OPEN FULL PAGE/, h=>h==='/zrm-menu/'], [/^EMAIL TO ORDER/, h=>h==='mailto:'+site.cateringEmail], [/^(DINE-IN MENU)/, h=>h==='/menu/'],
  [/^(EVENTS\/CATERING|Events & Catering|PLAN YOUR EVENT|Let us know ahead|tell us ahead)/i, h=>h==='/events-catering/'],
  [/^(MENU|Menu|EXPLORE THE MENU|SEE THE MENU|VIEW THE FULL MENU)\b/, h=>h==='/menu/'],
  [/^(ABOUT|GET TO KNOW US)/i, h=>h==='/about/'], [/^(EXPLORE THE GALLERY|Gallery)/i, h=>h==='/gallery/'],
  [/^HOURS & LOCATION/i, h=>h==='/#hours-location'], [/^Privacy Policy$/i, h=>h==='/privacy-policy/'], [/^Terms & Conditions$/i, h=>h==='/terms-conditions/'],
  [/^ZEN RAMEN & SUSHI$/, h=>h==='/'],
];
const label = r => (r.text || r.aria || '').replace(/\s*↗\s*$/,'').trim();
const paths = ['/','/menu/','/about/','/gallery/','/happy-hour/','/events-catering/','/zrm-menu/','/near-penn-station/','/near-madison-square-garden/','/privacy-policy/','/terms-conditions/','/lunch-specials/','/location/','/blog/'];
// 文章目录页上的文章链接:文字=文章标题,去向必须是 content/journal.json 里那篇文章自己的网址(文章页本身的链接由 check-journal.mjs 验)
const journal = new Map(JSON.parse((await import('fs')).readFileSync('content/journal.json','utf8')).posts.map(p=>[p.path,p.title]));
const b = await chromium.launch(); const skipIntro = c => c.addInitScript(()=>{try{sessionStorage.setItem('zen-intro-v2','1')}catch{}});
const seen = new Map(), anchors = [];
try {
  // ── A. 清点所有链接(电脑+手机;下拉与手机导航都展开)并按「文字→去向」规则判定 ──
  for (const [dn,opt] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{...devices['iPhone 13']}]]) {
    const ctx = await b.newContext(opt); await skipIntro(ctx); const p = await ctx.newPage();
    for (const path of paths) {
      await p.goto(BASE+path,{waitUntil:'networkidle'}); await p.waitForTimeout(250);
      if (dn==='phone') { await p.locator('.nav-toggle').click().catch(()=>{}); await p.waitForTimeout(150); }
      await p.getByRole('button',{name:/ORDER ONLINE/}).first().click().catch(()=>{}); await p.waitForTimeout(150);
      const rows = await p.evaluate(()=>[...document.querySelectorAll('a[href]')].map(e=>({text:(e.innerText||'').replace(/\s+/g,' ').trim(),aria:e.getAttribute('aria-label')||'',href:e.getAttribute('href'),target:e.getAttribute('target')||'',rel:e.getAttribute('rel')||'',panel:e.closest('[role=tabpanel]')?.id||'',inNav:!!e.closest('.category-navigation')})));
      for (const r of rows) anchors.push({...r,page:path,vp:dn});
    }
    await ctx.close();
  }
  const bad = new Set(); const unmatched = new Set(); const externals = new Set(); const internals = new Set();
  for (const r of anchors) {
    const h = r.href, l = label(r);
    if (/^https?:/.test(h)) { externals.add(h); ok(r.target==='_blank' && /noopener/.test(r.rel), `${r.page} 「${l}」外链没有 target=_blank + noopener`); }
    else if (!/^(mailto:|tel:|#)/.test(h)) internals.add(h.split('#')[0]);
    if (r.inNav) { const m = h.match(/^#(\w[\w-]*)--[\w-]+$/); ok(!!m && (`panel-${m[1]}`===r.panel), `${r.page} 分类导航「${l}」指向 ${h},但它在 ${r.panel||'?'} 里(菜单页签对不上)`); continue; }
    if (r.panel && /^VIEW ORIGINAL PDF|^View the original/i.test(l)) { ok(h===`/menus/${r.panel.replace('panel-','')}.pdf`, `${r.page} 「${l}」在 ${r.panel} 里却指向 ${h}`); continue; }
    if (journal.has(h)) { ok(l.includes(journal.get(h)), `${r.page} 文章链接文字「${l.slice(0,50)}」与去向 ${h} 的标题不符`); continue; }
    const rule = RULES.find(([re]) => re.test(l));
    if (!rule) { unmatched.add(`${l} → ${h}`); continue; }
    const key = `${l} → ${h}`; if (seen.has(key)) continue; seen.set(key, rule);
    if (!rule[1](h)) bad.add(`「${l}」→ ${h}`);
  }
  for (const x of bad) fail.push(`文字与去向不一致: ${x}`);
  for (const x of unmatched) fail.push(`有链接没被任何规则覆盖(请补规则或确认去向): ${x}`);
  for (const h of externals) {
    if (IG_REEL.test(h)) { const id = h.match(/reel\/([\w-]+)\//)[1]; for (const ext of ['mp4','webp']) { const r = await fetch(`${BASE}/ig/${id}.${ext}`); ok(r.status===200, `IG 视频块 ${id} 缺本地 ${ext}(链接与视频不是同一条)`); } continue; }   // IG 需登录,不能机器核对:以「链接 id = 本地视频 id」一致为准
    ok(h in VERIFIED, `出现了未经人工核对的外部网址: ${h}`);
  }
  // ── B. 内部链接真的能打开(200),PDF 是 PDF ──
  for (const h of internals) { const r = await fetch(BASE+h,{redirect:'manual'}); ok(r.status===200, `内部链接 ${h} 返回 ${r.status}`); if (h.endsWith('.pdf')) ok((r.headers.get('content-type')||'').includes('pdf'), `${h} 不是 PDF(${r.headers.get('content-type')})`); }
  // ── C. 带 # 的链接真的落在对的菜单页签/区块;页内锚点存在 ──
  { const ctx = await b.newContext({viewport:{width:1440,height:900}}); await skipIntro(ctx); const p = await ctx.newPage();
    const menuHashes = [...new Set(anchors.map(a=>a.href).filter(h=>/^\/menu\/#|^#(dinner|lunch|happy-hour)/.test(h)).map(h=>h.replace(/^\/menu\//,'')))].concat(['#dinner','#lunch','#happy-hour']);
    for (const hash of [...new Set(menuHashes)]) {
      await p.goto('about:blank'); await p.goto(BASE+'/menu/'+hash,{waitUntil:'networkidle'}); await p.waitForTimeout(500);   // 先回空白页,保证是「整页重新打开」而不是同页换锚点
      const want = hash.slice(1).split('--')[0];
      const st = await p.evaluate((hash)=>{ const sel=[...document.querySelectorAll('[role=tab][aria-selected=true]')].map(e=>e.id); const el=document.getElementById(hash.slice(1)); const panel=[...document.querySelectorAll('[role=tabpanel]')].find(x=>!x.hidden)?.id; const r=el?.getBoundingClientRect(); return {sel,panel,exists:!!el,visible:!!r&&r.width>0&&r.height>0}; }, hash);
      ok(st.sel.length===1 && st.sel[0]==='tab-'+want && st.panel==='panel-'+want, `/menu/${hash} 没有打开 ${want} 页签(实际 ${st.sel.join(',')}/${st.panel})`);
      if (hash.includes('--')) { ok(st.exists && st.visible, `/menu/${hash} 对应的菜单区块不存在或看不见`);
        await p.waitForTimeout(400); const pos = await p.evaluate((hash)=>{const r=document.getElementById(hash.slice(1)).getBoundingClientRect();return {top:Math.round(r.top),vh:innerHeight};}, hash);
        ok(pos.top>-40 && pos.top<pos.vh*0.55, `/menu/${hash} 打开后落点不对:目标区块顶部在 ${pos.top}px(视口高 ${pos.vh}px),用户看到的不是它`); }
    }
    await p.goto('about:blank'); await p.goto(BASE+'/menu/#dinner',{waitUntil:'networkidle'}); await p.evaluate(()=>{location.hash='lunch--bento-box';}); await p.waitForTimeout(1200);
    { const st = await p.evaluate(()=>({sel:[...document.querySelectorAll('[role=tab][aria-selected=true]')].map(e=>e.id).join(),top:Math.round(document.getElementById('lunch--bento-box').getBoundingClientRect().top),vh:innerHeight}));
      ok(st.sel==='tab-lunch' && st.top>-40 && st.top<st.vh*0.55, `同页从 Dinner 换到 #lunch--bento-box:页签 ${st.sel},区块顶部 ${st.top}px(应落在视口内)`); }
    await p.goto(BASE+'/menu/',{waitUntil:'networkidle'}); await p.getByRole('link',{name:/^HOURS & LOCATION/}).first().click(); await p.waitForURL(/\/#hours-location/); await p.waitForTimeout(800);
    ok(await p.evaluate(()=>{const r=document.getElementById('hours-location')?.getBoundingClientRect();return !!r&&r.top<innerHeight&&r.bottom>0;}), '从菜单页点 HOURS & LOCATION 没有滚到首页的营业时间与地图');
    await ctx.close(); }
  // ── D. 按钮真的做它写的事 ──
  { const ctx = await b.newContext({viewport:{width:1440,height:900}}); await skipIntro(ctx); const p = await ctx.newPage();
    // D1 ORDER ONLINE 下拉:四个外卖入口与顺序
    await p.goto(BASE+'/',{waitUntil:'networkidle'}); await p.getByRole('button',{name:/ORDER ONLINE/}).first().click(); await p.waitForTimeout(150);
    const dd = await p.evaluate(()=>[...document.querySelectorAll('#delivery-links a')].map(a=>[a.innerText.replace(/\s*↗\s*/,'').trim(),a.getAttribute('href')]));
    ok(JSON.stringify(dd.map(x=>x[0]))==='["ORDER DIRECT","UBER EATS","DOORDASH","GRUBHUB"]', `ORDER ONLINE 下拉内容/顺序不对: ${dd.map(x=>x[0])}`);
    await p.keyboard.press('Escape');
    // D2 首页三张菜单卡 → 对应页签
    for (const [name, tab] of [['Dinner','Dinner'],['Lunch','Lunch'],['Happy Hour','Happy Hour']]) {
      await p.goto(BASE+'/',{waitUntil:'networkidle'}); await p.locator('.menu-card',{hasText:name}).first().click(); await p.waitForURL(/\/menu\//); await p.waitForTimeout(500);
      ok(await p.getByRole('tab',{name:tab}).getAttribute('aria-selected')==='true', `首页「${name}」卡片没有打开 ${tab} 页签`);
    }
    // D3 菜单页页签切换、分类导航跳到对的区块
    await p.goto(BASE+'/menu/',{waitUntil:'networkidle'});
    for (const tab of ['Lunch','Happy Hour','Dinner']) { await p.getByRole('tab',{name:tab}).click(); await p.waitForTimeout(250); const vis = await p.evaluate(()=>[...document.querySelectorAll('[role=tabpanel]')].filter(x=>!x.hidden).map(x=>x.id)); ok(vis.length===1 && vis[0]==='panel-'+tab.toLowerCase().replace(' ','-'), `点「${tab}」页签后显示的是 ${vis}`); }
    await p.locator('.category-navigation a',{hasText:/^Ramen Noodles$/}).first().click(); await p.waitForFunction(()=>{const r=document.getElementById('dinner--ramen-noodles').getBoundingClientRect();return r.top<innerHeight*0.6&&r.top>-50;},null,{timeout:6000}).catch(()=>{});
    ok(await p.evaluate(()=>{const r=document.getElementById('dinner--ramen-noodles').getBoundingClientRect();return r.top<innerHeight*0.6&&r.bottom>0;}), '点分类「Ramen Noodles」没有滚到拉面区块');
    // D4 地图 STREET GUIDE / LIVE MAP
    await p.goto(BASE+'/',{waitUntil:'networkidle'}); await p.getByRole('button',{name:'LIVE MAP',exact:true}).click(); await p.waitForTimeout(500);
    ok(/150.*36th/i.test(decodeURIComponent(await p.locator('.map-frame iframe').getAttribute('src')||'')), 'LIVE MAP 的地图不是 150 W 36th St');
    await p.getByRole('button',{name:'STREET GUIDE',exact:true}).click(); ok(await p.locator('.map-frame iframe').count()===0, '点 STREET GUIDE 后仍显示实时地图');
    // D5 视频按钮
    await p.locator('.home-film').evaluate(e=>e.scrollIntoView({block:'center'})); await p.waitForTimeout(500);
    await p.getByRole('button',{name:/PLAY THE FILM|WATCH WITH SOUND/}).click(); await p.waitForTimeout(1800);
    ok(await p.evaluate(()=>{const v=document.querySelector('.home-film video');return !v.paused&&!v.muted&&v.currentTime>0.2;}), '点「看视频」按钮后视频没有带声音播放');
    // D6 相册大图
    await p.goto(BASE+'/gallery/',{waitUntil:'networkidle'}); await p.locator('.gallery-tile').first().click(); await p.waitForTimeout(400);
    ok(await p.getByRole('dialog').isVisible(), '点相册图没有打开大图'); await p.getByRole('button',{name:/Next image/}).click(); await p.waitForTimeout(150);
    ok(/2 \/ \d+/.test(await p.locator('.lightbox-controls').innerText()), '大图「下一张」没有切到第 2 张'); await p.getByRole('button',{name:/Close image/}).click(); await p.waitForTimeout(250); ok(!(await p.getByRole('dialog').isVisible()), '大图 CLOSE 没有关闭');
    // D7 IG 视频块的播放键
    { const c2 = await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}); await skipIntro(c2); var p2 = await c2.newPage(); }
    await p2.goto(BASE+'/',{waitUntil:'networkidle'}); await p2.locator('#instagram').evaluate(e=>e.scrollIntoView({block:'center'})); await p2.waitForTimeout(500);
    const igState = ()=>p2.evaluate(()=>{const v=document.querySelector('.ig-tile video');return !v.paused;});
    const igBefore = await igState(); await p2.locator('.ig-play').first().click(); await p2.waitForTimeout(1500); const igAfter = await igState();
    ok(igBefore!==igAfter, `IG 播放键点了没有切换播放/暂停(前 ${igBefore} 后 ${igAfter})`);
    if (!igAfter) { await p2.locator('.ig-play').first().click(); await p2.waitForTimeout(1500); ok(await igState(), 'IG 播放键再点一次仍没播放'); }
    // D8 活动页表单:空提交报错;填好后生成发给 catering@ 的邮件
    await p.goto(BASE+'/events-catering/',{waitUntil:'networkidle'}); await p.evaluate(()=>{window.__nav=[];if(window.navigation)navigation.addEventListener('navigate',e=>{window.__nav.push(e.destination.url);if(/^mailto:/.test(e.destination.url))e.preventDefault();});});
    await p.getByRole('button',{name:'OPEN EMAIL APP'}).click(); await p.waitForTimeout(200); ok(await p.locator('.field-error').count()>0, '空表单点 OPEN EMAIL APP 没有报错');
    const fill = async (id,v)=>{ const el=p.locator('#inquiry-'+id); if((await el.evaluate(e=>e.tagName))==='SELECT') await el.selectOption({index:1}); else await el.fill(v); };
    const ids = await p.evaluate(()=>[...document.querySelectorAll('[id^=inquiry-]')].map(e=>e.id.replace('inquiry-','')).filter(x=>x!=='message'));
    const today = new Date(Date.now()+2*864e5).toISOString().slice(0,10);
    for (const id of ids) await fill(id, id==='email'?'test@example.com':id==='phone'?'6465550101':id==='guests'?'12':id==='date'?today:id==='time'?'12:00':'Test');
    await p.getByRole('button',{name:'OPEN EMAIL APP'}).click(); await p.waitForTimeout(500);
    const nav = await p.evaluate(()=>window.__nav||[]); const mail = nav.find(u=>u.startsWith('mailto:'));
    ok(!!mail && mail.startsWith('mailto:'+site.cateringEmail+'?'), `表单没有把邮件发往 ${site.cateringEmail}(得到 ${mail||'无'})`); ok(!!mail && /subject=Event%20inquiry/.test(mail), '邮件主题不是 Event inquiry'); ok(!!mail && new URL(mail).searchParams.get('cc')===site.cateringCc, `表单没有抄送 ${site.cateringCc}`);
    // D9 404 页
    const r404 = await fetch(BASE+'/this-page-does-not-exist/'); ok(r404.status===404, `不存在的网址返回 ${r404.status}(应 404)`); ok(/href="\/"/.test(await r404.text()), '404 页没有回首页的按钮');
    await ctx.close(); }
} finally { await b.close(); try{srv.kill()}catch{} }
const total = anchors.length, uniq = seen.size;
console.log(`  链接 ${total} 条(${uniq} 种「文字→去向」),外部网址 ${Object.keys(VERIFIED).length} 个已核对`);
console.log(fail.length ? `LINKS FAIL x${fail.length}: ${fail.join(' | ')}` : 'LINKS PASS'); process.exit(fail.length?1:0);
