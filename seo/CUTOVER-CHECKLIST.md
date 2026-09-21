# 域名切换清单（zenramensushiny.com → 新站）

> 规矩：本清单按序执行,**第 0 步没绿,后面所有步骤禁止执行**。执行人在每步后填日期。

## 第 0 步 · 前置条件（全绿才许定切换日 T）
- [ ] Google Search Console 已验证、能看到旧站数据（现状:无权限,卡在毛向客户索取）
- [ ] GA4 访问权已到手
- [ ] DNS/域名管理权已到手（切换和回滚都靠它）
- [ ] 供应商四问有答案：是谁 / 月费 / 到期日 / cytd.ai 内容归属
- [ ] 新站已在 Vercel 生产项目部署且 `npm run seo` 全绿（CI 常态红绿灯）
- [ ] 摘除 noindex：部署环境变量 `NEXT_PUBLIC_SITE_INDEXABLE=true`

## 切换日 T
1. 再存一次旧站 sitemap 快照（对照用）：`curl -s https://zenramensushiny.com/sitemap-1.xml > seo/old-sitemap-T.xml`
2. Vercel 项目绑定域名 zenramensushiny.com（含 www 变体 301 到裸域或反之,保持与旧站一致）
3. DNS 把域名指向 Vercel
4. 生效后立刻跑：`node seo/watch.mjs --live` —— 抽查 301、首页 200、sitemap 200
5. Search Console 提交新 sitemap：`https://zenramensushiny.com/sitemap.xml`

## 回滚方案（任何异常,5 分钟内执行）
- DNS 指回旧主机（记录切换前的 DNS 值在下方）
- 切换前 DNS 值：`__________________`（第 0 步完成时填写）

## T 之后
- 每周一跑 `node seo/watch.mjs --live`（连续 4 周）,结果贴给毛
- 排名词较 570 基线掉幅 >20% → 停下查 301,不加新改动
- **供应商停约决定 ≥ T+45 天**,且必须在排名稳定(连续两周不掉)之后
