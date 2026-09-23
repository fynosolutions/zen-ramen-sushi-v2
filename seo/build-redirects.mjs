// 读旧站 URL 全量清单,分类生成 301 映射,合并进 vercel.json
import fs from 'fs';
const old = fs.readFileSync('seo/old-urls-2026-09-20.txt','utf8').trim().split('\n').map(u=>u.replace('https://zenramensushiny.com',''));
const exists = p => fs.existsSync('out'+p.replace(/\/$/,'')+'/index.html') || p==='/';
const T = [ // [正则, 目的地] 按序命中
  [/ramen|noodle|broth|tonkotsu|udon/i, '/menu/#dinner--ramen-noodles'],
  [/sushi|sashimi|nigiri|maki|temaki|omakase|roll|fish|salmon|tuna/i, '/menu/#dinner--sushi-rolls'],
  [/gyoza|appetizer|takoyaki|edamame|tempura|karaage|snack|shumai/i, '/menu/#dinner--appetizers'],
  [/sake|drink|beer|cocktail|beverage|tea\b/i, '/menu/#dinner--sake'],
  [/dessert|mochi|sweet/i, '/menu/#dinner--dessert'],
  [/happy.?hour/i, '/happy-hour/'],
  [/lunch/i, '/menu/#lunch'],
  [/catering|event|party|corporate|celebrat/i, '/events-catering/'],
  [/penn.?station|commut/i, '/near-penn-station/'],
  [/madison|msg|garden\b/i, '/near-madison-square-garden/'],
  [/midtown|nyc|manhattan|york|neighborhood|city|herald|bryant|koreatown/i, '/about/'],
  [/japan|culture|history|tradition|etiquette|guide|taste|flavor/i, '/about/'],
];
const structural = {
  '/blog/':'/about/', '/news/':'/about/', '/zen-ramen-sushi-blog/':'/about/',
  '/aboutus/':'/about/', '/contact-theme/':'/events-catering/', '/location-theme/':'/about/',
  '/full-width-theme/':'/about/', '/error-404-page/':'/about/',
};
const etvMap = JSON.parse(fs.readFileSync('seo/blog-etv-2026-09-23.json','utf8'));
const WRONG_CITY = /gainesville|dahlonega|greenville|noblesville/i;
// 薄内容策略(2026-09-23,两套工具交叉校准):博客只 301 有排名的;
// 零排名与写错城市的让它 404 —— 把 100+ 篇薄文全收口到两个锚点会被判软404
const worthRedirect = p => !/^\/\d{4}\/\d{2}\/\d{2}\//.test(p) || ((etvMap[p]?.etv ?? 0) >= 1 && !WRONG_CITY.test(p));
const redirects=[]; const report=[];
for(const p of old){
  if(exists(p)){report.push([p,'PAGE','(同URL保留)']);continue;}
  let dest = structural[p];
  if(!dest) for(const [re,d] of T){ if(re.test(p)){dest=d;break;} }
  if(!dest) dest = '/about/';
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
v.redirects=[...keepQuery,...oldPlain,...redirects];
fs.writeFileSync('vercel.json',JSON.stringify(v,null,2));
fs.writeFileSync('seo/redirect-map-report.tsv',report.map(r=>r.join('\t')).join('\n'));
const toAbout=report.filter(r=>r[2]==='/about/').length;
console.log(`总:${old.length} 同URL保留:${report.filter(r=>r[1]==='PAGE').length} 301:${redirects.length} 其中到/about/:${toAbout} · vercel.json redirects:${v.redirects.length}`);
