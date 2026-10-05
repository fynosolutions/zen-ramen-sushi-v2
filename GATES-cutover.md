# Gates: 域名切换 · 计划阶段（2026-09-27）

OWNS: seo/CUTOVER-CHECKLIST.md, GATES-cutover.md, GATES-cutover-godaddy-alt.md, scripts/build-for-host.mjs, scripts/apache-local.mjs, scripts/gen-host-configs.mjs, seo/dns-check.mjs, seo/check-cutover.mjs, seo/check-portability.mjs

Scope: 一份可执行的切换总计划 —— 覆盖毛问的六块(跳转范围/SEO判据/平台同步/权限/切换日流程/回滚),且计划里引用的现状全部与实物一致。只计划,不执行切换。

- [x] P1: 计划覆盖六块内容(权限、跳转、SEO 判据、平台同步、切换日、回滚)
  CHECK: node -e "const s=require('fs').readFileSync('seo/CUTOVER-CHECKLIST.md','utf8');const need=['## 1. 权限清单','## 2. 跳转都包含什么','## 3. SEO 怎么算成功','## 4. 各平台怎么同步','## 6. 切换日 T','## 7. 回滚'];const miss=need.filter(n=>!s.includes(n));console.log(miss.length?'MISSING '+miss:'SECTIONS OK')"
  EXPECT: SECTIONS OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=620277be5b04b0ecfcb16aafce0bad0a3dfd92270f5a209fdb1882f31a2e01c6; output-bytes=12

- [x] P2: 跳转映射验收门绿(有点击的旧网址全部有去处)
  CHECK: node seo/check-mapping.mjs
  EXPECT: MAPPING PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=3b9c34a420baea3c5800dde395b9be5099af368d575f111a2b32f5d5c59c6093; output-bytes=138

- [x] P3: 计划里写的跳转条数 = vercel.json 实际无参数规则数
  CHECK: node -e "const fs=require('fs');const n=JSON.parse(fs.readFileSync('vercel.json','utf8')).redirects.filter(r=>!r.has).length;const s=fs.readFileSync('seo/CUTOVER-CHECKLIST.md','utf8');console.log(s.includes('| '+n+' 条 |')?'COUNT MATCH '+n:'COUNT MISMATCH '+n)"
  EXPECT: COUNT MATCH
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=074ba68b52a88e130a9bdffd7d4155de8c91a80e23e38d8e04d47174432a6945; output-bytes=16

- [x] P4: 回滚原值仍写在计划里(192.0.78.24 与 192.0.78.25),且线上根域 A 已按计划指向 Vercel 的两个入口地址(2026-10-05 切换前这条查的是「线上仍指旧站」,切换后改为现状)
  CHECK: node -e "require('dns').promises.resolve4('zenramensushiny.com').then(a=>{const s=require('fs').readFileSync('seo/CUTOVER-CHECKLIST.md','utf8');const live=a.sort().join(',');const ok=live==='216.150.1.1,216.150.16.1'&&s.includes('192.0.78.24')&&s.includes('192.0.78.25');console.log(ok?'ROLLBACK VALUES OK':'ROLLBACK VALUES MISMATCH '+live)})"
  EXPECT: ROLLBACK VALUES OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=f104ec5ab3ba76ef4215083cb2aa3d016afe8a674cdf0ba749b25ef8b1640627; output-bytes=19

- [x] P5: 邮箱记录存档与线上一致(MX 三条都在计划的「不碰」表里)
  CHECK: node -e "require('dns').promises.resolveMx('zenramensushiny.com').then(m=>{const s=require('fs').readFileSync('seo/CUTOVER-CHECKLIST.md','utf8');const miss=m.map(x=>x.exchange).filter(e=>!s.includes(e));console.log(m.length===3&&!miss.length?'MX ARCHIVED':'MX GAP '+miss)})"
  EXPECT: MX ARCHIVED
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=f9294980f18d4806ec89918b26aa827ebb8f964940c5b537d3e67f9244a54a93; output-bytes=12

- [x] P6: 新站线上已带旧站两段 GSC 验证标签(切换后 Search Console 不失效)
  CHECK: node -e "fetch('https://zenramensushiny.com/?g='+Date.now()).then(r=>r.text()).then(h=>{const n=(h.match(/google-site-verification/g)||[]).length;console.log(n>=2?'VERIFY TAGS LIVE':'VERIFY TAGS MISSING '+n)})"
  EXPECT: VERIFY TAGS LIVE
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=50a32f428a84c55d092b2b551185696d02a9ce66c6cb4a04e0b00eaa098a0552; output-bytes=17

- [x] P7: 权限实测 —— GoDaddy 委托账号能看到并编辑该域名 DNS
  EVIDENCE: 2026-09-27 01:5x ET Orca 实测: sso.godaddy.com/access → Celina Lin「Access now」→ dcc.godaddy.com/control/portfolio/zenramensushiny.com/settings?tab=dns 列出 A/NS/CNAME/MX/TXT/SRV 共 3 页记录,每行带 Edit/Delete;未做任何修改。登录邮箱码从 jaye.mao Gmail(gmail-tools/token_jaye.json)自取

## 工具与证据（2026-10-03 起：构建/Apache/DNS/彩排检查。GoDaddy 主机备用路线与现路线共用，全部在本机真 Apache 上跑过）

- [x] P8: 一键构建可用:带统计编号与「允许收录」开关构建,生成 .htaccess(含 https/www 规则、旧网址跳转、缓存头)放进 out/,自检统计与索引开关
  CHECK: node scripts/build-for-host.mjs
  EXPECT: BUILD-FOR-HOST PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=2de3ef10389ecbdd9a6da1b38b8166b426dcd7bb12bfd19dddb233dd5130ca56; output-bytes=1541

- [x] P9: 本机真 Apache 全套彩排通过(113 条旧网址跳转、同网址页面、65 条故意 404、整站级跳转、统计/索引/规范网址、sitemap/robots、两个视频分段播放、图片缓存头、压缩、隐藏文件不对外)
  CHECK: sh -c 'node scripts/apache-local.mjs start out 8911 >/dev/null && node seo/check-cutover.mjs --host zenramensushiny.com --ip 127.0.0.1 --http-port 8911 --no-tls'
  EXPECT: CUTOVER-CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=065dd49ec5d2542d6f372d3c43c4b4fa41a3e7f42bef0a0ebcde12af609825be; output-bytes=1394

- [x] P10: 旧网址行为在真 Apache 上与 vercel.json 一致(含 65 条故意 404)
  CHECK: node seo/check-portability.mjs
  EXPECT: PORTABILITY PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=4724931fb16bc52d90380c67291aa18711bd3ed946a04acc150ee3837236d690; output-bytes=82

- [x] P11: 检查能报红 ①:漏传 .htaccess(最容易出的事故)时彩排必须失败
  CHECK: sh -c 'mv out/.htaccess /tmp/zen-h.bak && node scripts/apache-local.mjs stop 8911 >/dev/null; node scripts/apache-local.mjs start out 8911 >/dev/null; node seo/check-cutover.mjs --host zenramensushiny.com --ip 127.0.0.1 --http-port 8911 --no-tls >/tmp/zen-neg.log 2>&1; r=$?; mv /tmp/zen-h.bak out/.htaccess; node scripts/apache-local.mjs stop 8911 >/dev/null; if [ $r -ne 0 ]; then echo NEGATIVE-CONTROL RED; else echo NEGATIVE-CONTROL STAYED-GREEN; fi'
  EXPECT: NEGATIVE-CONTROL RED
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=4f6c6d672427a5e5cd90309eececae55c48dda180ebd51d6e2603571ef161e19; output-bytes=21

- [x] P12: 检查能报红 ②:邮箱记录被改时 DNS 比对必须失败
  CHECK: sh -c 'cp seo/baseline-T-1/dns-snapshot.json /tmp/zen-snap-neg.json && sed -i.bak "s/mx1.titan.email/mx1.evil.example/" /tmp/zen-snap-neg.json && if node seo/dns-check.mjs compare /tmp/zen-snap-neg.json >/dev/null 2>&1; then echo DNS-NEGATIVE STAYED-GREEN; else echo DNS-NEGATIVE RED; fi'
  EXPECT: DNS-NEGATIVE RED
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=9c98234d238b7cc58160f1bc078d2eeae629f3d28d1ef884e2090788956c677e; output-bytes=17

## 执行阶段（Vercel 路线；2026-10-05 约 16:05 ET 已切换，以下是切换后的验收与待办）

- [x] V1: 域名已指向 Vercel,且邮箱/NS/TXT 等其余记录与切换前快照逐条一致(只有根域 A 变化)
  CHECK: node seo/dns-check.mjs compare --flipped
  EXPECT: DNS-COMPARE PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=734dd86842d79a922c2f9b94da35d0604cb794782642c25d51911e9d2a0a3e88; output-bytes=393

- [x] V2: 根域 A 的生效等待时间 ≤600 秒(回滚 10 分钟内生效的前提)
  CHECK: node seo/dns-check.mjs ttl --max 600
  EXPECT: DNS-TTL PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=2df5ae9f2a85d1da6191552a943d34ecd83ca5dcc348a1c8bc661246c557a763; output-bytes=283

- [x] V3: 线上证书同时覆盖根域和 www、证书链完整、剩余 ≥60 天
  CHECK: node seo/check-cutover.mjs --host zenramensushiny.com --only-cert
  EXPECT: CERT-CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=8e4cb956453535bd13ba1d91ba6b7586c7c51a743e4dfa0657d29da242fbcadb; output-bytes=799

- [x] V4: 线上全套验收通过(整站级跳转、113 条旧网址永久跳转、同网址页面、65 条故意 404、统计/索引/规范网址、sitemap/robots、视频分段播放、缓存、压缩、速度)
  CHECK: node seo/check-cutover.mjs --host zenramensushiny.com
  EXPECT: CUTOVER-CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=352d7180d48666d9dd8a722ec57ea31586fccc8ff833a539f836d61bed01ebfe; output-bytes=2040

- [x] V5: 线上统计编号正确、没有 noindex
  CHECK: GA_BASE=https://zenramensushiny.com node seo/check-ga4.mjs
  EXPECT: GA4-CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=55c3fce93ac5212ee2e06c1f12a1729146c0b29ed26a7bf6ea09c58fe61b556f; output-bytes=51

- [ ] V6: 邮箱收发正常:店里邮箱收到一封发来的测试邮件、也能发出去(人工)
  EVIDENCE: pending

- [ ] V7: GSC 已提交新 sitemap 与旧网址 sitemap、4 个主页面已请求收录;Bing Webmaster 已验证并提交 sitemap(人工)
  EVIDENCE: pending

- [ ] V8: 各平台链接逐个点过(Google 商家、Yelp、TripAdvisor、IG 简介、Resy、外卖平台),都打开新站(人工)
  EVIDENCE: pending

- [ ] V9: 毛用真 iPhone 打开正式域名确认(图标、MENU 颜色、视频自动播)(人工)
  EVIDENCE: pending

- [x] V10: `zen-ramen.vercel.app` 已设成 308 跳转到正式域名(逐页带路径和参数),且仓库里的线上检查口径已改指正式域名(2026-10-05 由 website-0c 在 Vercel 设置里做、毛「按推荐走」)
  CHECK: node -e "(async()=>{const t=['/','/menu/','/zrm-menu/?menu=lunch'];let bad=0;for(const p of t){const r=await fetch('https://zen-ramen.vercel.app'+p,{redirect:'manual'});const l=r.headers.get('location');if(r.status!==308||l!=='https://zenramensushiny.com'+p)bad++;}console.log(bad===0?'VERCEL-APP REDIRECT OK':'VERCEL-APP REDIRECT BAD '+bad)})()"
  EXPECT: VERCEL-APP REDIRECT OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=24f2d8c9501d63bd78e795638a3073c561c905df3aa986301759914d92f1fa02; output-bytes=23

- [ ] V11: 头 7 天(到 2026-10-12)每天读 GSC 点击,没有触发止损线(任何一周 <130 次,或首页从 Google 消失);之后每周一报毛,共 4 周(人工)
  EVIDENCE: pending

