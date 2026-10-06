// 旧站「有 Google 真实点击」的文章,原网址原样保留(2026-10-06)。数据由 scripts/import-journal.py 从旧站导入,见该脚本开头的说明。
import data from '@/content/journal.json';
export type Post = { path:string; slug:string; title:string; pageTitle:string; description:string; date:string; modified:string;
  hero:{src:string;width:number;height:number;alt:string}|null; html:string; words:number; clicks:number; impressions:number };
export const posts = data.posts as unknown as Post[];
export const byPath = new Map(posts.map(p => [p.path, p]));
export const params = (p:Post) => { const [year,month,day,slug] = p.path.split('/').filter(Boolean); return {year,month,day,slug}; };
// 旧站给的时间是纽约当地时间(不带时区)。显示时按字面日期显示(不做时区换算,否则会差一天);
// 写进结构化数据时补上当天纽约的时区偏移(夏令时 -04:00 / 冬令时 -05:00)
export const fmtDate = (iso:string) => new Date(iso+'Z').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
export const withTz = (iso:string) => { const off = new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',timeZoneName:'longOffset'}).formatToParts(new Date(iso+'Z')).find(x=>x.type==='timeZoneName')!.value.replace('GMT',''); return iso+(off||'-05:00'); };
const topic = (p:Post) => /ramen|noodle|broth|tonkotsu|udon|tsukemen|dashi/i.test(p.slug) ? 'ramen' : /sushi|sashimi|nigiri|roll|fish|sake|nori|wasabi/i.test(p.slug) ? 'sushi' : 'other';
// 相关文章:同主题里排在自己后面的 3 篇(循环)。这样每篇文章都会被另外 3 篇链到,不会出现「只有目录页链它」的孤岛
export const related = (p:Post) => { const same = posts.filter(x => topic(x)===topic(p)); const pool = same.length >= 4 ? same : posts; const i = pool.findIndex(x => x.path===p.path); return [1,2,3].map(k => pool[(i+k) % pool.length]); };
// 目录页卡片用图:文章自己的头图;没有头图的(旧站就没配)按主题用本站实拍兜底,避免一格空着像没加载出来
const FALLBACK = { ramen:{src:'/images/shot-about-tonkotsu.webp',width:1536,height:1024,alt:'Tonkotsu ramen with braised pork belly, soft eggs, corn and arugula in a black bowl'},
  sushi:{src:'/images/shot-strip-seared-roll.webp',width:1536,height:1024,alt:'A seared special roll with spicy mayo, eel sauce and an orchid'},
  other:{src:'/images/shot-dining-room-bright.webp',width:1536,height:1024,alt:'The dining room under paper lanterns and banners'} };
export const cardImage = (p:Post) => p.hero ?? FALLBACK[topic(p)];

