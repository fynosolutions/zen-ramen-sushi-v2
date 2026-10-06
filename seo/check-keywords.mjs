// 关键词覆盖核对(2026-10-06):旧站在 9-20 排名存档里的每个词,现在承接它的新页面里还「说着」这个词吗?
// 做法:词 → 旧排名网址 → 新站落点(同网址页,或 vercel.json 跳转的目的地)→ 落点页面的可见文字 + 标题 + 描述里,是否包含这个词的全部实义词(忽略大小写、复数 s、& 与 and)。
// 判据:「本店相关」的词(不含别的城市/别家店的词),不许出现退步——即旧页面文字里有、新落点文字里没有的实义词。前 10 名的退步必须为 0;其余出报告。
// 「别的城市/别家店」= 词里含下面 FOREIGN 的任一项(这些词是搜别处同名店的人,旧站靠名字碰巧排上,不是本店的生意)。
// 用法: node seo/check-keywords.mjs    (先 npm run build)
import fs from 'fs';
const rk = JSON.parse(fs.readFileSync('seo/ranked-before-2026-09-20.json', 'utf8')).tasks[0].result[0].items;
const v = JSON.parse(fs.readFileSync('vercel.json', 'utf8')); const rules = new Map(v.redirects.filter(r => !r.has).map(r => [r.source, r.destination]));
const file = p => { const q = p.split('#')[0]; return 'out' + (q === '/' ? '' : q.replace(/\/$/, '')) + '/index.html'; };
const dest = p => { const q = p.endsWith('/') ? p : p + '/'; if (fs.existsSync(file(q))) return q; const wild = [...rules].find(([s]) => s.endsWith('/:path*') && q.startsWith(s.slice(0, -7))); return rules.get(q) || (wild && wild[1]) || null; };
const cache = new Map(); const pageText = p => { if (!cache.has(p)) { const h = fs.existsSync(file(p)) ? fs.readFileSync(file(p), 'utf8') : ''; const t = (h.match(/<title>([^<]*)/) || [])[1] || '', d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const main = (h.match(/<main[^>]*>([\s\S]*)<\/main>/) || [,''])[1];   // 只算标题、描述和正文区;导航和页尾里碰巧有的词不算(冷审指出)
  cache.set(p, (t + ' ' + d + ' ' + main.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).toLowerCase().replace(/&amp;/g, ' and ').replace(/&[a-z#0-9]+;/g, ' ').replace(/[^a-z0-9$ ]+/g, ' ')); } return cache.get(p); };
const STOP = new Set('a an the of in on at for to and or is are what how do does near me my your with by from s vs'.split(' '));
const stem = w => w.replace(/(ies)$/, 'y').replace(/s$/, '');
// 注意全部带词边界:早先写成 /ozen/ 把 frozen 也当成了别家店(冷审指出)。本地地标(Grand Central、Rockefeller、Midtown East…)不在此列——它们是本店的生意
const FOREIGN = /\b(sen.?nin|tsushima|zengo|zenkichi|ozen|zenna|omen|zushi|soya|myzen|zeni|zens|zenbu|zenzo|zenji|zento|izen|bebida|burrito|poke|lounge|grill|eatery|house|markham|delhi|astoria|lbi|westlake|livingston|hamburg|geneva|hanover|conway|clemson|shelton|lacey|middletown|parkland|spartanburg|greenville|berryville|maplewood|lakewood|bremerton|riverside|gainesville|noblesville|dahlonega|tokyo|chicago|houston|dallas|austin|seattle|portland|boston|miami|atlanta|denver|vegas|jersey|nj|brooklyn|queens|philadelphia|virginia|texas|florida|california|ohio|georgia|carolina|wa|va|arlington)\b|university place|apple street|zen street|zen bar|and bar|ramen bar|proximit/i;
// 旧页面文字基线(2026-10-06 从旧站抓的非文章页;文章是原样搬的,由 check-journal 验内容一致,这里不重复)
const OLD = JSON.parse(fs.readFileSync('seo/old-page-text-2026-10-06.json', 'utf8')).pages; const norm = t => t.toLowerCase().replace(/&amp;|&/g, ' and ').replace(/[^a-z0-9$ ]+/g, ' ');
const oldWords = {}; for (const [p, v] of Object.entries(OLD)) { const t = norm(v.title + ' ' + v.description + ' ' + v.text); oldWords[p] = { t, w: new Set(t.split(/\s+/).map(stem)) }; }
const WRONG_CITY = /gainesville|dahlonega|greenville|noblesville/i;   // 写错城市的文章是故意下线的(讲的是别的城市的同名店),它们的词没有落点属预期
let rows = [];
for (const it of rk) { const kw = it.keyword_data.keyword, pos = it.ranked_serp_element.serp_item.rank_group, vol = it.keyword_data.keyword_info.search_volume || 0, from = new URL(it.ranked_serp_element.serp_item.url).pathname;
  const to = dest(from); const toks = kw.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(w => w && !STOP.has(w));
  const text = to ? pageText(to) : ''; const words = new Set(text.split(/\s+/).map(stem)); const missNow = toks.filter(w => !words.has(stem(w)) && !text.includes(w));
  const isPost = /^\/\d{4}\/\d{2}\/\d{2}\//.test(from); const o = oldWords[from];
  // 退步 = 旧页面上有这个词、新落点上没有。文章(原样搬迁)不在此列;旧页面基线里没有的页面按「全部算退步」从严处理
  const miss = isPost ? (to === (from.endsWith('/') ? from : from + '/') ? [] : missNow) : missNow.filter(w => !o || o.w.has(stem(w)) || o.t.includes(w));
  rows.push({ kw, pos, vol, from, to, miss, missNow, foreign: FOREIGN.test(kw) }); }
const top10 = rows.filter(r => r.pos <= 10), own10 = top10.filter(r => !r.foreign), ownAll = rows.filter(r => !r.foreign);
const cov = a => a.filter(r => r.to && !r.miss.length).length;
console.log(`排名存档共 ${rows.length} 个词 · 前 10 名 ${top10.length} 个(本店相关 ${own10.length},别处同名店 ${top10.length - own10.length})`);
console.log(`  前 10 名·本店相关: 没有退步 ${cov(own10)}/${own10.length}(退步 = 旧页面上有、新落点上没有的词)`);
console.log(`  全部·本店相关:     没有退步 ${cov(ownAll)}/${ownAll.length} (${(cov(ownAll) / ownAll.length * 100).toFixed(1)}%)`);
console.log(`  没有落点的词: ${rows.filter(r => !r.to).length}(其中写错城市、故意下线的 ${rows.filter(r => !r.to && WRONG_CITY.test(r.from)).length})`);
const missTop = own10.filter(r => !r.to || r.miss.length); for (const r of missTop.slice(0, 40)) console.log(`   ✗ 第${r.pos}名 月搜${r.vol} 「${r.kw}」 ${r.from} → ${r.to || '无落点'} 缺: ${r.miss.join(',')}`);
if (process.argv.includes('--all')) for (const r of ownAll.filter(r => (!r.to || r.miss.length) && r.pos > 10).sort((a, b) => a.pos - b.pos).slice(0, 60)) console.log(`   · 第${r.pos}名 月搜${r.vol} 「${r.kw}」 ${r.from} → ${r.to || '无落点'} 缺: ${r.miss.join(',')}`);
const noDest = rows.filter(r => !r.to && !WRONG_CITY.test(r.from));   // 其余连落点都没有的词(不论是不是本店相关)一律报红
const missAll = [...ownAll.filter(r => !r.to || r.miss.length), ...noDest.filter(r => r.foreign)];
console.log(missAll.length ? `KEYWORD-CHECK FAIL x${missAll.length}(其中前 10 名 ${missTop.length})` : `KEYWORD-CHECK PASS (本店相关词 ${ownAll.length} 个,旧页面上有的词新落点上都在)`);
process.exit(missAll.length ? 1 : 0);
