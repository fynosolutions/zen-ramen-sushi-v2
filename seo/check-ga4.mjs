// 统计 + 索引开关验收(2026-10-03):这两样都是「构建时写进页面」的,GoDaddy 手动构建漏配变量会静默丢失。
// 用法: node seo/check-ga4.mjs [out目录]   或   GA_BASE=https://zenramensushiny.com node seo/check-ga4.mjs
import fs from 'fs';
const ID = 'G-JZD3SQCWMP'; const BASE = process.env.GA_BASE; const OUT = process.argv[2] || 'out';
const pages = ['/', '/menu/', '/about/', '/gallery/', '/happy-hour/', '/events-catering/'];
const fail = [];
for (const p of pages) {
  const h = BASE ? await (await fetch(BASE + p, {redirect:'follow'})).text() : fs.readFileSync(OUT + (p === '/' ? '/index.html' : p + 'index.html'), 'utf8');
  const ids = [...new Set(h.match(/G-[A-Z0-9]{8,12}/g) || [])];
  if (!ids.includes(ID)) fail.push(`${p}: 没有 ${ID}`);
  if (ids.some(i => i !== ID)) fail.push(`${p}: 出现别的统计编号 ${ids.filter(i => i !== ID)}`);
  for (const t of ['GT-MJJQ9P6Z', 'AW-17990718317', 'XUW55TSpfP5vV7RUmbuTfA', 'bzrcdn.openai.com/sdk/oaiq.min.js']) if (!h.includes(t)) fail.push(`${p}: 缺旧站带过来的统计/广告代码 ${t}`);   // 店家 GA4、Google Ads 转化、OpenAI 广告像素:2026-10-05 切换时漏过一次
  if (/<meta name="robots" content="[^"]*noindex/i.test(h)) fail.push(`${p}: 还是 noindex(NEXT_PUBLIC_SITE_INDEXABLE 没带)`);
}
console.log(fail.length ? `GA4-CHECK FAIL (${BASE || OUT}):\n  ` + fail.join('\n  ') : `GA4-CHECK PASS (${BASE || OUT}) ${pages.length} 页`);
process.exit(fail.length ? 1 : 0);
