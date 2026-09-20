# V2 实施与验证记录

更新日期：2026-09-21（Asia/Shanghai）。当前产物：用户确认范围内的图片版静态网站，已发布至独立 Vercel 评审站，未替换原正式官网。

在线地址：https://zen-ramen-sushi-v2.vercel.app 。用户已明确确认 Gallery 视频后补。

## 阶段状态

| 阶段 | 状态 | 证据 / 限制 |
| --- | --- | --- |
| P0 | 完成 | 原计划、12 页菜单预览与来源索引 |
| P1 | 完成 | GSAP Intro、SessionStorage、Skip / Escape、Reduced Motion、3.8 秒退出保护、无 JS 可用 |
| P2 | 完成 | 六项导航、移动菜单、外卖下拉和预约入口 |
| P3 | 完成 | 单店地图 / 营业信息、菜单预览、About；按计划顺序实现 |
| P4 | 已实现，原菜单疑点保留 | 三套结构化菜单、双价格、套餐与 PDF，About 完整页；见内容审计 |
| P5 | 完成 | mailto 至用户确认的邮箱；校验、日期、复制恢复及诚实状态 |
| P6 | 本轮图片版完成 | Gallery / Lightbox / Footer / 政策页已实现；视频按用户确认后补，环境图真实性仍待店方确认 |
| P7 | 本地检查与线上回归完成 | 构建、类型、Lint、8 项 Playwright；线上 7 页、15 条重定向、3 份 PDF 通过；没有宣称完成 Safari 实机或真实业务交易 |
| P8 | 独立评审站已发布 | Vercel Ready；Git 自动发布与原正式域名切换仍待后续处理 |

## 已通过

- `npm run build`：Next.js 16.3.5，所有路由静态预渲染，输出在 `out/`。
- TypeScript 构建检查和 `npm run lint` 无错误。
- 8 项 Playwright：首访 Intro / 会话跳过；Reduced Motion / 无 JS；菜单 hash / 双价格 / 键盘 / 历史返回；手机导航 / 外卖 / Escape；Lightbox 前后切换与焦点返回；地图点击加载；表单必填 / 日期 / 邮件准备；静态路由与响应式。
- 响应式自动检查：360、768、1440px；首页、菜单、About、Events、Gallery、Privacy、Terms 无横向溢出或已加载图片失效。
- 390px 和 1440px 的 5 个主要页面人工截图检查；`docs/qa/browser-audit.json` 记录无页面 JS 异常及图片加载成功。
- 菜单数据：整数美分、唯一 ID、来源页码边界和非空菜名校验通过。
- 所有源 PDF 保留下载入口；图片转换为本地 WebP。
- 线上 Edge 实测：7 个页面、全部 15 条已配置旧路径重定向、3 份 PDF 均返回 200；跳转目标路径与锚点符合配置；菜单 Lunch 切换成功，浏览器无 JS 异常，评审站维持 noindex。记录见 `docs/qa/online-verification.json`。

## 必须如实保留的限制

- 本机测试为 Windows Edge / Chromium，不是 iPhone Safari 实机。
- 地图显示受 Google Maps 服务 / 网络影响；保留独立导航外链和不按比例的街区示意。
- mailto 仅能验证准备内容及发起客户端打开，无法证明顾客已发送或店铺已收信。
- Gallery 视频按用户确认后补；环境图未完成店方真实性确认。
- 原菜单个别拼写 / 价格疑点已保留源值，不能自动推算或当作已纠错。
- 已配置旧路径重定向已部署并逐项通过线上回归；正式域名、真实商户落地与旧 Blog 保留须在原站切换前核对。
- 外部平台没有被用来创建真实预约或订单。
- 自动审批曾拒绝自动打开浏览器，返回策略限制；用户可直接点击本地预览链接。此限制不影响网站文件或本地服务。

## 验证文件

- `tests/site.spec.ts`：可重复执行的交互测试。
- `docs/qa/preview-desktop.png`、`preview-mobile.png`：静态成品首屏。
- `docs/qa/home-*.png`、`menu-*.png`、`events-*.png`、`gallery-*.png`、`about-*.png`：各页面截图，部分为开发预览检查过程，最终状态以最新本地成品为准。
- `docs/qa/browser-audit.json`：图片与运行时检查。
- `docs/qa/online-verification.json`、`online-desktop.png`、`online-mobile.png`：独立 Vercel 站点的最终线上验证与截图；可用 `node scripts/verify-online.mjs` 重新检查。
- `docs/qa/lighthouse-mobile.json`：如生成成功，为本地实验室测量，不能当作线上真实用户性能数据。

## 性能与可访问性实测

2026-09-21 本地静态成品、移动端模拟与压缩传输：Performance 93、Accessibility 100、Best Practices 100，CLS 0，LCP 约 3.2 秒。LCP 尚未达到计划中的 2.5 秒目标，不能报告为已达标。SEO 69 来自评审站明确设置的 noindex；正式域名验收后通过公开构建开关启用索引。

初次检查发现的静态预取 404、小字对比度和无效 ARIA 已修复。站内页面跳转改用普通静态链接，避免依赖 Next.js segment-prefetch 路由重写。最新扫描没有相应报错。

最初 Lighthouse CLI 在生成报告后的浏览器临时目录清理阶段报 Windows EPERM；改为使用自行管理的浏览器实例后扫描正常结束，最新 JSON 是完整测量报告。
