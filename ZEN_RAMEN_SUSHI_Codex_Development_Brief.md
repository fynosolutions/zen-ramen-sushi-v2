# ZEN RAMEN & SUSHI 网站开发执行文档（交付 Codex）

## 0. Codex 执行指令

请根据本文档完成 ZEN RAMEN & SUSHI 新版官方网站的设计与开发。实现时以本文档为需求基线；不要擅自删除页面、导航项、外链或交互。遇到尚未提供的素材或账号配置，应使用清晰的占位内容并集中标记为 `TODO`，不得伪造线上地址、表单收件人或第三方商户链接。

开发顺序必须从“首屏入场动画”开始，再制作全站 Header、首页前三个核心 Section，最后完成 Events / Catering、Gallery 等后续内容。

---

## 1. 项目概况

- 品牌名称：ZEN RAMEN & SUSHI
- 现有官网（第一版）：https://zenramensushiny.com/
- 主要版式参考：https://www.tottoramen.com/
- 入场动画参考：https://heynoodles.com/
- 门店数量：1 家
- 门店城市：New York, NY
- 门店地址：150 W 36th St, New York, NY 10018
- 电话：(646) 870-7509
- 网站语言：英文
- 部署平台：Vercel
- 网站架构：纯前端静态网站
- 功能范围：前端页面展示、前端交互和外部链接跳转
- 明确不包含：自建后端、数据库、用户系统、管理后台、API Route、Server Action、Serverless Function 或 Edge Function

### 内容来源优先级

1. 用户后续提供的资料和 PDF 菜单。
2. ZEN RAMEN & SUSHI 第一版官网中的文字、图片、地址、电话和营业信息。
3. 本文档中已经确认的第三方平台链接。
4. 参考网站仅用于布局、氛围和交互参考，不直接复制其品牌内容或源代码。

---

## 2. 推荐技术方案

本项目必须以可部署到 Vercel 的纯前端静态网站实现。若项目没有既定技术栈，建议采用：

- Next.js + React + TypeScript，并启用静态导出 `output: 'export'`
- Tailwind CSS 或 CSS Modules
- GSAP 用于入场动画及滚动动效
- Google Maps iframe 用于地图，不依赖本站后端
- 表单只实现前端展示和校验；提交后跳转到客户提供的外部表单地址，或通过 `mailto:` 打开邮件客户端
- 图片使用 Next.js Image 优化，视频使用响应式 HTML5 Video

### 纯前端边界

- 所有页面在构建时生成静态文件，由 Vercel CDN 托管。
- 不创建 `/api`、服务端接口、数据库连接、身份认证、文件上传或邮件发送服务。
- 预约、外卖平台、地图导航及其他第三方业务通过 `<a>` 外链完成。
- Events / Catering 表单不能把数据提交到本站后端；若客户未提供第三方表单地址，则使用 `mailto:` 方案或暂时禁用正式提交，并标记 `TODO`。
- 不在前端代码中放置任何私钥、邮件服务密钥或仅服务端可用的凭证。
- 如果选用不支持 Next.js 静态导出的功能，必须改成纯客户端等价实现，不能因此引入后端。

### Vercel 部署要求

- 项目通过 Git 仓库连接 Vercel，提交代码后可自动构建和部署。
- 执行正式构建前确认静态导出成功，所有输出位于静态构建目录。
- 不启用 Vercel Functions、Edge Functions 或其他收费后端能力。
- 外部链接、图片、视频和字体路径在 Vercel 生产域名下必须正常工作。
- 页面直达与刷新不能出现 404；静态路由方案必须在部署前完成验证。

---

## 3. 全站视觉方向

### 配色

- 主色：红色、黑色、白色
- 红色用于按钮、重点标题、印章式元素和交互状态
- 黑色用于背景、文字及视觉对比
- 白色用于留白、内容区和反差排版

最终颜色值应统一定义为 CSS Design Tokens，不要在组件中散落硬编码颜色。

### 字体

- 整体选择偏圆润、亲和的字体风格
- 英文标题可以更有品牌感，正文必须保证清晰易读
- 注意字重、字距以及移动端字号，不可因追求风格牺牲可读性

### 日式元素

餐厅本身包含较多日本视觉元素，新网站可使用日式纹样、印章感图形、波浪、灯笼、拉面、寿司或笔触插画等作为装饰。装饰应服务于层级和氛围，避免无节制堆砌。

---

## 4. 首屏入场动画（第一开发步骤）

用户进入网站时，首先播放类似 Hey Noodles 的全屏动态效果，然后自然进入主页。

### 建议动画流程

1. 页面首次载入时锁定滚动，显示覆盖整个视口的 Loading Overlay。
2. Overlay 使用品牌红、黑、白配色，展示 ZEN RAMEN & SUSHI 品牌文字或 Logo。
3. 中央使用菜品、拉面碗或寿司相关的像素化/颗粒化 Reveal 动画，形成从模糊、像素或遮罩状态逐步显现的效果。
4. 同步显示简洁的 `LOADING` 或进度反馈，避免用户误以为页面卡住。
5. 素材和字体完成加载后，Overlay 通过遮罩、缩放、淡出或向上揭幕的方式退出，露出首页 Hero。
6. 动画结束后恢复滚动并把焦点交给页面主体。

### 技术与体验要求

- 优先使用 GSAP Timeline；像素化效果可使用 Canvas、CSS Mask 或分块元素实现。
- 动画总时长建议约 2–4 秒，资源已缓存时不得无意义等待。
- 同一会话内可通过 `sessionStorage` 控制只播放一次，刷新策略可配置。
- 必须支持 `prefers-reduced-motion`：减少动画用户直接使用淡入或立即显示主页。
- 即使动画脚本或图片加载失败，也必须在超时后自动进入主页，不能阻塞网站。
- 移动端减少粒子数量和 GPU 压力，避免掉帧。

---

## 5. Header 与导航

桌面端 Header 按以下顺序显示：

1. MENU
2. ABOUT
3. HOURS & LOCATION
4. ORDER DELIVERY/PICKUP
5. EVENTS/CATERING
6. RESERVE TODAY

### Header 行为

- Header 可使用透明叠加在 Hero 上、滚动后转为实体背景的方案。
- 当前 Section / 页面需要有清晰状态。
- 移动端使用可访问的汉堡菜单。
- 所有交互元素必须支持键盘操作、焦点样式及触摸操作。
- `RESERVE TODAY` 必须以明显的按钮样式呈现。

### Reserve Today 外链

点击后跳转：

https://resy.com/cities/new-york-ny/venues/zen-ramen-and-sushi?date=2026-09-20&seats=2

外链建议在新标签页打开，并使用安全的 `rel` 属性。

---

## 6. ORDER DELIVERY/PICKUP 下拉菜单

桌面端鼠标悬停或键盘聚焦 `ORDER DELIVERY/PICKUP` 时显示下拉菜单；移动端点击后展开。

菜单顺序与链接：

1. UBER EATS
   - 当前尚未核实纽约门店的准确商家页。
   - 保留菜单项，但在正式上线前必须由客户确认链接。
   - 不得链接到其他同名门店，也不得自行猜测 URL。
2. DOORDASH
   - https://www.doordash.com/store/zen-ramen-sushi-new-york-64843/111425951/
3. GRUBHUB
   - https://www.grubhub.com/restaurant/zen-ramen-and-sushi-150-w-36th-st-new-york/327291
4. TOAST ONLINE
   - https://www.toasttab.com/local/order/zen-ramen-sushi-takeout-150-w-36th-street

### 下拉菜单验收要求

- 鼠标从主菜单移动到下拉层时，下拉层不能意外关闭。
- 支持 Enter、Space、Escape 及方向键或标准 Tab 导航。
- 外链在新标签页打开。
- Uber Eats 未确认前可设为不可点击并显示 `Coming Soon`，或通过配置隐藏链接行为，但菜单文字必须保留。

---

## 7. 首页参考范围与 Section 顺序

Totto Ramen 只用于参考以下三个核心 Section 的布局思路和节奏：

1. HOURS & LOCATION
2. MENU
3. ABOUT

只参考这三个 Section，不继续照搬 Totto Ramen 后续 Section。后续内容应延续 ZEN RAMEN & SUSHI 第一版官网的品牌风格，并按本执行文档重新设计。

建议首页结构：

1. Intro Animation
2. Hero
3. HOURS & LOCATION
4. MENU Preview
5. ABOUT
6. EVENTS / CATERING Preview
7. GALLERY Preview
8. Footer

---

## 8. HOURS & LOCATION

Location 只展示一家纽约门店，不制作多门店切换器。

### 必须包含

- 店名：ZEN RAMEN & SUSHI
- 地址：150 W 36th St, New York, NY 10018
- 电话：(646) 870-7509
- 营业时间：从第一版官网复制，并在上线前再次核对
- Google Maps 地图
- `Get Directions` 或 `Open in Google Maps` 按钮

### 地图设计要求

- 禁止像第一版官网一样把地图作为一个孤立、普通的矩形块直接放在页面一侧。
- 地图应与地址、电话和营业时间组成统一的视觉卡片或完整 Section。
- 可通过日式纹样、印章图形、手绘线条、色块、边框、轻微旋转、不规则遮罩或局部叠层装饰地图容器。
- 装饰不能遮挡地图 Logo、版权信息、缩放、拖动和跳转控件。
- 地图必须响应式显示；移动端不得溢出或变得过矮。
- 地图需要加载标题，并考虑延迟加载以提升性能。

---

## 9. MENU

- 菜单最终内容以用户后续提供的 PDF 为唯一权威数据源。
- 收到 PDF 后完整提取：分类、菜品名称、菜品说明、价格、套餐信息、过敏原或特殊标记，以及 PDF 中的其他必要文字。
- 不得以第一版官网的旧菜单替代新 PDF。
- 页面布局可参考 Totto Ramen 的 MENU Section，但视觉语言必须使用 ZEN RAMEN & SUSHI 的红、黑、白与日式元素。
- 数据应结构化存储，避免把整张菜单图片直接作为唯一内容；保证移动端可读和便于后续修改。
- PDF 未提供前使用明确的临时数据或 `TODO`，不要虚构正式价格。

---

## 10. ABOUT

- 文案直接采用 ZEN RAMEN & SUSHI 第一版官网中的 About 文字。
- 版式可参考 Totto Ramen 的 ABOUT Section。
- 使用餐厅环境、制作过程、拉面或寿司图片增强叙事。
- 设计需要延续红、黑、白以及圆润字体风格。

---

## 11. Events / Catering

Events / Catering 需要作为独立内容页面或完整 Section，包含：

1. 数张大幅活动、聚餐或 Catering 宣传图片。
2. 服务介绍文字，优先复制第一版官网现有内容。
3. 信息填写表单。

### 表单建议字段

- Full Name
- Email
- Phone Number
- Event Type
- Event Date
- Event Time
- Number of Guests
- Catering / On-site Event 选择
- Additional Details / Message
- Submit

### 表单要求

- 必填项、邮箱、电话、日期和人数需要前端校验。
- 表单仅在浏览器中运行，不向本站后端提交数据，也不把信息存入本站数据库。
- 点击 Submit 后跳转到客户提供的外部表单页面；如客户选择邮件方案，则使用 `mailto:` 打开用户默认邮件客户端，并将已填写内容编码到邮件正文。
- 跳转前必须通过前端校验，并防止用户连续重复点击。
- 如果尚未提供跳转目标，保留完整表单 UI，但把提交地址集中配置为 `TODO`，不得伪造接口。
- 不得在前端代码中暴露邮件密钥或任何私密凭证。
- 由于本站没有后端，若未来要求“直接发送邮件、保存咨询记录或后台查看提交”，必须另行确认第三方服务或扩大项目范围，不能在当前版本中暗中加入后端。

---

## 12. Gallery

Gallery 用于纯视觉展示，内容包含：

- 餐厅环境图片
- 菜品图片
- 横版视频

### 展示要求

- 使用响应式网格、Masonry 或编辑感较强的图片排版。
- 图片支持清晰的 Hover 状态及点击放大查看。
- 横版视频必须保持正确宽高比，提供封面图、播放控制和移动端适配。
- 视频默认不要强制带声音自动播放；如使用背景自动播放，必须静音、循环并允许暂停。
- Gallery 需要单独路由时可使用 `/gallery`。当前指定 Header 中没有 Gallery 项，不要擅自修改主导航；可从首页 Gallery Preview 或 Footer 进入，除非用户后续要求加入主导航。

---

## 13. 文字与图片素材规则

### 文字

- 除 PDF 菜单外，网站文字直接复制 ZEN RAMEN & SUSHI 第一版官网的现有内容。
- 复制后只允许做必要的格式清理，不擅自改变事实、营业信息或品牌含义。
- 所有外部事实在上线前核对一次。

### 图片

1. 优先使用第一版官网的现有图片。
2. 根据新版排版可进行裁剪、构图调整、高清修复和放大处理。
3. 处理时必须保留真实菜品、餐厅环境和品牌特征，不能把菜品改变为与实物不符的内容。
4. 若没有可用高清图，可先使用 AI 生成符合品牌风格的高清占位图片。
5. AI 图片应保持真实的餐饮摄影质感，并在素材管理中标记为 AI 临时素材，方便后续替换为客户实拍原图。
6. 输出 WebP / AVIF 等现代格式，并提供合理的 `alt` 文本。

---

## 14. 页面与路由建议

- `/`：首页，包含前三个核心 Section 及后续内容预览
- `/menu`：完整菜单
- `/about`：完整品牌介绍（如首页内容足够，可锚点跳转）
- `/hours-location`：营业时间、地址和地图（也可使用首页锚点）
- `/events-catering`：活动与餐饮服务 + 表单
- `/gallery`：环境图片、菜品图片及横版视频

导航可以使用页面路由或首页锚点，但桌面端、移动端和浏览器返回行为必须一致。

除站内静态页面外，以下业务功能全部采用外部跳转：Resy 预约、Uber Eats、DoorDash、Grubhub、Toast Online、Google Maps 导航，以及客户后续指定的 Events / Catering 表单目标。

---

## 15. 通用工程要求

### 响应式

- 至少覆盖手机、平板、普通桌面和宽屏。
- 不允许依赖只在桌面端成立的 Hover 完成功能；移动端必须有点击替代。
- 检查长标题、表单、地图、菜单价格和视频在窄屏下的布局。

### 可访问性

- 使用语义化 HTML。
- 图片提供 `alt`，装饰图片使用空 `alt`。
- 所有按钮、菜单、下拉层和表单均可通过键盘操作。
- 颜色对比满足基本 WCAG 要求。
- 为动态效果实现 Reduced Motion 方案。

### 性能

- 首屏非关键图片和地图延迟加载。
- 控制图片尺寸和视频体积，避免把原始超大文件直接上线。
- 预加载真正影响首屏体验的字体和入场动画素材。
- 防止入场动画造成 CLS 或长时间白屏。

### SEO

- 配置 Title、Description、Open Graph、favicon 和 canonical。
- 添加餐厅本地业务结构化数据 `Restaurant` / `LocalBusiness`。
- 地址、电话和营业时间在页面可见文本与结构化数据中保持一致。

---

## 16. 待提供或待确认事项

- 菜单 PDF 文档。
- Uber Eats 纽约门店的准确商户链接。
- Events / Catering 表单的外部跳转地址，或用于 `mailto:` 的最终收件邮箱。
- Gallery 横版视频文件和最终封面。
- Logo 原始文件、品牌字体或其他品牌规范（如有）。
- AI 临时图片是否在正式上线前全部替换。
- Reserve Today 链接中的固定日期 `2026-09-20` 是否需要改成动态日期或无日期的场馆主页。

---

## 17. 完成验收清单

- [ ] 首次进入网站可看到 Hey Noodles 风格的品牌入场动画。
- [ ] 动画失败时有自动退出保护，Reduced Motion 正常。
- [ ] Header 的六个项目顺序和文字完全正确。
- [ ] Reserve Today 跳转到指定 Resy 页面。
- [ ] ORDER DELIVERY/PICKUP 在桌面端 Hover/Focus、移动端点击均可展开。
- [ ] DoorDash、Grubhub、Toast 链接正确，Uber Eats 未误链同名商家。
- [ ] 首页只借鉴 Totto Ramen 的 HOURS & LOCATION、MENU、ABOUT 三个 Section。
- [ ] Location 只显示纽约一家门店。
- [ ] Google Maps 已融入整体设计，而不是孤立矩形地图块。
- [ ] Events / Catering 有大图和完整表单状态。
- [ ] Events / Catering 表单只进行前端校验，并跳转到已确认的外部目标或邮件客户端。
- [ ] Gallery 有环境图、菜品图和横版视频。
- [ ] 网站文案与第一版官网一致，菜单内容以新 PDF 为准。
- [ ] 低清图片已修复或使用明确标记的 AI 临时素材。
- [ ] 红、黑、白配色、圆润字体和日式元素贯穿全站。
- [ ] 手机、平板和桌面端均完成检查。
- [ ] 键盘导航、表单校验、图片替代文本及 Reduced Motion 可用。
- [ ] SEO、本地餐厅结构化数据及社交分享信息已配置。
- [ ] 项目为纯前端静态构建，不存在 API Route、Server Action、Serverless Function、Edge Function 或数据库依赖。
- [ ] Vercel 生产构建与部署成功，所有静态路由、资源和外部跳转已验证。

---

## 18. 最终交付要求

- 完整源代码与清晰的组件结构。
- 如需要通过环境变量配置公开外链，则提供 `.env.example`，其中只能包含公开配置的变量名和说明，不得包含密钥。
- README：安装、启动、静态构建、Vercel 部署、素材替换、外部链接和表单跳转配置方法。
- 将所有待确认内容统一记录在 README 的 `TODO / Client Confirmation` 部分。
- 构建命令必须成功，且不得存在阻塞上线的 TypeScript、Lint 或资源路径错误。
- 最终交付不得包含后端目录、数据库配置、邮件发送服务或未使用的服务端依赖。
