# ZEN RAMEN & SUSHI 第二版网站可执行计划

版本：1.1 ｜ 资料核查与用户确认日期：2026-09-20 ｜ 当前阶段：资料整合与实施规划

> 实施更新（2026-09-21）：已按本计划制作并发布独立图片版评审站 https://zen-ramen-sushi-v2.vercel.app 。用户确认本轮视频后补。本文原阶段表保留为初始计划快照，当前进度、验证结果和剩余事项以 `docs/qa-checklist.md` 与 `README.md` 为准；原正式官网域名尚未切换。

本文件将原开发说明、现有官网及本地素材转换为可逐项执行的任务。此次交付仅包含计划和调研记录，没有开始网站开发、部署或修改第一版网站。后续开发以用户最新指令为最高优先级，以原开发说明为需求基线；本文中的“建议”和“待确认”不等同于已经获得店方确认。

## 1. 项目目标与已确定范围

为纽约单店制作英文官网第二版，让访客能够快速查看菜单及价格、了解营业时间与地址、预约、跳转外卖平台、咨询活动或 Catering，并浏览菜品和环境图片及横版视频。

### 1.1 本轮用户已确认的目标

1. **品牌体验与转化并重**：突出日式氛围，同时方便看菜单、预约和点餐。首页以菜单和预约为主要行动入口，Header 保持醒目的点餐入口；不把页面单独偏向外卖或预约。
2. **三份 PDF 均作为正式菜单来源，保留现金价和刷卡价**：不再把菜单版本选择列为等待用户确认的前置条件；只对具体不可辨认或疑似错误条目做单项复核。
3. **Events / Catering 确定使用 mailto**：收件人为 `catering@zenramensushiny.com`。填写并通过前端校验后打开顾客邮件应用，由顾客发送；不接入第三方表单或邮件发送后端。

以上为 2026-09-20 用户明确答复，覆盖下文原始资料中的未定状态，后续执行无需再次询问相同选择。

### 1.2 实施边界

| 项目 | 执行基线 |
| --- | --- |
| 品牌 | ZEN RAMEN & SUSHI |
| 门店 | 150 W 36th St, New York, NY 10018；仅一家 |
| 电话 | (646) 870-7509；电话链接使用 `tel:+16468707509` |
| 网站语言 | 英文；开发计划与维护说明可用中文 |
| 风格 | 红、黑、白；圆润亲和的英文字体；真实餐饮图片；适量日式图形 |
| 核心结构 | 首页 + 完整菜单 + About + Events / Catering + Gallery |
| 技术边界 | Next.js、React、TypeScript，静态导出；无运行时后端 |
| 托管 | Vercel，通过 Git 仓库构建部署 |
| 业务完成方式 | 预约、外卖和导航使用外链；活动咨询打开邮件客户端发送至已确认 Catering 邮箱 |
| 不在本次范围 | 自建点餐、支付、会员、后台、数据库、邮件发送服务、API Route、Server Action、Serverless / Edge Function |

优先级：用户新增资料和菜单 PDF → 第一版官网的非菜单内容 → 原说明中指定的平台链接。Totto Ramen 和 Hey Noodles 只作为指定范围的设计或交互参考。

## 2. 资料盘点与关键发现

### 2.1 本地资料

| 文件 | 已核查情况 | 后续用途 |
| --- | --- | --- |
| `ZEN_RAMEN_SUSHI_Codex_Development_Brief.md` | 已完整阅读，包含开发顺序、六项导航、外链、动画、静态部署及验收要求 | 需求基线，不覆盖原文件 |
| `4a9cabbc5831e665cdeac0855837d3df.jpg` | 1280 × 1280 白底 JPG；黑白猫、筷子、红碗、莲花与 ZEN 字样 | 品牌主标识、入场动画、页眉页脚；尚无透明或矢量原稿 |
| `ZEN NOODLE DINNER MENU-01.pdf` | 8 页，约 3.23 MB，无可提取文字层 | 晚餐完整菜单及饮品 |
| `ZEN NOODLE Lunch II takeout-2023-04-01.pdf` | 2 页，约 8.79 MB，无可提取文字层 | 午餐套餐、适用时段及饮品 |
| `zen noodle happy hour menu final print-02.pdf` | 2 页，约 13.34 MB，无可提取文字层 | Happy Hour 菜单及适用条件 |

三份菜单共 12 页，已逐页渲染并进行分类与规则检查；本阶段没有完成逐菜品文字和价格的最终录入。自动文字提取结果为空并不代表菜单为空。后续必须采用图像识别或人工转录，再对照原页逐项校对。

午餐文件名含 2023 年日期，但不能仅依据文件名认定它失效。用户已明确确认三份 PDF 为正式菜单来源，按此执行；后续仅在店方提供新版本或发现具体条目疑点时更新。

调研附属资料位于 `docs/research/`：12 张菜单页面预览、文字层提取记录、官网媒体与外链清单。它们是研究材料，不应直接全部复制到网站公开资源目录。

### 2.2 第一版官网可复用信息

现有首页提供拉面、寿司、特惠和 Events & Catering 内容；About 页面有更完整介绍。后续建立文案来源表，直接复用选定原文并只清理格式；不编造品牌历史、评价、销量或获奖信息。来源：[第一版首页](https://zenramensushiny.com/)、[About](https://zenramensushiny.com/about-us/)。

现有营业时间如下，店铺时区统一为 `America/New_York`：

| 星期 | 营业时间 |
| --- | --- |
| Sunday | 12:00 PM – 11:00 PM |
| Monday – Wednesday | 11:30 AM – 11:00 PM |
| Thursday – Friday | 11:30 AM – 12:00 AM（次日凌晨） |
| Saturday | 12:00 PM – 12:00 AM（次日凌晨） |

以上来自[现有 Location 页面](https://zenramensushiny.com/location/)，页面、页脚与结构化数据使用同一份配置；上线前再次核对。

已找到两个公开邮箱：`catering@zenramensushiny.com` 用于 Catering 咨询，`info@zenramensushiny.com` 用于一般联系。用户已明确确认前者为新版咨询收件人；本次未发送测试邮件或测试收信能力。来源：[第一版首页](https://zenramensushiny.com/)，以及本轮用户答复。

现有 Location 页的预约链接不带日期；原开发说明使用固定日期 `2026-09-20`。保留两者来源，建议最终采用无日期场馆链接，避免网站长期指向过期日期，待配置定稿时确认。来源：[Location](https://zenramensushiny.com/location/)。

### 2.3 已发现的冲突与处理方式

| 编号 | 发现 | 执行方式 |
| --- | --- | --- |
| F01 | 原说明把菜单 PDF、Logo 列为待提供；实际已经存在 | 更新状态为“已收到”；只保留透明 / 矢量 Logo 的可选补充项 |
| F02 | 多数菜单同时列 Cash 与 Card (credit/debit) 价格 | 数据与界面保留两套价格，不能合成一个“起价”或按比例推算 |
| F03 | 午餐 PDF 标明 Monday–Friday，11:30 AM–4:00 PM，Except Holiday；旧 About 页面提到每日午餐特惠 | 以 PDF 的限制为准；旧文中的冲突句不直接搬入待发布页面，记录必要修改并请店方复核 |
| F04 | Happy Hour PDF 标明 4 PM–8 PM；首页进一步写明 Daily | PDF 管时间和菜品价格，Daily 来源单独记录为旧站，上线前核对适用日期 |
| F05 | 部分 PDF 单项价格看起来不符合统一换算比例 | 原样录入并标记疑点，不自动纠错。例如晚餐第 2 页 Miso Soup 为 3.99 / 4.13，不能按其他菜品比例改价 |
| F06 | 原说明建议 Next.js Image 优化，同时禁止运行时后端 | 图片预先压缩并生成响应式尺寸；禁用默认在线优化，详见技术方案 |
| F07 | Catering 邮箱已在旧站公开，用户已确认使用邮件客户端方案 | 使用已确认邮箱，不再等待外部表单地址；不能虚构“提交成功”状态 |
| F08 | 旧站媒体文件名中出现 `unsplash`、`ChatGPT-Image` | 仅可判断为图库或 AI 来源线索，不能据此声称均为门店实拍；逐张核查用途，不把非实拍环境图标成真实店内照片 |
| F09 | 本地没有视频；本次检查的首页、About、Location HTML 未发现 video / source 标签 | 视频仍为待补充项，不能把静态图片冒充视频，不能据此断言整个旧站绝无视频 |

### 2.4 参考站的使用范围与核查边界

已读取 [Totto Ramen](https://www.tottoramen.com/) 当前首页内容，能确认其含餐饮主题主视觉内容、菜单入口、品牌介绍和门店信息。当前页面同时包含多门店、评价及 FAQ 等内容，这些不扩展到本项目。新版严格按原说明只借鉴 HOURS & LOCATION、MENU、ABOUT 的布局思路和节奏；不声称参考站当前恰好采用相同命名或顺序。

已读取 [Hey Noodles](https://heynoodles.com/) 页面，确认有 Loading 内容。本次没有用可交互浏览器实测完整入场动画，所以“像素化显现、2–4 秒、揭幕退出”是原说明要求和本项目设计方案，不作为参考站真实实现机制的结论。开发开始时再检查其动态节奏，不复制品牌素材或源码。

已成功解析官网媒体地址并记录在 `docs/research/web-source-inventory.json`；地址存在于 HTML 不等于每张图片已下载或已通过清晰度检查。旧站 Catering 菜单地址本次读取失败，后续重试；不得标记其详细菜单已核实。

## 3. 页面结构与导航决策

### 3.1 路由方案

| 地址 | 内容与入口 | 验收重点 |
| --- | --- | --- |
| `/` | Intro → Hero → HOURS & LOCATION → MENU Preview → ABOUT → EVENTS / CATERING Preview → GALLERY Preview → Footer | Section 顺序一致；核心行动入口可见 |
| `/menu/` | Dinner、Lunch、Happy Hour 三套菜单；分类、价格、说明和原 PDF 入口 | 文本可选取；套餐和双价格完整；切换菜单不混价 |
| `/about/` | 旧站完整品牌介绍，去掉与 PDF 冲突的陈述后核对 | 首页只摘取原文摘要，此页承载全文 |
| `/#hours-location` | 单店营业时间、地址、电话和地图 | 子页面也可正确跳回首页定位；固定 Header 不遮挡标题 |
| `/events-catering/` | 大图、原有服务介绍、完整咨询表单 | 收件目标与状态诚实、可操作 |
| `/gallery/` | 环境、菜品、横版视频和图片放大 | 从首页预览或 Footer 进入，不增加第七项主导航 |

About 采用独立页以承接旧站较长内容；Hours & Location 采用首页完整 Section，避免重复维护两份营业信息。这是原说明允许范围内的具体实现选择。

Footer 保留一般联系入口，并检查旧站 Privacy Policies、Terms & Conditions 的迁移需要。正式替换旧域名时必须完成原文迁移或提供仍可访问的实际目标，不能将页脚链接留在已经失效的旧路径。Blog 不纳入新开发范围，旧文章是否归档或保留属于域名切换前的 URL 盘点事项。

### 3.2 Header 固定顺序

| 顺序 | 显示文字 | 行为 |
| --- | --- | --- |
| 1 | MENU | `/menu/` |
| 2 | ABOUT | `/about/` |
| 3 | HOURS & LOCATION | `/#hours-location` |
| 4 | ORDER DELIVERY/PICKUP | 展开四个平台，不设置虚假默认目标 |
| 5 | EVENTS/CATERING | `/events-catering/` |
| 6 | RESERVE TODAY | Resy 外链，明显按钮 |

Logo 返回首页。桌面端可在 Hero 上透明叠加、滚动后使用实体背景；移动端采用汉堡菜单。当前页面或 Section 明确标识；支持 Tab、Enter、Space、Escape、点击外部关闭及关闭后焦点返回。外卖下拉可通过 Hover、Focus 或点击打开，触摸端不依赖 Hover；主项与下拉层之间不得存在导致意外关闭的空隙。

### 3.3 外链集中配置表

| 项目 | 地址 / 状态 | 上线要求 |
| --- | --- | --- |
| Resy，原说明 | `https://resy.com/cities/new-york-ny/venues/zen-ramen-and-sushi?date=2026-09-20&seats=2` | 原样保留为来源，不无声变更 |
| Resy，推荐候选 | `https://resy.com/cities/new-york-ny/venues/zen-ramen-and-sushi` | 旧站正在引用；建议确认后使用，仍需实际打开核对场馆 |
| UBER EATS | 未核实 | 第一项文字保留，显示 Coming Soon，禁用链接；不得猜测同名店 |
| DOORDASH | `https://www.doordash.com/store/zen-ramen-sushi-new-york-64843/111425951/` | 按原说明配置；实测商户、地址、落地页与可用性 |
| GRUBHUB | `https://www.grubhub.com/restaurant/zen-ramen-and-sushi-150-w-36th-st-new-york/327291` | 按原说明配置；实测商户、地址、落地页与可用性 |
| TOAST ONLINE | `https://www.toasttab.com/local/order/zen-ramen-sushi-takeout-150-w-36th-street` | 原说明与旧站一致；仍需点击核对 |
| Google Maps | 复用旧站已指向该地址的地图 / 导航目标 | 核对定位，不误链同名餐厅；不需要网站后端 |
| Events / Catering | `mailto:catering@zenramensushiny.com`，已由用户确认 | 按第 6 节实现校验、邮件正文编码与打开客户端 |

以上链接除特别说明外仅完成来源核对，本次没有逐一测试第三方订单或预约流程。上线验证只需核对落地商户，不提交真实订单、预约或咨询。外部网页使用新标签页及 `rel="noopener noreferrer"`；`mailto:` 与 `tel:` 使用对应客户端行为。

## 4. 视觉方案与素材安排

整体方向：用现有猫咪红碗 Logo 建立品牌识别，以大幅餐饮图片、醒目标题、红黑白分区和留白组织内容。避免每个 Section 都重复同一套卡片；日式纹样只在分隔、边缘和少量印章位置使用。

| 模块 | 桌面端方案 | 移动端处理 |
| --- | --- | --- |
| Intro | 红 / 黑 / 白品牌覆盖层，Logo 或菜品逐步显现，再揭幕进入 Hero | 减少分块数量；减少动画偏好直接进入 |
| Hero | 一张重点菜品或餐饮氛围大图；品牌名和旧站简介；菜单、预约行动入口 | 预设独立裁切焦点，标题不遮食物主体，按钮不出屏 |
| Hours & Location | 地址与时间、地图合成一个完整构图；用边框、红色标签和纹样连接 | 信息在上、地图在下；地图建议至少 280px 高 |
| Menu Preview | 拉面、寿司及套餐图片配 Dinner / Lunch / Happy Hour 入口 | 文本入口足够大，价格与时段不放进图片 |
| About | 图文错位或两栏布局，保留原文含义 | 单列阅读，摘要通向完整页 |
| Events / Catering | 大图、服务原文、明显咨询入口 | 表单单列；首屏能看懂用途 |
| Gallery | 不同宽度图片形成编辑式网格，视频独立 16:9 区域 | 按阅读顺序排列，无横向溢出 |

实施时在一个 Token 文件中定义颜色、字体、间距、圆角、内容宽度和动效时长。候选颜色为品牌红 `#E51B23`、深黑 `#151515`、白 `#FFFFFF`；属于初始建议，需从 Logo 取样并检查按钮及文字对比后定稿。标题使用圆润粗体，正文使用清晰的无衬线字体；优先有明确可用许可的字体并自托管，控制字重数量。

Logo 先使用原文件的白底版本；若后续制作透明版，应保留完整猫、红碗、莲花、筷子和字样，不能重新生成导致品牌变形。无矢量原稿不阻塞开发。

素材台账至少包含：原始地址 / 本地文件、页面来源、像素尺寸、用途、裁切焦点、alt、实际来源类型、是否临时、是否经过人工核对。旧站照片优先复用，但不得把图库照片或 AI 图默认为店内实拍。菜单中的图片有示意性质说明，不能自动作为某道菜的精确实物证明。缺图先登记，只有确实不足时才考虑原说明允许的 AI 临时素材。

## 5. 菜单数据化专项

### 5.1 完整覆盖的页面和类别

| 来源 | 页码 | 已识别的内容范围 |
| --- | --- | --- |
| Dinner | 1 | 封面、店名、地址、电话 |
| Dinner | 2 | Appetizer、Appetizer From Sushi Bar、Hot Soup、Sides |
| Dinner | 3 | Sushi Rolls、Special Roll |
| Dinner | 4 | Chef Special Rolls |
| Dinner | 5 | Sushi Entree、Sushi or Sashimi A La Carte、Roll Combo |
| Dinner | 6 | Bento Box、Rice Dishes、Dessert |
| Dinner | 7 | Ramen Noodles、面条选项、Ramen Topping |
| Dinner | 8 | Sake、Beer、Wine、Cocktails、Chu-Hi、Japanese Drinks、Soft Drinks |
| Lunch | 1 | 饮品、封面及午餐适用日期 / 时间 |
| Lunch | 2 | Sushi Bar、Rice Dishes、Bento Box、Lunch Roll、加料和套餐条件 |
| Happy Hour | 1 | Appetizer、Sushi Rolls、Extra Topping、酒水和红字参与标记 |
| Happy Hour | 2 | 封面、时段、食品统一价提示、Japanese Drinks、Soft Drinks |

### 5.2 数据结构要求

每道菜必须具有稳定 ID、菜单类型、分类、原始名称、说明、份量 / 选项、价格、附加费用、标记、来源文件、来源页码、核对状态。价格以美分整数存储，不用浮点数计算或从现金价自动生成刷卡价。

建议数据结构包含以下字段：

```ts
type MenuPrice = {
  label?: string;       // 套餐数量、规格等
  cashCents?: number;   // 原文确实提供时才录入
  cardCents?: number;
  listedCents?: number; // 原文只列单价且未明确支付方式时使用
};

type MenuItem = {
  id: string;
  menu: 'dinner' | 'lunch' | 'happy-hour';
  category: string;
  name: string;
  description?: string;
  prices: MenuPrice[];
  options?: string[];
  notes?: string[];
  markers?: string[];
  source: { file: string; page: number };
  reviewStatus: 'transcribed' | 'needs-confirmation' | 'verified';
};
```

菜单级规则单独存储：服务时段、日期限制、Holiday 例外、Cash / Card 说明、套餐附带项目、替换规则、过敏提示、生食提示和图片说明。标记只能来源于菜单，不根据食材名称擅自给菜品添加 Vegan / Gluten-free 等标签。

### 5.3 录入与校对步骤

1. 保存原 PDF，不覆盖；逐页建立来源编号。
2. 对扫描页执行 OCR 或视觉转录，识别文字、列对应关系及红字 / 辣度标记。
3. 按上述类别整理 Dinner、Lunch、Happy Hour；相同菜名在不同菜单保留独立记录。
4. 对每项核对名称、说明、份量、现金价、刷卡价和选项；逐页核对行数，防止漏项和重复。
5. 重点检查跨列套餐：Lunch Roll 的 2 Rolls、3 Rolls，以及 Sushi / Sashimi 不同选择的价格。
6. 核对规则文字；不要把 Happy Hour 食品的统一价套用到全部饮品。
7. 不一致或不可辨认处录入待确认清单，保留原页证据，不能自行补价或改价。
8. 将审核通过的数据用于网页，提供三份原始 PDF 的查看 / 下载入口作为补充。

用于校验实现的初步样例：Dinner 第 7 页 Tonkotsu Shoyu 现金 $20.99 / 卡 $21.83；Lunch 第 2 页 Lunch Roll 两卷 $10.99 / $11.43、三卷 $12.99 / $13.51；Happy Hour 食品标题价 $6.49 / $6.75。样例只用于说明双价格和套餐结构，不能代替完整数据校对。

桌面端名称与价格对齐；移动端在每道菜内部明确标注 Cash 和 Card，说明文字换行，不能依赖整张菜单图片的缩放阅读。切换三套菜单使用可访问 Tabs 或普通导航；分类可用锚点。V2 不增加购物车、结账或未要求的复杂搜索。

## 6. 交互行为的具体实现

### 6.1 入场动画：第一个产品功能

先完成必要项目初始化，然后首先开发 Intro，不先制作 Gallery 或其他后续页面。

流程：基础页面已经可渲染 → 客户端开启 Intro 与滚动锁定 → 品牌图形分块显现 → Hero 关键图与字体就绪或达到上限 → Overlay 揭幕退出 → 清理状态并恢复滚动。

- 建议正常动画总长约 2–4 秒；缓存命中可更短，不伪造百分比。
- 明确提供 Skip；同会话只播放一次，采用版本化 `sessionStorage` 标记。
- `prefers-reduced-motion` 下跳过主要动画；存储不可用时也正常进入网站。
- 超时建议不超过 4 秒，失败必须解除滚动锁、移除阻挡和恢复可交互状态。
- 默认 HTML / CSS 不让隐藏 Overlay 永久覆盖内容；JS 未启动或加载失败时主体仍可阅读。
- 不等待整站 Gallery、地图或视频加载，不劫持正常滚动。
- 避免打断已开始操作的用户；结束后按需要将焦点移回合理位置，不无条件抢焦点。
- 测试首访、同会话重访、图片失败、JS 失败、慢网、Reduced Motion 和移动端旋转。

### 6.2 地图、图库与视频

地图 iframe 设置 title、延迟加载、固定比例或最小高度；装饰放在容器外，不盖住地图标识、版权和交互控件。无论地图是否加载成功，地址、电话及 Get Directions 都可使用。

图片放大使用可访问对话框，支持关闭按钮、Escape、前后图切换、焦点约束及关闭后返回原图；背景不可误滚动。视频使用正确比例、poster、controls、playsInline，默认不自动有声播放。有背景视频时必须静音且提供暂停。视频缺失时可完成布局预览，但不得将 Gallery 的视频要求标为通过。

### 6.3 Events / Catering 表单

字段：Full Name、Email、Phone Number、Event Type、Event Date、Event Time、Number of Guests、Catering / On-site Event、Additional Details / Message。

建议必填：姓名、邮箱、电话、活动类型、日期、时间、人数、服务方式；Message 可选。日期按纽约当地日期判断，人数为正整数，电话校验兼容国际格式，不要求用户使用唯一的美国电话号码写法；不捏造门店容纳人数上限。错误提示与字段关联，提交时定位第一个错误。

| 模式 | 实现和用户反馈 |
| --- | --- |
| 本版确定：mailto | 前端校验 → 固定收件人 `catering@zenramensushiny.com`，以编码后的 subject/body 打开邮件客户端；明确提示“请在邮件应用中发送”，不能显示“已发送成功”。按钮建议显示 Open Email App，使操作结果更清楚 |
| 未来更换外部表单 | 不在本版实施范围。只有用户变更需求并提供真实目标与字段预填规则后才替换，不能在当前版本增加服务 |

防重复点击采用短暂处理中状态，完成打开客户端 / 跳转尝试后可恢复；不把表单信息写入 localStorage、不传到本站接口。mailto 无法确认用户是否发送，需提供邮箱显示与可复制的咨询内容作为恢复方式，并处理正文过长问题。全流程验证用测试内容，不自动发送邮件。

## 7. 工程与部署方案

### 7.1 选定方案

采用 Next.js App Router + React + TypeScript + CSS Modules / 全局 CSS Tokens + GSAP。固定一个包管理器并提交 lockfile；依赖版本在开始开发时选择兼容的稳定版本，不在计划中写死未经安装验证的版本。

启用 `output: 'export'`，建议 `trailingSlash: true`，导出目录为 `out/`。浏览器交互才使用客户端组件；禁止请求时服务端能力和站内业务接口。构建阶段生成 HTML 不等于上线后有后端。[Next.js 静态导出说明](https://nextjs.org/docs/app/guides/static-exports)。

Next.js 默认图片优化依赖在线处理，不适合本项目边界。采用本地预生成 WebP / AVIF 和响应式尺寸，使用原生 picture / img；若使用 `next/image`，设置 `images.unoptimized: true`，并自行管理资源尺寸。不要引入 `/_next/image` 服务或为了图片增加第三方收费服务。[静态导出限制](https://nextjs.org/docs/app/guides/static-exports)、[Image unoptimized](https://nextjs.org/docs/app/api-reference/components/image#unoptimized)。

### 7.2 建议目录

```text
app/
  layout.tsx
  page.tsx
  globals.css
  menu/page.tsx
  about/page.tsx
  events-catering/page.tsx
  gallery/page.tsx
  not-found.tsx
components/
  intro/       # IntroOverlay
  navigation/  # Header、DeliveryDropdown、MobileNav
  home/        # Hero、各首页 Section
  menu/        # MenuTabs、MenuCategory、MenuItem
  events/      # InquiryForm
  gallery/     # GalleryGrid、Lightbox、Video
  shared/      # Footer、地图等
content/
  site.ts      # 地址、时区、营业时间、公开外链、咨询配置
  copy.ts      # 已确认英文文案及来源
  menus/       # 三套结构化菜单
  media.ts     # 媒体清单与来源
public/
  brand/
  images/
  menus/       # 原 PDF 的明确命名副本
  video/       # 收到视频后添加
  fonts/
docs/
  research/
  content-audit.md
  qa-checklist.md
next.config.ts
README.md
```

该目录仅为后续规划，本次没有创建这些应用文件。公开店铺信息直接集中配置，不需要密钥；只有确实使用公开环境变量时才添加 `.env.example`。

### 7.3 SEO、性能与维护

- 每个页面设置独立 Title、Description、canonical、Open Graph 基本文字信息和品牌 favicon；分享图复用核查过的现有合适素材，不生成虚假菜品图。
- Restaurant 结构化数据复用地址、电话、时区与营业时间配置；不得编造评分、价格等级或坐标。确认正式域名后生成 canonical 和 sitemap；预览环境避免被索引。
- 首屏关键图片优先加载，后续图片、地图和视频延迟加载；图片声明尺寸以避免布局跳动。不要在访问页面时一次下载三份大 PDF。
- 初始性能预算建议：首屏主图单个不超过约 350 KB、普通网格缩略图约 150 KB 内，按清晰度调整；Lighthouse 移动端 Performance 目标 ≥ 85、Accessibility ≥ 95。该数值为目标，不是当前测试结果。
- 在固定测试环境中记录首访含动画与重访数据，目标 LCP ≤ 2.5s、CLS ≤ 0.1；真实用户 INP 等指标上线后才有可靠现场数据。若动画掩盖内容过久，缩短动画，不延迟主要内容呈现。

### 7.4 Vercel 发布与旧站迁移

开发完成后依次执行：静态构建 → 本地静态目录检查 → Git 连接 Vercel → Preview 部署 → 页面、链接和资源回归 → 正式发布 → 正式域名验证。Git 集成会在提交后触发部署，具体设置以项目实际配置核对。[Vercel Git 部署](https://vercel.com/docs/git)。

建议明确配置构建命令 `npm run build`、输出目录 `out`（若最终选用 npm）。检查部署结果中没有应用 Functions 或 Edge Functions。静态内容更改需要重新构建部署，不增加管理后台。

如替换现有域名，先盘点 `/about-us/`、`/location/`、`/zrm-menu/` 及其菜单查询参数、联系页、政策页和博客 URL。使用 Vercel 平台静态重定向配置或静态兼容页映射到新地址；不要依赖 Next.js 运行时跳转或把所有旧链接一律送回首页。查询参数必须分别验证。正式切换前保留第一版备份、原部署与域名配置，记录回退步骤；切换不等于删除旧站。

## 8. 分阶段执行清单

状态定义：`已完成` 仅指本次实际调研；所有开发项当前均为 `未开始`。前一阶段的验收通过后推进，资料准备可提前进行，但产品功能开发顺序必须遵守原说明。

| 阶段 | 任务与具体交付物 | 依赖 | 完成条件 | 状态 |
| --- | --- | --- | --- | --- |
| P0 资料整合 | 阅读 Brief；核对本地文件；浏览旧站和参考站；输出本文及素材索引 | 用户提供资料 | 已识别范围、冲突和缺项；明确核查边界 | 已完成 |
| P1 最小工程 + 入场动画 | 初始化静态项目、配置 Token / Logo；开发 Intro、超时和 Reduced Motion；保留最小 Hero 承接动画 | P0 | 动画不锁死；同会话策略正确；静态导出成功 | 未开始 |
| P2 Header + Hero | 六项导航、移动菜单、外卖下拉、预约按钮、真实 Hero 素材 | P1 | 导航文字顺序正确；键盘和触摸均可用 | 未开始 |
| P3 首页三个核心 Section | 依次完成 Hours & Location、Menu Preview、About；整合地图 | P2 | 单店信息正确；地图与信息构成整体；次序正确 | 未开始 |
| P4 完整菜单 + About | 转录并全量校对 12 页；实现三套菜单与双价格；原 PDF 入口；完整 About | P3；PDF 可在此前准备 | 无漏项；规则和来源可追溯；所有疑点有结论或明确标记 | 未开始 |
| P5 Events / Catering | 大图、原文、完整表单、字段验证、已确认邮箱的 mailto 流程 | P4；邮箱与方式已确认 | 可打开正确收件人与正文；错误、处理中和恢复状态正确 | 未开始 |
| P6 Gallery + Footer | 图片网格、Lightbox、横版视频、页脚联系与必要政策内容 | P5；视频与实拍素材 | 图片可放大；视频可播放；无失效 Footer 链接 | 未开始 |
| P7 全站验证 | 响应式、可访问性、内容、SEO、性能、静态边界与链接检查 | P1–P6 | 第 10 节清单通过，阻塞问题归零 | 未开始 |
| P8 预览与上线 | Vercel Preview、部署验证、正式发布、旧 URL 迁移、文档和回退说明 | P7；账号 / 仓库 / 域名条件 | 线上页面可直达刷新；无后端；交付记录齐全 | 未开始 |

每阶段交付可查看的结果：P1 动画演示；P2 首屏和导航；P3 首页主要区域；P4 完整菜单；P5 咨询流程；P6 全站内容；P7 检查报告；P8 预览 / 正式地址和维护说明。不要把中间演示视作整站完成。

责任分工：开发执行者负责设计、实现、素材整理、数据录入及验证；店方负责菜单时效、歧义价格、真实素材与业务目标确认；站点管理员负责仓库、Vercel 和正式域名接入。内容确认与不依赖该内容的开发可并行，不因可选矢量 Logo 等事项停止全部工作。

## 9. 待确认事项与默认处理

| ID | 事项 | 当前依据 / 建议 | 影响与截止点 |
| --- | --- | --- | --- |
| C01 | 三份菜单的正式来源与双价格已确认；仅剩具体转录疑点 | 用户已确认三份均使用；疑点保留原值，不推算 | 不再等待菜单版本确认；P4 内容验收前解决具体疑点 |
| C02 | 午餐与 Happy Hour 日期、时段的跨来源一致性 | 午餐按已确认 PDF 的工作日及节假日限制；Happy Hour 每日来自旧首页 | 按 PDF 执行；只有旧站补充的适用日期仍需上线复核 |
| C03 | Uber Eats 本店准确地址 | 未提供，保留 Coming Soon 禁用项 | 不阻塞其他平台；可按原说明带此状态发布 |
| C04 | 已确认：Catering 提交方式 / 收件邮箱 | 用户选择 mailto 至 `catering@zenramensushiny.com` | 已解除决策依赖，直接实施；验证邮件客户端打开行为 |
| C05 | Resy 固定日期处理 | 建议使用旧站已引用的无日期场馆地址 | 不阻塞布局；预约正式上线前定稿 |
| C06 | Gallery 横版视频和封面 | 本地未提供 | 不阻塞图片画廊；阻塞“含视频”的完整验收；缺失时只能说明阶段完成 |
| C07 | 实拍环境 / 活动图片与旧站图库、AI 图的使用方式 | 先复核现有素材来源和清晰度，不把占位图描述为实拍 | 真实环境展示验收前解决，不凭空补图 |
| C08 | 透明 / 矢量 Logo、指定字体 | 原 JPG 可直接支持初版 | 可选项，不阻塞开发 |
| C09 | 当前营业时间 | 已从旧站 Location 获取 | 开发可使用；上线前复核 |
| C10 | Git、Vercel、正式域名及旧站迁移条件 | 原说明要求 Vercel；本次未检查账号接入状态 | 不阻塞本地开发；阻塞相应部署 / 域名切换 |

上述事项在开发 README 的 `TODO / Client Confirmation` 保持同一编号和状态。缺素材时开发预览可有清晰占位；正式版不显示损坏媒体、虚构价格或假提交成功。若用户明确选择无视频等缩减范围，再更新验收基线，不能由开发者自行删除要求。

## 10. 验收清单

### 内容与业务

- [ ] 单店名称、地址、电话正确，页面和结构化数据一致。
- [ ] 三份 PDF 全量转录并逐项核对，含饮品、套餐、规格、加价、提示文字及双价格。
- [ ] Lunch / Happy Hour 时段与限制不混用；无旧站冲突营销句。
- [ ] 非菜单文案有旧站来源，没有编造服务承诺。
- [ ] 六项主导航顺序、文案、目标正确；Gallery 入口位于预览区或 Footer。
- [ ] 四个外卖平台顺序正确；Uber Eats 不误链；Resy 不指向过期固定日期。
- [ ] 表单只打开实际目标，错误状态正确；不把邮件客户端打开等同于发送成功。
- [ ] Gallery 有环境图、菜品图、可播放横版视频；缺视频时此项不能勾选。

### 体验与可访问性

- [ ] 覆盖 360 / 390px 手机、768px 平板、1280 / 1440px 桌面及 1920px 宽屏，无横向溢出。
- [ ] 桌面鼠标、全键盘与触摸都可操作导航、下拉、Tabs、表单、Lightbox。
- [ ] Intro 首访 / 重访、超时、慢网、无 JS 和 Reduced Motion 均不阻挡内容。
- [ ] 弹层关闭后焦点恢复；移动菜单和图片放大可通过 Escape 关闭。
- [ ] 对比度达到 WCAG AA 基本目标；触摸目标建议至少 44 × 44px；装饰 alt 为空。
- [ ] 图片 alt 不把非实拍素材描述为门店实景；地图与视频有必要说明和控件。
- [ ] 至少用桌面 Chromium 与手机 Safari 实测；无对应设备时明确记录未覆盖项，不声称通过。

### 工程与发布

- [ ] 类型检查、ESLint 与生产构建通过；构建命令和检查结果写入交付记录。
- [ ] `out/` 包含所有页面和资源，静态服务器下直接访问、刷新、返回均正常。
- [ ] 无 API Route、Server Action、数据库、邮件服务、运行时 Functions / Edge Functions。
- [ ] 不依赖默认 `/_next/image`；无资源 404、运行时阻塞错误、泄露凭证或表单数据日志。
- [ ] 每页 metadata、favicon、canonical、sitemap 和 Restaurant 数据正确。
- [ ] Vercel Preview 与正式部署分别检查；性能结果写明设备、环境和日期。
- [ ] 旧 URL、查询参数、政策内容、PDF 下载链接和域名回退方案通过检查。
- [ ] README 说明安装、预览、构建、发布、换图、改价、改时间和外链配置；所有 TODO 有状态。

功能验证重点放在 Intro 故障退出、双价格 / 套餐渲染、导航交互、表单错误与跳转、静态路由直达；不为每个纯装饰组件编写无意义测试。外部链接检查可能遇到登录或反爬限制，此时记录限制并人工核对，不把 HTTP 200 当作商户正确的唯一证据。

## 11. 最终交付与下一步

后续开发交付：完整源代码与锁文件、静态导出产物、结构化菜单与来源台账、处理后的品牌 / 图片 / 视频素材、Vercel 预览与正式访问地址、验收报告、维护 README、待确认清单及旧站迁移 / 回退说明。

本次计划完成后，下一项明确动作是 P1：在保留现有资料的前提下初始化静态工程，并首先实现可超时退出、可跳过、支持 Reduced Motion 的品牌入场动画。随后严格按照 P2–P8 推进。此处描述下一步任务，不表示已经开始执行开发。

## 12. 来源索引

- 本地需求基线：`ZEN_RAMEN_SUSHI_Codex_Development_Brief.md`。
- 本地品牌与菜单：第 2.1 节列出的 JPG 与三份 PDF；菜单页码均指 PDF 实际页码，从 1 开始。
- [ZEN 第一版首页](https://zenramensushiny.com/)：品牌介绍、活动咨询邮箱、Happy Hour 文案及媒体入口。
- [ZEN About](https://zenramensushiny.com/about-us/)：完整介绍及午餐表述冲突来源。
- [ZEN Location](https://zenramensushiny.com/location/)：营业时间、门店信息、地图及不带日期的 Resy 链接。
- [ZEN Catering 菜单入口](https://zenramensushiny.com/zrm-menu/?menu=catering)：本次获取失败，待后续核查。
- [Totto Ramen](https://www.tottoramen.com/)：限定范围的布局参考。
- [Hey Noodles](https://heynoodles.com/)：入场动效参考；本次未实测完整动画。
- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports)、[Next.js Image](https://nextjs.org/docs/app/api-reference/components/image#unoptimized)：静态实现及图片处理约束。
- [Vercel Git 部署](https://vercel.com/docs/git)：后续 Git 集成部署依据。

来源核查时间为 2026-09-20；网页、商户链接与营业信息可能变化，正式上线前按计划复核。
