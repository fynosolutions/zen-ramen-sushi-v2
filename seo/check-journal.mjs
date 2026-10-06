// 旧站文章原样搬迁的验收(2026-10-06)。两层:
//   默认:      对构建产物 out/ 逐篇查「页面在、标题/主标题/规范网址/可收录/结构化数据对、正文没被渲染吃掉、图片文件在且有说明、链接都有去处、有指向菜单/happy hour/点单的入口」
//   --source F: 再拿一份「独立于导入脚本」的旧站备份(WordPress REST 导出的 JSON,含 posts[].link/title/content)逐篇比对内容有没有丢
//   CTA_BASE=网址: 把上面「对 out/」的检查改成对线上
// 用法: node seo/check-journal.mjs [--source ~/Desktop/CC-Max-2026/restaurant/zen-024-backups/zen_site_backup_2026-09-23.json]
import fs from 'fs';
const BASE = process.env.CTA_BASE || ''; const si = process.argv.indexOf('--source'); const SRC = si > 0 ? process.argv[si + 1].replace(/^~/, process.env.HOME) : '';
const J = JSON.parse(fs.readFileSync('content/journal.json', 'utf8')); const posts = J.posts;
const v = JSON.parse(fs.readFileSync('vercel.json', 'utf8')); const redirectSrc = new Set(v.redirects.filter(r => !r.has).map(r => r.source));
const fails = []; const bad = (p, m) => fails.push(`${p}: ${m}`);
const dec = s => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;|&rsquo;|&#8217;/g, '’').replace(/&lsquo;|&#8216;/g, '‘').replace(/&quot;/g, '"').replace(/&ldquo;|&#8220;/g, '“').replace(/&rdquo;|&#8221;/g, '”').replace(/&ndash;|&#8211;/g, '–').replace(/&mdash;|&#8212;/g, '—').replace(/&hellip;|&#8230;/g, '…').replace(/&nbsp;|&#160;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const norm = s => dec(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
const text = h => norm(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' '));
const words = s => s.toLowerCase().match(/[a-z0-9']+/g) || [];
// 对线上逐篇慢慢取(每个请求间隔 600ms):2026-10-06 并发检查曾触发 Vercel 的自动防护
const get = async p => { if (BASE) { await new Promise(r => setTimeout(r, 600)); const r = await fetch(BASE + p, { redirect: 'manual' }); return { st: r.status, h: await r.text() }; } const f = 'out' + p + 'index.html'; return fs.existsSync(f) ? { st: 200, h: fs.readFileSync(f, 'utf8') } : { st: 404, h: '' }; };
const pageExists = p => { const q = p.split('#')[0].split('?')[0]; return q === '/' || fs.existsSync('out' + q.replace(/\/$/, '') + '/index.html') || fs.existsSync('out' + q) || fs.existsSync('public' + q); };

let checked = 0, totalWords = 0, imgs = 0, intLinks = 0, extLinks = 0;
for (const post of posts) {
  const p = post.path; const { st, h } = await get(p); if (st !== 200) { bad(p, `页面不是 200(${st})`); continue; } checked++;
  if (redirectSrc.has(p)) bad(p, '这个网址在 vercel.json 里还挂着跳转(会盖住页面)');
  const title = norm((h.match(/<title>([^<]*)<\/title>/) || [])[1] || ''); if (title !== norm(post.pageTitle)) bad(p, `标题与旧站不一致: 「${title}」≠「${post.pageTitle}」`);
  if ((h.match(/<title>/g) || []).length !== 1) bad(p, '不止一个 title 标签');
  const h1s = [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => text(m[1])); if (h1s.length !== 1 || h1s[0] !== norm(post.title)) bad(p, `主标题应恰好一个且等于文章标题,实际: ${JSON.stringify(h1s).slice(0, 120)}`);
  const desc = norm((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || ''); if (desc !== norm(post.description)) bad(p, '描述与导入数据不一致');
  const can = (h.match(/<link rel="canonical" href="([^"]*)"/) || [])[1]; if (can !== 'https://zenramensushiny.com' + p) bad(p, `规范网址不是自己: ${can}`);
  const robots = (h.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || ''; if (/noindex/.test(robots)) bad(p, 'noindex(本地验收要带 NEXT_PUBLIC_SITE_INDEXABLE=true 构建,否则这条和下一条都验不到)'); else if (!/max-image-preview:large/.test(robots)) bad(p, `robots 没带 max-image-preview:large: ${robots}`);
  if (!/"@type":"BlogPosting"/.test(h)) bad(p, '缺文章结构化数据');
  const art = (h.match(/<div class="scene-body journal-body">([\s\S]*?)<\/div><aside class="journal-visit"/) || [])[1]; if (!art) { bad(p, '找不到正文容器'); continue; }
  const built = words(text(art)).length, src = words(text(post.html)).length; totalWords += built; if (built < src * 0.995 || built > src * 1.005) bad(p, `正文词数与导入数据不一致(页面 ${built} / 数据 ${src})`);
  for (const m of art.matchAll(/<img\b[^>]*>/g)) { imgs++; const s = (m[0].match(/src="([^"]+)"/) || [])[1], a = (m[0].match(/alt="([^"]*)"/) || [])[1]; if (!a) bad(p, `图片没有说明: ${s}`); if (!BASE && !fs.existsSync('public' + s)) bad(p, `图片文件不存在: ${s}`); }
  if (post.hero && !h.includes(`class="journal-hero" src="${post.hero.src}"`)) bad(p, '头图没渲染出来');
  const ids = new Set([...art.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  for (const m of art.matchAll(/<a\b[^>]*>/g)) { const href = dec((m[0].match(/href="([^"]*)"/) || [])[1] || '');
    if (/^https?:/.test(href)) { extLinks++; if (!/target="_blank"/.test(m[0]) || !/noopener/.test(m[0])) bad(p, `外链没有 target=_blank + noopener: ${href.slice(0, 60)}`); }
    else if (href.startsWith('#')) { if (href.length > 1 && !ids.has(href.slice(1))) bad(p, `页内锚点没有落点: ${href}`); }
    else if (href.startsWith('/')) { intLinks++; const q = href.split('#')[0].split('?')[0]; const withSlash = q.endsWith('/') || /\.[a-z0-9]+$/i.test(q) ? q : q + '/'; if (!pageExists(withSlash) && !redirectSrc.has(withSlash)) bad(p, `站内链接没有去处: ${href}`); }
    else if (!/^(mailto:|tel:)/.test(href)) bad(p, `看不懂的链接: ${href.slice(0, 60)}`); }
  for (const need of ['href="/menu/"', 'href="/happy-hour/"', 'href="/lunch-specials/"', 'toasttab.com', 'href="/blog/"']) if (!h.includes(need)) bad(p, `缺入口 ${need}`);
  if (!/class="header|primary-navigation/.test(h) || !/<footer/.test(h) || !h.includes('tel:+16468707509')) bad(p, '缺导航/页尾/电话');
}
// 文章目录页:每篇都要有链接(否则是孤岛页)
const idx = await get('/blog/'); if (idx.st !== 200) bad('/blog/', '目录页不是 200'); else for (const post of posts) if (!idx.h.includes(`href="${post.path}"`)) bad('/blog/', `目录里没有 ${post.path}`);
// sitemap:每篇都在
const sm = BASE ? await (await fetch(BASE + '/sitemap.xml')).text() : fs.readFileSync('out/sitemap.xml', 'utf8'); for (const post of posts) if (!sm.includes(`<loc>https://zenramensushiny.com${post.path}</loc>`)) bad('sitemap', `缺 ${post.path}`);
console.log(`文章 ${checked}/${posts.length} 篇 · 正文共 ${totalWords} 词 · 正文图片 ${imgs} 张 · 站内链接 ${intLinks} · 外链 ${extLinks}`);

if (SRC) {   // 与独立备份比对:旧文章的内容有没有在搬的过程中丢
  const B = JSON.parse(fs.readFileSync(SRC, 'utf8')).posts; const byPath = new Map(B.map(x => [new URL(x.link).pathname, x])); let cmp = 0, minCover = 1, minPath = '', notInBackup = [], imgOld = 0, imgNew = 0;
  for (const post of posts) { const old = byPath.get(post.path); if (!old) { notInBackup.push(post.path); continue; } cmp++;
    const oldTitle = norm(old.title.rendered || old.title); if (oldTitle !== norm(post.title)) bad(post.path, `标题与备份不一致: 「${post.title}」≠「${oldTitle}」`);
    const oc = old.content.rendered || old.content; const ow = words(text(oc)); const { h } = await get(post.path); const nw = new Set(); const nws = words(text((h.match(/<div class="scene-body journal-body">([\s\S]*?)<\/div><aside class="journal-visit"/) || [])[1] || ''));
    for (let i = 0; i + 5 <= nws.length; i++) nw.add(nws.slice(i, i + 5).join(' '));
    let hit = 0, tot = 0; for (let i = 0; i + 5 <= ow.length; i++) { tot++; if (nw.has(ow.slice(i, i + 5).join(' '))) hit++; } const cover = tot ? hit / tot : 1; if (cover < minCover) { minCover = cover; minPath = post.path; }
    if (cover < 0.97) bad(post.path, `旧文内容只保住 ${(cover * 100).toFixed(1)}%(五词片段覆盖率,要 ≥97%)`);
    // 图片:旧文里放在本站媒体库(wp-content/uploads)的图,新页面上一张不能少;放在供应商图床(rankpilot)的那些在旧站上本来就是裂图(2026-10-06 真浏览器实测加载成功 0 张),不计
    const oldImgs = [...oc.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m => m[1]).filter(u => /zenramensushiny\.com\/wp-content\/uploads\//.test(u) && !/rankpilot|placehold/.test(u)).length; const newImgs = ((h.match(/<div class="scene-body journal-body">([\s\S]*?)<\/div><aside class="journal-visit"/) || [,''])[1].match(/<img\b/g) || []).length; if (newImgs < oldImgs) bad(post.path, `正文图片少了(旧 ${oldImgs} / 新 ${newImgs})`); imgOld += oldImgs; imgNew += newImgs;
    const oh = [...oc.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map(m => text(m[1])).filter(Boolean); const nh = new Set([...h.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map(m => text(m[1]))); const lostH = oh.filter(x => !nh.has(x)); if (lostH.length) bad(post.path, `丢了 ${lostH.length} 个小标题: ${lostH.slice(0, 2).join(' | ')}`);
  }
  console.log(`与独立备份比对 ${cmp} 篇 · 内容覆盖率最低 ${(minCover * 100).toFixed(1)}%(${minPath.slice(12, 60)}) · 本站媒体库图片 旧 ${imgOld} / 新 ${imgNew} · 备份里没有的 ${notInBackup.length} 篇${notInBackup.length ? ': ' + notInBackup.map(x => x.slice(1, 11)).join(' ') : ''}`);
  if (cmp < posts.length * 0.9) bad('备份', `能比对的只有 ${cmp}/${posts.length} 篇,不足九成`);
}
console.log(fails.length ? `JOURNAL-CHECK FAIL x${fails.length}\n  ` + fails.slice(0, 25).join('\n  ') : `JOURNAL-CHECK PASS (${BASE || 'out'}${SRC ? ' + 独立备份' : ''})`);
process.exit(fails.length ? 1 : 0);
