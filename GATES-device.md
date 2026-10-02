# Gates: 真机问题修复 + 首页视频手机自动播 + 卷类招牌卡(2026-10-02)

OWNS: components/Ico.tsx, seo/check-device-safe.mjs, components/HomeFilm.tsx, public/video/zen-film-0925-m.mp4, GATES-device.md

Scope: 毛用 iPhone 看预览站发现三件事(箭头/星标变成彩色 emoji、视频不自动播)+ 同一张截图里「MENU」按钮字是蓝的;同批上线三个卷分区的招牌卡。

- [x] D1: 上线文件里没有会被手机换成 emoji/方块的符号字符;全站每个按钮都有明确的文字颜色(电脑 + 手机两种宽度、10 个页面)
  CHECK: node seo/check-device-safe.mjs
  EXPECT: DEVICE-SAFE PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=cc00940ad4cd8835ee5dc641eb505daa8714c29c8f94f92facd719987a2253ed; output-bytes=91

- [x] D2: 检查能报红:放回一个 ↗、去掉 button{color:inherit},各自必须失败
  EVIDENCE: 2026-10-02 ①把 Intro.tsx 的图标换回字符「↗」→ DEVICE-SAFE FAIL「符号字符 ↗(U+2197)出现在 1 个上线文件里」;②去掉 button{color:inherit} → FAIL x10+(每页「MENU」按钮、相册 11 个图片按钮没写文字颜色)——这也证实了毛截图里「MENU」变蓝的原因(.nav-toggle 没写颜色)。第一次做②时检查没变红:探针样式是用 init script 注入的,实际没生效;改成加载后插到 <head> 最前面并加 zz-probe 自检后才变红。视频断言的对照:把 preload 改成 auto 且恢复「触屏不自动播」→ MOBILE FAIL x3(没滑到就下载 / 滑到没自动播 / 没用轻量版)。全部还原后 PASS。

- [x] D3: 招牌卡:三个卷分区各一张,电脑=2:1 大图在左、菜名/说明/价格在右;手机=整行大图、字在下;图不会被图框裁掉;菜名对
  CHECK: node seo/check-menu-photos.mjs render
  EXPECT: MENU-PHOTOS-RENDER PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=732bb664d0a785318bca7649e4f1c98fd1ffcd872f62fe3a96da70e3c24686f0; output-bytes=493

- [x] D4: 手机 4 种配置全站通过,其中首页视频:没滑到不下载、滑到自动静音播、手机用轻量版、点按钮带声音、开「减少动态效果」不自动播
  CHECK: node seo/check-mobile.mjs
  EXPECT: MOBILE PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=63009e9d298ab06b1ad013a5ab197cf8846e2bd1da2188236d3f64c1740bd5f8; output-bytes=537

- [x] D5: 不退步:SEO 四项、链接审计、菜单图数据
  CHECK: (npm run seo; node seo/check-links.mjs; node seo/check-menu-photos.mjs data) 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const ok=['MAPPING PASS','META PASS','ALT PASS','PAGES PASS','LINKS PASS','MENU-PHOTOS-DATA PASS'].every(k=>s.includes(k));console.log(ok?'REGRESSION PASS':'REGRESSION FAIL\n'+s)})"
  EXPECT: REGRESSION PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=6ffb5de8a8d9789798c211c8ad703f997d7f0f6fc201d639b192107059c39448; output-bytes=16

- [x] D6: 独立冷眼审稿(只看截图):招牌卡与新图标,P1/P2 处理完
  EVIDENCE: 2026-10-02 两轮,每轮新开审稿员、只给截图,均无 P1、无 emoji/缺字方块。第 1 轮 P2 六条全部处理:Special Roll 的招牌卡与列表第一行重复(→ 卡片写全说明与双价,列表不再重复那一行)、卡片只有一个没标注的价格(→ 现金价/刷卡价都标)、手机上菜名贴着图(→ 样式优先级修正,间距 14px)、Sweetheart 盘子太满(→ 缩小)、CLOSE 的 × 太小(→ 画的图标)、下拉展开后箭头仍朝下(→ 展开时翻转)。第 2 轮 P2 一条:手机卡片价格是「$ 在前、标签在后」而列表相反 → 改成同一顺序;P3 处理了分隔线、图标线条加粗、Sweetheart 回调大小。未处理(说明):电话后面的小红箭头、PDF 链接箭头在下划线外——都是原有设计,不在本次范围。

- [x] D7: 合并后线上回读:同一套检查对预览站通过;手机轻量版视频线上能分段请求(206)
  EVIDENCE: 2026-10-02 PR #11 合并(cf0054f)后约 50 秒线上更新。回读:首页 HTML 里有内联图标(class="ico ico-ne"),首页与菜单页已无任何符号字符;/video/zen-film-0925-m.mp4 带 Range 请求返回 206 + accept-ranges + content-range …/5385574。对 https://zen-ramen.vercel.app 重跑:DEVICE-SAFE PASS、MENU-PHOTOS-RENDER PASS、MENU-MOTION PASS、LINKS PASS、CTA 八项全部 PASS、MOBILE PASS(4 种手机配置 × 10 页,含视频「没滑到不下载 / 滑到自动静音播 / 用轻量版 / 点按钮带声音」)。真机 iPhone/安卓的最终确认需要毛本人看(本机没有系统模拟器)。
