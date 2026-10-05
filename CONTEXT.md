# CONTEXT — 024 Zen Ramen 官网

## 术语

- **旧站**：WordPress.com 上的原官网。切换后仍保留在 WordPress.com，用于回滚。
- **新站**：Fyno 在 Vercel 上搭的新官网，本仓库即其源码。
- **临时地址**：`zen-ramen.vercel.app`，新站在切换前的预览地址。**2026-10-05 起已在 Vercel 项目域名设置里设成 308 跳转到正式域名**（逐页带路径和参数）。
- **正式域名**：`zenramensushiny.com`，客户所有，注册与 DNS 都在客户的 GoDaddy。
- **切换**：只把正式域名的 A（根域）与 CNAME（www）两条记录从旧站改指新站。**不含**改 Nameserver、改邮件记录、转移注册商。
- **跳转（301）**：旧站网址 → 新站最相关页面的永久重定向，决定 SEO 得失。
- **回滚**：把那两条记录改回旧站的值，旧站即恢复。
- **真实点击**：Google Search Console 报告的点击；与之相对的「估算流量」（DataForSEO/SE Ranking）只看趋势、不做判断。
