# Gates: 菜单单品图换成顾客实拍(2026-10-01)

OWNS: content/featured.ts, content/photo-sources.json, components/MenuBrowser.tsx, public/images/guest-*.webp, seo/check-menu-photos.mjs, docs/design-references.md, GATES-menu-photos.md

Scope: 午市/晚市菜单页补上 15 张真实菜品照片(顾客在 Google Maps 拍的,裁方图+轻度校色),每张只出现在它拍的那道菜上;不生成、不改菜。

- [x] M1: 数据对:每个配图条目的分区/菜品都存在;每张顾客实拍图有来源台账、只挂在台账允许的菜品上;文件是 ≥1000 的方图;共 15 张都被使用
  CHECK: node seo/check-menu-photos.mjs data 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(s.includes('MENU-PHOTOS-DATA PASS')?'MENU-PHOTOS-DATA PASS':s))"
  EXPECT: MENU-PHOTOS-DATA PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=69962908fed6cfb69f211cdca41fd56dcca43ff11b10c8dc001b7b2fe850554a; output-bytes=22

- [x] M2: 渲染对:电脑与手机上,午市页有 ≥6 张、晚市页有 ≥14 张图真的显示(已加载、宽度≥1000)、图注正确(Katsu Bento Box / I. Shrimp Teriyaki / Gyu Don)、无横向溢出
  CHECK: node seo/check-menu-photos.mjs render
  EXPECT: MENU-PHOTOS-RENDER PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=1bdf1b22a3ab7bc48a1ac2329ded33ff94419576a1a380aeb5f16749a81052fa; output-bytes=493

- [x] M3: 全站图片亮度闸通过(平均亮度≥100、近黑≤18%)
  CHECK: npm run photos 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(s.includes('PHOTO GATE PASS')?'MENU PHOTO GATE PASS':'PHOTO GATE FAIL\n'+s))"
  EXPECT: MENU PHOTO GATE PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=9ae590e8c502e916fc5c1cdbfb2d94a17eb020c3b4ae134a06f7b4462e76cea1; output-bytes=21

- [x] M4: 原有检查不退步:SEO 四门、类型检查、CTA 十三门
  CHECK: npm run seo 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const ok=['MAPPING PASS','META PASS','ALT PASS','PAGES PASS'].every(k=>s.includes(k));console.log(ok?'REGRESSION SEO PASS':'REGRESSION SEO FAIL\n'+s)})"
  EXPECT: REGRESSION SEO PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=a65dce097bbcd0c418bfe200a600da772466b6dc53f228dbb2530391ea6a0f4b; output-bytes=20

- [x] M5: 上线后回读:线上午市页/晚市页肉眼检查配图与菜名一一对得上,线上版同一套 render 检查通过
  EVIDENCE: 2026-10-01 PR #5 合并(b3a00f3)后约 24 秒线上更新;对 https://zen-ramen.vercel.app 跑 check-menu-photos.mjs render=PASS(电脑+手机,午市≥6/晚市≥14 张已加载、图注正确、无溢出);线上跑 hero-desktop/hero-mobile/overflow/header-stable 均 PASS;线上午市页肉眼复核 Sushi Bar 刺身午餐图与菜名一致;负向对照:改前线上版 render 检查 FAIL(无顾客图)、把 Takoyaki 图挂到 Karaage 上 data 检查 FAIL
