# 域名切换总计划（zenramensushiny.com → 新站）

> **本文件是切换的唯一总计划**（2026-09-27 重写，取代旧版清单）。`DNS-PLAN.md`、`GODADDY-PLAN.md` 是它引用的背景资料。
> 验收账本：`GATES-cutover.md`（仓库根目录）。**T-1 的门全绿才许执行切换日。**
> 状态：**计划阶段，未执行任何切换动作。** 老板已看过新站并同意切换（2026-09-27 毛确认）。

## 0. 这次切换到底改了什么

域名不变、邮箱不变、注册商不变。**只把"这个域名的网页由谁来提供"从旧的 WordPress.com 换到我们的 Vercel。**
所以：
- 外面所有写着 `zenramensushiny.com` 的地方（Google 商家、Yelp、IG 简介、广告）**不用改，自动指到新站**。
- 但**网站里面的页面变了**（旧站 179 个已知网址 → 新站 10 个收录页面），Google 要重新抓一遍、重新评估。**跳转（301）就是告诉 Google「旧页搬到了这里」**，这是整次切换里唯一决定 SEO 得失的东西。

## 1. 权限清单（2026-09-27 逐项实测）

| 系统 | 用途 | 状态 | 实测证据 |
|---|---|---|---|
| GoDaddy（客户 Celina Lin 账号，Delegate Access） | 改 A + CNAME 两条 | ✅ | 以 jaye.mao 登录 → Access now → 看到该域名全部 DNS 记录并有编辑按钮。登录要 6 位邮箱码，发到 jaye.mao 邮箱，本机脚本可自取 |
| Vercel（Fyno 团队，项目 zen-ramen） | 绑域名、开索引开关 | ✅ | `vercel project ls` 可见 zen-ramen |
| Google Search Console（网址前缀资源，jaye.mao） | 看数据、提交 sitemap、请求收录 | ✅ | 能读近 3 个月报表。新站已带旧站两段验证标签，切换后不会失效 |
| GA4 `G-JZD3SQCWMP` | 看新站访问 | ✅ | 已在线上生效 |
| Google 商家（管理员） | 核对网址字段 | ✅ | 网址字段 = `http://zenramensushiny.com/`（首页，不用改） |
| WordPress 后台（administrator） | 旧站留作回滚 | ✅ | 2026-09-23 已验证 |
| Bing Webmaster Tools | ChatGPT 搜索吃 Bing 的索引 | ❌ 未开 | 可从 GSC 一键导入，约 5 分钟（见 §9 决定 D3） |

## 2. 跳转都包含什么

| 类别 | 数量 | 怎么处理 | 真相源 |
|---|---|---|---|
| **同网址保留**：首页、`/menu/`、`/happy-hour/`、`/about/` 等 | 5 个旧网址 | 新站同一网址直接是新页面，不跳 | `out/` 构建产物 |
| **旧页 → 新页 301**：有真实点击的博客、菜单单品页（`/zrm-menu-item/*`）、菜单分类、旧的关于/联系页 | 110 条 | 各自跳到最相关的新页（拉面文章 → 菜单拉面区；catering 单品 → 活动包场页） | `vercel.json`（由 `seo/build-redirects.mjs` 生成） |
| **带参数的旧菜单链接**：`/zrm-menu/?menu=catering` 等 | 3 条规则 | 按参数跳到 catering / 午餐 | `vercel.json` 里带 `has` 的规则 |
| **故意不留（404）**：近 3 个月 0 点击的 AI 薄博客、写错城市的文章 | 65 条 | 不跳。全部收口到首页会被 Google 判"软 404"，反而伤新站 | `seo/redirect-map-report.tsv` |
| **整站级**：`http://` → `https://`、`www.` → 不带 www | 自动 | Vercel 绑域名时自动做（旧站也是不带 www 的版本为主，口径一致） | Vercel 域名设置 |
| **临时地址**：`zen-ramen.vercel.app` | 1 | 切换后设成 301 到正式域名，防止 Google 看到两份一样的站 | Vercel 域名设置 |

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

## 5. T-1（切换前一天）

1. GoDaddy：把 A `@`、CNAME `www` 的 TTL 从 1 小时调到 **600 秒**（让切换和回滚都在 10 分钟内生效）。只改 TTL，不改值
2. GSC：存基线——近 28 天总点击、前 20 页点击、「已编入索引」页数，截图进 `seo/baseline-T-1/`
3. 把旧站 sitemap 存档：`curl -s https://zenramensushiny.com/sitemap.xml > seo/baseline-T-1/old-sitemap.xml`
4. 生成「旧网址 sitemap」（110 条跳转源），放进新站 `public/`，随新站一起上线
5. 升级 `seo/watch.mjs`：从抽 20 条改成打全部 110 条 + 5 个同网址页（现版本只抽旧清单的 20 条）
6. 通知旧站线 session（`restaurant-e7`）：切换后旧站后台改走 WordPress.com 地址、对旧站的 SEO 改动全部作废，停止投入
7. 跑 `GATES-cutover.md` 的 T-1 门，全绿才进 T

## 6. 切换日 T（2026-09-30 周三 10:00 ET，约 30 分钟，agent 执行）

| 步 | 动作 | 验证 |
|---|---|---|
| 1 | Vercel 项目 zen-ramen 添加 `zenramensushiny.com` + `www.zenramensushiny.com`（www 设为跳到不带 www） | Vercel 显示待配置 |
| 2 | Vercel 环境变量 `NEXT_PUBLIC_SITE_INDEXABLE=true`，重新部署 | 临时地址页面上 noindex 消失 |
| 3 | GoDaddy：A `@` 192.0.78.24 → **76.76.21.21**；删除 A `@` 192.0.78.25；CNAME `www` → **cname.vercel-dns.com** | `dig` 回读到新值 |
| 4 | 🔴 **不碰**：NS、全部 MX（outlook + titan）、全部 TXT、autodiscover / email / lyncdiscover / msoid / sip / pay / _domainconnect / SRV | 改后 `dig MX/TXT` 与 §8 存档逐字一致 |
| 5 | 等 SSL 签发（通常 1–10 分钟） | `https://zenramensushiny.com/` 返回 200 且是新站 |
| 6 | 跑 `node seo/watch.mjs --live` | 110 条 301 + 5 个同网址页全过 |
| 7 | `zen-ramen.vercel.app` 设 301 → 正式域名 | curl 回读 |
| 8 | GSC：提交新 sitemap + 旧网址 sitemap；4 个主页面请求编入索引 | GSC 显示「已提交」 |
| 8b | 开 Bing Webmaster Tools（从 GSC 导入）并提交 sitemap | Bing 显示已验证 |
| 9 | 按 §4 逐个点各平台链接 | 记录到本文件 §10 |
| 10 | 发一封测试邮件到店里邮箱 | 能收到（证明邮箱没受影响） |

## 7. 回滚（任何异常，10 分钟内）

GoDaddy 把两条记录改回原值：A `@` = **192.0.78.24** 和 **192.0.78.25**；CNAME `www` = **zenramensushiny.com.**
旧站一直原封不动在 WordPress.com 上，改回即恢复。Vercel 上绑的域名可以留着，不影响。
**时效**：旧站现有 https 证书有效到 **2026-11-15**（2026-09-27 直连实测）——此前回滚即时可用；此后 WordPress.com 需重新签证书，回滚可能有最长约 1 天 https 报错。WordPress.com 后台**什么都不改**（保持域名连接与主域名、不设私密），否则回滚通道会断。

## 8. 切换前 DNS 全量存档（2026-09-27 在 GoDaddy 面板实读）

| 类型 | 名称 | 值 | 切换时 |
|---|---|---|---|
| A | @ | 192.0.78.24 | **改** → 76.76.21.21 |
| A | @ | 192.0.78.25 | **删** |
| CNAME | www | zenramensushiny.com. | **改** → cname.vercel-dns.com |
| NS | @ | ns19 / ns20.domaincontrol.com. | 不碰 |
| MX | @ | zenramensushiny-com.mail.protection.outlook.com.（0） | 不碰 |
| MX | @ | mx1.titan.email.（10）· mx2.titan.email.（20） | 不碰 |
| TXT | @ | NETORGFT13749143.onmicrosoft.com | 不碰 |
| TXT | @ | v=spf1 include:spf.titan.email ~all | 不碰 |
| TXT | _activator_template | template applied | 不碰 |
| CNAME | autodiscover / email / lyncdiscover / msoid / sip / pay / _domainconnect | （Microsoft 365 / GoDaddy 各项） | 不碰 |
| SRV | _sip._tls / _sipfederationtls._tcp | lync | 不碰 |

## 9. 已拍板（2026-09-27 毛）

| # | 决定 |
|---|---|
| D1 | **T = 2026-09-30 周三 10:00 ET**；T-1 = 9/29 周二（§5） |
| D2 | 出事（打不开 / 跳转大面积出错）agent **可直接回滚**，事后立即告知毛 |
| D3 | 开 Bing Webmaster Tools（T 当天，jaye.mao，从 GSC 导入） |
| D4 | T 后 4 周，每周一推毛飞书三行报告（本周点击 / 对比基线 / 正常还是要处理） |
| — | 旧站保留多久、cytd 停约：之后再谈（≥T+45，排名稳定后） |

仍在调研、会改动本计划的三件事（结论出来后回写本节）：WordPress.com 在域名移走后会怎样 · 还有谁能改这个域名的 DNS · Vercel 接入域名要什么。

## 10. T 之后

- 每周一跑 `node seo/watch.mjs --live` + 读 GSC 每周点击，对照 §3 判据，结果报毛（连续 4 周）
- T+28：撤掉旧网址 sitemap；把 TTL 调回 1 小时
- T+45 之后：旧站去留、cytd 停约（须在排名连续两周不掉之后）

## 不在本次范围

- 邮箱：SPF 只包含 titan、没包含 Microsoft 365（从 Outlook 发出的信可能进垃圾箱）——**切换前就存在的问题，不是这次引起的**，这次也不碰；另行告知老板
- cytd / Rankpilot 供应商处置（毛：之后再说）
- GA4 转化事件（询盘、电话点击）
