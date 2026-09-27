# Gates: 域名切换 · 计划阶段（2026-09-27）

OWNS: seo/CUTOVER-CHECKLIST.md, GATES-cutover.md

Scope: 一份可执行的切换总计划 —— 覆盖毛问的六块(跳转范围/SEO判据/平台同步/权限/切换日流程/回滚),且计划里引用的现状全部与实物一致。只计划,不执行切换。

- [x] P1: 计划覆盖六块内容(权限、跳转、SEO 判据、平台同步、切换日、回滚)
  CHECK: node -e "const s=require('fs').readFileSync('seo/CUTOVER-CHECKLIST.md','utf8');const need=['## 1. 权限清单','## 2. 跳转都包含什么','## 3. SEO 怎么算成功','## 4. 各平台怎么同步','## 6. 切换日 T','## 7. 回滚'];const miss=need.filter(n=>!s.includes(n));console.log(miss.length?'MISSING '+miss:'SECTIONS OK')"
  EXPECT: SECTIONS OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=0e42c8a9e372/36 entries; EXPECT=matched; output-sha256=620277be5b04b0ecfcb16aafce0bad0a3dfd92270f5a209fdb1882f31a2e01c6; output-bytes=12

- [x] P2: 跳转映射验收门绿(有点击的旧网址全部有去处)
  CHECK: node seo/check-mapping.mjs
  EXPECT: MAPPING PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=0e42c8a9e372/36 entries; EXPECT=matched; output-sha256=3b9c34a420baea3c5800dde395b9be5099af368d575f111a2b32f5d5c59c6093; output-bytes=138

- [x] P3: 计划里写的跳转条数 = vercel.json 实际无参数规则数
  CHECK: node -e "const fs=require('fs');const n=JSON.parse(fs.readFileSync('vercel.json','utf8')).redirects.filter(r=>!r.has).length;const s=fs.readFileSync('seo/CUTOVER-CHECKLIST.md','utf8');console.log(s.includes('| '+n+' 条 |')?'COUNT MATCH '+n:'COUNT MISMATCH '+n)"
  EXPECT: COUNT MATCH
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=0e42c8a9e372/36 entries; EXPECT=matched; output-sha256=074ba68b52a88e130a9bdffd7d4155de8c91a80e23e38d8e04d47174432a6945; output-bytes=16

- [x] P4: 回滚原值与线上 DNS 一致(现在仍指旧站),且计划写着这两个值
  CHECK: node -e "require('dns').promises.resolve4('zenramensushiny.com').then(a=>{const s=require('fs').readFileSync('seo/CUTOVER-CHECKLIST.md','utf8');const live=a.sort().join(',');const ok=live==='192.0.78.24,192.0.78.25'&&s.includes('192.0.78.24')&&s.includes('192.0.78.25');console.log(ok?'ROLLBACK VALUES OK':'ROLLBACK MISMATCH '+live)})"
  EXPECT: ROLLBACK VALUES OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=0e42c8a9e372/36 entries; EXPECT=matched; output-sha256=f104ec5ab3ba76ef4215083cb2aa3d016afe8a674cdf0ba749b25ef8b1640627; output-bytes=19

- [x] P5: 邮箱记录存档与线上一致(MX 三条都在计划的「不碰」表里)
  CHECK: node -e "require('dns').promises.resolveMx('zenramensushiny.com').then(m=>{const s=require('fs').readFileSync('seo/CUTOVER-CHECKLIST.md','utf8');const miss=m.map(x=>x.exchange).filter(e=>!s.includes(e));console.log(m.length===3&&!miss.length?'MX ARCHIVED':'MX GAP '+miss)})"
  EXPECT: MX ARCHIVED
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=0e42c8a9e372/36 entries; EXPECT=matched; output-sha256=f9294980f18d4806ec89918b26aa827ebb8f964940c5b537d3e67f9244a54a93; output-bytes=12

- [x] P6: 新站线上已带旧站两段 GSC 验证标签(切换后 Search Console 不失效)
  CHECK: node -e "fetch('https://zen-ramen.vercel.app/?g='+Date.now()).then(r=>r.text()).then(h=>{const n=(h.match(/google-site-verification/g)||[]).length;console.log(n>=2?'VERIFY TAGS LIVE':'VERIFY TAGS MISSING '+n)})"
  EXPECT: VERIFY TAGS LIVE
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=0e42c8a9e372/36 entries; EXPECT=matched; output-sha256=50a32f428a84c55d092b2b551185696d02a9ce66c6cb4a04e0b00eaa098a0552; output-bytes=17

- [x] P7: 权限实测 —— GoDaddy 委托账号能看到并编辑该域名 DNS
  EVIDENCE: 2026-09-27 01:5x ET Orca 实测: sso.godaddy.com/access → Celina Lin「Access now」→ dcc.godaddy.com/control/portfolio/zenramensushiny.com/settings?tab=dns 列出 A/NS/CNAME/MX/TXT/SRV 共 3 页记录,每行带 Edit/Delete;未做任何修改。登录邮箱码从 jaye.mao Gmail(gmail-tools/token_jaye.json)自取
