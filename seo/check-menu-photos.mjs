// 菜单配图验收(2026-10-01):每张图只出现在它拍的那道菜上;图文件齐全、1024 方图、来源台账齐全;渲染实测。
// 用法: node seo/check-menu-photos.mjs data|render
import fs from 'fs'; import sharp from 'sharp'; import {spawn} from 'child_process';
import {featured} from '../content/featured.ts';
const mode = process.argv[2]; const fail = []; const ok = (c,m) => { if(!c) fail.push(m); };
const done = n => { console.log(fail.length ? `${n} FAIL: ${fail.join(' | ')}` : `${n} PASS`); process.exit(fail.length?1:0); };
const menus = JSON.parse(fs.readFileSync('content/menus.json','utf8')); const src = JSON.parse(fs.readFileSync('content/photo-sources.json','utf8'));
if (mode === 'data') {
  const guestUsed = new Set();
  for (const [key, list] of Object.entries(featured)) {
    const [mid, sid] = key.split('--'); const sec = menus.find(m=>m.id===mid)?.sections.find(s=>s.id===sid); ok(!!sec, `${key}: 菜单里没有这个分区`);
    for (const f of list) {
      const it = sec?.items.find(x=>x.id===f.itemId); ok(!!it, `${key}: 菜品 ${f.itemId} 不在该分区`);
      const file = f.img.replace('/images/',''); ok(fs.existsSync('public'+f.img), `${f.img} 文件不存在`);
      if (file.startsWith('dish-')) { guestUsed.add(file); const rec = src.photos.find(p=>p.file===file); ok(!!rec, `${file}: 台账里没有来源记录`); ok(rec?.items.includes(f.itemId), `${file}: 台账没有允许它出现在 ${f.itemId}(${it?.name}) 上`); }
      if (fs.existsSync('public'+f.img)) { const md = await sharp('public'+f.img).metadata(); ok(md.width===md.height && md.width>=1000 || /^shot-/.test(file), `${file}: 不是 ≥1000 的方图(${md.width}x${md.height})`);
        if (file.startsWith('dish-')) { ok(md.hasAlpha, `${file}: 没有透明通道`); const {data,info} = await sharp('public'+f.img).ensureAlpha().raw().toBuffer({resolveWithObject:true}); let x0=1e9,y0=1e9,x1=-1,y1=-1; for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){ if(data[(y*info.width+x)*4+3]>8){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);} } const m=Math.min(x0,y0,info.width-1-x1,info.height-1-y1)/info.width; ok(m>=0.05, `${file}: 菜离画布边太近(最小边距 ${(m*100).toFixed(1)}% <5%)`); ok(fs.statSync('public'+f.img).size<=250*1024, `${file}: 超过 250KB`); } }
    }
  }
  for (const [key, list] of Object.entries(featured)) ok(list.length % 3 === 0 || list.length === 1, `${key}: 配图 ${list.length} 张,既不是 1 张(招牌卡)也不是 3 的倍数(一排排不满)`);
  /* 招牌卡(分区只有 1 张):图框是 2:1、只露出画布中间一半高度,所以菜必须落在中间 46% 高度以内、宽度不超过 84%,否则会被裁掉 */
  for (const [key, list] of Object.entries(featured)) { if (list.length !== 1 || !fs.existsSync('public'+list[0].img)) continue; const {data,info} = await sharp('public'+list[0].img).ensureAlpha().raw().toBuffer({resolveWithObject:true}); let x0=1e9,y0=1e9,x1=-1,y1=-1; for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){ if(data[(y*info.width+x)*4+3]>8){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);} } const top=y0/info.height, bot=(info.height-1-y1)/info.height, wide=(x1-x0)/info.width; ok(top>=0.27 && bot>=0.27 && wide<=0.84, `${key}: 招牌卡的图会被 2:1 图框裁掉(上留白 ${(top*100).toFixed(0)}% 下留白 ${(bot*100).toFixed(0)}% 宽 ${(wide*100).toFixed(0)}%;用 fit-dish.py --wide 重摆)`); }
  for (const p of src.photos) { ok(guestUsed.has(p.file), `${p.file}: 台账里有但没被使用`); ok(!!p.depicts && !!p.googleTag, `${p.file}: 台账缺 depicts/googleTag`); }
  ok(guestUsed.size >= 30, `菜品透明图只用了 ${guestUsed.size} 张(<30)`);
  console.log(`  featured 分区 ${Object.keys(featured).length} 个,菜品透明图 ${guestUsed.size} 张`); done('MENU-PHOTOS-DATA');
}
if (mode === 'render') {
  const {chromium, devices} = await import('playwright'); const PORT = 3072; const BASE = process.env.CTA_BASE || `http://127.0.0.1:${PORT}`;
  const srv = process.env.CTA_BASE ? {kill(){}} : spawn('node',['scripts/serve.mjs'],{env:{...process.env,PORT:String(PORT)},stdio:'ignore'});
  for (let i=0;i<40;i++){ try{ if((await fetch(BASE+'/')).ok) break; }catch{} await new Promise(r=>setTimeout(r,250)); }
  const b = await chromium.launch();
  try {
    for (const [name,opt] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{...devices['iPhone 13']}]]) {
      const ctx = await b.newContext(opt); await ctx.addInitScript(()=>{try{sessionStorage.setItem('zen-intro-v2','1')}catch{}}); const p = await ctx.newPage();
      await p.goto(BASE+'/menu/',{waitUntil:'networkidle'});
      for (const [tab, want, sections] of [['Lunch',9,['lunch--bento-box','lunch--rice-dishes','lunch--sushi-bar']],['Dinner',27,['dinner--appetizers','dinner--sushi-rolls','dinner--special-roll','dinner--chef-special-rolls','dinner--sushi-entree','dinner--bento-box','dinner--rice-dishes','dinner--ramen-noodles']]]) {
        await p.getByRole('tab',{name:tab}).click(); await p.waitForTimeout(400);
        for (const s of sections) { const loc = p.locator(`#${s} .featured-dish img`); const n = await loc.count(); ok(n>0, `${name} ${tab} ${s}: 没有配图`); for (let i=0;i<n;i++){ await loc.nth(i).evaluate(e=>e.scrollIntoView({block:'center'})); await p.waitForTimeout(350); /* 图在悬浮时 Playwright 的「元素稳定」检查会超时,直接用 DOM 滚动 */ } }
        await p.waitForTimeout(600);
        const r = await p.evaluate(()=>({imgs:[...document.querySelectorAll('.featured-dish img')].filter(i=>!i.closest('[hidden]')).map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>=1000})), caps:[...document.querySelectorAll('.featured-dish')].filter(d=>!d.closest('[hidden]')).map(d=>d.querySelector('figcaption strong')).map(e=>e.textContent), sw:document.documentElement.scrollWidth, iw:innerWidth}));
        const guest = r.imgs.filter(i=>i.src.includes('dish-')); ok(guest.length>=want, `${name} ${tab}: 菜品透明图 ${guest.length} 张(<${want})`); ok(r.imgs.every(i=>i.ok), `${name} ${tab}: 有图没加载成功`); ok(r.sw<=r.iw, `${name} ${tab}: 横向溢出`);
        if (tab==='Dinner') { /* 招牌卡排版:电脑=2:1 大图在左、菜名/说明/价格在右;手机=图在上、字在下;说明文字要在 */
          const solo = await p.evaluate(()=>[...document.querySelectorAll('.featured-dishes.solo')].filter(d=>!d.closest('[hidden]')).map(d=>{ const ph=d.querySelector('.featured-photo').getBoundingClientRect(), cap=d.querySelector('figcaption').getBoundingClientRect(), box=d.getBoundingClientRect(); return {id:d.closest('section').id, ratio:ph.width/ph.height, phW:ph.width/box.width, right:cap.left>=ph.right-1, below:cap.top>=ph.bottom-1, desc:(()=>{const e=d.querySelector('.featured-desc'); return !!e && e.getBoundingClientRect().height>0 && !!e.textContent;})(), name:d.querySelector('figcaption strong').textContent}; }));
          ok(solo.length===3, `${name} Dinner: 招牌卡 ${solo.length} 张(应为 3)`);
          for (const c of solo) { ok(Math.abs(c.ratio-2)<0.1, `${name} #${c.id}: 招牌卡图框不是 2:1(${c.ratio.toFixed(2)})`); if (name==='desktop') ok(c.desc, `${name} #${c.id}: 招牌卡没有说明文字`); if (name==='desktop') ok(c.right && c.phW>0.6 && c.phW<0.72, `${name} #${c.id}: 招牌卡的字不在图右边 / 图不是占两格(${c.phW.toFixed(2)})`); else ok(c.below && c.phW>0.95, `${name} #${c.id}: 手机招牌卡不是「图在上、字在下」`); }
          ok(['Rainbow Roll','Crazy Yellowtail Roll','Sweetheart Roll'].every(n=>solo.some(c=>c.name===n)), `${name} Dinner: 招牌卡菜名不对 ${solo.map(c=>c.name).join(',')}`); }
        if (tab==='Lunch') ok(r.caps.includes('Katsu Bento Box') && r.caps.includes('Shrimp Teriyaki Bento Box') && r.caps.includes('Sashimi Bento Box') && r.caps.includes('Gyu Don') && r.caps.includes('Salmon Lunch — Sushi') && r.caps.includes('Eel Lunch — Sushi'), `${name} Lunch: 图注不对 ${r.caps.join(',')}`);
      }
      await ctx.close();
    }
  } finally { await b.close(); try{srv.kill()}catch{} }
  done('MENU-PHOTOS-RENDER');
}
fail.push('未知 mode'); done('MENU-PHOTOS');
