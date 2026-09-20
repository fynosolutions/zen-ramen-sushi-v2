# 截图所示图片替换

2026-09-21：按用户提供的三张截图替换图片，保留页面文案与业务入口。

- 首页（Hours & Location 同页）Happy Hour 卡片：`photo-7.webp` 啤酒与小食图替换为已有 `photo-5.webp`，使用 1024 × 1024 日料菜品图，CSS 裁切中心为 50% / 43%。
- 首页 Catering：`photo-8.webp` 重复寿司拼盘替换为旧站的聚餐俯拍照片；桌面裁切为正方形，手机比例为 1.1:1。
- Events & Catering 横幅：同一聚餐照片按横幅取景，桌面与手机分别设置焦点，保留夹取菜品的动作和桌面主菜。

聚餐图高清来源：https://zenramensushiny.com/wp-content/uploads/2026/03/natalie-sum-rUhdUhwBe8A-unsplash.jpg 。下载文件 `public/images/shared-table-original.jpg` 为 2665 × 3331，1,832,202 字节；原样保留，不宣称为店内实拍或 AI 超分辨率结果。`srcSet` 按显示尺寸与像素密度在原有 819px WebP 和高清原图之间选择，裁切由 CSS 完成。

验证：静态生产构建通过；1440px 桌面及 390px / 2× 手机显示检查通过，六处图片均成功加载，无横向溢出或浏览器脚本异常。首页 Catering 修正显式宽高，避免高清原图的原始高度撑开布局。截图与检查数据保存在 `docs/qa/replaced-*.png` 和 `docs/qa/image-replacements.json`。

已发布至 https://zen-ramen-sushi-v2.vercel.app ，线上两种视口的三处替换均通过加载和尺寸验证，页面返回 200，无脚本异常。线上记录：`docs/qa/image-replacements-online.json`。
