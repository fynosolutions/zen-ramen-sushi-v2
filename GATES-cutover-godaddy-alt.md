# Gates: 域名切换 · GoDaddy 主机备用路线（2026-10-03 写，**未启用**）

OWNS: GATES-cutover-godaddy-alt.md

Scope: 2026-10-05 毛改回「网站全部 deploy 在 Vercel、GoDaddy 只当域名注册商」，本账本是原先「放老板的 GoDaddy cPanel 主机」路线的执行阶段门，**保留备用**（以后网站要交还老板、搬去 GoDaddy 主机时启用）。这些门现在是红的，是对的——没启用，不代表出了问题。启用前先把 `HOST_IP`（主机地址）设成环境变量。

## 执行阶段（切换前的 6 项门 + 切换后验收；**全绿才许切**）

- [ ] E1: 老板书面同意买 GoDaddy cPanel 主机(Deluxe)并付款;记下谁、何时、多少钱
  EVIDENCE: pending

- [ ] E2: 毛已重置 GoDaddy 登录密码,agent 能登录并进入该域名的 DNS 编辑页(只读)
  EVIDENCE: pending

- [ ] E3: 根域 A 与 www 的生效等待时间已降到 600 秒并实测
  CHECK: node seo/dns-check.mjs ttl --max 600
  EXPECT: DNS-TTL PASS
  EVIDENCE: pending

- [x] E4: 买主机之后、切换之前,DNS 与基线快照逐条一致(开通向导没改任何记录)
  CHECK: node seo/dns-check.mjs compare seo/baseline-T-1/dns-snapshot.json
  EXPECT: DNS-COMPARE PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/apple/Desktop/Orca/zen-ramen-cutover; path=b23d0ac203a6/32 entries; EXPECT=matched; output-sha256=a0fc10c93b2a7b8c25c2cea02480dfe5cca38c3c84275a0a6dc7be74c6bcafaa; output-bytes=55

- [ ] E5: 证书同时覆盖根域和 www、证书链完整、剩余 ≥60 天(用主机地址测:HOST_IP=主机地址)
  CHECK: sh -c '[ -n "$HOST_IP" ] && node seo/check-cutover.mjs --host zenramensushiny.com --ip "$HOST_IP" --only-cert'
  EXPECT: CERT-CHECK PASS
  EVIDENCE: pending

- [ ] E6: 用主机地址彩排全过(HOST_IP=主机地址;不动线上域名)
  CHECK: sh -c '[ -n "$HOST_IP" ] && node seo/check-cutover.mjs --host zenramensushiny.com --ip "$HOST_IP"'
  EXPECT: CUTOVER-CHECK PASS
  EVIDENCE: pending

- [ ] E7: 切换后线上正式域名全套验收通过(切换日才勾)
  CHECK: node seo/check-cutover.mjs --host zenramensushiny.com
  EXPECT: CUTOVER-CHECK PASS
  EVIDENCE: pending

- [ ] E8: 切换后邮箱与其余记录没变:`node seo/dns-check.mjs compare --flipped` PASS(只有根域 A 变化)+ 测试邮件到店里邮箱能收到(切换日才勾)
  EVIDENCE: pending
