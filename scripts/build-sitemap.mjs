// 生成 public/sitemap.xml(2026-10-06):固定页面 + content/journal.json 里的文章。改了页面或重新导入文章后重跑:node scripts/build-sitemap.mjs
// 顺序即重要性;文章带 lastmod(旧站的最后修改时间),固定页面不带(没有可信的修改时间就不写)。
import fs from 'fs';
const ROOT = 'https://zenramensushiny.com';
const pages = ['/', '/menu/', '/happy-hour/', '/lunch-specials/', '/location/', '/near-penn-station/', '/near-madison-square-garden/', '/events-catering/', '/zrm-menu/', '/about/', '/gallery/', '/blog/', '/privacy-policy/', '/terms-conditions/'];
const posts = JSON.parse(fs.readFileSync('content/journal.json', 'utf8')).posts.sort((a, b) => b.clicks - a.clicks);
const missing = pages.filter(p => !fs.existsSync('app' + (p === '/' ? '/page.tsx' : p + 'page.tsx')));
if (missing.length) { console.error('SITEMAP FAIL 这些页面在 app/ 里不存在:', missing.join(' ')); process.exit(1); }
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + pages.map(p => `<url><loc>${ROOT}${p}</loc></url>`).join('\n') + '\n'
  + posts.map(p => `<url><loc>${ROOT}${p.path}</loc><lastmod>${p.modified.slice(0, 10)}</lastmod></url>`).join('\n') + '\n</urlset>\n';
fs.writeFileSync('public/sitemap.xml', xml);
if (fs.existsSync('out')) fs.writeFileSync('out/sitemap.xml', xml);
console.log(`SITEMAP OK ${pages.length} 个页面 + ${posts.length} 篇文章 = ${pages.length + posts.length} 条`);
