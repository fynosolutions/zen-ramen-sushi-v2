// 切换前彩排 / 切换后验收:对「某个主机地址上的新站」或「线上正式域名」跑全套检查。
// 用法:
//   node seo/check-cutover.mjs --host zenramensushiny.com --ip <GoDaddy 主机地址>   彩排:不动线上域名,把域名「临时指到」主机地址测(curl --resolve)
//   node seo/check-cutover.mjs --host zenramensushiny.com                          切换后:测真实线上
//   加 --only-cert 只看证书那一节(装完证书、改域名之前先单独验一次)
//   本机 Apache 试跑(无 https):  --ip 127.0.0.1 --http-port 8911 --no-tls   (会给每个请求带 X-Forwarded-Proto: https,模拟「https 已经由前面处理」)
// 检查内容:证书(根域+www、完整链、剩余天数)· http→https 与 www→根域 · 113 条旧网址跳转逐条 · 同网址页面 200 · 65 条故意 404 · 首页统计/索引/规范网址
//         · sitemap/robots · 两个视频的分段播放(206)· 图片缓存头 · 压缩 · 首页速度 · .htaccess 不对外 · 顺序无死循环
import fs from 'fs'; import {execFile, spawnSync} from 'child_process'; import {promisify} from 'util';
const pexec = promisify(execFile);
const args = process.argv.slice(2); const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; }; const has = f => args.includes('--' + f);
const HOST = opt('host', 'zenramensushiny.com'), IP = opt('ip', ''), HP = opt('http-port', '80'), SP = opt('https-port', '443'), NOTLS = has('no-tls');
const GA = 'G-JZD3SQCWMP'; const WWW = 'www.' + HOST;
const origin = (scheme, host) => { const port = scheme === 'http' ? HP : SP; const dflt = scheme === 'http' ? '80' : '443'; return `${scheme}://${host}${port === dflt ? '' : ':' + port}`; };
const ROOT = NOTLS ? origin('http', HOST) : origin('https', HOST);
const resolveArgs = IP ? ['http', 'https'].flatMap(s => [HOST, WWW].flatMap(h => ['--resolve', `${h}:${s === 'http' ? HP : SP}:${IP}`])) : [];
const baseArgs = ['-s', '--max-time', '25', ...resolveArgs, ...(NOTLS ? ['-H', 'X-Forwarded-Proto: https'] : [])];
// 一次请求:返回 状态码、响应头(小写)、Location、耗时;needBody 时带回正文
async function req(url, { head = false, headers = [], body = false, noXfp = false } = {}) {
  const a = [...baseArgs, '-D', '-', '-o', body ? '/dev/stdout' : '/dev/null', '-w', '\n__T__%{http_code}|%{time_starttransfer}|%{ssl_verify_result}', ...(head ? ['-I'] : []), ...headers.flatMap(h => ['-H', h]), url];
  if (noXfp) { const i = a.indexOf('X-Forwarded-Proto: https'); if (i > 0) a.splice(i - 1, 2); }
  try { const { stdout } = await pexec('curl', a, { maxBuffer: 64 * 1024 * 1024 }); const [pre, tail] = stdout.split('\n__T__'); const [code, ttfb, ssl] = (tail || '').trim().split('|');
    const parts = pre.split(/\r?\n\r?\n/); const hdrBlocks = parts.filter(p => /^HTTP\//.test(p)); const hdr = (hdrBlocks[hdrBlocks.length - 1] || '').split(/\r?\n/); const h = {}; for (const l of hdr.slice(1)) { const i = l.indexOf(':'); if (i > 0) h[l.slice(0, i).toLowerCase()] = l.slice(i + 1).trim(); }
    return { code: +code, h, loc: h.location || '', ttfb: +ttfb, ssl, body: body ? parts.slice(hdrBlocks.length).join('\n\n') : '' }; } catch (e) { return { code: 0, h: {}, loc: '', ttfb: 0, ssl: '', body: '', err: String(e.message).slice(0, 80) }; } }
const pool = async (items, n, fn) => { const out = []; let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } })); return out; };
const fails = []; const log = (ok, msg, detail = '') => { console.log(`  ${ok ? '✓' : '✗'} ${msg}${detail ? '  ' + detail : ''}`); if (!ok) fails.push(msg + (detail ? ' ' + detail : '')); };
const path = u => u.replace(/^https?:\/\/[^/]+/, '');
console.log(`彩排/验收对象: ${ROOT}${IP ? `  (域名 ${HOST} 临时指到 ${IP})` : ''}${NOTLS ? '  [本机无 https 试跑模式]' : ''}`);

// 1 证书
if (!NOTLS) {
  console.log('① 证书');
  for (const name of [HOST, WWW]) {
    const target = IP ? `${IP}:${SP}` : `${name}:${SP}`;
    const r = spawnSync('sh', ['-c', `echo | openssl s_client -connect ${target} -servername ${name} -showcerts 2>/dev/null`], { encoding: 'utf8' }); const out = r.stdout || '';
    const certs = (out.match(/-----BEGIN CERTIFICATE-----/g) || []).length;
    const first = (out.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/) || [''])[0];
    const txt = spawnSync('openssl', ['x509', '-noout', '-text', '-enddate'], { input: first, encoding: 'utf8' }).stdout || '';
    const sans = [...txt.matchAll(/DNS:([^,\s]+)/g)].map(m => m[1]); const end = (txt.match(/notAfter=(.*)/) || [])[1]; const days = end ? Math.round((new Date(end) - Date.now()) / 86400000) : -1;
    log(sans.includes(HOST) && sans.includes(WWW), `证书同时覆盖 ${HOST} 与 ${WWW}(通过 ${name} 取到)`, `证书名单: ${sans.join(' ') || '(没取到)'}`);
    log(certs >= 2, `证书链完整(${name}:${certs} 张;至少 2 张=自己的证书+中间证书)`);
    log(days >= 60, `证书剩余 ${days} 天(${name};要 ≥ 60)`);
  }
  const t = await req(`https://${HOST}${SP === '443' ? '' : ':' + SP}/`, { head: true }); log(t.code === 200 && t.ssl === '0', '浏览器级别验证:证书可信、主页 200', `状态 ${t.code} 验证码 ${t.ssl}${t.err ? ' ' + t.err : ''}`);
}
if (has('only-cert')) { console.log(fails.length ? `\nCERT-CHECK FAIL x${fails.length}` : '\nCERT-CHECK PASS'); process.exit(fails.length ? 1 : 0); }
// 2 http→https、www→根域
console.log('② 整站级跳转');
{
  // 永久跳转 301(Apache)和 308(Vercel)都算对;http www 在 Vercel 上是两跳(先 https www,再根域),只要最终落在 https 根域、不超过 2 跳就行
  const perm = c => c === 301 || c === 308;
  const a = await req(`${origin('http', HOST)}/menu/?x=1`, { head: true, noXfp: true }); log(perm(a.code) && a.loc === `https://${HOST}/menu/?x=1`, 'http 根域 → https 根域(带路径与参数)', `${a.code} → ${a.loc}`);
  if (NOTLS) { const b = await req(`${origin('http', WWW)}/menu/`, { head: true, noXfp: true }); log(perm(b.code) && b.loc === `https://${HOST}/menu/`, 'http www → https 根域(本机试跑:一步到位)', `${b.code} → ${b.loc}`); }
  else { const r = await pexec('curl', [...baseArgs, '-o', '/dev/null', '-L', '--max-redirs', '4', '-w', '%{url_effective}|%{num_redirects}|%{http_code}', `${origin('http', WWW)}/menu/`]).then(x => x.stdout.split('|'), () => ['', '9', '0']);
    log(r[0] === `https://${HOST}/menu/` && +r[1] <= 2 && r[2] === '200', 'http www → 最终落在 https 根域(≤2 跳)', `${r[1]} 跳 → ${r[0]} ${r[2]}`); }
  const c = await req(`${NOTLS ? origin('http', WWW) : origin('https', WWW)}/menu/`, { head: true }); log(perm(c.code) && c.loc === `https://${HOST}/menu/`, 'https www → https 根域', `${c.code} → ${c.loc}`);
  const d = await req(`${ROOT}/menu/`, { head: true }); log(d.code === 200, '根域直接访问 /menu/ → 200(没有死循环)', `${d.code} ${d.loc}`);
}
// 3 旧网址跳转
console.log('③ 旧网址跳转');
// 带通配/正则的规则(/tag/(.*)、/:year(\\d{4})/ 之类)不能把规则本身当网址去请求:每条给一个样例网址(2026-10-06;/tag/ 的样例是真实的旧标签页,有排名词)
const PATTERN_SAMPLES = [['/tag/real-ramen-vs-instant/', '/blog/'], ['/category/ramen/', '/blog/'], ['/author/zenramensushi/', '/blog/'], ['/2026/06/', '/blog/'], ['/2026/', '/blog/'], ['/page/2/', '/blog/'], ['/blog/page/2/', '/blog/']];
const v = JSON.parse(fs.readFileSync('vercel.json', 'utf8')); const isPattern = r => /[:(*]/.test(r.source); const plain = v.redirects.filter(r => !r.has && !isPattern(r)), query = v.redirects.filter(r => r.has);
const jobs = [...plain.map(r => ({ u: ROOT + r.source, dest: r.destination, name: r.source, q: '' })), ...PATTERN_SAMPLES.map(([src, dest]) => ({ u: ROOT + src, dest, name: src + '(通配规则样例)', q: '' })), ...query.map(r => ({ u: `${ROOT}${r.source}?${r.has[0].key}=${r.has[0].value}`, dest: r.destination, name: `${r.source}?${r.has[0].key}=${r.has[0].value}`, q: `${r.has[0].key}=${r.has[0].value}` }))];
// 去向比较:路径和 #锚点必须一致;查询参数要么和目标一致,要么是「把原请求的参数带过去了」(Vercel 的做法,页面忽略它;Apache 版规则会去掉参数)——两种都算对
const parts = u => { const [pq, hash = ''] = u.split('#'); const [pth, qs = ''] = pq.split('?'); return { pth, qs, hash }; };
const sameDest = (loc, j) => { const a = parts(path(loc)), b = parts(j.dest); return a.pth === b.pth && a.hash === b.hash && (a.qs === b.qs || (b.qs === '' && a.qs === j.q)); };
const res = await pool(jobs, 8, async j => ({ j, r: await req(j.u, { head: true }) })); const badR = res.filter(({ j, r }) => !((r.code === 301 || r.code === 308) && sameDest(r.loc, j)));
log(badR.length === 0, `${jobs.length} 条旧网址 → 永久跳转(301/308)且去向正确`, badR.slice(0, 3).map(({ j, r }) => `${j.name}→${r.code} ${path(r.loc)}`).join(' | '));
// 4 同网址页面 + 故意 404
const old = fs.readFileSync('seo/old-urls-2026-09-20.txt', 'utf8').trim().split('\n').map(u => u.replace('https://zenramensushiny.com', ''));
const exists = p => p === '/' || fs.existsSync('out' + p.replace(/\/$/, '') + '/index.html');
const same = old.filter(exists), gone = old.filter(p => !exists(p) && !plain.find(r => r.source === p.replace(/\/$/, '') + '/'));
const rs = await pool(same, 8, async p => ({ p, r: await req(ROOT + p, { head: true }) })); const bs = rs.filter(({ r }) => r.code !== 200);
log(bs.length === 0, `${same.length} 个同网址页面 → 200`, bs.slice(0, 3).map(({ p, r }) => `${p}→${r.code}`).join(' | '));
const rg = await pool(gone, 8, async p => ({ p, r: await req(ROOT + p, { head: true }) })); const bg = rg.filter(({ r }) => r.code !== 404);
log(bg.length === 0, `${gone.length} 条故意不跳转的旧网址 → 404(不能是 200,也不能全跳首页)`, bg.slice(0, 3).map(({ p, r }) => `${p}→${r.code}`).join(' | '));
// 5 首页内容
console.log('④ 首页与站点文件');
const home = await req(ROOT + '/', { body: true }); const html = home.body;
log(home.code === 200 && html.includes(GA), `首页含统计编号 ${GA}`); log(!/<meta name="robots" content="[^"]*noindex/i.test(html), '首页没有 noindex');
log(new RegExp(`<link rel="canonical" href="https://${HOST.replace(/\./g, '\\.')}/"`).test(html), '首页规范网址指向正式域名');
for (const f of ['/sitemap.xml', '/robots.txt']) { const r = await req(ROOT + f, { body: true }); log(r.code === 200 && r.body.includes(HOST), `${f} → 200 且指向 ${HOST}`, `${r.code}`); }
// 6 视频、缓存、压缩、速度、隐藏文件
console.log('⑤ 视频、缓存、速度');
for (const f of ['/video/zen-film-0925.mp4', '/video/zen-film-0925-m.mp4']) { const r = await req(ROOT + f, { head: true, headers: ['Range: bytes=0-1'] }); log(r.code === 206 && /bytes 0-1\//.test(r.h['content-range'] || ''), `${f} 支持分段播放(206)`, `${r.code} ${r.h['content-range'] || ''}`); }
const img = await req(ROOT + '/images/shot-hero-noodle-chopsticks.webp', { head: true }); log(/must-revalidate|no-cache/.test(img.h['cache-control'] || ''), '图片每次回源校验(同事同名换图后客人能看到新图)', img.h['cache-control'] || '(没有缓存头)');
const gz = await req(ROOT + '/', { head: true, headers: ['Accept-Encoding: gzip'] }); log(/gzip|br/.test(gz.h['content-encoding'] || ''), '首页压缩传输', gz.h['content-encoding'] || '(没压缩)');
const ttfb = []; for (let i = 0; i < 3; i++) ttfb.push((await req(ROOT + '/', { head: true })).ttfb); const med = ttfb.sort()[1]; log(med < 1.5, `首页首字节 ${med.toFixed(2)} 秒(要 < 1.5)`);
const ht = await req(ROOT + '/.htaccess', { head: true }); log(ht.code === 403 || ht.code === 404, '.htaccess 不对外提供', `${ht.code}`);
console.log(fails.length ? `\nCUTOVER-CHECK FAIL x${fails.length}` : '\nCUTOVER-CHECK PASS');
process.exit(fails.length ? 1 : 0);
