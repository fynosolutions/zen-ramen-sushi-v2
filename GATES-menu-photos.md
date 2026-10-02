# Gates: 菜单单品图 = 真实参考重拍的透明菜品图 + 轻微动效(2026-10-01 起,10-02 改版)

OWNS: content/featured.ts, content/photo-sources.json, components/MenuBrowser.tsx, components/DishMotion.tsx, app/menu/page.tsx, app/globals.css, public/images/dish-*.webp, seo/check-menu-photos.mjs, seo/check-menu-motion.mjs, docs/design-references.md, docs/menu-dish-images.md, GATES-menu-photos.md

Scope: 菜单页的 27 张菜品图 = 以真实顾客照片或店家旧拍摄为参考、「同一道菜只改拍摄质量」重拍的透明背景图,每张只出现在它拍的那道菜上;图上加轻微动效(悬浮、移上放大),不改结构、不遮挡文字与下单。

- [x] M1: 数据对:每个配图条目的分区/菜品都存在;每张菜品透明图有来源台账、只挂在台账允许的菜品上;文件是 ≥1000 的方图、有透明通道、菜离画布边 ≥5%、≤250KB;共 27 张都被使用,且每个分区的张数是 3 的倍数
  CHECK: node seo/check-menu-photos.mjs data 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(s.includes('MENU-PHOTOS-DATA PASS')?'MENU-PHOTOS-DATA PASS':s))"
  EXPECT: MENU-PHOTOS-DATA PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=69962908fed6cfb69f211cdca41fd56dcca43ff11b10c8dc001b7b2fe850554a; output-bytes=22

- [x] M2: 渲染对:电脑与手机上,午市页有 ≥9 张、晚市页有 ≥24 张图真的显示(已加载、宽度≥1000)、图注正确(Katsu Bento Box / Shrimp Teriyaki Bento Box / Sashimi Bento Box / Gyu Don / Salmon Lunch — Sushi / Eel Lunch — Sushi)、无横向溢出
  CHECK: node seo/check-menu-photos.mjs render
  EXPECT: MENU-PHOTOS-RENDER PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=42275967a3ac7a9c5f3f1a5dd1b9517f49802a49d82585e4608fdf444594ad3d; output-bytes=492

- [x] M3: 全站图片亮度闸通过(平均亮度≥100、近黑≤18%)
  CHECK: npm run photos 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(s.includes('PHOTO GATE PASS')?'MENU PHOTO GATE PASS':'PHOTO GATE FAIL\n'+s))"
  EXPECT: MENU PHOTO GATE PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=9ae590e8c502e916fc5c1cdbfb2d94a17eb020c3b4ae134a06f7b4462e76cea1; output-bytes=21

- [x] M4: 原有检查不退步:SEO 四门、类型检查、CTA 十三门
  CHECK: npm run seo 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const ok=['MAPPING PASS','META PASS','ALT PASS','PAGES PASS'].every(k=>s.includes(k));console.log(ok?'REGRESSION SEO PASS':'REGRESSION SEO FAIL\n'+s)})"
  EXPECT: REGRESSION SEO PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=a65dce097bbcd0c418bfe200a600da772466b6dc53f228dbb2530391ea6a0f4b; output-bytes=20

- [x] M5: 上线后回读:线上午市页/晚市页肉眼检查配图与菜名一一对得上,线上版同一套 render 检查通过
  EVIDENCE: 2026-10-02 PR #7 合并(b3fa… 后)约 40 秒线上更新;对 https://zen-ramen.vercel.app 跑 check-menu-photos.mjs render=PASS(电脑+手机,午市≥6/晚市≥17 张已加载、图注正确、无溢出),拉面区三碗(Tonkotsu / Grill Chicken Yuzu Ramen / Vegetables Ramen)肉眼复核;负向对照:改前线上版 render 与 motion 检查均 FAIL、把 Takoyaki 图挂到 Karaage 上 data 检查 FAIL

- [x] M6: 动效不扰人:看得见的菜品图才悬浮(屏幕外的不跑、同时 ≤12 个);鼠标移上放大 7% 且仍在格子内、图注没被盖、版面不跳;移开恢复;开了「减少动态效果」全停;触屏不触发悬停放大、无溢出;菜单页顶部 ORDER ONLINE 没被挡
  CHECK: node seo/check-menu-motion.mjs
  EXPECT: MENU-MOTION PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=d19f9eeb04bf61604214a8763847c39ff3f2016b2cfc5fff4adeb31a1956cfad; output-bytes=17

- [x] M7: 上线后回读:线上菜单页菜品图与动效检查通过(渲染+动效),肉眼看午市/晚市几排
  EVIDENCE: 2026-10-02 对线上跑 check-menu-motion.mjs=PASS(悬浮只在可见时、移上放大 7%、不盖图注、版面不跳、减少动态效果全停、触屏无悬停、ORDER ONLINE 不被挡);负向对照:线上旧版 FAIL;注意「减少动态效果」另有全局 !important 兜底,单去掉本规则的包裹不会变红

<!-- 2026-10-02 PR #8 合并后线上复测:render PASS(午市≥7/晚市≥18,图注含 D. Sashimi (5 pcs))、motion PASS;午市 Bento 三张(I. Shrimp Teriyaki / Katsu Bento Box / D. Sashimi (5 pcs))肉眼复核。 -->
