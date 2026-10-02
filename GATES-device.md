# Gates: 真机问题修复 + 首页视频手机自动播 + 卷类招牌卡(2026-10-02)

OWNS: components/Ico.tsx, seo/check-device-safe.mjs, components/HomeFilm.tsx, public/video/zen-film-0925-m.mp4, GATES-device.md

Scope: 毛用 iPhone 看预览站发现三件事(箭头/星标变成彩色 emoji、视频不自动播)+ 同一张截图里「MENU」按钮字是蓝的;同批上线三个卷分区的招牌卡。

- [ ] D1: 上线文件里没有会被手机换成 emoji/方块的符号字符;全站每个按钮都有明确的文字颜色(电脑 + 手机两种宽度、10 个页面)
  CHECK: node seo/check-device-safe.mjs
  EXPECT: DEVICE-SAFE PASS
  EVIDENCE: pending

- [ ] D2: 检查能报红:放回一个 ↗、去掉 button{color:inherit},各自必须失败
  EVIDENCE: pending

- [ ] D3: 招牌卡:三个卷分区各一张,电脑=2:1 大图在左、菜名/说明/价格在右;手机=整行大图、字在下;图不会被图框裁掉;菜名对
  CHECK: node seo/check-menu-photos.mjs render
  EXPECT: MENU-PHOTOS-RENDER PASS
  EVIDENCE: pending

- [ ] D4: 手机 4 种配置全站通过,其中首页视频:没滑到不下载、滑到自动静音播、手机用轻量版、点按钮带声音、开「减少动态效果」不自动播
  CHECK: node seo/check-mobile.mjs
  EXPECT: MOBILE PASS
  EVIDENCE: pending

- [ ] D5: 不退步:SEO 四项、链接审计、菜单图数据
  CHECK: (npm run seo; node seo/check-links.mjs; node seo/check-menu-photos.mjs data) 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const ok=['MAPPING PASS','META PASS','ALT PASS','PAGES PASS','LINKS PASS','MENU-PHOTOS-DATA PASS'].every(k=>s.includes(k));console.log(ok?'REGRESSION PASS':'REGRESSION FAIL\n'+s)})"
  EXPECT: REGRESSION PASS
  EVIDENCE: pending

- [ ] D6: 独立冷眼审稿(只看截图):招牌卡与新图标,P1/P2 处理完
  EVIDENCE: pending

- [ ] D7: 合并后线上回读:同一套检查对预览站通过;手机轻量版视频线上能分段请求(206)
  EVIDENCE: pending
