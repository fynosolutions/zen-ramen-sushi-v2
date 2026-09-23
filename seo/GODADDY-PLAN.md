# GoDaddy 能做什么 · 网站搬家可行性 · 切换方案
> 2026-09-23 实测结论。**现阶段只做方案,不执行切换。**

## 一、GoDaddy 在这件事里能做三件事(别混为一谈)

| 能力 | 我们要用吗 | 说明 |
|---|---|---|
| ① **域名注册商** | ✅ 保持不变 | zenramensushiny.com 注册在 GoDaddy,2023-03-30 注册,四把安全锁已开。**不转移注册商** |
| ② **DNS 托管** | ✅ 保持不变,只改记录 | NS = ns19/ns20.domaincontrol.com(GoDaddy 自家)。切换只改 A + CNAME 两条 |
| ③ **网页主机** | ⏸️ 现在不用,未来可选 | 若客户坚持"全在 GoDaddy",我们的站**搬得过去**——已实测,见第三节 |

**当前状态**：网站临时托管在 Fyno 自己的 Vercel（我们的架子,客户不感知）。
域名与邮箱一直在客户的 GoDaddy,**我们一个字没动过**。

## 二、API 令牌现状(已办)

- 已在 `jaye.mao@fynosolutions.com` 名下生成 PAT：名称 `fyno-dns-automation`,有效期 1 年,
  权限**仅 Domains & DNS(11/11)**,商务/订单/客户全部 0。存于 `~/Desktop/.env.secrets`(600)。
- 实测：认证 ✅ HTTP 200 / 该账号名下域名 **0 个** / 读 zenramensushiny.com **403**。
- **结论：域名在客户自己的 GoDaddy 账号里。** 我们的令牌有效但够不着。
- **Delegate Access 已于 2026-09-23 接受**(Celina Lin → jaye.mao,级别 Products/Domains/Purchase)。
  🔴 **但实测:网页端授权 ≠ API 可用。** PAT 只对令牌所有者自己名下的域名生效:
  授权后 `/v1/domains/{域名}/records` 仍 403、`/v1/domains` 仍返回 0 个、
  `X-Shopper-Id` 代理调用(746584231 / 749378374)双双 403、`/v1/shoppers/subaccount` 401。
  **→ 切换日改 DNS 走网页端**(已有授权可登入客户账号操作),或给客户步骤单让他自己改两条。
  别再花时间试 API 代理调用。
- ⚠️ 该令牌明文经过聊天记录,切换完成后建议吊销重发。

## 三、🔑 搬家可行性：实测过了,能搬

**问题**：我们用 Next.js 建的站,万一以后要放到 GoDaddy 主机上,搬得动吗?跳转会不会丢?

**审计结论——这个站 95% 与主机无关**：
- `output: 'export'` 纯静态导出,产物就是一堆 HTML/CSS/JS/图片
- 无 API 路由、无服务端渲染、无中间件、无 Vercel 专有调用(已 grep 确认)
- **唯一绑死 Vercel 的是 vercel.json 里的 153 条 301 跳转**——而它们扛着全部 SEO 迁移价值

**解决方案(已落地)**：`scripts/gen-host-configs.mjs` 从 vercel.json 这一份真相源,
自动生成四家主机的等效配置：

| 产物 | 适用主机 |
|---|---|
| `.htaccess` | **Apache —— GoDaddy cPanel/Linux 主机**、多数虚拟主机 |
| `web.config` | IIS —— GoDaddy Plesk/Windows 主机 |
| `_redirects` | Netlify / Cloudflare Pages |
| `nginx-redirects.conf` | nginx —— 自建/VPS |

**实测取证(2026-09-23)**：本机起真 Apache 2.4.62,加载生成的 `.htaccess`,
把 153 条旧 URL 逐条打了一遍 → **156/156 行为与 Vercel 完全一致**(`seo/check-portability.mjs`)。
测试器官先用坏配置做过负向对照(报 500),证明它真的在读配置、不是假绿。

> ⚠️ **唯一不兼容的是 GoDaddy Website Builder**(拖拽建站产品)——那是封闭平台,
> 传不了自定义 HTML,搬过去等于重做。要搬只能搬到 GoDaddy 的 **cPanel/Linux 主机**(支持 .htaccess)。

## 四、未来切换的完整动作(等网站定稿后执行)

**前置**(客户侧,毛去要)
1. Delegate Access 授权给 jaye.mao@fynosolutions.com
2. Google Search Console 验证权(拿到域名权限后我可自助完成)
3. 供应商四问答案(停约不能与切换同期,见 CUTOVER-CHECKLIST)

**切换日**(我执行,全程可回滚)
1. Vercel 项目绑定 zenramensushiny.com + www
2. GoDaddy DNS 改两条：`A @ → 76.76.21.21`、`CNAME www → cname.vercel-dns.com`
   🔴 **MX / TXT 一律不动**(域名上挂着 Microsoft365 + titan 邮箱,动 NS 会断信)
3. 摘 noindex → 重新部署
4. Search Console 提交新 sitemap
5. `node seo/watch.mjs --live` 验 301 + 首页 + sitemap

**回滚**：把两条记录改回 `A 192.0.78.24/.25`、`CNAME www → zenramensushiny.com`,5 分钟生效。

**盯梢**：每周 `node seo/watch.mjs --live`,排名词较 570 基线掉超 20% 即查 301。

## 五、如果客户以后要求"网站也放 GoDaddy"

1. 确认是 **cPanel/Linux 主机**(不是 Website Builder)
2. `npm run build` → 得到 `out/`
3. `node scripts/gen-host-configs.mjs` → 把 `.htaccess` 放进 `out/`
4. 整个 `out/` 目录 FTP/文件管理器上传到 `public_html/`
5. 跑 `seo/check-portability.mjs`(改 BASE 指向线上)验 153 条跳转
6. DNS 的 A 记录改成 GoDaddy 主机 IP 即可,同样不碰 MX

**代价**：失去 Vercel 的自动部署(以后每次改动要手动上传)和全球 CDN。
**建议**：除非客户强烈要求统一账单,否则维持"域名在 GoDaddy + 网站在 Vercel"——
这是行业常规做法,客户照样完整拥有域名。
