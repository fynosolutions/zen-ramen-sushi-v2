// 读旧站 URL 全量清单,分类生成 301 映射,合并进 vercel.json
import fs from 'fs';
import { oldUrls as old, clicksOf } from './sources.mjs';
const exists = p => fs.existsSync('out'+p.replace(/\/$/,'')+'/index.html') || p==='/';
const T = [ // [正则, 目的地] 按序命中
  [/^\/zrm-menu-item\/.*catering/i, '/events-catering/'],
  [/ramen|noodle|broth|tonkotsu|udon/i, '/menu/#dinner--ramen-noodles'],
  [/sushi|sashimi|nigiri|maki|temaki|omakase|roll|fish|salmon|tuna/i, '/menu/#dinner--sushi-rolls'],
  [/gyoza|appetizer|takoyaki|edamame|tempura|karaage|snack|shumai/i, '/menu/#dinner--appetizers'],
  [/sake|drink|beer|cocktail|beverage|tea\b/i, '/menu/#dinner--sake'],
  [/dessert|mochi|sweet/i, '/menu/#dinner--dessert'],
  [/happy.?hour/i, '/happy-hour/'],
  [/lunch/i, '/lunch-specials/'],   // 2026-10-06:午市有独立页了(之前指菜单页的午市页签)
  [/catering|event|party|corporate|celebrat/i, '/events-catering/'],
  [/penn.?station|commut/i, '/near-penn-station/'],
  [/madison|msg|garden\b/i, '/near-madison-square-garden/'],
  [/midtown|nyc|manhattan|york|neighborhood|city|herald|bryant|koreatown/i, '/about/'],
  [/japan|culture|history|tradition|etiquette|guide|taste|flavor/i, '/about/'],
];
const structural = {
  '/blog/':'/about/', '/news/':'/about/', '/zen-ramen-sushi-blog/':'/about/',
  '/aboutus/':'/about/', '/contact-theme/':'/location/', '/location-theme/':'/location/',   // 旧联系/地址类页面 → 地址页(之前分别指宴会页、关于页,不对等)
  '/full-width-theme/':'/about/', '/error-404-page/':'/about/',
  '/zrm-menu/':'/menu/', '/zrm-category/bento-box/':'/lunch-specials/',
  // 2026-10-06 SEO 积累承接:午市套餐有了独立页;旧联系页/主菜页原先被关键词规则带偏(联系页→拉面菜单、主菜页→关于),改到对的页;
  // 旧文章目录现在是真页面 /blog/,同类入口都指过去
  '/lunch-specials-2/':'/lunch-specials/', '/zen-ramen-contact/':'/location/', '/main-course/':'/menu/',
  '/news/':'/blog/', '/zen-ramen-sushi-blog/':'/blog/',
  // 2026-10-06 16 个月数据带出来的老入口:不写在这里会落到兜底的 /about/(上线后线上验收抓到 /uorder-menu/ 被带偏)
  '/uorder-menu/':'/menu/', '/contact/':'/location/', '/zrm-menu-item/sushi-lunch/':'/lunch-specials/', '/zrm-menu-item/sashimi-lunch/':'/lunch-specials/',
};
// 不在旧网址清单里、但有外链或旧站上能打开的零散入口(2026-10-06 用外链数据与旧站实测补)
const LEGACY = [
  ['/uorder-menu/', '/menu/'],                                        // 2 个外部域名链到它(旧站上已是 404)
  ['/sushi/', '/menu/#dinner--sushi-rolls'],                          // 旧站 200,供应商站有链接
  // ⚠️ /wp-content/…、/wp-json/、/wp-login.php 这类路径在 Vercel 上会被平台防护直接 403(响应头 x-vercel-mitigated: deny),跳转规则轮不到执行(2026-10-06 实测)。
  //    所以旧站的菜单 PDF 直链、被盗链的 logo 没法在这里承接;三条都没有 Google 点击,记为已知缺口,别再加回来
  // 2026-10-06 用 Search Console 16 个月数据补:旧菜单插件的单品/分类/标签页(257 个单品页里 14 次点击)→ 菜单页;有点击的单品页上面已按品类逐条指到菜单锚点,这里兜住其余的
  ['/zrm-menu-type/happy-hour-4-8pm/', '/happy-hour/'], ['/about-2/', '/about/'],
  ['/zrm-menu-item/(.*)', '/menu/'], ['/zrm-menu-type/(.*)', '/menu/'], ['/zrm-category/(.*)', '/menu/'], ['/zrm-tag/(.*)', '/menu/'], ['/menu-item/(.*)', '/menu/'],
  ['/tag/(.*)', '/blog/'], ['/category/(.*)', '/blog/'], ['/author/(.*)', '/blog/'],   // 用 (.*) 不用 :path*:后者在线上匹配不到带尾斜杠的 /tag/xxx/(2026-10-06 上线后实测 404)
  ['/:year(\\d{4})/:month(\\d{2})/', '/blog/'], ['/:year(\\d{4})/', '/blog/'], ['/page/:n(\\d+)/', '/blog/'], ['/blog/page/:n(\\d+)/', '/blog/'], ['/feed/', '/blog/'], ['/comments/feed/', '/blog/'],   // 日期归档、分页、RSS(旧站有,新站没有对应物)→ 文章目录
   // 旧站的标签/分类/作者归档页(清单外的也一并)→ 文章目录
];
const WRONG_CITY = /gainesville|dahlonega|greenville|noblesville/i;
// 薄内容策略(2026-09-23,以 GSC 真实点击为准):博客只 301 有真实点击的;
// 零点击与写错城市的让它 404。估算工具(DataForSEO etv / SE Ranking)高估一个数量级,
// 实测 etv 180 的页面真实点击为 0 —— 永远用 GSC 裁决
const worthRedirect = p => !/^\/\d{4}\/\d{2}\/\d{2}\//.test(p) || (clicksOf(p) >= 1 && !WRONG_CITY.test(p));
const redirects=[]; const report=[];
for(const p of old){
  if(exists(p)){report.push([p,'PAGE','(同URL保留)']);continue;}
  let dest = structural[p];
  if(!dest && /^\/(tag|category|author)\//.test(p)) dest='/blog/';   // 标签/分类/作者归档页 → 文章目录
  if(!dest) for(const [re,d] of T){ if(re.test(p)){dest=d;break;} }
  if(!dest) dest = /^\/(zrm-menu-item|zrm-category|mftype)\//.test(p) ? '/menu/' : '/about/';
  if(!worthRedirect(p)){ report.push([p,'RETIRE', WRONG_CITY.test(p)?'(写错城市)':'(零排名薄内容)']); continue; }
  redirects.push({source:p.replace(/\/$/,'')+'/',destination:dest,permanent:true});
  report.push([p,'301',dest]);
}
// 合并进 vercel.json:保留原有 query 规则,去掉与新映射重复/与真实页面冲突的
const v = JSON.parse(fs.readFileSync('vercel.json','utf8'));
const keepQuery = v.redirects.filter(r=>r.has); // zrm-menu query 规则
// 只保留本次仍在映射内的旧规则;被判 RETIRE 的旧规则一并清除
const retired = new Set(report.filter(r=>r[1]==='RETIRE').map(r=>r[0].replace(/\/$/,'')+'/'));
const oldPlain = v.redirects.filter(r=>!r.has && !redirects.some(n=>n.source===r.source) && !exists(r.source) && !retired.has(r.source));
const legacy = LEGACY.map(([source,destination])=>({source,destination,permanent:true}));
v.redirects=[...keepQuery,...oldPlain.filter(r=>!legacy.some(l=>l.source===r.source)),...redirects,...legacy];
fs.writeFileSync('vercel.json',JSON.stringify(v,null,2));
fs.writeFileSync('seo/redirect-map-report.tsv',report.map(r=>r.join('\t')).join('\n'));
const toAbout=report.filter(r=>r[2]==='/about/').length;
console.log(`总:${old.length} 同URL保留:${report.filter(r=>r[1]==='PAGE').length} 301:${redirects.length} 其中到/about/:${toAbout} · vercel.json redirects:${v.redirects.length}`);
