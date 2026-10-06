// 「旧站的 SEO 积累有没有被新站接住」逐网址核对(2026-10-06)。
// 旧站在一个网址上的积累有三种来源:Google 真实点击(GSC)、排名词(9-20 存档)、外链(GSC「外部链接」报告 + DataForSEO 外链库)。
// 判据:凡是有任一种积累的旧网址,在新站必须是下面之一,否则报红——
//   SAME   同网址页面 200(积累原地保住)
//   MOVED  永久跳转(301/308)到一个 200 的、内容对等的页面(不许跳首页,不许跳到不存在的页)
//   RETIRED 只允许「写错城市的文章」和「旧站自己都已删除的文章」(名单在 content/journal.json 的 notOnOldSite)
// 另外:有点击的旧文章必须是 SAME(文章跳到菜单页不算对等);午市/地址/联系/主菜/文章目录这些旧页的去向写死在下面逐条验。
// 用法: node seo/check-equity.mjs            对 out/ + vercel.json
//       CTA_BASE=https://zenramensushiny.com node seo/check-equity.mjs   对线上(真实请求,逐条跟跳转)
import fs from 'fs';
const BASE = process.env.CTA_BASE || ''; const ROOT = 'https://zenramensushiny.com';
const gs = ['seo/gsc-clicks-2026-09-23.json', 'seo/gsc-clicks-3m-2026-09-27.json', 'seo/gsc-clicks-16m-2026-10-06.json'].map(f => JSON.parse(fs.readFileSync(f, 'utf8')));
const clicks = k => Math.max(...gs.map(g => g[k]?.clicks ?? 0)), imps = k => Math.max(...gs.map(g => g[k]?.imp ?? 0));
const MIN_IMP = 100;   // 近 3 个月曝光 ≥100 也算有积累(有曝光 = Google 在给它排名);与 scripts/import-journal.py 的 MIN_IMPRESSIONS 同值
const rk = JSON.parse(fs.readFileSync('seo/ranked-before-2026-09-20.json', 'utf8')).tasks[0].result[0].items; const kws = {};
for (const it of rk) { const u = new URL(it.ranked_serp_element.serp_item.url).pathname; (kws[u] = kws[u] || []).push(it.keyword_data.keyword); }
// 外链目标:GSC「Top linked pages(外部)」2026-10-06 读数 + DataForSEO backlinks/domain_pages 2026-10-06(只有这几个网址有外部域名链入)
const BACKLINKED = { '/': 1153, '/2026/06/21/sushi-grade-fish-fresh-vs-frozen-truth-revealed/': 1, '/zrm-menu/': 1, '/uorder-menu/': 2 };
const J = JSON.parse(fs.readFileSync('content/journal.json', 'utf8')); const restored = new Set(J.posts.map(p => p.path)), gone = new Set(J.notOnOldSite);
const WRONG = /gainesville|dahlonega|greenville|noblesville/i; const PLATFORM = /^\/wp-content\//;   /* /wp-content/ 在 Vercel 上被平台直接 403,接不了(16 个月里只有一份宴会菜单 PDF 有 3 次点击);照实列出,不算失败 */ const isPost = p => /^\/\d{4}\/\d{2}\/\d{2}\//.test(p);
const v = JSON.parse(fs.readFileSync('vercel.json', 'utf8')); const rules = new Map(v.redirects.filter(r => !r.has).reverse().map(r => [r.source, r.destination]));   /* 同一个 source 出现两次时线上是「先出现的生效」,倒序建表让先出现的覆盖后出现的(2026-10-06:/uorder-menu/ 本地过、线上被前一条带去 /about/) */
const localExists = p => { const q = p.split('#')[0].split('?')[0]; return q === '/' || fs.existsSync('out' + q.replace(/\/$/, '') + '/index.html') || (/\.[a-z0-9]+$/i.test(q) && fs.existsSync('out' + q)); };
async function resolve(p) {   // → {kind, final, hops}
  if (!BASE) { if (localExists(p)) return { kind: 'SAME', final: p }; const toRe = src => new RegExp('^' + src.replace(/\/:\w+\*/g, '(?:/.*)?').replace(/:\w+\(([^)]+)\)/g, '($1)').replace(/:\w+/g, '[^/]+') + '$'); const wild = [...rules].find(([src]) => /[:(*]/.test(src) && toRe(src).test(p)); /* 本地只是近似模拟 Vercel 的匹配,以上线后的线上模式为准(/tag/:path* 就是本地过、线上 404) */ const d = rules.get(p) || rules.get(p.replace(/\/$/, '') + '/') || (wild && wild[1]); if (!d) return { kind: 'NONE', final: '' }; return { kind: localExists(d) ? 'MOVED' : 'BROKEN', final: d }; }
  let cur = BASE + p, hops = 0, codes = [];
  for (;;) { let r; try { r = await fetch(cur, { redirect: 'manual' }); } catch (e) { return { kind: 'ERROR', final: String(e).slice(0, 60) }; } codes.push(r.status);
    if (r.status >= 300 && r.status < 400 && hops < 6) { cur = new URL(r.headers.get('location'), cur).href; hops++; continue; }
    const fin = new URL(cur); const same = fin.pathname === p || fin.pathname === p.replace(/\/$/, '') + '/';
    if (r.status === 200) return { kind: same ? 'SAME' : (codes.slice(0, -1).every(c => c === 301 || c === 308) ? 'MOVED' : 'TEMP'), final: fin.pathname + fin.hash, hops };
    return { kind: hops ? 'BROKEN' : 'NONE', final: fin.pathname + ' → ' + r.status, hops }; }
}
const pool = async (items, n, fn) => { const out = []; let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } })); return out; };

const keys = new Set([...gs.flatMap(g => Object.keys(g)), ...Object.keys(kws).map(k => k.endsWith('/') ? k : k + '/'), ...Object.keys(BACKLINKED)]);
// GSC 会把页内锚点记成单独的键(/文章/#小标题/),它们就是那篇文章本身,归并掉
const valued = [...keys].filter(k => !k.includes('#')).filter(k => clicks(k) >= 1 || imps(k) >= MIN_IMP || (kws[k] || []).length || BACKLINKED[k]);
// 对线上一个一个慢慢来(每个请求间隔 600ms):2026-10-06 并发检查曾触发 Vercel 的自动防护,让全站对非浏览器请求返回 403
const nap = ms => new Promise(r => setTimeout(r, ms));
const res = await pool(valued, BASE ? 1 : 50, async k => { if (BASE) await nap(600); return { k, c: clicks(k), im: imps(k), kw: (kws[k] || []).length, bl: BACKLINKED[k] || 0, ...(await resolve(k)) }; });
const fails = []; const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);
const same = res.filter(r => r.kind === 'SAME'), moved = res.filter(r => r.kind === 'MOVED'), rest = res.filter(r => !['SAME', 'MOVED'].includes(r.kind));
for (const r of rest) { const allowed = WRONG.test(r.k) || gone.has(r.k) || PLATFORM.test(r.k); if (!allowed) fails.push(`${r.k} (点击${r.c} 排名词${r.kw} 外链${r.bl}) 没有被接住: ${r.kind} ${r.final}`); }
for (const r of moved) { if ((r.final.split('#')[0] || '/') === '/' && r.k !== '/') fails.push(`${r.k} 被跳到首页`); if (isPost(r.k) && !WRONG.test(r.k) && !gone.has(r.k)) fails.push(`${r.k} 是有积累的文章(点击${r.c} 曝光${r.im} 排名词${r.kw}),却被跳转到 ${r.final}(应原网址保留)`); }
// 「旧站已删」的豁免名单是导入脚本自己写的:对线上验收时到旧站现查一遍,确实 404 才认(旧站限流或连不上 = 不认)
if (BASE) for (const g of gone) { let st = 0; try { const { execFileSync } = await import('child_process'); st = +execFileSync('curl', ['-s', '-o', '/dev/null', '-m', '30', '-w', '%{http_code}', '--resolve', 'zenramensushiny.com:443:192.0.78.24', 'https://zenramensushiny.com' + g], { encoding: 'utf8' }); } catch {} if (st !== 404) fails.push(`${g} 被当作「旧站已删」放行,但旧站现在返回 ${st}(不是 404)`); }
for (const p of restored) { const r = res.find(x => x.k === p); if (r && r.kind !== 'SAME') fails.push(`${p} 应是同网址页面,实际 ${r.kind}`); }
// 指定去向的旧页
const FIXED = [['/lunch-specials-2/', '/lunch-specials/'], ['/location/', '/location/'], ['/zen-ramen-contact/', '/location/'], ['/main-course/', '/menu/'], ['/blog/', '/blog/'], ['/news/', '/blog/'], ['/zen-ramen-sushi-blog/', '/blog/'],
  ['/about-us/', '/about/'], ['/drinks/', '/menu/#dinner--sake'], ['/desserts/', '/menu/#dinner--dessert'], ['/appetizers/', '/menu/#dinner--appetizers'], ['/zrm-menu/', '/menu/'], ['/uorder-menu/', '/menu/'], ['/sushi/', '/menu/#dinner--sushi-rolls'],
  ['/contact-theme/', '/location/'], ['/location-theme/', '/location/'], ['/zrm-category/bento-box/', '/lunch-specials/'], ['/tag/zen-ramen-and-sushi/', '/blog/'], ['/2026/06/', '/blog/'], ['/page/2/', '/blog/'], ['/feed/', '/blog/'],
  ['/favicon.ico', '/favicon.ico'], ['/apple-touch-icon.png', '/apple-touch-icon.png']];
// 已知缺口(不在判据内,见 seo/build-redirects.mjs 里的说明):旧站 /wp-content/ 下的菜单 PDF 直链与被盗链的 logo——Vercel 平台对这类路径直接 403,跳转接不住;三条都没有 Google 点击
const fx = await pool(FIXED, BASE ? 1 : 20, async ([src, want]) => { if (BASE) await nap(600); return { src, want, ...(await resolve(src)) }; });
for (const f of fx) { const got = f.final.split('#')[0]; if (!['SAME', 'MOVED'].includes(f.kind) || got !== f.want.split('#')[0]) fails.push(`${f.src} 应到 ${f.want},实际 ${f.kind} ${f.final}`); }

const tot = sum(res, r => r.c), kept = sum(same, r => r.c), mv = sum(moved, r => r.c), lost = sum(rest, r => r.c);
const postsSame = same.filter(r => isPost(r.k)), postsMoved = moved.filter(r => isPost(r.k));
console.log(`有积累的旧网址 ${res.length} 个(点击 ${tot} 次 · 曝光 ${sum(res, r => r.im)} 次 · 排名词 ${sum(res, r => r.kw)} 个 · 外链目标 ${Object.keys(BACKLINKED).length} 个)`);
console.log(`  同网址保住   ${same.length} 个 · ${kept} 次点击(${(kept / tot * 100).toFixed(1)}%) · 曝光 ${sum(same, r => r.im)} · 排名词 ${sum(same, r => r.kw)} · 其中文章 ${postsSame.length} 篇 / ${sum(postsSame, r => r.c)} 次点击`);
console.log(`  跳到对等页面 ${moved.length} 个 · ${mv} 次点击(${(mv / tot * 100).toFixed(1)}%) · 曝光 ${sum(moved, r => r.im)} · 排名词 ${sum(moved, r => r.kw)} · 其中文章 ${postsMoved.length} 篇 / ${sum(postsMoved, r => r.c)} 次点击`);
console.log(`  没有承接     ${rest.length} 个 · ${lost} 次点击(${(lost / tot * 100).toFixed(1)}%) · 曝光 ${sum(rest, r => r.im)}: ${rest.map(r => r.k.slice(0, 44) + (WRONG.test(r.k) ? '[写错城市]' : gone.has(r.k) ? '[旧站已删]' : PLATFORM.test(r.k) ? '[平台拦截]' : '')).join(' ')}`);
console.log(`  指定去向 ${fx.filter(f => ['SAME', 'MOVED'].includes(f.kind)).length}/${FIXED.length} 条到位`);
console.log(fails.length ? `EQUITY-CHECK FAIL x${fails.length}\n  ` + fails.slice(0, 30).join('\n  ') : `EQUITY-CHECK PASS (${BASE || 'out + vercel.json'})`);
process.exit(fails.length ? 1 : 0);
