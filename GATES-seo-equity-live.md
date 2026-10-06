# Gates: 旧站 SEO 积累承接 · 上线后验收(2026-10-06)

OWNS: GATES-seo-equity-live.md

Scope: `GATES-seo-equity.md` 的改动合并并发布后,对 https://zenramensushiny.com 的真实验收。**上线前不要跑**;每项内部都是慢速逐条请求(2026-10-06 并发检查曾触发 Vercel 自动防护),整套约 5 分钟,不要并行跑、不要连跑多遍。

- [ ] L1: 线上逐条:有积累的旧网址全部被接住(同 E1,真实请求、逐条跟跳转;并到旧站现查「旧站已删」的豁免)
  CHECK: sh -c 'CTA_BASE=https://zenramensushiny.com node seo/check-equity.mjs'
  EXPECT: EQUITY-CHECK PASS (https://zenramensushiny.com)
  EVIDENCE: pending

- [ ] L2: 线上逐篇:搬回来的文章(同 E2 的页面检查,对线上)
  CHECK: sh -c 'CTA_BASE=https://zenramensushiny.com node seo/check-journal.mjs'
  EXPECT: JOURNAL-CHECK PASS (https://zenramensushiny.com)
  EVIDENCE: pending

- [ ] L3: 线上:切换验收、统计与第三方代码仍然全过
  CHECK: sh -c 'node seo/check-cutover.mjs --host zenramensushiny.com && GA_BASE=https://zenramensushiny.com node seo/check-ga4.mjs'
  EXPECT: GA4-CHECK PASS
  EVIDENCE: pending

- [ ] L4: Google 能抓到新内容:Search Console 对首页与一篇搬回的文章做实时测试 = 可收录;新 sitemap 重新提交并读到「固定页 + 文章数」条
  EVIDENCE: pending

- [ ] L5: 网站对普通访客可用:Vercel 自动防护的人机验证已解除(不带浏览器的普通请求首页返回 200,而不是 403 challenge)
  CHECK: sh -c 'curl -s -o /dev/null -D - https://zenramensushiny.com/ | head -1'
  EXPECT: HTTP/2 200
  EVIDENCE: pending
