# V2 内容与素材审计

日期：2026-09-20。

## 菜单

用户已确认三份 PDF 为正式来源并要求保留 Cash / Card。已按 12 页视觉内容转录出 44 个菜单类别、451 条显示记录（包括菜单之间重复的饮品、套餐规格和加料）。每条记录保留源文件与页码。

| 菜单 | 类别 | 显示记录 | 来源 |
| --- | --- | --- | --- |
| Dinner | 22 | 256 | `ZEN NOODLE DINNER MENU-01.pdf`，第 2–8 页；第 1 页为封面 |
| Lunch | 12 | 95 | `ZEN NOODLE Lunch II takeout-2023-04-01.pdf`，第 1–2 页 |
| Happy Hour | 10 | 100 | `zen noodle happy hour menu final print-02.pdf`，第 1–2 页 |

已检查套餐列对应、现金 / 刷卡价格、午餐工作日与节假日限制、Happy Hour 红字参与标记、过敏与生食提示、加料与替换条件。Lunch Roll 的 36 个可选卷保留为套餐选择说明，而不是伪造 36 个单点价。

源文件存在以下疑点，当前按原稿保留，没有用计算替换：

- Dinner 第 2 页 Miso Soup：Cash 3.99 / Card 4.13。
- Dinner 第 5 页 Sushi & Sashimi Omakase：Cash 49.99 / Card 51.98。
- Lunch 第 2 页 Bento A：13.99 / 14.55；同页部分其他 13.99 项目 Card 为 14.59。
- Lunch 第 2 页 Bento B：14.99 / 15.63。
- Lunch 第 2 页 Bento F 原稿写为 “Poke Katsu”，未擅自改成 Pork。
- Dinner 单点菜中的 “Spanish Mackwrel”、加料中的 “Naruomaki” 等原稿拼写保留；需要店方确认后再修改。
- 清酒仅列一个金额，采用 Listed Price，不补造 Cash / Card 差价。

`reviewStatus: visually-transcribed` 表示视觉转录，并不表示每个原菜单疑点已获店方更正确认。修改菜单请编辑生成脚本并同步 PDF，不直接静默改生成结果。

## 文字

- 店名、地址、电话与营业时间来自原 Brief 及旧站 Location 页面。
- Hero、品牌介绍、拉面、寿司和 Catering 主体文案复用旧站；格式和标点作必要清理。
- 页面标题、导航提示、表单说明及互动状态为新版界面文案，不引入新的经营承诺。
- 旧 About 的“Lunch specials available daily”与 PDF 冲突，未搬入新版本。
- 原政策文字来自 `https://zenramensushiny.com/privacy-policies-3/` 与 `https://zenramensushiny.com/terms-conditions/`，保存于 `content/legal.json`；有效日期仍为 June 8, 2026，保留原联系邮箱 support@zenramensushiny.com。只修复了读取时引号乱码。
- 已采用旧站公开的无日期 Resy 场馆链接。旧说明中固定 2026-09-20 的地址保留在原计划里作为记录。

## 图片

图片全部取自用户授权的旧站或本地 Logo，没有新生成 AI 图片。下载源索引为 `docs/research/downloaded-media.json`，WebP 为部署资源，下载的 JPG / PNG 原件保存在 `docs/research/original-images/`。

- 图片编号 0、3、4、10 的旧站文件名有 Unsplash 线索，不能声称为店方原创实拍。
- 编号 2、6、7、8、12、13 的文件名有 ChatGPT-Image 线索，按 AI 来源待复核记录，不能把它们说成准确实物或真实店内纪录。
- 编号 9 与 13 用于 Dining Inspiration，没有宣称是已核实的门店实景。Gallery 的真实环境素材要求仍需店方核实或补充。
- 原 JPEG Logo 不做重绘，完整保留。favicon 为红底 Z 简化标记。
- 图片压缩成 WebP；首屏主图约 56 KB，现用图中最大约 212 KB。

## 未完成的素材 / 业务条件

用户已确认本轮先交付图片版，视频与最终封面后补。其余待处理：Uber Eats 精确商户链接、环境图片真实性、具体原菜单疑点、营业时间上线复核、旧 Blog 迁移策略，以及 Git / 原正式域名接入。独立 Vercel 评审站已经发布。

本次未发送邮件、下订单或完成真实预约。Resy 页面依赖 JavaScript，本次网络文本读取不能证明预约库存；外卖链接依照已提供地址配置，上线仍需店方实际打开检查。
