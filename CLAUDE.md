@AGENTS.md

# ZEN RAMEN & SUSHI — 客户 024 官网

Fyno 给客户做的新官网。旧站（WordPress.com）每月约 1 万次自然流量、546+ 排名词，**新站上线是一次迁移，不是一次发布**。

- **线上（正式）：https://zenramensushiny.com**（2026-10-05 约 16:05 ET 起由 Vercel 提供；Fyno Solutions 团队，Pro，项目 zen-ramen）。**push main = 直接发布给真客人**，合并任何 PR 都按正式发布对待。`zen-ramen.vercel.app` 已在 Vercel 项目域名设置里设成 308 跳转到正式域名（2026-10-05）；**线上检查一律用 `CTA_BASE=https://zenramensushiny.com`，不再用 vercel.app**
- **托管与域名**：网站全部 deploy 在 Vercel；**GoDaddy 只当域名注册商/DNS**（毛 2026-10-05 改回；9/27 曾定放 GoDaddy cPanel 主机，现为备用方案，见 `seo/CUTOVER-CHECKLIST.md` 附录 A）。切换总计划与回滚：`seo/CUTOVER-CHECKLIST.md`；验收账本 `GATES-cutover.md`（Vercel 路线 V1–V11）与 `GATES-cutover-godaddy-alt.md`（备用路线）
- 客户的正式域名：zenramensushiny.com（**仍指向旧站，尚未切换**）
- 本地预览：`npm run preview` → 127.0.0.1:3001（先 `npm run build`）

**转化/CTA（2026-10-01）**：所有「ORDER ONLINE」都指 `content/site.ts` 的 `site.order`（Toast 直订，店家不付第三方佣金）；链接加 `data-cta="位置-动作"` 就会被 `components/CtaTracker.tsx` 记进 GA4（cta_click/click_to_call/get_directions/order_click/reserve_click）；营业状态在 `lib/open-status.ts`（按纽约时间、按常规营业时间，不含节假日）；验收 `GATES-cta.md`，`node seo/check-cta.mjs <mode>` 可对本地或线上（`CTA_BASE=网址`）跑。

**手机版验证（2026-10-02）**：`node seo/check-mobile.mjs`（`CTA_BASE=https://zenramensushiny.com` 测线上，`ONLY=iPhone` 只跑一种配置）用 iPhone WebKit / Pixel Chromium / 360 / 320 四种配置跑全站：图片全加载且不糊、无横向溢出、展开导航/下拉/页签/分类/地图/相册/表单、锚点不被粘性栏盖住、触屏无悬停放大、视频点按播放、页头不抖。**每个有配图的菜单分区，图的张数必须是 1 张（招牌卡）或 3 的倍数**（一排排满）。手机两列时奇数张的最后一张自动变成「左图右字」的整行。**相册也要排满**：电脑 3 列（宽图占 2 格）、手机 2 列，窄图落单时在 `content/media.ts` 给它加 `wideSm:true`（手机上占整行）。进相册的照片桌面色相要和现有木桌一致（≈34°，量法见 `docs/menu-dish-images.md`）；菜单透明图统一用 `python3 scripts/fit-dish.py 输入 输出` 摆进画布。店家旧拍摄的精选图在飞书 `图片/1002 店家旧拍摄精选(Google Drive)`。验收 `GATES-mobile.md`。

**真机才会出的问题（2026-10-02 毛 iPhone 截图）**：本机的手机测试是「电脑引擎 + 手机屏幕尺寸」的模拟，**测不出真机系统的行为**；这台 Mac 没有 iOS 模拟器也没有安卓模拟器。已知三类，都改成了不依赖真机就能查的规则，`node seo/check-device-safe.mjs`（`npm run device-safe`）：①**不许用符号字符当图标**（↗ ✳ ★ ▶ ☰ ⌄ 在 iPhone/安卓上会变彩色 emoji 或缺字方块）→ 一律用 `components/Ico.tsx` 的内联 SVG（`<Ico n="ne|right|left|down|spark|check|menu|play|pause|star"/>`），CSS 里要图标用 mask；②**每个按钮都要有明确文字颜色**（iPhone 上没写颜色的按钮是系统蓝，手机导航「MENU」曾变蓝）→ `globals.css` 开头有 `button{color:inherit}`；③**iPhone 不给没在播的视频预加载数据** → `load()` 后直接 `play()`，不要等 `loadeddata`。**给毛看的手机截图页用 `phone-check` skill**(`node ~/.claude/skills/phone-check/scripts/phone_check.mjs https://zen-ramen.vercel.app/ --session zen-intro-v2=1 --out <目录>`,出 iPhone|安卓并排的 report.html + 冷审拼图),和本仓的 `check-mobile.mjs`(查交互)两个都跑。新发现的真机问题照这个路子：先想「能不能写成不靠真机的规则」，再补进这个检查。

**首页视频（2026-10-02 毛定）**：电脑和手机都是滑到眼前才静音循环播；`preload="none"` + 等 `window load` 之后才开始盯 + 手机用轻量版 `homeFilm.srcMobile`（4:5 居中裁切，5.4MB；原片 13MB，换片两个都要换，命令在 `content/media.ts`）。省流量/2G/减少动态效果/iPhone 省电模式 → 只有封面和播放按钮。`check-mobile.mjs` 会查「没滑到不下载、滑到自动播、用的是轻量版、点按钮有声音」。

**菜单招牌卡（2026-10-02）**：分区只有 1 张配图时（三个卷分区）不放孤零零一个方格，自动变成横向大图 + 右侧菜名/说明/价格（手机：整行大图、字在下、不重复说明）。图用 `python3 scripts/fit-dish.py 输入 输出 --wide`。每个分区的配图张数只能是 **1 张或 3 的倍数**。等店里确认其余卷的菜名后可以升级成一排 3 张。

**链接/按钮审计（2026-10-02）**：`node seo/check-links.mjs`（`CTA_BASE=https://zenramensushiny.com` 测线上）逐条核对「按钮文字→去向」规则、内部链接可开、`#` 锚点落在对的菜单页签与区块、外部网址只许出现 `VERIFIED` 清单里的（Toast/Resy/外卖三平台/Google/IG，需在真实浏览器核对，curl 会被 Cloudflare 拦）、页签/下拉/地图/视频/相册/表单按钮真的做它写的事。**新增或改任何外部网址，要先在真实浏览器打开核对，再加进 `VERIFIED`。** 菜单 `.food-section` 不要用 `content-visibility:auto`（估高不准会让锚点落偏几千像素）。验收 `GATES-links.md`。

**协作**：`main` 已上锁（2026-09-28）——非管理员只能走 PR，需 1 个批准 + CI `build-and-seo` 绿灯；管理员（jayemaoFYNO、mingzhoujin）可直推。设计同事 wzh152 按 `CONTRIBUTING.md` 走 PR。

## 毛的要求（本项目，也是做别的餐厅站的标准）
- 网站是生意工具：首屏订餐/订位/电话/导航/评论都能一步点到；对比旧站后直接优化。
- **菜品图必须和实物几乎一样**；真照片只当参考，生成透明背景展示图；动效轻微（悬浮、大小不一、移上放大），不改结构、不挡文字和下单。
- 图可以多，但不能让人视觉疲劳：配图分区 1 张（招牌卡）或 3 的倍数；加不进现有审美的图宁可不加。
- 首页要有动态元素（视频），手机也自动播，但不能拖慢页面。
- 手机和电脑同一标准；iPhone、安卓都看；截图给毛看（`phone-check` skill）；毛用真 iPhone 终验。
- 每个按钮的文字与去向要一致。设计同事走 PR，不碰命名/SEO/菜单文字。
- 通用打法与踩坑全集 → memory `ref_restaurant_website_playbook`。

## 这次踩的坑（本仓专属；通用的在 playbook）
- 件数以菜单为准：「(6 pcs)」的图上就是 6 个（顾客照片常是吃剩的）；同分区三张同一机位（`docs/menu-dish-images.md` 末尾「定稿规则」）。
- 旧站 Toast 链接是 404、旧站按钮文字与去向对不上 → `check-links.mjs` 的 `VERIFIED` 清单。
- 手机检查本身会骗人：溢出要拿 `screen.width` 比；探针要自检；改字号后在 360 宽重跑（`.h1-kicker` 调到 11px 曾超出 6px，已保持 10px）。
- 真机才出的三类问题（符号变 emoji / 按钮系统蓝 / iPhone 视频不预加载）→ `check-device-safe.mjs`。
- 本机跑整套手机检查约 10–12 分钟，后台命令超时要给足；检查脚本别并发抢端口。

**切换/托管相关工具（2026-10-03 起）**：`node seo/check-cutover.mjs --host zenramensushiny.com [--ip 入口地址] [--only-cert]`（全套验收；Vercel 口径：永久跳转 301/308 都算、http www 允许两跳、带参数的跳转可保留原参数）· `node seo/dns-check.mjs snapshot|compare [--flipped]|ttl`（DNS 快照/比对/等待时间，直接问 GoDaddy 权威服务器；只比对固定名单里的记录名，新增名字如 `_vercel` 看不到）· `node seo/check-ga4.mjs`。**备用方案（搬到 GoDaddy 主机）的工具**：`node scripts/build-for-host.mjs`（一键构建+放 `.htaccess`+自检+`--upload` 上传）· `node scripts/apache-local.mjs start out 8911`（本机起真 Apache 试跑）。**线上检查的地址从此用 `CTA_BASE=https://zenramensushiny.com`**（不再用 zen-ramen.vercel.app）。

**统计/广告代码与询单邮箱（2026-10-05 切换当天补记）**：`app/layout.tsx` 里除了我们自己的 GA4（`G-JZD3SQCWMP`，构建变量 `NEXT_PUBLIC_GA4_ID`），还注入了旧站带过来的三段：店家自己的 GA4（经 Google 标签 `GT-MJJQ9P6Z`）、Google Ads 转化 `AW-17990718317`、OpenAI 广告转化像素。这三段**切换时漏带过一次**（旧站在 WordPress 的 Google Site Kit / WPCode 里），当天补回（PR #22）；`node seo/check-ga4.mjs` 现在会逐个检查，丢了报红。**别删**，要改先问毛（广告在用这些转化）。活动/宴请询单表单：`content/site.ts` 的 `cateringEmail` = `info@`、`cateringCc` = `jaye.mao@fynosolutions.com`，页面只显示 `info@`，是 `mailto:` 型（不自动发送）。`catering@` 实测收不到外面来信（Microsoft 退信 `550 5.1.10 RecipientNotFound`，2026-10-05），修好之前别改回去；`check-links.mjs` 会断言收件人与抄送。

## 红线（违反 = 事故）

**域名和邮箱是客户的；网站托管在我们的 Vercel 账号下。** 切换只改了根域 A 记录（192.0.78.24/25 → 216.150.1.1 + 216.150.16.1），www 的 CNAME 本来就指向根域；`zenramensushiny.com` 的 MX/TXT 上挂着客户在用的 Microsoft 365 + titan 邮箱，**改 nameserver 会当场中断收信**（Vercel 界面会推荐「改用 Vercel 域名服务器」，不要点）。回滚（头 48 小时，到 2026-11-15 旧站证书到期为止）：A 改回 192.0.78.24 + 192.0.78.25。完整方案：`seo/CUTOVER-CHECKLIST.md`、`seo/DNS-PLAN.md`。网站挂在 Fyno 的账号下，要跟老板说清谁托管、怎么拿走——这个站是静态导出，可随时搬 Apache（附录 A）。

**菜品文案与配图只写菜单里真有的东西。** 每一样食材、价格、卷名都要能在 `content/menus.json` 找到出处——曾凭空写出三种 happy hour 不供应的寿司卷和一个不存在的 $5 档位。写之前先查，别凭印象。

**换图片/视频时换文件名。** 同名替换会被浏览器缓存挡住，看起来"没换"。新图起新名、改引用、删旧文件。

## 素材现状：全站图片 = 2026-09-22 店内实拍（AI 占位图已全部删除）
**菜单单品图（2026-10-02）**：缺单品图的菜用 `dish-*.webp`——以真实顾客照片为参考、gpt-image-2.5 重拍成透明背景（「同一道菜只改拍摄质量」），prompt 与对应关系见 `docs/menu-dish-images.md`、`content/photo-sources.json`；一张图只挂在它拍的那道菜上，`node seo/check-menu-photos.mjs data|render` 验收；轻微动效（悬浮/移上放大 7%）在 globals.css 末尾「菜品图动效」，`node seo/check-menu-motion.mjs` 验收。Google 的菜名标签有错，以照片内容对菜单描述为准。

`public/images/shot-*.webp` 全部取自飞书云盘 `024 Zen Ramen Penn/图片/0924新图/正常高亮`（47 张过亮度闸；同目录 `较暗` 放其余 93 张，不选用）。原片没进仓，重出图从飞书下原片再裁。
**一张图只挂在它拍的那道菜上**（台账 `content/photo-sources.json` 强制）；对不上具体菜单条目的实拍（炙烤卷、刺身木盒、粉色马天尼、分层饮品）→ 只当场景图用、alt 不写菜名。Rainbow/Crazy Yellowtail/Sweetheart 三个卷现在用店家旧拍摄做成透明图，以「招牌卡」上线。
**台账与出图铁律**：`docs/design-references.md`；换图仍要换文件名。
**亮度闸（毛 2026-09-24 定）**：这组实拍整体欠曝、废片多。选图只用原片平均亮度 ≥85 且近黑像素 ≤18% 的（140 张里 47 张过），出图再统一提亮到 ≈118；上线前跑 `npm run photos`，任何图平均亮度 <100 就红。已用毛指出的暗图做过反向验证（全红）。
**视频**：原片 61 条在飞书 `视频/0924 新视频/{横屏,竖屏}`；官网横版混剪（66 秒，靳晓宇剪，已上线）= `content/media.ts` 的 `homeFilm`/`galleryVideo`，编码与手机轻量版见 memory `ref_web_video_mobile_contract`。换片两个文件（`zen-film-*.mp4` 与 `-m.mp4`）都要换，并换文件名。

`public/ig/*.mp4` 是 @zenramen_sushi 公开 reels 的自托管副本（已去黑边与片头水印、转 H.264 Main L4.0 yuv420p faststart）。新增一条 = 在 `content/ig.ts` 加一行，视频与封面放进 `public/ig/`。

## 账本：改完跑，不靠感觉

`GATES.md`（SEO 迁移 11 门）与 `GATES-video.md`（视频与搬家 12 门）是可执行的验收清单：

```
node ~/.claude/skills/unlazy/scripts/gate-check.mjs --reverify GATES.md
```

`npm run seo` 是其中四道的快捷方式，已挂进 GitHub CI——改坏 301 映射、丢标题、删 alt 会亮红灯合不进去。

## 数据真相源：GSC 真实点击 > 估算工具

`seo/gsc-clicks-2026-09-23.json` 是 Search Console 的**真实点击**，逐 URL。DataForSEO 的 etv 和 SE Ranking 的估算都高估约一个数量级——实测有页面 etv 180 而真实点击为 0。**任何"这页值不值得保"的判断以 GSC 为准**，估算工具只用于看趋势。Search Console 资源已验证在 jaye.mao@fynosolutions.com 名下，可直接登 search.google.com/search-console 查。

## 旧站的 SEO 积累怎么接（2026-10-06 定版：有积累的网址，同网址保住或跳到对等页）

毛的要求：「新网站应该能接住旧网站所有的 SEO 积累，不应该有 drop」。一个旧网址有没有积累看四样：Google 真实点击、近 3 个月曝光 ≥100、9-20 排名存档里有词、有外链。验收账本 `GATES-seo-equity.md`（本地 12 门）与 `GATES-seo-equity-live.md`（上线后）。

- **旧文章原网址原样保留，不跳转**：有积累的 86 篇在 `content/journal.json`，由 `scripts/import-journal.py` 从旧站导入（标题与描述逐字沿用 Google 收录的原文；30 篇共用站点默认描述的换成正文开头；正文清洗、图片转 webp 放 `public/images/journal/`）。路由 `app/[year]/[month]/[day]/[slug]/`，目录页 `/blog/`。切换当天曾把它们 301 到菜单锚点——Google 不把「文章→菜单页」当等价内容，这个做法已废。
- **仍然故意 404 的只有两类**：写错城市的文章（Gainesville / Noblesville / Greenville / Dahlonega，讲的是别处同名店）和旧站自己已删的（名单 = `journal.json` 的 `notOnOldSite`）。没有积累的薄文章照旧 404。
- **新增的同网址/对等页面**：`/location/`（旧站同网址）、`/lunch-specials/`（旧 `/lunch-specials-2/` 301 过来；菜名价格全读 `menus.json`）。旧的联系页、主菜页、标签/分类/作者归档、日期归档、分页、RSS 的去向都在 `seo/build-redirects.mjs` 里（`structural` 与 `LEGACY`）。
- **接不住的已知缺口**：`/wp-content/…`、`/wp-json/`、`/wp-login.php` 这类路径在 Vercel 上被平台防护直接 403（`x-vercel-mitigated: deny`），跳转规则轮不到执行，所以旧站的菜单 PDF 直链和被盗链的 logo 没法承接；三条都没有 Google 点击。别再往 vercel.json 里加 `/wp-content/` 的跳转。
- **三个验收脚本**：`seo/check-equity.mjs`（逐网址：有积累的都被接住；有积累的文章必须同网址）· `seo/check-journal.mjs --source <旧站备份.json>`（逐篇，并与 9-23 的独立备份比内容，备份在 `~/Desktop/CC-Max-2026/restaurant/zen-024-backups/`）· `seo/check-keywords.mjs`（旧页面文字里有的排名词，新落点正文里还在；旧页面文字基线 `seo/old-page-text-2026-10-06.json`）。三个都有负向对照门。
- **改了文章或页面后**：`node scripts/build-sitemap.mjs`（sitemap 是生成的，别手改）→ `node seo/build-redirects.mjs` → 重新构建 → 跑账本。本地验收一律带 `NEXT_PUBLIC_SITE_INDEXABLE=true` 构建。
- ⚠️ **对线上跑检查要慢**：10-06 我一天内对线上并发跑了几十轮检查，触发了 Vercel 的自动防护，全站对不带浏览器的请求返回 403 约一小时（真人浏览器多等一两秒、Google 实时测试不受影响）。`check-equity` / `check-journal` 的线上模式已改成每请求间隔 600ms；上线后的整套验收只跑一遍，不要并行、不要连跑。
- 排名对比的两份基线：`seo/ranked-before-2026-09-20.json`、`seo/ranked-after-2026-10-06.json`（后者虽是 10-06 拉的，但数据源各词最后更新在 10-01 之前，等于第二份切换前基线；真正的影响要 2–4 周后再拉）。

## 跳转的真相源是 vercel.json

旧 URL 清单（153 条存档 + GSC 里有点击但不在清单的）共 179 条。`seo/sources.mjs` 是旧 URL 与点击数据的唯一入口（两份 GSC 导出取较大值；**2026-09-27 实测 09-23 那份窗口太短，漏了 49 个有点击的页面**——重算映射前先从 GSC 重新导出近 3 个月「网页」表），`seo/build-redirects.mjs` 是生成器（新站上有同网址页面的自动不生成跳转），`seo/check-mapping.mjs` 是验收门。

`npm run host-configs` 从 vercel.json 生成 Apache/IIS/Netlify/nginx 四份等效配置——真 Apache 实测 156/156 与 Vercel 行为一致，所以这个站搬去任何主机都不丢跳转。改跳转只改 vercel.json 的生成逻辑，然后重新生成，别手改产物。

## 另一条 session 在并行处理旧站

Restaurant 仓有个 session（`restaurant-e7`）同时在做旧站 WordPress 的 SEO/评论/广告——**两边数据要交叉验证，不能互相直接采信**。这条规矩不是客套：这轮返工两次都是因为直接信了对方的估算工具（先是我的 etv 判断被更准的 GSC 推翻，中途还各自的正则/口径都出过错，靠交叉验证抓出来的）。跨 session 消息用 `SendMessage`，对方名字是 `restaurant-e7`。

## 已知坑

**Safari 播视频强制要求服务器支持 HTTP Range。** `scripts/serve.mjs` 已补 206 响应与生产对齐；`preload="none"` 的 video 在 Safari 上要先显式 `load()`、**然后立刻 `play()`**（不要等 `loadeddata`，iPhone 不为没在播的视频预加载，会永远等不到）。

**`content-visibility` 的 `contain-intrinsic-size` 用单值会连宽度一起约束**，在 768px 撑出横向溢出。只约束高度用 `contain-intrinsic-block-size`。

**测试端口可能被早先残留的进程占着。** 验证 Apache/预览服务器行为前先 `lsof -nP -iTCP:<port> -sTCP:LISTEN`，否则会对着别人的服务器调试半天。

## 卡在客户侧的事

1. ~~Delegate Access 授权~~ —— 2026-09-23 已接受。但实测 **GoDaddy 的 API 令牌不认委托授权**（授权后读客户域名仍 403），切换日改 DNS 走网页端，详见 `seo/GODADDY-PLAN.md`
2. ~~Google Search Console~~ —— 2026-09-23 已自助验证（WordPress 后台加 meta 标签），资源在 jaye.mao 名下。~~GA4~~ —— 已建在 Fyno Restaurants 账号(401363907)下，ID `G-JZD3SQCWMP`，已接进 Vercel 生产环境变量并线上生效。建号步骤与坑见 memory `ref_ga4_property_setup`（跨项目通用，以后给别的店建 GA4 直接抄）
3. **SEO 供应商四问**（是谁/月费/到期/cytd.ai 上 45 篇内容归属）—— 停约与切换不能同期
4. ~~客户实拍照片~~ —— 2026-09-24 已全站替换；~~官网横版视频~~ —— 已上线
5. **店里要确认**：其余寿司卷的菜名（凑满每个卷分区一排 3 张）；烧卖/素煎饺是否每份 6 个；Tomato Seafood Ramen 命名
6. ~~正式切换~~ —— **2026-10-05 已完成**（Vercel；待办见 `seo/CUTOVER-CHECKLIST.md` §10：GSC/Bing/平台链接/测试邮件/真 iPhone、头一周每天读点击；vercel.app 已 308 跳转到正式域名）
