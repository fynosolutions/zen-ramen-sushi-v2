/* 真机才会出的两类问题,用不依赖真机的办法拦住(2026-10-02 毛 iPhone 截图:箭头/星标变成彩色 emoji、「MENU」按钮字变蓝)。
   A. 上线文件里不许出现「符号字符」(↗ ✳ ★ ▶ ☰ ⌄ 这类):它们在 iPhone/安卓上会被换成系统 emoji 或缺字方块,电脑上却正常,模拟器测不出来。小图标一律用 components/Ico.tsx 的内联 SVG。
   B. 每个按钮都要有明确的文字颜色:iPhone 上没写颜色的按钮是系统蓝。做法:在页面最前面塞一条 button{color:rgb(1,2,3)},谁最后算出来还是这个颜色,谁就没被网站自己的样式管到。
   用法: node seo/check-device-safe.mjs   (先 npm run build;B 部分 CTA_BASE=网址 可测线上) */
import fs from 'node:fs'; import path from 'node:path';
import {spawn} from 'child_process'; import {chromium, devices} from 'playwright';
const fail = []; const ok = (c,m) => { if(!c) fail.push(m); };

/* ── A. 符号字符 ── */
const RISKY = /[←-⇿⌀-⏿①-⓿■-➿⤀-⥿⬀-⯿〰〽㊗㊙]|[\u{1F000}-\u{1FAFF}]/gu;
const walk = d => fs.readdirSync(d,{withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(d,e.name)) : [path.join(d,e.name)]);
const files = fs.existsSync('out') ? walk('out').filter(f => /\.(html|css|js|txt)$/.test(f)) : [];
ok(files.length > 20, `out/ 里只找到 ${files.length} 个文件(先 npm run build)`);
const hits = {};
for (const f of files) { const s = fs.readFileSync(f,'utf8'); const m = s.match(RISKY); if (m) for (const ch of new Set(m)) (hits[ch] = hits[ch] || []).push(f.replace(/^out\//,'')); }
for (const [ch, where] of Object.entries(hits)) ok(false, `符号字符「${ch}」(U+${ch.codePointAt(0).toString(16).toUpperCase()})出现在 ${where.length} 个上线文件里(如 ${where.slice(0,2).join(', ')});手机上会变 emoji/方块,换成 <Ico/>`);

/* ── B. 按钮文字颜色 ── */
const PORT = 3000 + (process.pid % 900), BASE = process.env.CTA_BASE || `http://127.0.0.1:${PORT}`;
const srv = process.env.CTA_BASE ? {kill(){}} : spawn('node',['scripts/serve.mjs'],{env:{...process.env,PORT:String(PORT)},stdio:'ignore'});
for (let i=0;i<40;i++){ try{ if((await fetch(BASE+'/')).ok) break; }catch{} await new Promise(r=>setTimeout(r,250)); }
const PAGES = ['/','/menu/','/about/','/gallery/','/happy-hour/','/events-catering/','/near-penn-station/','/near-madison-square-garden/','/privacy-policy/','/terms-conditions/'];
const b = await chromium.launch();
try {
  for (const [name,opt] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{...devices['Pixel 7']}]]) {
    const ctx = await b.newContext(opt);
    await ctx.addInitScript(() => { try{sessionStorage.setItem('zen-intro-v2','1')}catch{} });
    const p = await ctx.newPage(); let n = 0;
    for (const u of PAGES) {
      await p.goto(BASE+u,{waitUntil:'networkidle'});
      if (u === '/gallery/') { await p.locator('.gallery-tile').first().click(); await p.waitForTimeout(300); }
      /* 探针样式放在 <head> 最前面(层叠顺序最低);zz-probe 用来证明探针真的生效了 */
      const probe = await p.evaluate(() => { const st = document.createElement('style'); st.textContent = 'button,zz-probe{color:rgb(1,2,3)}'; document.head.prepend(st); const z = document.createElement('zz-probe'); document.body.append(z); const c = getComputedStyle(z).color; z.remove(); return c; });
      ok(probe === 'rgb(1, 2, 3)', `${name} ${u}: 探针样式没生效(${probe}),按钮颜色检查不可信`);
      const r = await p.evaluate(() => { const all = [...document.querySelectorAll('button')]; return {n: all.length, bad: all.filter(x => getComputedStyle(x).color === 'rgb(1, 2, 3)').map(x => (x.innerText || x.getAttribute('aria-label') || x.className || '?').trim().slice(0,30))}; });
      n += r.n; ok(r.bad.length === 0, `${name} ${u}: ${r.bad.length} 个按钮没写文字颜色(iPhone 上会变系统蓝):${[...new Set(r.bad)].join(' / ')}`);
    }
    ok(n >= 30, `${name}: 只查到 ${n} 个按钮,检查可能没生效`);
    await ctx.close();
  }
} finally { await b.close(); try{srv.kill()}catch{} }
if (fail.length) { console.log('DEVICE-SAFE FAIL x'+fail.length+':\n - '+fail.join('\n - ')); process.exit(1); }
console.log(`  上线文件 ${files.length} 个无符号字符;全站按钮都有明确文字颜色`); console.log('DEVICE-SAFE PASS');
