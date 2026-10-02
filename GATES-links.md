# Gates: 全站按钮/链接审计(2026-10-02)

OWNS: seo/check-links.mjs, content/site.ts, app/page.tsx, components/CtaTracker.tsx, components/MenuBrowser.tsx, app/globals.css, package.json, GATES-links.md

Scope: 每个按钮「写的是什么」和「去哪」一致;内部链接都能打开;带 # 的链接真的落在对的菜单页签与区块;外部网址都是人工在真实浏览器核对过的;页签/下拉/地图切换/视频/相册/表单这些按钮真的做它写的事。

- [x] L1: 机器审计全过:824 条链接(电脑+手机,下拉与手机导航都展开)逐条按「文字→去向」规则判定;内部链接返回 200、PDF 是 PDF;外部网址只许出现已核对清单里的;所有 target=_blank 都带 noopener;带 # 的链接整页打开/同页换锚点都落在对的页签与区块;ORDER ONLINE 下拉四项与顺序;首页三张菜单卡进对的页签;页签/分类导航/LIVE MAP/视频/相册/IG 播放键/活动页表单(邮件发往 catering@、主题 Event inquiry)/404 页
  CHECK: node seo/check-links.mjs
  EXPECT: LINKS PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=3f11e6f40cca09897dd7be517e1779954634718baadcf9cda2a8b446df74b52b; output-bytes=550

- [x] L2: 每个外部网址都在真实浏览器里打开过并读到对的店(Toast/Resy/Uber Eats/DoorDash/Grubhub/Google 地图路线与地点页/Instagram),清单写在 check-links.mjs 的 VERIFIED(机器人请求会被 Cloudflare 拦,不能用 curl 代替)
  EVIDENCE: 2026-10-02 逐个在 Orca 真实浏览器打开核对:Toast https://www.toasttab.com/local/order/zen-ramen-sushi-takeout-150-w-36th-street → toast.app 页「Zen Ramen & Sushi - Takeout 150 W 36th street」(旧站用的 …/zen-ramen-sushi-takeout 返回 404);Resy → 「Zen Ramen & Sushi」Midtown 订位页;Uber Eats → 「Zen Ramen & Sushi」150 W 36th St;DoorDash → 「Zen Ramen Sushi」,页面结构化数据 streetAddress=150 West 36th Street;Grubhub → 「Zen Ramen and Sushi」150 W 36th St;Google 地图路线 → 终点 Zen Ramen & Sushi, 150 W 36th St, NY 10018;Google 评论链接 maps?cid=2710011137368693845 → 地点页「Zen Ramen & Sushi」(feature id 0x89c259ac084a6bc1:0x259be4c56c369c55);Instagram 账号 @zenramen_sushi(IG 需登录,各 reel 以「链接 id = 本地视频 id」一致为准);邮箱 info@/catering@ 与旧站页面里的一致

- [x] L3: 审计能报红:对改前线上版、把电话改错一位、把 ORDER ONLINE 指向 Resy,三种情况都必须失败
  EVIDENCE: 2026-10-02 三种负向对照均变红:①对改前线上版(评论按钮指向路线 + 菜单分区落点偏几千像素)LINKS FAIL x41;②菜单页电话改错一位 → 「(646) 870-7509」→ tel:…7500 FAIL;③关于页 ORDER ONLINE 指向 Resy → FAIL;还原后 LINKS PASS

- [x] L4: 不退步:SEO 四门、类型检查、CTA 十三门、菜单图七门、8 条 Playwright 测试
  CHECK: npm run seo 2>&1 | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const ok=['MAPPING PASS','META PASS','ALT PASS','PAGES PASS'].every(k=>s.includes(k));console.log(ok?'REGRESSION SEO PASS':'REGRESSION SEO FAIL\n'+s)})"
  EXPECT: REGRESSION SEO PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=a65dce097bbcd0c418bfe200a600da772466b6dc53f228dbb2530391ea6a0f4b; output-bytes=20

- [x] L5: 上线后回读:对线上预览站跑同一套审计通过
  EVIDENCE: 2026-10-02 PR #9 合并后约 40 秒线上更新;对 https://zen-ramen.vercel.app 跑 check-links.mjs=LINKS PASS(824 条链接、59 种文字→去向、外部 8 个已核对);同时线上跑 hero-desktop/hero-mobile/overflow/header-stable、菜单图 render、动效 均 PASS
