# ZEN RAMEN & SUSHI · V2

英文餐厅网站第二版。Next.js 16.3.5、React、TypeScript、GSAP；构建为纯静态 HTML / CSS / JS，输出在 `out/`。没有数据库、业务 API、Server Action、邮件发送后端或运行时 Functions。

本轮图片版在线预览：[zen-ramen-sushi-v2.vercel.app](https://zen-ramen-sushi-v2.vercel.app)。这是独立的 V2 评审站点，已启用 noindex；尚未切换现有官网域名。用户已确认视频后补，本轮按图片版交付。

公开源码仓库：[fynosolutions/zen-ramen-sushi-v2](https://github.com/fynosolutions/zen-ramen-sushi-v2)，默认分支 `main`。仓库包含源代码、品牌与菜单素材、执行计划及验证记录；不包含本地凭据、依赖目录与构建缓存。

```powershell
git clone https://github.com/fynosolutions/zen-ramen-sushi-v2.git
cd zen-ramen-sushi-v2
```

## 本地使用

建议 Node.js 22 或更新的受支持版本；本机使用 Node.js 24.16.0 验证。

```powershell
npm ci
$env:NEXT_TELEMETRY_DISABLED='1'
npm run dev -- --port 3000
```

开发预览：`http://127.0.0.1:3000`。

```powershell
npm run build
npm run preview
```

静态成品预览：`http://127.0.0.1:3001`。`scripts/serve.mjs` 仅是本地查看静态文件的工具，不会部署为网站后端。

```powershell
npm run typecheck
npm run lint
npm test
```

浏览器测试使用本机 Microsoft Edge 的 Chromium 引擎。如果机器没有 Edge，可在 `playwright.config.ts` 去掉 `channel: 'msedge'`，安装 Playwright Chromium 后运行。测试针对生产导出的 `out/`，改动后先重新构建。

## 页面与功能

- `/`：品牌入场动画、Hero、营业时间 / 地图、菜单预览、About、Catering 与 Gallery 预览。
- `/menu/`：Dinner / Lunch / Happy Hour 切换、分类锚点、双价格、原 PDF 入口。
- `/about/`：品牌介绍及旧站文案。
- `/events-catering/`：完整咨询表单与校验，打开顾客邮件应用。
- `/gallery/`：图片网格、键盘可操作 Lightbox；视频插槽已实现，视频素材仍缺。
- `/privacy-policy/`、`/terms-conditions/`：从旧站迁移的现有政策原文。
- 静态 404、favicon、sitemap、canonical、Restaurant JSON-LD。

Intro 同会话只播放一次。测试时清除浏览器的 `sessionStorage['zen-intro-v2']` 后刷新。支持 Skip、Escape、Reduced Motion、资源加载等待和 3.8 秒退出保护；JavaScript 未启动时页面正常显示。

Google Maps 按需加载。初始街区示意是原创、明确标注不按比例的导览图；点击 Explore Google Maps 加载实际地图 iframe，导航外链始终可用。不使用 Maps 私钥。

## 日常维护

| 修改事项 | 文件 / 方法 |
| --- | --- |
| 门店地址、电话、时区、营业时间、预约与外卖链接 | `content/site.ts` |
| 常用英文文案 | `content/site.ts` 中 `copy`；About 完整段落在 `app/about/page.tsx` |
| 菜品与双价格 | 编辑 `scripts/build-menu-data.py` 中对应源数据，运行 `python scripts/build-menu-data.py` 生成 `content/menus.json`，再构建 |
| 原菜单 PDF | 替换 `public/menus/dinner.pdf`、`lunch.pdf`、`happy-hour.pdf`；同步转录数据 |
| 图片 | `public/images/`；组件中的引用与 `content/media.ts`；来源记录在 `docs/research/downloaded-media.json` |
| 视频 | 将经过确认的 MP4 / poster 放入 `public/video/`，在 `content/media.ts` 将 `galleryVideo` 从 null 改成 `{src, poster, title}` |
| Logo | `public/brand/logo.jpg`；原文件保持不变 |
| 配色、布局、响应式 | `app/globals.css` 顶部 Tokens 及各模块规则 |
| 政策文字 | `content/legal.json`；保留原文来源和有效日期 |
| 正式域名 | 检查 `app/layout.tsx`、`public/sitemap.xml`、`public/robots.txt` 中当前的 `https://zenramensushiny.com` |

所有价格存储为整数美分。禁止从 Cash 按比例推导 Card；PDF 中单价且没有明确支付方式的清酒使用 Listed Price，不能补出第二种价格。当前结构为 Dinner 256 条、Lunch 95 条、Happy Hour 100 条，包含不同套餐规格及在各菜单重复列出的饮品，并非 451 道不同菜品。

菜单文本转录仅整理排版和英文标点；可疑拼写及价格保留源值，见 `docs/content-audit.md`。原 PDF 始终可供核对。

## Catering 邮件流程

用户已确认收件人：`catering@zenramensushiny.com`。表单只在浏览器内校验并构造 `mailto:`，不会自动发送、存储咨询记录，也不向本站传输字段。顾客在邮件应用中点击 Send 才能发送。

未配置邮件客户端或正文过长时，可查看 / 复制咨询内容自行发送。网站只显示“准备好邮件”，不会声称已发送成功。更换为直接在线提交属于另外的第三方服务接入，不能擅自加后端。

## Vercel 部署

`vercel.json` 已配置静态构建输出及主要旧 URL 重定向。已使用现有 Vercel 登录部署到独立项目 `zen-ramen-sushi-v2`，项目源码保存在上述 GitHub 仓库。当前通过 Vercel CLI 发布；Vercel 尚未连接 GitHub 自动部署，推送代码本身不会更新网站。

1. 将源代码放入店方指定的 Git 仓库，排除 `node_modules`、`.next`、`out` 和任何本地凭据。
2. 在现有 Vercel 项目连接该仓库；Framework Preset 选择 Other（配置为 `framework: null`），Build Command 为 `npm run build`，Output Directory 为 `out`。这样按普通静态目录发布，避免 Next.js 平台适配器在 `out` 查找服务器构建清单。
3. 本轮独立评审站默认 noindex。只有正式域名和内容均通过验收后，将公开构建变量 `NEXT_PUBLIC_SITE_INDEXABLE=true` 并重新构建，才开启索引；不根据 Vercel production / preview 环境自动判断。
4. 检查 Preview 所有页面、PDF、菜单 hash 切换、外链、地图和邮件客户端；确认部署中没有应用 Functions。
5. 解决视频 / 真实环境图等内容缺项后，保留旧站和原 DNS 配置，再绑定正式域名。
6. 逐条核对 `vercel.json` 的旧路径、查询参数和锚点重定向；本地静态服务器不模拟 Vercel 重定向。
7. Blog 不在本次新建范围；域名切换前必须决定旧文章的保留 / 归档方式，不能直接删除已有文章。
8. 回退时恢复先前 Vercel 部署或原主机域名指向；不要删除第一版备份。

`.env.example` 仅包含公开的索引开关，不含任何密钥。不会把 Vercel Token、邮箱密码或第三方服务密钥写入仓库。`.vercel/` 为本机项目关联资料，已被 Git 忽略。

## TODO / Client Confirmation

| ID | 状态 | 说明 |
| --- | --- | --- |
| C01 | PDF 版本及双价格已确认；个别原文疑点保留 | Miso Soup 卡价、午餐 Bento 个别卡价、少数菜单拼写见内容审计，不自行纠正 |
| C02 | 时段已按 PDF 实施 | 午餐周一至周五 11:30–16:00，节假日除外；Happy Hour 16:00–20:00，不额外扩张可用时间 |
| C03 | 待补 | Uber Eats 本店准确链接；当前保留 Coming Soon 禁用项 |
| C04 | 已完成 | mailto 方式和 Catering 邮箱由用户确认，已实现 |
| C05 | 已实施计划建议 | 使用旧站已公开的不带日期 Resy 场馆链接，避免过期日期；未提交真实预约 |
| C06 | 用户确认后补 | 本轮图片版已获确认；Gallery 视频与封面在提供素材后接入 |
| C07 | 待核实 | 两张旧站环境图真实拍摄来源未确认，暂标为 Dining Inspiration；部分旧站图有 AI / 图库来源线索 |
| C08 | 不阻塞 | 当前 JPG Logo 已使用，矢量稿为可选后续优化 |
| C09 | 沿用旧站 | 上线前再次核对营业时间 |
| C10 | 独立预览与 GitHub 仓库已建立 | Vercel 项目已关联并发布，GitHub 公开仓库为 `fynosolutions/zen-ramen-sushi-v2`；自动部署与原官网正式域名仍待接入 |

## 当前验证结果

`npm run build`、TypeScript、ESLint 与 8 项 Playwright 场景已通过。测试覆盖生产静态输出中的主要交互、7 条页面路由、360 / 768 / 1440px 布局，以及首访、无 JavaScript、Reduced Motion、表单校验、菜单双价格、地图按需加载和图库键盘操作。

桌面 / 手机尺寸截图和浏览器记录位于 `docs/qa/`。这是 Windows Edge 上的设备尺寸模拟，不等同于 iPhone Safari 实机验收。Google Maps 是否能够显示地图内容依赖访客网络；已验证 iframe 地址与按需加载行为。没有发送真实咨询、创建订单或完成真实预约。

最近一次本地 Lighthouse 移动端实验室测量：Performance 93、Accessibility 100、Best Practices 100、CLS 0；LCP 约 3.2 秒，尚未达到原计划 2.5 秒目标。SEO 69 的扣分项是评审版本主动设置的 noindex。它们不是线上真实用户数据。

更详细的阶段状态与未覆盖项见 `docs/qa-checklist.md`。不要将独立评审站误称为已经替换原正式官网。
