# Gates: 首页与全站转化(CTA)优化 · 对比旧站后的改造(2026-10-01)

OWNS: components/HomeFilm.tsx, components/OpenStatus.tsx, components/CtaBand.tsx, components/CtaTracker.tsx, components/Header.tsx, components/Shared.tsx, components/Intro.tsx, lib/open-status.ts, app/page.tsx, app/menu/page.tsx, app/layout.tsx, app/globals.css, seo/check-cta.mjs, scripts/test-open-status.mjs, GATES-cta.md

Scope: 把「订餐/订位/打电话/导航」做成全站显眼、可测量的 CTA:首屏主按钮改为 ORDER ONLINE(直连 Toast)、手机首屏露出菜品照片、页尾 CTA 条、菜单页顶部订餐入口、营业状态、GA4 点击事件;不拖慢站点、不破坏已有门。

- [x] C1: 桌面首屏(1440×900)内:ORDER ONLINE(红色主按钮、第一个、指向 Toast 直订)、RESERVE、电话、导航、菜单 全部可见且按钮 ≥44px 高
  CHECK: node seo/check-cta.mjs hero-desktop
  EXPECT: CTA-HERO-DESKTOP PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=279368e5a39657334dae4074b05a1505c5f8ee1200a706ccdaf06a72d15d1490; output-bytes=22

- [x] C2: 手机首屏(390×844 与 360×740):菜品照片露出 ≥140px,且 ORDER ONLINE 与 RESERVE 都在底部固定栏之上(不被挡)
  CHECK: node seo/check-cta.mjs hero-mobile
  EXPECT: CTA-HERO-MOBILE PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=d6729538c65a652351526c9cd581df8f02e0c3baaed9ebd142ade442e13ad19a; output-bytes=21

- [x] C3: 全站 8 个页面页头都有「ORDER ONLINE」、Toast 直订链接 ≥2 处;7 个内容页有页尾 CTA 条;首页与菜单页的关键 CTA 都带 data-cta 标记
  CHECK: node seo/check-cta.mjs pages
  EXPECT: CTA-PAGES PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=d1a10b5022ecec56bc1b2ad6fb0ff9c191940762b63dc53e82d28b15e8ee1fc8; output-bytes=15

- [x] C4: 营业状态(开/关/几点关/几点开)逻辑 11 例全对,且负向对照能报红
  CHECK: node scripts/test-open-status.mjs
  EXPECT: OPEN-STATUS PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=6eb4ea09b48ccd946547cf50bf6ec161dec8d6534760c64b42abaabe255e9a27; output-bytes=41

- [x] C5: 浏览器实测营业状态:周一中午=OPEN NOW·UNTIL 11 PM;周一 23:30=CLOSED·OPENS TOMORROW 11:30 AM;周四 23:30=OPEN NOW·UNTIL 12 AM
  CHECK: node seo/check-cta.mjs status
  EXPECT: CTA-STATUS PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=d0b4dc9cec6d1f61ea227b6f763e19dc2db44380b8dbfe5fef8c441fcda2757c; output-bytes=16

- [x] C6: 点击事件:没装 GA 时点击不报错;装了之后 cta_click / click_to_call / get_directions 都带 cta_location 发出
  CHECK: node seo/check-cta.mjs tracking
  EXPECT: CTA-TRACKING PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=28fe59c3eb93b83fff294fd4d7f15f7f08ab9240ceee3d32a18c3381e99e5e82; output-bytes=18

- [x] C7: 5 种屏宽(320/390/768/1024/1440)× 3 个页面无横向溢出、CTA 不超出屏幕
  CHECK: node seo/check-cta.mjs overflow
  EXPECT: CTA-OVERFLOW PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=d02fa9d22d0a2887bc3e325643cd7cbfee851d3d255a1f36f93a5cc8f3df9ecb; output-bytes=18

- [x] C8: 不拖慢:JS+CSS 总量 ≤ 改前基线 843,358 B 的 105%
  CHECK: node seo/check-cta.mjs perf
  EXPECT: CTA-PERF PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=d92fcce0730f448569b17292827204a15a3022c3b66d0b5bcea92e3e2e59d45e; output-bytes=63

- [x] C9: 旧有 SEO 验收门全部仍绿(301 映射/标题描述/alt/钱页)
  CHECK: npm run seo 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const ok=['MAPPING PASS','META PASS','ALT PASS','PAGES PASS'].every(k=>s.includes(k));console.log(ok?'SEO GATES PASS':'SEO GATES FAIL\n'+s)})"
  EXPECT: SEO GATES PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=62bb6405e1d71f1913cd56dc7b864e5111347aa7e550362ead62db9f1356dbdd; output-bytes=15

- [x] C10: 类型检查通过
  CHECK: npm run typecheck 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(/error TS/.test(s)?'TYPECHECK FAIL\n'+s:'TYPECHECK PASS'))"
  EXPECT: TYPECHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=17bf6131bbbef7fdab68acaa8c1fce8ebb81f3b1f2cc8c9fce5c38f05621300a; output-bytes=15

- [ ] C11: 上线后回读:线上首页桌面/手机截图里首屏能看到 ORDER ONLINE 主按钮;线上点击记录正常;并核对 CI 与 Playwright 8 条测试
  EVIDENCE: pending
