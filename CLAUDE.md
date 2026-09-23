@AGENTS.md

# ZEN RAMEN & SUSHI — 客户 024 官网

Fyno 给客户做的新官网。旧站（WordPress.com）每月约 1 万次自然流量、546+ 排名词，**新站上线是一次迁移，不是一次发布**。

- 线上（我们的临时架子）：https://zen-ramen.vercel.app · Fyno 的 Vercel team，push main 即自动部署
- 客户的正式域名：zenramensushiny.com（**仍指向旧站，尚未切换**）
- 本地预览：`npm run preview` → 127.0.0.1:3001（先 `npm run build`）

## 红线（违反 = 事故）

**域名和邮箱是客户的，Vercel 是我们的。** 切换只改 A 和 CNAME 两条记录；`zenramensushiny.com` 的 MX/TXT 上挂着客户在用的 Microsoft 365 + titan 邮箱，**改 nameserver 会当场中断收信**。完整方案与回滚：`seo/GODADDY-PLAN.md`、`seo/DNS-PLAN.md`、`seo/CUTOVER-CHECKLIST.md`。

**菜品文案与配图只写菜单里真有的东西。** 每一样食材、价格、卷名都要能在 `content/menus.json` 找到出处——曾凭空写出三种 happy hour 不供应的寿司卷和一个不存在的 $5 档位。写之前先查，别凭印象。

**换图片/视频时换文件名。** 同名替换会被浏览器缓存挡住，看起来"没换"。新图起新名、改引用、删旧文件。

## 素材现状：全是占位图

`public/images/dish-*.webp`（24 张菜品卡）、`zen-*.webp`（场景图）都是 gpt-image 按菜单描述生成的**占位图**，等客户实拍到货后替换。台账与出图铁律：`docs/design-references.md`。

`public/ig/*.mp4` 是 @zenramen_sushi 公开 reels 的自托管副本（已去黑边与片头水印、转 H.264 Main L4.0 yuv420p faststart）。新增一条 = 在 `content/ig.ts` 加一行，视频与封面放进 `public/ig/`。

## 账本：改完跑，不靠感觉

`GATES.md`（SEO 迁移 11 门）与 `GATES-video.md`（视频与搬家 12 门）是可执行的验收清单：

```
node ~/.claude/skills/unlazy/scripts/gate-check.mjs --reverify GATES.md
```

`npm run seo` 是其中四道的快捷方式，已挂进 GitHub CI——改坏 301 映射、丢标题、删 alt 会亮红灯合不进去。

## 数据真相源：GSC 真实点击 > 估算工具

`seo/gsc-clicks-2026-09-23.json` 是 Search Console 的**真实点击**，逐 URL。DataForSEO 的 etv 和 SE Ranking 的估算都高估约一个数量级——实测有页面 etv 180 而真实点击为 0。**任何"这页值不值得保"的判断以 GSC 为准**，估算工具只用于看趋势。Search Console 资源已验证在 jaye.mao@fynosolutions.com 名下，可直接登 search.google.com/search-console 查。

## 跳转的真相源是 vercel.json

153 条 301 承接旧站全部 URL（`seo/old-urls-2026-09-20.txt` 是实测存档，`seo/redirect-map-report.tsv` 是映射报告）。`npm run host-configs` 从它生成 Apache/IIS/Netlify/nginx 四份等效配置——真 Apache 实测 156/156 与 Vercel 行为一致，所以这个站搬去任何主机都不丢跳转。改跳转只改 vercel.json，然后重新生成。

## 已知坑

**Safari 播视频强制要求服务器支持 HTTP Range。** `scripts/serve.mjs` 已补 206 响应与生产对齐；`preload="none"` 的 video 在 Safari 上要先显式 `load()` 再 `play()`，否则永远 readyState=0。

**`content-visibility` 的 `contain-intrinsic-size` 用单值会连宽度一起约束**，在 768px 撑出横向溢出。只约束高度用 `contain-intrinsic-block-size`。

**测试端口可能被早先残留的进程占着。** 验证 Apache/预览服务器行为前先 `lsof -nP -iTCP:<port> -sTCP:LISTEN`，否则会对着别人的服务器调试半天。

## 卡在客户侧的事

1. ~~Delegate Access 授权~~ —— 2026-09-23 已接受。但实测 **GoDaddy 的 API 令牌不认委托授权**（授权后读客户域名仍 403），切换日改 DNS 走网页端，详见 `seo/GODADDY-PLAN.md`
2. ~~Google Search Console~~ —— 2026-09-23 已自助验证（WordPress 后台加 meta 标签），资源在 jaye.mao 名下。**GA4 仍缺**
3. **SEO 供应商四问**（是谁/月费/到期/cytd.ai 上 45 篇内容归属）—— 停约与切换不能同期
4. **客户实拍照片与视频** —— 到货后替换全部占位素材
