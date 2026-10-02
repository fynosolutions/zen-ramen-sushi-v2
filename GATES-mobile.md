# Gates: 手机版多重验证(2026-10-02)

OWNS: seo/check-mobile.mjs, GATES-mobile.md, package.json, app/globals.css, components/**, CLAUDE.md

Scope: 手机版按「按钮/链接审计」同一标准测过,并覆盖「展开信息(导航/下拉/页签/分类)、动态(悬浮/视频/减少动效/触屏无悬停/页头不抖)、图片(全部加载/不破图/不糊/不溢出)」;iPhone WebKit + 安卓 Chromium + 360/320 窄屏;本地 + 线上;独立冷眼审稿;全部合并上线。

- [ ] M1: 4 种手机配置(iPhone 13 WebKit / Pixel 7 Chromium / 360×740 / 320×568)×10 个页面:全部图片加载成功且不糊、无横向溢出、无控制台报错与同源 4xx/5xx;展开导航/ORDER ONLINE 下拉/菜单页签/分类导航/地图切换/相册/表单/底部操作栏/锚点落点(不被粘性栏盖住);动态(触屏无悬停放大、悬浮在跑、减少动效全停、视频点按播放、开场动画可跳过、页头不抖)
  CHECK: node seo/check-mobile.mjs
  EXPECT: MOBILE PASS
  EVIDENCE: pending

- [x] M2: 检查能报红:注入三种手机端缺陷(整宽溢出 / 糊图 / 锚点被粘性栏盖住),各自必须失败
  EVIDENCE: 2026-10-02 三种注入缺陷均变红(各自跑完后还原再跑一遍 PASS):①给 .hero-copy 加 width:130vw(整宽溢出)→ 320 窄屏配置 FAIL(元素被推出屏幕点不到);②把 dish-gyoza.webp 缩成 90px(糊图)→ FAIL x8「图片偏糊(原图只有显示宽度的 0.55–0.58 倍)」;③给 .food-section 加 scroll-margin-top:0(锚点被粘性栏盖住)→ FAIL x24「区块顶 0px < 粘性栏底 60px」。另:第一次跑出真实缺陷「Happy Hour 页可见图片只有 1 张」→ 已补 3 张同名小食图

- [ ] M3: 独立冷眼审稿:只看手机截图的审稿员(看不到代码)对首页首屏/页尾 CTA/菜单图/展开导航/下拉/相册/底部栏给出结论,P1/P2 全部处理
  EVIDENCE: pending

- [ ] M4: 不退步:SEO 四门、类型检查、CTA 十三门、菜单图七门、链接五门、8 条 Playwright 测试
  CHECK: npm run seo 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const ok=['MAPPING PASS','META PASS','ALT PASS','PAGES PASS'].every(k=>s.includes(k));console.log(ok?'REGRESSION SEO PASS':'REGRESSION SEO FAIL\n'+s)})"
  EXPECT: REGRESSION SEO PASS
  EVIDENCE: pending

- [ ] M5: 合并后线上回读:同一套手机检查对线上预览站通过
  EVIDENCE: pending
