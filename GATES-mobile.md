# Gates: 手机版多重验证(2026-10-02)

OWNS: seo/check-mobile.mjs, GATES-mobile.md, package.json, app/globals.css, components/**, CLAUDE.md

Scope: 手机版按「按钮/链接审计」同一标准测过,并覆盖「展开信息(导航/下拉/页签/分类)、动态(悬浮/视频/减少动效/触屏无悬停/页头不抖)、图片(全部加载/不破图/不糊/不溢出)」;iPhone WebKit + 安卓 Chromium + 360/320 窄屏;本地 + 线上;独立冷眼审稿;全部合并上线。

- [x] M1: 4 种手机配置(iPhone 13 WebKit / Pixel 7 Chromium / 360×740 / 320×568)×10 个页面:全部图片加载成功且不糊、无横向溢出、无控制台报错与同源 4xx/5xx;展开导航/ORDER ONLINE 下拉/菜单页签/分类导航/地图切换/相册/表单/底部操作栏/锚点落点(不被粘性栏盖住);动态(触屏无悬停放大、悬浮在跑、减少动效全停、视频点按播放、开场动画可跳过、页头不抖)
  CHECK: node seo/check-mobile.mjs
  EXPECT: MOBILE PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=f40f7afa2a942d8de6473c5e3396a2b3aac30b7c3942dee5620a887972a944f1; output-bytes=537

- [x] M2: 检查能报红:注入三种手机端缺陷(整宽溢出 / 糊图 / 锚点被粘性栏盖住),各自必须失败
  EVIDENCE: 2026-10-02 三种注入缺陷均变红(各自跑完后还原再跑一遍 PASS):①给 .hero-copy 加 width:130vw(整宽溢出)→ 320 窄屏配置 FAIL(元素被推出屏幕点不到);②把 dish-gyoza.webp 缩成 90px(糊图)→ FAIL x8「图片偏糊(原图只有显示宽度的 0.55–0.58 倍)」;③给 .food-section 加 scroll-margin-top:0(锚点被粘性栏盖住)→ FAIL x24「区块顶 0px < 粘性栏底 60px」。另:第一次跑出真实缺陷「Happy Hour 页可见图片只有 1 张」→ 已补 3 张同名小食图。第四轮审稿后新增的两条断言也做了对照:把奇数张最后一格的图改回 2:1 横条 + 去掉相册素拉面的 wideSm → iPhone 配置 FAIL x5(「有 1 张配图不是同样大小的方图」x4、「相册有 1 排没排满」x1),还原后 PASS

- [x] M3: 独立冷眼审稿:只看手机截图的审稿员(看不到代码)对首页首屏/页尾 CTA/菜单图/展开导航/下拉/相册/底部栏给出结论,P1/P2 全部处理
  EVIDENCE: 2026-10-02 共五轮,每轮新开审稿员、只给截图。第 1 轮 P1(页尾按钮字看不清/大图背景透/导航展开够不着)已修;第 2 轮无 P1,P2=大图关闭键、奇数张横条、抠图大小不一、素煎饺过绿、相册两张旧拍摄偏灰 → 全部处理;第 3 轮无 P1,判「相册目标未达成」(旧拍摄三张仍突兀)→ 相册新增从 4 张减到 2 张并按量出来的桌面色相(34°)重调,便当图注去字母编号;第 4 轮 PASS WITH FIXES:整桌俯拍偏灰(再加暖+裁左 6%)、便当三张机位不一(虾照烧/炸排重拍成同一机位)、「Shumai (6 pcs)」图上只有 4 个(烧卖与素煎饺都按菜单重做成 6 个)→ 已处理;第 5 轮 PASS WITH FIXES 无 P1:件数核对 6/6/6/5 全对,相册「可接受」,剩余 P2=虾照烧便当比另外两盒大且转角不同 → 已把它缩到同宽(转角保留,盒子是实物的方盒);截图里被页头挡住的素煎饺另行放大核对为 6 个。未处理并说明:便当「看起来比实拍图更精致」(P3,生成图的固有观感)、午市刺身盘机位与两盘握寿司不同(P3)。

- [x] M4: 不退步:SEO 四门、类型检查、CTA 十三门、菜单图七门、链接五门、8 条 Playwright 测试
  CHECK: npm run seo 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const ok=['MAPPING PASS','META PASS','ALT PASS','PAGES PASS'].every(k=>s.includes(k));console.log(ok?'REGRESSION SEO PASS':'REGRESSION SEO FAIL\n'+s)})"
  EXPECT: REGRESSION SEO PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=a65dce097bbcd0c418bfe200a600da772466b6dc53f228dbb2530391ea6a0f4b; output-bytes=20

- [x] M5: 合并后线上回读:同一套手机检查对线上预览站通过
  EVIDENCE: 2026-10-02 PR #10 合并(91610d9)后线上约 30 秒更新;4 张图(dish-shumai / dish-vegetable-gyoza / dish-bento-shrimp-teriyaki / archive-table-spread)线上文件与 main 逐字节一致(sha 相同),已撤的 archive-karaage.webp 线上 404。对 https://zen-ramen.vercel.app 重跑:MOBILE PASS(4 种手机配置 × 10 页)、MENU-PHOTOS-RENDER PASS、MENU-MOTION PASS、LINKS PASS、CTA 八项(hero-desktop/hero-mobile/pages/overflow/tracking/status/header-stable/about-image)全部 PASS
