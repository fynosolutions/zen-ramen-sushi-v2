# 怎么改这个网站（给设计同事）

不用装任何软件，全部在 GitHub 网页上完成。

- 预览网站：https://zen-ramen.vercel.app
- `main` = 正式版本，**已上锁**：只能通过 Pull Request（PR）修改。

## 东西都在哪

| 想改的 | 文件位置 |
|---|---|
| 图片 | `public/images/`（**同名替换即可，不用改名**） |
| 视频 | `public/video/` |
| 颜色、字体、间距、版式等所有样式 | `app/globals.css` |
| 各页面结构 | `app/` 下各文件夹，首页是 `app/page.tsx` |
| 页头、页脚、相册、视频等模块 | `components/` |
| 文案、营业时间、电话 | `content/site.ts` |

## 改的流程（4 步）

1. **改**：打开文件点右上角铅笔图标编辑；换图片就进 `public/images/` → **Add file → Upload files**，把同名新图拖进去。
2. **保存时选「Create a new branch and start a pull request」**（不能直接提交到 main，已上锁）。
3. **写清楚 + 看预览**：PR 里写一两句改了什么，附改前/改后截图（**手机、电脑各一张**）。PR 页面会自动跑检查，并给出一个单独的预览网址。
   - 检查**绿灯** = 可以给人看；**红灯** = 先别合并，找 Jaye。
4. **等 Jaye 点头（Approve）后再合并**，合并后约 1 分钟预览网站更新。

同一个 PR 可以继续改：在 PR 的分支上再编辑文件，预览会跟着更新。

## 请别碰（改坏会影响 Google 排名或菜品信息）

- `vercel.json`、`seo/` 文件夹：旧网址跳转，改坏了会丢 Google 流量
- `content/menus.json`：菜单价格与菜名。设计上要动菜品文字，只能写菜单上真有的
- `app/layout.tsx` 里的 `verification`（Google 验证）那段

## 改坏了怎么办

不会丢东西：GitHub 保存每一个版本。合并后发现问题，找 Jaye 一键退回。
