# Gates: 旧站 SEO 积累承接 · 上线后验收(2026-10-06)

OWNS: GATES-seo-equity-live.md

Scope: `GATES-seo-equity.md` 的改动合并并发布后,对 https://zenramensushiny.com 的真实验收。**上线前不要跑**;每项内部都是慢速逐条请求(2026-10-06 并发检查曾触发 Vercel 自动防护),整套约 5 分钟,不要并行跑、不要连跑多遍。

- [x] L1: 线上逐条:有积累的旧网址全部被接住(同 E1,真实请求、逐条跟跳转;并到旧站现查「旧站已删」的豁免)
  CHECK: sh -c 'CTA_BASE=https://zenramensushiny.com node seo/check-equity.mjs'
  EXPECT: EQUITY-CHECK PASS (https://zenramensushiny.com)
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=689da848cb9173fdd539b6c60d608d45ce6c684c3dc5af49b170140d7ff6521a; output-bytes=673

- [x] L2: 线上逐篇:搬回来的文章(同 E2 的页面检查,对线上)
  CHECK: sh -c 'CTA_BASE=https://zenramensushiny.com node seo/check-journal.mjs'
  EXPECT: JOURNAL-CHECK PASS (https://zenramensushiny.com)
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=0c68bbc88c7f1bd991b1b81841175ea8761e158e74caafe1290d8f4edddd6b32; output-bytes=147

- [x] L3: 线上:切换验收、统计与第三方代码仍然全过
  CHECK: sh -c 'node seo/check-cutover.mjs --host zenramensushiny.com && GA_BASE=https://zenramensushiny.com node seo/check-ga4.mjs'
  EXPECT: GA4-CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=3aab7298800605c48babeb500dfdb87ed65b75dbfedd445cdec9336d5de76619; output-bytes=2091

- [x] L4: Google 能抓到新内容:Search Console 对首页与搬回的文章做实时测试 = 可收录;新 sitemap 重新提交
  EVIDENCE: 2026-10-06 约 05:10 ET,Search Console(jaye.mao@fynosolutions.com,资源 https://zenramensushiny.com/)逐个做「网址检查 → TEST LIVE URL → REQUEST INDEXING」共 10 个网址:/、/menu/、/about/、/blog/、/location/、/lunch-specials/、/2026/06/18/tonkotsu-vs-shoyu…、/2026/01/15/affordable-sushi-lunch-special…、/2026/06/21/sushi-grade-fish…、/2026/06/10/tsukemen…。10 个的实时测试结果都是「URL is available to Google · Page can be indexed」,请求收录都返回「Indexing requested · URL was added to a priority crawl queue」。索引现状:除 /lunch-specials/(新网址,URL is unknown to Google)外其余 9 个都是「URL is on Google · Page is indexed」——即文章与 /location/、/blog/ 的旧索引条目在 10-05 的跳转期间没有掉。sitemap:/sitemap.xml 于 Oct 6 重新提交成功(提交后页面仍显示上次读取 Oct 5、10 页;Google 重读后应为 99 条——**未核实,10-07 回看**)。

- [x] L5: 网站对普通访客可用:Vercel 自动防护的人机验证已解除(不带浏览器的普通请求首页返回 200,而不是 403 challenge)
  CHECK: sh -c 'curl -s -o /dev/null -D - https://zenramensushiny.com/ | head -1'
  EXPECT: HTTP/2 200
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-sushi-v2; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=5295082f3441133caab3b2e0646a5080e1012d53643bd6405436b9c68148c94b; output-bytes=13
