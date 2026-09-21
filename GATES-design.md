# GATES — 设计遗留 7 条 + 冷眼复审修复

- [x] D1: 菜单页 HH tab 顶部有全场一价横幅
  CHECK: node -e "const h=require('fs').readFileSync('out/menu/index.html','utf8'); console.log(h.includes('EVERYTHING')&&h.includes('hh-banner')?'D1 PASS':'D1 FAIL')"
  EXPECT: D1 PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=93843a6463da5f9038f4e2bbaf53e7b686777a513656d841defe9d1e3daf9b78; output-bytes=8
- [x] D2: Lightbox 图片切换有淡入过渡
  CHECK: node -e "const c=require('fs').readFileSync('app/globals.css','utf8'),g=require('fs').readFileSync('components/Gallery.tsx','utf8'); console.log(c.includes('lb-fade')&&g.includes('key={selected}')?'D2 PASS':'D2 FAIL')"
  EXPECT: D2 PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=db7faceabc5f6989f23bb9eea8cee9d5504160be54c8cccd6df03adf4e596628; output-bytes=8
- [x] D3: Events 页表单标题降级(不再双主标)
  CHECK: node -e "const h=require('fs').readFileSync('out/events-catering/index.html','utf8'); console.log(h.includes('form-title')?'D3 PASS':'D3 FAIL')"
  EXPECT: D3 PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=a62bce359c925825ed16898c4b689209e59d37c9ea403e20c230f4f94874fcea; output-bytes=8
- [x] D4: 手机(390x844)首屏 hero 食物图可见高度 ≥120px
  CHECK: node seo/check-mobile-hero.mjs
  EXPECT: MHERO PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=76badd3869ad149537361194342f36e99f2df1069b57426efb210f43e5bb10f3; output-bytes=17
- [x] D5: CASH/CARD 列头化——桌面产物中行内 small 标被 CSS 隐藏且每分区有一个列头
  CHECK: node -e "const c=require('fs').readFileSync('app/globals.css','utf8'),h=require('fs').readFileSync('out/menu/index.html','utf8'); const heads=(h.match(/price-cols/g)||[]).length; console.log(c.includes('.food-prices small{display:none')&&heads>=44?'D5 PASS heads='+heads:'D5 FAIL heads='+heads)"
  EXPECT: D5 PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=8aae5569aef66a35811dcd29c7f185721dca8c654573514b0309b7c0716862e9; output-bytes=17
- [ ] D6: 视频三处——素材依赖店方实拍,本 session 无法自产
- [x] D7: 菜单长列表懒渲染(content-visibility)且 768px 无溢出(由 Playwright 断言)
  CHECK: node -e "const c=require('fs').readFileSync('app/globals.css','utf8'); console.log(c.includes('content-visibility:auto')?'D7 PASS':'D7 FAIL')"
  EXPECT: D7 PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=a1b539a34ea589f921e65fd34ddf2308070fb7423752d5feb939a077497f764e; output-bytes=8
- [x] D8: 构建+8项测试+SEO四检全绿
  CHECK: npm test 2>&1 | tail -1
  EXPECT: 8 passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=08a09681b1f4/35 entries; EXPECT=matched; output-sha256=d5a820007cb488bafc1081262da31418067b6746426d4f44f94cbc6101c3792e; output-bytes=18

ABANDON: D6 视频素材只能来自店方实拍(生成视频违背真实性红线),已列入交毛的素材需求单,插槽代码就绪(galleryVideo 填值即上线)
