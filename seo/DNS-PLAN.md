# zenramensushiny.com · DNS 切换方案（2026-09-23 实地勘测）

> 勘测方式：whois + dig 公开查询，**未登录任何后台**。GoDaddy 凭据仍缺（见文末）。

## 一、现状（已核实）

| 项 | 值 | 含义 |
|---|---|---|
| 注册商 | **GoDaddy.com, LLC** | 与毛所述一致 |
| 注册日 | 2023-03-30 | |
| 域名锁 | clientTransfer/Update/Renew/Delete **Prohibited** | 防劫持,正常状态。**不影响改 DNS 记录**,只影响转移注册商 |
| Nameserver | **ns19 / ns20.domaincontrol.com** | = GoDaddy 自家 DNS。**DNS 在 GoDaddy 面板里改** |
| A 记录 | 192.0.78.24 / .25 | = **WordPress.com (Automattic)**,印证旧站是 WP.com 托管 |
| www | CNAME → 根域 | |
| **MX** | **0 → Microsoft 365** · 10/20 → titan.email | 🔴 **域名上有公司邮箱在用** |
| TXT | SPF(titan) + MS365 域验证 | 🔴 同上 |

## 二、🔴 最重要的一条：**绝不能改 Nameserver**

切换网站有两种做法,这里**只有一种是安全的**：

| 做法 | 后果 |
|---|---|
| ❌ 把 NS 改成 Vercel 的 nameserver | DNS 整体托管权转走 → **MX 和 SPF 一并失效 → info@zenramensushiny.com 立即收不到邮件**。店家业务邮件中断,且排查困难 |
| ✅ **保持 NS 在 GoDaddy,只改 A / CNAME 两条记录** | 网站指向新站,邮件记录原样不动,零风险 |

**结论：切换只动两条记录,其余一律不碰。**

## 三、切换日要改的记录（精确值）

在 GoDaddy → 域名 → DNS 管理里：

| 操作 | 类型 | 名称 | 原值 | 新值 |
|---|---|---|---|---|
| 改 | A | `@` | 192.0.78.24 | **76.76.21.21** |
| 删 | A | `@` | 192.0.78.25 | （删除这条多余的） |
| 改 | CNAME | `www` | zenramensushiny.com | **cname.vercel-dns.com** |

**一律不碰**：所有 MX、所有 TXT（SPF/MS365 验证）、任何 titan/outlook 相关记录。

TTL 建议：切换**前一天**先把这两条的 TTL 调到 600 秒(10分钟),切换当天生效快、回滚也快;稳定两周后再调回 1 小时。

## 四、回滚（5 分钟内）

把上表「新值」改回「原值」即可。所以切换前必须先把原值抄下来存档——**本文件第一节就是存档**。

## 五、Vercel 侧配套（我来做,不需要毛）

1. Vercel 项目 zen-ramen → Settings → Domains → 添加 `zenramensushiny.com` 与 `www.zenramensushiny.com`
2. Vercel 会自动签发 SSL(DNS 生效后约 1 分钟)
3. 摘掉 noindex：环境变量 `NEXT_PUBLIC_SITE_INDEXABLE=true` 后重新部署

## 六、仍缺（只有毛能给）

- **GoDaddy 登录凭据**（账号疑似 jaye.mao@fynosolutions.com,密码未知;若开了两步验证还需验证码）
  - 已确认本机**无**GoDaddy 会话、钥匙串无记录、密钥文件无记录
  - 替代方案：GoDaddy 支持创建 **API Key**（Developer Portal → API Keys,Production 环境），
    把 key+secret 给我即可全自动改记录,不必交账号密码。**推荐走这条。**

## 七、顺带发现的问题（不阻塞切换,建议告知店家）

MX 同时挂了 Microsoft 365(优先级0) 和 titan.email(10/20) 两套邮件系统。
正常情况一个域名只该用一套。当前配置下邮件优先投 MS365,titan 只在 MS365 不可达时兜底——
很可能是历史迁移没清干净。**不影响网站切换**,但店家如果反馈"有些邮件收不到",根因在这里。
