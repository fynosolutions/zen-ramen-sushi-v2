// 旧站 URL 清单 + GSC 真实点击 的唯一入口(build-redirects 与 check-mapping 共用)
// 点击取两份 GSC 导出的较大值:09-23 那份窗口较短,漏了 49 个近 3 个月有点击的页面(2026-09-27 实测)
import fs from 'fs';
const read = f => JSON.parse(fs.readFileSync(f,'utf8'));
// 第三份(2026-10-06):Search Console API 拉的 16 个月全量(2025-06-06~2026-10-04),补上 3 个月窗口看不到的老网址
const files = ['seo/gsc-clicks-2026-09-23.json','seo/gsc-clicks-3m-2026-09-27.json','seo/gsc-clicks-16m-2026-10-06.json'].map(read);
export const clicksOf = p => { const k = p.endsWith('/')?p:p+'/'; return Math.max(...files.map(g=>g[k]?.clicks ?? 0)); };
const listed = fs.readFileSync('seo/old-urls-2026-09-20.txt','utf8').trim().split('\n').map(u=>u.replace('https://zenramensushiny.com',''));
// 清单之外、但 GSC 有真实点击的旧 URL 也要有去处
const extra = [...new Set([files[1], files[2]].flatMap(f => Object.keys(f).filter(p => f[p].clicks >= 1)))].filter(p => !p.includes('/wp-content/') && !listed.some(l => (l.endsWith('/')?l:l+'/') === p));   // /wp-content/ 在 Vercel 上被平台 403,写规则也没用
export const oldUrls = [...listed, ...extra];
