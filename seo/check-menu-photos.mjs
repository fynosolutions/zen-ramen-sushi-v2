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
      if (file.startsWith('guest-')) { guestUsed.add(file); const rec = src.photos.find(p=>p.file===file); ok(!!rec, `${file}: 台账里没有来源记录`); ok(rec?.items.includes(f.itemId), `${file}: 台账没有允许它出现在 ${f.itemId}(${it?.name}) 上`); }
      if (fs.existsSync('public'+f.img)) { const md = await sharp('public'+f.img).metadata(); ok(md.width===md.height && md.width>=1000, `${file}: 不是 ≥1000 的方图(${md.width}x${md.height})`); }
    }
  }
  for (const p of src.photos) { ok(guestUsed.has(p.file), `${p.file}: 台账里有但没被使用`); ok(!!p.depicts && !!p.googleTag, `${p.file}: 台账缺 depicts/googleTag`); }
  ok(guestUsed.size >= 15, `顾客实拍图只用了 ${guestUsed.size} 张(<15)`);
  console.log(`  featured 分区 ${Object.keys(featured).length} 个,顾客实拍图 ${guestUsed.size} 张`); done('MENU-PHOTOS-DATA');
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
      for (const [tab, want, sections] of [['Lunch',6,['lunch--bento-box','lunch--rice-dishes','lunch--sushi-bar']],['Dinner',14,['dinner--appetizers','dinner--sushi-entree','dinner--bento-box','dinner--rice-dishes','dinner--ramen-noodles']]]) {
        await p.getByRole('tab',{name:tab}).click(); await p.waitForTimeout(400);
        for (const s of sections) { const loc = p.locator(`#${s} .featured-dish img`); const n = await loc.count(); ok(n>0, `${name} ${tab} ${s}: 没有配图`); for (let i=0;i<n;i++){ await loc.nth(i).scrollIntoViewIfNeeded(); await p.waitForTimeout(350); } }
        await p.waitForTimeout(600);
        const r = await p.evaluate(()=>({imgs:[...document.querySelectorAll('.featured-dish img')].filter(i=>!i.closest('[hidden]')).map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>=1000})), caps:[...document.querySelectorAll('.featured-dish')].filter(d=>!d.closest('[hidden]')).map(d=>d.querySelector('figcaption strong')).map(e=>e.textContent), sw:document.documentElement.scrollWidth, iw:innerWidth}));
        const guest = r.imgs.filter(i=>i.src.includes('guest-')); ok(guest.length>=want, `${name} ${tab}: 顾客实拍图 ${guest.length} 张(<${want})`); ok(r.imgs.every(i=>i.ok), `${name} ${tab}: 有图没加载成功`); ok(r.sw<=r.iw, `${name} ${tab}: 横向溢出`);
        if (tab==='Lunch') ok(r.caps.includes('Katsu Bento Box') && r.caps.includes('I. Shrimp Teriyaki') && r.caps.includes('Gyu Don'), `${name} Lunch: 图注不对 ${r.caps.join(',')}`);
      }
      await ctx.close();
    }
  } finally { await b.close(); try{srv.kill()}catch{} }
  done('MENU-PHOTOS-RENDER');
}
fail.push('未知 mode'); done('MENU-PHOTOS');
