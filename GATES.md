# GATES — 024 Zen Ramen 新站 SEO（迁移准备+落地）

- [x] G1: 旧站 URL 全量存档（≥140 条）
  CHECK: node -e "const n=require('fs').readFileSync('seo/old-urls-2026-09-20.txt','utf8').trim().split('\n').length; console.log(n>=140?'PASS '+n:'FAIL '+n)"
  EXPECT: PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=e015fc20c5b2c7cce16700082d6f1a48c351c7418a82b5358c98f93053f4a106; output-bytes=9
- [x] G2: 排名词基线存档（≥400 词, 合法 JSON）
  CHECK: node -e "const d=JSON.parse(require('fs').readFileSync('seo/ranked-before-2026-09-20.json','utf8')); const n=d.tasks[0].result[0].items.length; console.log(n>=400?'PASS '+n:'FAIL '+n)"
  EXPECT: PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=d722a4864d2dc8f4d879aeec1cf4d0eb846737d97150c459de58301d52ae69f5; output-bytes=9
- [x] G3: 分层承接（真相源=GSC 真实点击，非估算工具）——有点击的旧 URL 一条不丢且不倒向首页；零点击薄内容与写错城市的故意下线；点击保全率 100%
  CHECK: node seo/check-mapping.mjs
  EXPECT: MAPPING PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=dc56851cecd1ebbc655e99d7247800124ada2b74e09864aa3d87754d6e3a5fdc; output-bytes=135
- [x] G4: Restaurant JSON-LD 含 geo/priceRange/sameAs(IG+TikTok+FB)/acceptsReservations/image/servesCuisine/openingHours/hasMenu
  CHECK: node -e "const h=require('fs').readFileSync('out/index.html','utf8'); const m=h.match(/<script type=\"application\/ld\+json\">(.*?)<\/script>/s); const j=JSON.parse(m[1].replace(/\\u003c/g,'<')); const need=['geo','priceRange','sameAs','acceptsReservations','image','servesCuisine','openingHoursSpecification','hasMenu']; const miss=need.filter(k=>!(k in j)); const tik=(j.sameAs||[]).some(u=>u.includes('zen.ramen.sushi')); console.log(miss.length===0&&tik&&(j.sameAs||[]).length>=3?'LD PASS':'LD FAIL '+miss+' tiktok:'+tik)"
  EXPECT: LD PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=39036b4159177827c449528163945d6bb3e7985a8cf8ff36bbe9cbc747538b78; output-bytes=8
- [x] G5: 全站 title ≤60 字符且唯一；description 唯一且 ≤160
  CHECK: node seo/check-meta.mjs
  EXPECT: META PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=15381b61bbd94dbeccaae9f944b13d3615807179934661739d2a1352589494ac; output-bytes=18
- [x] G6: 产物 HTML 中 img alt 覆盖率 100%（装饰图 alt="" 计入合格）
  CHECK: node seo/check-alt.mjs
  EXPECT: ALT PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=3f95de0cf284954757c55d31de7e42fb5cc6f8b96819670d25ef99483ce68039; output-bytes=29
- [x] G7: 三个钱页建成：/happy-hour/ ≥800 词；/near-madison-square-garden/ 与 /near-penn-station/ 各 ≥350 词；三页均有 tel: 链接与导航
  CHECK: node seo/check-pages.mjs
  EXPECT: PAGES PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=d3f21689a459ed84a6671d51464d8fb4d7999b5ade75f328ec4d9835f3741239; output-bytes=190
- [x] G8: sitemap.xml 收录三个新页
  CHECK: node -e "const s=require('fs').readFileSync('public/sitemap.xml','utf8'); const ok=['happy-hour','near-madison-square-garden','near-penn-station'].every(u=>s.includes(u)); console.log(ok?'SITEMAP PASS':'SITEMAP FAIL')"
  EXPECT: SITEMAP PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=eb419932f5789ef21b2c9ee1d60315c6828e4cc21c0c8588d899033642ccd68f; output-bytes=13
- [x] G9: 构建 + Playwright 全绿
  CHECK: npm test 2>&1 | tail -1
  EXPECT: 8 passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=9134b3f26a9659e9899cad7ad2beaf6847c91d5cb41567441d0fa425d8b68d2c; output-bytes=18
- [x] G10: 20 项 SEO 体检对本地产物跑通且无 FAIL 级问题（体检器自身输出为准）
  CHECK: node seo/run-verify.mjs
  EXPECT: VERIFY PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=af19c4f1cc878f4d3411edb536465600c3826d369ae0672dc1671ed1fedc1abd; output-bytes=803
- [x] G11: [manual] 受阻项清单已交毛：GSC/GA4/DNS/WordPress 权限 + 供应商四问（谁/月费/到期/内容归属）
  EVIDENCE: 2026-09-20 收官报告已列受阻五项并写入 open-steps reports/zen-ramen-sushi-v2/latest.md 追加节
