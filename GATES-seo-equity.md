# Gates: 旧站 SEO 积累承接(2026-10-06)

OWNS: app/[year]/**, app/blog/**, app/location/**, app/lunch-specials/**, lib/journal.ts, content/journal.json, public/images/journal/**, public/favicon.ico, public/apple-touch-icon.png, public/sitemap.xml, scripts/import-journal.py, scripts/build-sitemap.mjs, seo/check-journal.mjs, seo/check-equity.mjs, seo/check-keywords.mjs, seo/old-page-text-2026-10-06.json, seo/ranked-after-2026-10-06.json, GATES-seo-equity.md

Scope: 毛 2026-10-06 的要求——「新网站应该能接住旧网站所有的 SEO 积累,不应该有 drop,要检查、验证、闭环」。旧站在一个网址上的积累 = Google 真实点击 / 曝光 / 排名词 / 外链;凡是有积累的旧网址,新站必须同网址保住或永久跳到对等页面,并且每条都用命令验。

改了别人拥有的文件(都只为让原有检查认新页面,理由写在各处注释里):app/layout.tsx(robots、WebSite 结构化数据、OG、图标)、app/page.tsx 与 content/site.ts(首页补回旧首页一句文案)、app/about/page.tsx、app/menu/page.tsx、app/happy-hour/page.tsx、components/Shared.tsx(页尾三个入口、PageHeading 的 labelInHeading)、app/globals.css(只追加)、vercel.json 与 seo/build-redirects.mjs、seo/check-meta.mjs、seo/check-mapping.mjs、seo/check-links.mjs。

构建约定:本账本的本地门一律对带收录开关的构建产物跑——`NEXT_PUBLIC_GA4_ID=G-JZD3SQCWMP NEXT_PUBLIC_SITE_INDEXABLE=true npm run build && node scripts/build-sitemap.mjs`。

## 本地(对 out/ + vercel.json)

- [x] E1: 有积累的旧网址(点击≥1 / 曝光≥100 / 有排名词 / 有外链)全部被接住:同网址 200,或永久跳到存在的对等页;有积累的文章必须同网址;只有写错城市的文章和旧站已删的可以不接
  CHECK: node seo/check-equity.mjs
  EXPECT: EQUITY-CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-seo-equity; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=63b66099589af1c99878d2098403100c73a5925669390b6ce9ec8f2d4007289b; output-bytes=663

- [x] E2: 搬回来的文章逐篇:页面在、标题=旧站 Google 收录的原文、主标题、规范网址自指、可收录且带 max-image-preview:large、文章结构化数据、正文没被渲染吃掉、图片在且有说明、链接都有去处、有菜单/happy hour/午市/点单入口、目录页与 sitemap 里都有;并与 9-23 的独立备份逐篇比对(五词片段覆盖率 ≥97%、小标题不丢、本站媒体库图片不少)
  CHECK: node seo/check-journal.mjs --source ~/Desktop/CC-Max-2026/restaurant/zen-024-backups/zen_site_backup_2026-09-23.json
  EXPECT: JOURNAL-CHECK PASS (out + 独立备份)
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-seo-equity; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=d3352a72346555ea43287e5d1217313b0e312a70cdcadf5f1de515a18340c444; output-bytes=271

- [x] E3: 旧站排名词(9-20 存档 570 个)里本店相关的词:旧页面文字里有的实义词,新落点的标题/描述/正文区里都还在;没有落点的词只允许来自写错城市的文章
  CHECK: node seo/check-keywords.mjs
  EXPECT: KEYWORD-CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-seo-equity; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=10c48fc6799e9d1dc444b7100f00db836ab4b31dcb661c0d5cc100efbd92075e; output-bytes=395

- [x] E4: 仓库原有的映射/标题描述/图片说明/钱页字数检查仍然全过(含新增的 3 个页面与全部文章)
  CHECK: sh -c 'node seo/check-mapping.mjs && node seo/check-meta.mjs && node seo/check-alt.mjs && node seo/check-pages.mjs'
  EXPECT: PAGES PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-seo-equity; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=2c35accf4adb26aedd7e803b75d17fcc175691d7edd37506b87bcf7a6391915d; output-bytes=377

- [x] E5: 全站链接「文字→去向」审计通过(真浏览器;含页尾 3 个新入口、3 个新页面、目录页上每篇文章的链接)
  CHECK: node seo/check-links.mjs
  EXPECT: LINKS PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-seo-equity; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=4daf04dc2e52fad188d099010a0a7c0aacf2c3f8546b9f88393ecbb934a58511; output-bytes=555

- [x] E6: 真机安全规则在新增内容上也成立(无符号字符、按钮有颜色等)
  CHECK: node seo/check-device-safe.mjs
  EXPECT: DEVICE-SAFE PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-seo-equity; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=fff9e9b15b543d06de06e80712db7f3671d29e7aea44d7bef15f819c0ff49c91; output-bytes=92

- [x] E7: 统计代码与收录开关、三段第三方代码在构建产物里都在
  CHECK: node seo/check-ga4.mjs
  EXPECT: GA4-CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-seo-equity; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=c11ba230e5f78e66fe56d3edfc3b11479eef4acb2d4eb56d32d87e8de71b101c; output-bytes=27

- [x] E8: 技术对齐旧站:每页 robots 带 max-image-preview:large;首页有 WebSite 结构化数据;og:site_name/type/locale 在;菜单页与 happy hour 页有分享图;菜单页主标题含 menu;文章有面包屑;/favicon.ico 与 /apple-touch-icon.png 在;sitemap 条数 = 固定页 + 文章数
  CHECK: node -e "const fs=require('fs');const rd=p=>fs.readFileSync('out'+p+'index.html','utf8');const f=[];const ok=(c,m)=>{if(!c)f.push(m)};const J=JSON.parse(fs.readFileSync('content/journal.json','utf8')).posts;const pages=['/','/menu/','/happy-hour/','/lunch-specials/','/location/','/about/','/blog/','/events-catering/','/gallery/','/near-penn-station/','/near-madison-square-garden/',J[0].path,J[J.length-1].path];for(const p of pages){const h=rd(p);ok(/name=.robots. content=.index, follow[^>]*max-image-preview:large/.test(h),p+' robots');ok(/property=.og:site_name. content=.Zen Ramen (&amp;|&) Sushi/.test(h),p+' og:site_name');ok(/property=.og:image. content=/.test(h),p+' og:image');ok(/property=.og:type./.test(h),p+' og:type');}const home=rd('/');ok(/\"@type\":\"WebSite\"/.test(home),'WebSite schema');ok(/\"@type\":\"Restaurant\"/.test(home),'Restaurant schema');const m=rd('/menu/');const h1=(m.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)||[])[1]||'';ok(/menu/i.test(h1.replace(/<[^>]+>/g,' ')),'menu h1 含 menu: '+h1.replace(/<[^>]+>/g,' ').slice(0,60));ok((m.match(/<h1/g)||[]).length===1,'menu 单一 h1');ok(/\"@type\":\"BreadcrumbList\"/.test(rd(J[0].path)),'文章面包屑');for(const x of ['favicon.ico','apple-touch-icon.png','favicon.svg'])ok(fs.existsSync('out/'+x)&&fs.statSync('out/'+x).size>100,x);const sm=fs.readFileSync('out/sitemap.xml','utf8');const n=(sm.match(/<loc>/g)||[]).length;ok(n===13+J.length,'sitemap 条数 '+n+' ≠ 13+'+J.length);ok(!/\/wp-content\//.test(JSON.stringify(JSON.parse(fs.readFileSync('vercel.json','utf8')).redirects)),'vercel.json 里不该有 wp-content 跳转(平台会 403)');console.log(f.length?'PARITY FAIL x'+f.length+': '+f.join(' | '):'PARITY PASS ('+pages.length+' 页 · sitemap '+n+' 条)');process.exit(f.length?1:0)"
  EXPECT: PARITY PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-seo-equity; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=a16569e50a3ac389c8006f8a463ad9c01c63d74be82747b463ef6effcc557470; output-bytes=39

- [x] E9: 负向对照①:把一篇有点击的文章从数据里拿掉后,积累核对必须报红(证明它真的在查「有积累的文章必须同网址」)
  CHECK: sh -c 'cp content/journal.json /tmp/j.bak && node -e "const fs=require(\"fs\");const j=JSON.parse(fs.readFileSync(\"content/journal.json\",\"utf8\"));const gone=j.posts.shift();fs.writeFileSync(\"content/journal.json\",JSON.stringify(j));fs.renameSync(\"out\"+gone.path+\"index.html\",\"/tmp/gone-index.html\");fs.writeFileSync(\"/tmp/gone-path\",gone.path)" ; node seo/check-equity.mjs >/tmp/neg1.log 2>&1; r=$?; cp /tmp/j.bak content/journal.json; mv /tmp/gone-index.html "out$(cat /tmp/gone-path)index.html"; if [ $r -ne 0 ] && grep -q "没有被接住\|应原网址保留\|应是同网址" /tmp/neg1.log; then echo NEGATIVE-EQUITY RED; else echo NEGATIVE STAYED-GREEN; exit 1; fi'
  EXPECT: NEGATIVE-EQUITY RED
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-seo-equity; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=40fd02a19f53ab69cf4b8f948127fd31f4b0d0fb446b35bf93c753fb2a86e428; output-bytes=20

- [x] E10: 负向对照②:把一篇文章的正文砍掉一半后,与独立备份的比对必须报红(证明内容比对不是摆设)
  CHECK: sh -c 'f="out$(node -e "console.log(JSON.parse(require(\"fs\").readFileSync(\"content/journal.json\",\"utf8\")).posts[3].path)")index.html"; cp "$f" /tmp/post.bak; node -e "const fs=require(\"fs\");const f=process.argv[1];let h=fs.readFileSync(f,\"utf8\");const a=h.indexOf(\"journal-body\");const b=h.indexOf(\"journal-visit\");const mid=a+Math.floor((b-a)/2);const cut=h.lastIndexOf(\"<p>\",mid);const end=h.lastIndexOf(\"</div><aside\",b);fs.writeFileSync(f,h.slice(0,cut)+h.slice(end))" "$f"; node seo/check-journal.mjs --source ~/Desktop/CC-Max-2026/restaurant/zen-024-backups/zen_site_backup_2026-09-23.json >/tmp/neg2.log 2>&1; r=$?; cp /tmp/post.bak "$f"; if [ $r -ne 0 ] && grep -q "只保住\|词数与导入数据不一致" /tmp/neg2.log; then echo NEGATIVE-JOURNAL RED; else echo NEGATIVE STAYED-GREEN; exit 1; fi'
  EXPECT: NEGATIVE-JOURNAL RED
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-seo-equity; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=cc04116f8f858c2339f6cce7ac31b4a42e5dd9d94d7e57a6cfa2473f62ea198b; output-bytes=21

- [x] E11: 负向对照③:把首页补回的那句旧文案拿掉后,关键词核对必须报红(证明它真的在比「旧页有、新页没有」)
  CHECK: sh -c 'cp out/index.html /tmp/home.bak; node -e "const fs=require(\"fs\");let h=fs.readFileSync(\"out/index.html\",\"utf8\");const i=h.indexOf(\"Whether you\");const j=h.indexOf(\"</p>\",i);if(i<0)process.exit(3);fs.writeFileSync(\"out/index.html\",h.slice(0,i)+h.slice(j))"; node seo/check-keywords.mjs >/tmp/neg3.log 2>&1; r=$?; cp /tmp/home.bak out/index.html; if [ $r -ne 0 ] && grep -q "KEYWORD-CHECK FAIL" /tmp/neg3.log && grep -q "缺: " /tmp/neg3.log; then echo NEGATIVE-KEYWORD RED; else echo NEGATIVE STAYED-GREEN; exit 1; fi'
  EXPECT: NEGATIVE-KEYWORD RED
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-seo-equity; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=c80bf990c11ef9f1d4de0f37746bd7669befe178502a2ba14a5550c284c3de4e; output-bytes=21

- [x] E12: 新页面的版式过独立审稿(design-critic 只看截图、每轮新实例):最后一轮没有「必须修」的问题
  EVIDENCE: 2026-10-06 三轮,每轮新实例、只给截图路径。第 1 轮 FAIL(必须修 3:手机表格第二列被切、地址页按钮字色被正文链接样式盖掉、目录页热门区卡片缺图;应修 10)→ 全部处理;第 2 轮 必须修 0(应修 3:菜单页手机小标签间距、关于页要点折行、文章署名行缺分隔)→ 全部处理并实测(三页「小标签→大标题」间距手机 4/4/4、电脑 -2/-2/-2);第 3 轮 必须修 0,前述 3 处确认到位。第 3 轮另提 2 条应修项都在全站原有部件上(红色行动条说明文字在手机上的换行、菜单页顶部 RESERVE/CALL 两个文字链接下划线不等高),线上现状即如此、非本次改动引入,未动,记入待办。审稿员没拍到的 3 处手机画面(地址页按钮组、午市页按钮组、关于页要点列表)由我按模拟真人滚动重拍并逐张看过。截图在本 session 临时目录 shots/ shots2/ shots3/ shots4/。

上线后的验收在 `GATES-seo-equity-live.md`(上线前不要跑,它会对线上发请求)。
