# 域名切换清单（zenramensushiny.com → 新站）

> 规矩：本清单按序执行,**第 0 步没绿,后面所有步骤禁止执行**。执行人在每步后填日期。

## 第 0 步 · 前置条件（全绿才许定切换日 T）
- [ ] Google Search Console 已验证、能看到旧站数据（现状:无权限,卡在毛向客户索取）
- [ ] GA4 访问权已到手
- [x] 注册商已查明 = **GoDaddy**（NS 也在 GoDaddy,ns19/ns20.domaincontrol.com）
- [ ] GoDaddy 登录凭据或 API Key 到手（**推荐要 API Key,不必交账号密码**——见 DNS-PLAN.md §6）
- [ ] 供应商四问有答案：是谁 / 月费 / 到期日 / cytd.ai 内容归属
- [ ] 新站已在 Vercel 生产项目部署且 `npm run seo` 全绿（CI 常态红绿灯）
- [ ] 摘除 noindex：部署环境变量 `NEXT_PUBLIC_SITE_INDEXABLE=true`

## 切换日 T
> ⚠️ **DNS 具体改法见 `seo/DNS-PLAN.md`——红线：只改 A 和 CNAME 两条,绝不改 Nameserver
> （域名上挂着 Microsoft365 + titan 的公司邮箱,改 NS 会直接中断收信）。**
1. 再存一次旧站 sitemap 快照（对照用）：`curl -s https://zenramensushiny.com/sitemap-1.xml > seo/old-sitemap-T.xml`
2. Vercel 项目 zen-ramen 绑定 zenramensushiny.com + www 两个域名
3. GoDaddy DNS：A `@` → 76.76.21.21（删掉多余的第二条 A）; CNAME `www` → cname.vercel-dns.com。MX/TXT 一律不动
4. 生效后立刻跑：`node seo/watch.mjs --live` —— 抽查 301、首页 200、sitemap 200
5. Search Console 提交新 sitemap：`https://zenramensushiny.com/sitemap.xml`

## 回滚方案（任何异常,5 分钟内执行）
- DNS 指回旧主机（记录切换前的 DNS 值在下方）
- 切换前 DNS 值：**A @ = 192.0.78.24 + 192.0.78.25 · CNAME www = zenramensushiny.com**（2026-09-23 实测存档,见 DNS-PLAN.md）

## T 之后
- 每周一跑 `node seo/watch.mjs --live`（连续 4 周）,结果贴给毛
- 排名词较 570 基线掉幅 >20% → 停下查 301,不加新改动
- **供应商停约决定 ≥ T+45 天**,且必须在排名稳定(连续两周不掉)之后
