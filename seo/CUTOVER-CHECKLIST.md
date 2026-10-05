# 域名切换总计划（zenramensushiny.com → 新站）

> **本文件是切换的唯一总计划。** 2026-09-27 首版；2026-10-03 曾按「放老板的 GoDaddy cPanel 主机」重写（该方案现收进**附录 A**，备用、未启用）；**2026-10-05 毛改回：网站全部 deploy 在 Vercel，GoDaddy 只当域名注册商/DNS**，本文 §5–§7、§9、§10 按实际执行改写。`DNS-PLAN.md`、`GODADDY-PLAN.md` 是背景资料。
> 验收账本：`GATES-cutover.md`（Vercel 路线的「执行阶段」V1–V10）；GoDaddy 备用路线的门在 `GATES-cutover-godaddy-alt.md`。
> ✅ **状态：2026-10-05 约 16:05 ET 已切换到 Vercel**（由 website-0c 会话执行，线上验收通过：`node seo/check-cutover.mjs --host zenramensushiny.com` 全 PASS）。**切换后的待办见 §10。**
> 工具（都在仓库里）：`seo/check-cutover.mjs`（全套验收，已按 Vercel 口径：永久跳转 301/308 都算、http www 允许两跳、带参数的跳转可保留原参数）· `seo/dns-check.mjs`（DNS 快照/比对/等待时间）· `seo/check-ga4.mjs`；备用路线工具 `scripts/build-for-host.mjs`、`scripts/apache-local.mjs`。

## 0. 这次切换到底改了什么

域名不变、邮箱不变、注册商不变。**只把"这个域名的网页由谁来提供"从旧的 WordPress.com 换到 Vercel（Fyno Solutions 团队，Pro）。域名仍注册、解析在老板的 GoDaddy 账号。**
所以：
- 外面所有写着 `zenramensushiny.com` 的地方（Google 商家、Yelp、IG 简介、广告）**不用改，自动指到新站**。
- 但**网站里面的页面变了**（旧站 179 个已知网址 → 新站 10 个收录页面），Google 要重新抓一遍、重新评估。**跳转（301）就是告诉 Google「旧页搬到了这里」**，这是整次切换里唯一决定 SEO 得失的东西。

## 1. 权限清单（2026-09-27 逐项实测）

| 系统 | 用途 | 状态 | 实测证据 |
|---|---|---|---|
| GoDaddy（客户 Celina Lin 账号，Delegate Access） | 改 A + CNAME 两条 | ✅ | 以 jaye.mao 登录 → Access now → 看到该域名全部 DNS 记录并有编辑按钮。登录要 6 位邮箱码，发到 jaye.mao 邮箱，本机脚本可自取 |
| Vercel（Fyno 团队，项目 zen-ramen） | 正式托管：绑域名、证书、环境变量、部署 | ✅ | `vercel project ls` 可见 zen-ramen，最新生产地址 = zenramensushiny.com |
| Google Search Console（网址前缀资源，jaye.mao） | 看数据、提交 sitemap、请求收录 | ✅ | 能读近 3 个月报表。新站已带旧站两段验证标签，切换后不会失效 |
| GA4 `G-JZD3SQCWMP` | 看新站访问 | ✅ | 已在线上生效 |
| Google 商家（管理员） | 核对网址字段 | ✅ | 网址字段 = `http://zenramensushiny.com/`（首页，不用改） |
| WordPress 后台（administrator） | 旧站留作回滚 | ✅ | 2026-09-23 已验证 |
| Bing Webmaster Tools | ChatGPT 搜索吃 Bing 的索引 | ❌ 未开 | 可从 GSC 一键导入，约 5 分钟（见 §9 决定 D3） |

## 2. 跳转都包含什么

| 类别 | 数量 | 怎么处理 | 真相源 |
|---|---|---|---|
| **同网址保留**：首页、`/menu/`、`/happy-hour/`、`/about/` 等 | 5 个旧网址 | 新站同一网址直接是新页面，不跳 | `out/` 构建产物 |
| **旧页 → 新页 永久跳转（Vercel 实际返回 308）**：有真实点击的博客、菜单单品页（`/zrm-menu-item/*`）、菜单分类、旧的关于/联系页 | 110 条 | 各自跳到最相关的新页（拉面文章 → 菜单拉面区；catering 单品 → 活动包场页） | `vercel.json`（由 `seo/build-redirects.mjs` 生成） |
| **带参数的旧菜单链接**：`/zrm-menu/?menu=catering` 等 | 3 条规则 | 按参数跳到 catering / 午餐 | `vercel.json` 里带 `has` 的规则 |
| **故意不留（404）**：近 3 个月 0 点击的 AI 薄博客、写错城市的文章 | 65 条 | 不跳。全部收口到首页会被 Google 判"软 404"，反而伤新站 | `seo/redirect-map-report.tsv` |
| **整站级**：`http://` → `https://`、`www.` → 不带 www | 自动 | Vercel 绑域名时自动做：http→https 为 308，www→根域为 301（项目域名设置里的跳转）；2026-10-05 线上实测 | `seo/check-cutover.mjs` |
| **临时地址**：`zen-ramen.vercel.app` | 1 | **待毛决定**（§10）：现在它与正式域名是同一个生产部署，也是 `index, follow`（规范网址已指向正式域名）；稳妥做法是设成 308 跳转到正式域名，或单独给这个主机加 `X-Robots-Tag: noindex` | 页面 `<meta robots>`、项目域名设置 |

**点击保全**：按 GSC 近 3 个月逐页点击算，旧站逐页点击合计 3,056 次里 **3,048 次（99.7%）有着落**，只丢写错城市的 8 次。
数据来源：`seo/gsc-clicks-3m-2026-09-27.json`（GSC「网页」表导出）；门：`npm run seo` 的 MAPPING。

## 3. SEO 怎么算成功（判据写死，不看感觉）

**主判据 = GSC 真实点击**（估算工具高估约 10 倍，只看趋势，不做判断）。

| 项 | 基线（切换前） | 判据 |
|---|---|---|
| GSC 每周点击 | 近 3 个月 2,840 次 ≈ **每周约 220 次**（T-1 当天重取近 28 天精确值） | 第 1–2 周：允许掉到 175/周（-20%）；第 3–4 周应回到 ≥200/周 |
| 首页 + 菜单 + Happy Hour 点击 | 占全站 **约 73%**（2,243 / 3,056 次，3 个月） | 这三页的周点击不应掉超 15%（同网址页，理论上不受影响） |
| GSC「网页 → 已编入索引」 | T-1 截图存档 | 新站 sitemap 里 10 页在 T+14 天内全部被收录 |
| 301 实测 | — | 切换当天 110 条逐条打一遍，100% 返回 301/308 且目的地返回 200 |

**止损线**：任何一周点击低于基线 60%（< 130/周），或首页从 Google 消失 → 当天查原因；查不出 → 执行 §7 回滚。
**正常波动说明**：切换后 2–4 周排名晃动是 Google 重新评估的正常现象，**这期间不加新改动**，以免分不清是谁造成的。

## 4. 各平台怎么同步

**Google 发现换站是被动的**（它按自己的节奏来重新抓取）。我们能做的是**主动通知 + 加速**：

| 平台 | 需要改吗 | 动作 | 何时 |
|---|---|---|---|
| Google 搜索 | 不改网址 | ① 提交新 sitemap ② 对首页/菜单/Happy Hour/活动页逐个「请求编入索引」③ 额外提交一份**旧网址 sitemap**，让 Google 尽快抓到那 110 条跳转（4 周后撤掉） | T 当天 |
| Google 商家（地图） | 不改（网址是首页） | T 当天点一下确认能打开新站 | T |
| Bing（也是 ChatGPT 搜索的数据源） | — | 开 Bing Webmaster Tools（从 GSC 导入），提交 sitemap | T（待 D3） |
| OpenAI 广告 | 不改（落地页是首页） | 确认广告点进来是新站 | T |
| Yelp / TripAdvisor / IG 简介 / Resy / 外卖平台 | 预计不改（都填域名首页） | T 当天逐个点一次，记录结果 | T |
| 旧站 WordPress.com | 保留不删 | 留作回滚；**不删、不取消连接域名**；订阅 2026-12-16 到期前再决定续不续 | T+45 之后 |

## 5. 切换前的准备（Vercel 路线；2026-10-05 已全部做完）

| 步 | 动作 | 验证 |
|---|---|---|
| 1 | Vercel 项目 zen-ramen 添加 `zenramensushiny.com` 与 `www.zenramensushiny.com`（www 设为 301 跳到根域）；GoDaddy 里**只新增**验证记录 `_vercel` TXT 完成认领 | 项目域名 `verified: true` |
| 2 | **提前预签证书**：`vercel certs issue zenramensushiny.com www.zenramensushiny.com --challenge-only --scope fynosolutions` + GoDaddy **只新增** `_acme-challenge` TXT。旧站发过 HSTS（1 年）：没有合格证书就不许改 A | `vercel certs ls` 有这张（根域+www，90 天，自动续期） |
| 3 | 生产环境变量 `NEXT_PUBLIC_GA4_ID`、`NEXT_PUBLIC_SITE_INDEXABLE=true`（**构建时写进页面**，改了必须重新部署才生效），重新部署 | `node seo/check-ga4.mjs`；线上 `index, follow` |
| 4 | GoDaddy：根域 A 与 www 的等待时间 3600 → **600 秒**，只改时间不改值 | `node seo/dns-check.mjs ttl --max 600`（只卡根域 A；www 的 CNAME 指向根域、回滚不用动它） |
| 5 | 存 DNS 快照 `seo/baseline-T-1/dns-snapshot.json`（与 9/27 手抄存档逐条一致） | `node seo/dns-check.mjs compare` |
| 6 | **彩排**（不动线上域名）：`node seo/check-cutover.mjs --host zenramensushiny.com --ip 216.150.1.1` | 证书/跳转/视频/统计/速度全 PASS |

## 6. 切换日 T（2026-10-05 约 16:05 ET，周一，已执行）

| 步 | 动作 | 验证 |
|---|---|---|
| 1 | GoDaddy DNS：根域 **A 记录**把 192.0.78.24 与 192.0.78.25 **两条换成** Vercel 推荐的 **216.150.1.1 + 216.150.16.1**（备选 76.76.21.21）。**新旧不能并存**（否则一半客人看到旧站）。www 的 CNAME 本来就指向根域，不动 | `dig` 回读；ns19/ns20 与 8.8.8.8、1.1.1.1、9.9.9.9 逐步一致（等待时间 600 秒内） |
| 2 | 🔴 **不碰**：NS、全部 MX（outlook + titan）、全部 TXT、autodiscover / email / lyncdiscover / msoid / sip / pay / _domainconnect / SRV。**也不要点 Vercel 界面里「改用 Vercel 域名服务器」的推荐**（会当场断邮箱） | `node seo/dns-check.mjs compare --flipped` 必须 PASS（只允许根域 A 变化） |
| 3 | `node seo/check-cutover.mjs --host zenramensushiny.com` | CUTOVER-CHECK PASS（2026-10-05 线上实测通过） |
| 4 | `GA_BASE=https://zenramensushiny.com node seo/check-ga4.mjs`；GA4「实时」里亲手点电话、ORDER ONLINE、导航 | PASS；`click_to_call` / `order_click` / `get_directions` 进来 |
| 5 | GSC：提交新 sitemap + 旧网址 sitemap；4 个主页面「请求编入索引」；开 Bing Webmaster（从 GSC 导入）并提交 sitemap | 显示「已提交」/已验证 |
| 6 | 按 §4 逐个点各平台链接（Google 商家、Yelp、TripAdvisor、IG 简介、Resy、外卖平台） | 都打开新站 |
| 7 | 发一封测试邮件到店里邮箱 | 能收到 |
| 8 | 毛用真 iPhone 打开一次（图标、MENU 颜色、视频自动播） | 毛确认 |

（5–8 为人工项，状态见 `GATES-cutover.md` V6–V8；执行记录以账本证据为准。）

## 7. 回滚（头 48 小时可用；第 7 天起不再回滚，改成向前修）

**什么时候回滚**：切换后 48 小时内出现 https 报错（根域或 www 任一）、`dns-check compare --flipped` 发现邮箱/TXT/NS 任何一条变了、旧网址跳转低于 100%、首页打不开 → **立即回滚，不在原地修**。第 7 天起 Google 已重抓，回滚只会重开一次 2–4 周的评估。
**怎么回滚**：GoDaddy DNS 把根域 A 改回**两条**：**192.0.78.24** 和 **192.0.78.25**；www 的 CNAME 保持 **zenramensushiny.com.**（本来就没动）。旧站一直原封不动在 WordPress.com 上，改回即恢复；Vercel 上绑的域名与证书可以留着。约 10 分钟生效（A 的等待时间 600 秒）。
**⚠️ 时效与 HSTS**：旧站证书有效到 **2026-11-15**（2026-10-03 实测）——此前回滚即时可用；**此后回滚会有 https 报错，最长约 1 天**。另外新站（Vercel）对回头客发的是 **HSTS 2 年**（`max-age=63072000`，2026-10-05 实测）：访客浏览器见过新站后，回滚目标也必须有合格的 https，否则对他们整站打不开。所以**回滚窗口实际到 2026-11-15 为止，第 7 天起就不建议再用**。WordPress.com 后台**什么都不改**（保持域名连接与主域名、不设私密），否则回滚通道会断。

## 8. 切换前 DNS 全量存档（2026-09-27 在 GoDaddy 面板实读；2026-10-03 又用 `seo/dns-check.mjs` 直接问 GoDaddy 权威服务器存了机器快照 `seo/baseline-T-1/dns-snapshot.json`，23 条记录与下表逐条一致）

| 类型 | 名称 | 值 | 切换时 |
|---|---|---|---|
| A | @ | 192.0.78.24 | **已换成** 216.150.1.1（2026-10-05）|
| A | @ | 192.0.78.25 | **已换成** 216.150.16.1（2026-10-05）|
| CNAME | www | zenramensushiny.com. | **不改**（本来就指根域；等待时间仍 3600）|
| NS | @ | ns19 / ns20.domaincontrol.com. | 不碰 |
| MX | @ | zenramensushiny-com.mail.protection.outlook.com.（0） | 不碰 |
| MX | @ | mx1.titan.email.（10）· mx2.titan.email.（20） | 不碰 |
| TXT | @ | NETORGFT13749143.onmicrosoft.com | 不碰 |
| TXT | @ | v=spf1 include:spf.titan.email ~all | 不碰 |
| TXT | _activator_template | template applied | 不碰 |
| CNAME | autodiscover / email / lyncdiscover / msoid / sip / pay / _domainconnect | （Microsoft 365 / GoDaddy 各项） | 不碰 |
| SRV | _sip._tls / _sipfederationtls._tcp | lync | 不碰 |

## 9. 已拍板

| # | 决定 |
|---|---|
| D1 | **T = 2026-10-05（周一）约 16:05 ET，已执行**（原定 9/30 周三 10:00；10-04 周日只彩排的安排被取代） |
| D2 | 出事（打不开 / 跳转大面积出错 / https 报错 / 邮箱记录被改）agent **可直接回滚**，事后立即告知毛（§7） |
| D3 | 开 Bing Webmaster Tools（T 当天，jaye.mao，从 GSC 导入） |
| D4 | T 后 4 周，每周一推毛飞书三行报告（本周点击 / 对比基线 / 正常还是要处理）；**头一周每天读一次 GSC 点击**，不等周报 |
| D5 | **网站托管在 Vercel（Fyno Solutions 团队，Pro）；GoDaddy 只当域名注册商/DNS**（毛 2026-10-05）。不买 GoDaddy 主机 |
| — | 旧站保留多久、cytd 停约：之后再谈（≥T+45，排名稳定后） |

## 10. T 之后

**已做/在做**：切换已完成；线上全套验收 PASS；邮箱记录未变。**待办与风险**（按先后）：

| 项 | 谁 | 说明 |
|---|---|---|
| 完成 §6 的 5–8 | agent + 毛 | GSC 提交 sitemap/请求收录、Bing、各平台链接、测试邮件、真 iPhone 终验 |
| **头一周每天读 GSC 点击** | agent | 首页 GSC 日点击**连续 2 天低于基线日均（约 31）的一半**就当天查原因；每周一再跑 `node seo/check-cutover.mjs --host zenramensushiny.com` + 读 GSC 周点击，对照 §3，连续 4 周报毛 |
| **`zen-ramen.vercel.app` 的去留（待毛决定）** | 毛拍板 | 现在它是同一个生产部署、`index, follow`，规范网址指向正式域名。建议设成 308 跳转到正式域名（一次性，Vercel 项目域名设置）；跳转后旧检查里的 `CTA_BASE=https://zen-ramen.vercel.app` 要改成 `https://zenramensushiny.com` |
| 清理 `_acme-challenge` TXT | agent | 办证书时临时加的，无害；Vercel 续期走 HTTP 验证，不需要它 |
| **推送 main = 直接发布给真客人** | 全员 | 合并任何 PR 都按正式发布对待；设计同事合并前先看预览 |
| **回滚窗口** | — | 头 48 小时可回滚，第 7 天起只向前修；2026-11-15 旧站证书到期后回滚会 https 报错（§7） |
| **谁托管、怎么拿走** | 毛告诉老板 | 网站挂在 Fyno 的 Vercel 账号下（付费团队，商用没问题）。老板之前的诉求是「不给老板换新的部署地方」——要说清楚谁托管、谁付钱、以后交还怎么搬（附录 A 备用方案 + `node scripts/build-for-host.mjs`） |
| T+28 | agent | 撤掉旧网址 sitemap；根域 A 的等待时间调回 1 小时（www 的 CNAME 一直是 3600，没动过） |
| T+45 之后 | 毛 | 旧站去留、cytd 停约（须在排名连续两周不掉之后）；WordPress.com 订阅 2026-12-16 到期前决定续不续 |

## 不在本次范围

- 邮箱：SPF 只包含 titan、没包含 Microsoft 365（从 Outlook 发出的信可能进垃圾箱）——**切换前就存在的问题，不是这次引起的**，这次也不碰；另行告知老板
- cytd / Rankpilot 供应商处置（毛：之后再说）
- ~~GA4 转化事件~~ → 已并入 §5b（10-03）

## 附录 A. 备用方案：搬到老板自己的 GoDaddy 主机（2026-10-03 写，**未启用**）

> 2026-10-05 毛改回 Vercel 托管。本附录保留，用于以后「Fyno 不再托管、网站要交还老板」时搬家：网站是静态导出，`node scripts/build-for-host.mjs` 一键构建+放跳转规则+上传，`node scripts/apache-local.mjs` 在本机真 Apache 上试跑，`seo/check-cutover.mjs --ip 主机地址` 彩排。

### A.1 准备与彩排（P 日；**不动线上域名**）

主机买完、文件传完、证书装好后，用「把域名临时指到主机地址」的办法把新站从头到尾测一遍——这是整个计划里最重要的一步，因为新站只在 Vercel 上测过，**从没在 GoDaddy 服务器上跑过**。

| 步 | 谁 | 动作 | 验证 |
|---|---|---|---|
| P0 | 毛 | **让老板书面同意**买 Web Hosting (cPanel) **Deluxe**（3 年首期约 $7.99/月，续费约 $16.99/月；购买页再确认价格与退款条款）。记下谁、何时、多少钱。委托权限虽含 Purchase，**未经老板同意不下单** | 聊天记录/邮件存档 |
| P1 | 毛 | 重置 jaye.mao 的 GoDaddy 登录密码（密码只在页面里输入，不经聊天）。登录还要 6 位邮箱码，发到 jaye.mao 邮箱，本机脚本可自取 | agent 能进该域名的 DNS 编辑页（只读，不改） |
| P2 | agent | 买主机之前再存一份 DNS 快照：`node seo/dns-check.mjs snapshot seo/baseline-T-1/dns-before-purchase.json`（2026-10-03 已存基线 `seo/baseline-T-1/dns-snapshot.json`，与 9/27 手抄存档逐条一致） | 文件存在 |
| P3 | agent | 买主机。**创建时若有「自动连接域名」选项，不要勾**。买完**立刻**：`node seo/dns-check.mjs compare seo/baseline-T-1/dns-before-purchase.json` | 必须 PASS；任何一条不同 → 按快照原样手改回，不等客服（GoDaddy 官方说明：开通向导可能自己改 DNS） |
| P4 | agent | 把根域 A 与 www 的「生效等待时间」从 3600 降到 **600 秒**，只改时间不改值（至少提前 1 小时）。2026-10-03 实测现在仍是 3600 | `node seo/dns-check.mjs ttl --max 600` PASS |
| P5 | agent | 开 SSH，用 SFTP 上传（GoDaddy 主机页 → Settings → SSH access）；记下主机地址（cPanel 右侧栏的 Shared IP）与用户名 | `ssh 用户名@主机地址 true` 能连上 |
| P6 | agent | `HOST_SSH=用户名@主机地址 node scripts/build-for-host.mjs --upload` 先看**试运行清单**，再加 `--apply` 真传。脚本一次做完：带统计编号与「允许收录」开关构建 → 生成 .htaccess（含 https/www 规则、110+3 条旧网址跳转、缓存头）放进 `out/` → `check-ga4` 自检 → 上传 | 脚本末尾 PASS；上传后 `ls -la` 回读确认 `.htaccess` 在（它是隐藏文件，最容易漏） |
| P7 | agent | **手签证书**（本机用 Let's Encrypt 的 DNS 验证）：**一张证书同时写根域和 www**，带完整证书链；GoDaddy DNS 里**只新增** `_acme-challenge` TXT，签完删掉；证书+私钥+中间证书装进 cPanel → SSL/TLS → Manage SSL Sites。旧站发过 HSTS（1 年），没有合格证书就不许改 A | `node seo/check-cutover.mjs --host zenramensushiny.com --ip <主机地址> --only-cert` PASS |
| P8 | agent | **彩排**：`node seo/check-cutover.mjs --host zenramensushiny.com --ip <主机地址>`，再用 `phone-check`（Chromium 的 host-resolver 映射）把电脑/安卓版各看一遍 | 全 PASS；iPhone 真机只能在切换后看第一眼 |
| P9 | agent | 通知旧站线 session（`restaurant-e7`）：切换后旧站后台改走 WordPress.com 地址、对旧站 SEO 的改动作废；GA4 里记一条备注；备好给老板的那句话（邮箱不受影响；WordPress 后台若提示域名没指向，别去「修」） | — |
| P10 | agent | 把旧站 sitemap 存档（`curl -s https://zenramensushiny.com/sitemap.xml > seo/baseline-T-1/old-sitemap.xml`）；GSC 存基线（近 28 天总点击、前 20 页点击、「已编入索引」页数）截图进 `seo/baseline-T-1/` | 文件存在 |

**今后每次更新网站**（不再是 push 自动上线）：`HOST_SSH=… node scripts/build-for-host.mjs --upload --apply`，再 `GA_BASE=https://zenramensushiny.com node seo/check-ga4.mjs`。**别直接 `npm run build` 然后传 `out/`**：缺两个开关会没有统计、还带 noindex，且不报错。

### A.2 构建时开关（为什么必须用脚本）

`NEXT_PUBLIC_GA4_ID`（统计）与 `NEXT_PUBLIC_SITE_INDEXABLE`（放开索引）都是**构建时写进页面**的，原来只配在 Vercel 上。`scripts/build-for-host.mjs` 已固定带上 `NEXT_PUBLIC_GA4_ID=G-JZD3SQCWMP NEXT_PUBLIC_SITE_INDEXABLE=true`，并跑 `seo/check-ga4.mjs`（6 页都要有 `G-JZD3SQCWMP`、没有别的统计编号、没有 noindex）。GA4 属性已按「旧站不再使用」处理：旧站上的 `GT-MJJQ9P6Z`、`AW-17990718317` 来源不明、不是我们的，切换后随旧站消失，不迁移。切换后 1–2 天，事件出现在 GA4 事件列表，再把 `order_click`、`click_to_call`、`get_directions` 标成关键事件；看数时按主机名 = zenramensushiny.com 筛（预览站访问在同一属性里）。

### A.3 切换日（6 项门全绿后；备用方案）

**6 项门（缺一项就不切，改约下一个工作日；周日 13:00 ET 前的彩排也按这个判）**：
① 老板书面同意并已买主机 ② 能登录 GoDaddy 并进得去域名设置页 ③ 等待时间已实测 ≤600 秒 ④ 用主机地址彩排全过（P8） ⑤ 新 DNS 快照已存且与基线一致 ⑥ 证书同时覆盖根域和 www 且链完整（P7）。对应 `GATES-cutover.md` 的「执行阶段」。

| 步 | 动作 | 验证 |
|---|---|---|
| 1 | `node seo/dns-check.mjs compare` + `node seo/dns-check.mjs ttl --max 600` | 都 PASS |
| 2 | GoDaddy DNS：根域 **A 记录**，把 192.0.78.24 与 192.0.78.25 **两条换成一条**：主机地址（cPanel 右侧栏的 Shared IP）。**www 的 CNAME 本来就指向根域（zenramensushiny.com.），不用动**——在 DNS 页确认它仍是这个值 | `dig` 回读到新值 |
| 3 | 🔴 **不碰**：NS、全部 MX（outlook + titan）、全部 TXT、autodiscover / email / lyncdiscover / msoid / sip / pay / _domainconnect / SRV | `node seo/dns-check.mjs compare --flipped` 必须 PASS（只允许 `@ A` 变化） |
| 4 | 用手机和电脑打开 `https://zenramensushiny.com/` 与 `https://www.zenramensushiny.com/`、`http://` 版 | 都是新站、锁头正常、www 与 http 一步跳到 https 根域 |
| 5 | `node seo/check-cutover.mjs --host zenramensushiny.com`（113 条旧网址跳转、同网址页面、65 条故意 404、证书、视频、速度） | CUTOVER-CHECK PASS |
| 6 | `GA_BASE=https://zenramensushiny.com node seo/check-ga4.mjs`；再在 GA4「实时」里亲手点一次电话、ORDER ONLINE、导航 | PASS；`click_to_call` / `order_click` / `get_directions` 进来 |
| 7 | GSC：提交新 sitemap + 旧网址 sitemap；4 个主页面请求编入索引；开 Bing Webmaster（从 GSC 导入）并提交 sitemap | 显示「已提交」/已验证 |
| 8 | 按 §4 逐个点各平台链接（Google 商家、Yelp、TripAdvisor、IG 简介、Resy、外卖平台），记录到 §10 | 都打开新站 |
| 9 | 发一封测试邮件到店里邮箱 | 能收到（证明邮箱没受影响） |
| 10 | 毛用真 iPhone 打开一次（图标、MENU 颜色、视频自动播） | 毛确认 |

### A.4 回滚（备用方案）

**什么时候回滚**：切换后 48 小时内，出现 https 报错（根域或 www 任一）、`dns-check compare --flipped` 发现邮箱/TXT/NS 任何一条变了、旧网址跳转低于 100%、首页打不开 → **立即回滚，不在原地修**（旧站对回头客有 HSTS，https 报错 = 对他们整站打不开，每分钟都在丢单）。第 7 天起不再回滚、改成向前修（Google 已重抓，回滚只会重开一次 2–4 周的评估）。

**怎么回滚**：GoDaddy DNS 里把根域 A 记录改回**两条**：**192.0.78.24** 和 **192.0.78.25**；www 的 CNAME 保持 **zenramensushiny.com.**。旧站一直原封不动在 WordPress.com 上，改回即恢复。主机和证书可以留着，不影响。回滚靠「等待时间已降到 600 秒」（门③）和「账号能登录」（门②）——这两项没做到就**不切**。
**时效**：旧站现有 https 证书有效到 **2026-11-15**（2026-10-03 实测）——此前回滚即时可用；此后 WordPress.com 需重新签证书，回滚可能有最长约 1 天 https 报错。WordPress.com 后台**什么都不改**（保持域名连接与主域名、不设私密），否则回滚通道会断。
