# 菜单菜品透明图：怎么来的、prompt 是什么（2026-10-02）

菜单页 featured 区的 27 张 `public/images/dish-*.webp`（15 道原有 + 10-02 补的拉面三碗 + Bento 的刺身便当），不是 AI 凭空画的菜，也不是直接用顾客照片：
**每张都以同一道菜的一张真实顾客照片（Google Maps）为参考，用 gpt-image-2.5「编辑」生成**，要求「同一道菜，只提升拍摄质量」，输出真透明背景。生成后由毛逐张对照真实参考审过（2026-10-02）。

## 通用 prompt（每张都用，后面接一句菜的描述）
```
Professional restaurant menu photo of THIS EXACT DISH, re-shot in a bright clean studio and isolated on a fully transparent background (real alpha).
STRICT FIDELITY: reproduce the dish exactly as in the reference photo — same ingredients, same pieces and count, same arrangement, same sauces and garnishes, same plate/bowl/tray shape, material and colour. Do not add, remove, replace, restyle or 'improve' any food.
REMOVE everything that is not the dish and its own plate/bowl/tray: tabletop, hands, chopsticks held by people, glasses, bottles, napkins, other dishes, people, bags, menus, any text or logos.
IMPROVE ONLY THE PHOTOGRAPHY: bright soft even studio lighting, natural accurate colours (remove any yellow/orange colour cast), crisp sharp focus, fresh glossy highlights, tidy the rim of the plate (no drips, crumbs or smudges outside the food).
Keep a similar camera angle to the reference. The whole dish together with its plate/bowl/tray must be completely inside the frame with a small even margin, nothing cropped; if part of the plate or tray is cut off in the reference, complete it naturally in the same material.
No cast shadow, no drop shadow, no reflection, no tabletop, no solid backdrop, no scenery, no checkerboard pattern. Photorealistic, high resolution, appetizing.
DISH: <该菜在参考图里的样子，一句话，见下>
```
被盘子切边的 5 张（刺身午餐、Takoyaki、烤鱿鱼、煎饺、Katsu 便当）在最前面加了一句：
`FRAMING (most important): shrink the whole subject so that the ENTIRE plate/tray/box, including every corner and edge, is fully visible with at least 10% of the image width of empty transparent margin on all four sides. Nothing may touch or be cut by the image border; …`

## 每道菜的 DISH 句
- bento-shrimp-teriyaki：Japanese bento box in a black lacquer tray with red compartments: four California-style rolls with avocado and cucumber (top left), white rice (top right), stir-fried teriyaki shrimp with snow peas, onion and red pepper (bottom left), four fried dumplings (bottom right).
- bento-katsu：katsu bento in a red-brown lacquer tray: sliced breaded cutlet with small yellow pickle pieces, white rice, avocado-cucumber roll pieces, fried shumai dumplings, a lemon wedge and pickled ginger(参考照片里的沙拉是盒外的另一份小菜,不画进盒里).
- chicken-teriyaki：grilled chicken teriyaki pieces glazed with dark teriyaki sauce, over white rice with one broccoli floret, in a wide round speckled stoneware plate.
- katsu-rice：breaded fried katsu cutlet, sliced, over white rice with a broccoli floret and sliced scallions, in a wide round cream stoneware bowl.
- gyu-don：marinated sliced beef stir-fried with green and red bell peppers, onions and scallions, in a wide round speckled grey-white stoneware plate.
- lunch-sashimi：sashimi lunch on a white square plate: salmon, yellowtail and tuna slices on shredded carrot and shiso, a mound of white sushi rice with sesame, a small black bowl of chopped tuna tartare with scallions.
- takoyaki：takoyaki octopus balls with Kewpie mayonnaise and takoyaki sauce, bonito flakes and scallions, on a green bamboo leaf on a dark rectangular tray.
- gyoza：pan-fried pork gyoza with golden seared bottoms and a small dish of soy dipping sauce, on a green-glazed dark rectangular plate.
- vegetable-gyoza：EXACTLY SIX pan-fried vegetable gyoza(菜单写 6 pcs,参考图只有 5 个)with soft natural spinach-green wrappers(not neon), seared golden on one side, on a bamboo leaf on a round white plate.
- shumai：EXACTLY SIX fried shrimp shumai(菜单写 6 pcs,顾客照片里只剩 4 个) with crispy golden wrappers, on a round cream stoneware plate with a brown pattern.
- ika-yaki：grilled whole squid with teriyaki-style glaze, the body sliced into rings, tentacles beside it, a lemon wedge, on a green leaf on a dark blue-grey rectangular plate.
- edamame：steamed edamame pods in a small dark brown ceramic bowl with a pour spout.
- zen-don：chirashi-style rice bowl: assorted sashimi (tuna, yellowtail, white fish, salmon), sweet egg omelet, crab stick, shredded carrot, pickled ginger and wasabi over sushi rice, in a dark speckled blue bowl.
- salmon-don：salmon don: chunks of salmon sashimi with bonito flakes, pickled ginger, seaweed salad and mixed greens over rice, in a dark speckled blue bowl.
- bento-sashimi（10-02，参考=毛提供的 Google 照片）：与通用 prompt 相同，但相机句改为「CAMERA (change from the reference): re-photograph the box from a higher position, a high three-quarter overhead view looking down at about 60 degrees…」，末尾加「IGNORE any user-interface overlay, button, icon or map thumbnail in the reference」；DISH：a Japanese sashimi bento box with a red-orange lacquer inside and a black base, divided into compartments: sashimi (tuna, salmon, white fish) with shiso leaf, shredded carrot, cucumber and an orchid garnish (left); a sesame-sprinkled sushi rice mound (top middle); a small compartment of pale yellow pickled salad (centre); a cluster of exactly six California roll pieces (top right); exactly four pieces of fried chicken karaage (bottom right).（⚠️ 模型没守住「四块鸡」，成图有 6 块，比原图可见的多）
- salmon-lover：salmon set on a long black slate-style tray: salmon sashimi slices, salmon nigiri, and a spicy salmon roll cut into pieces.
- vegetable-ramen（10-02 补，参考=顾客照片，Google 误标为 Miso Soup）：a vegetable ramen in a black round bowl, seen from above: glazed tofu cubes with a red-brown glaze, whole shiitake mushrooms, baby bok choy, spinach leaves, dark kikurage wood-ear strips and noodles, and micro-green sprouts.
- tonkotsu、chicken-yuzu（10-02，参考=店里 09-22 自己的实拍，只抠背景统一风格）：tonkotsu ramen in a black ceramic bowl, seen from above: two slices of braised pork belly, two halved soft-boiled eggs, corn, arugula and chopped scallions, kikurage and noodles in broth. / grilled chicken yuzu ramen in a black ceramic bowl, seen from above: sliced grilled chicken breast, two halved soft-boiled eggs, a lime slice, bok choy and scallions in a clear light broth.（这三碗 FRAMING 句改为 bowl 版）

## 一个分区只有 2 张图时补第三张「不同形式」的（毛 10-02）
- 拉面：补 Vegetables Ramen（素拉面，参考顾客照片）；并把 Tonkotsu / Chicken Yuzu 的店内实拍也做成同款俯拍黑碗透明图，三碗风格统一。
- Bento Box：Google 上没有干净的单品照，**毛 10-02 自己给了一张刺身便当照片**，补成第三张（挂在 D. Sashimi 上——照片里是刺身+饭团+加州卷+炸鸡，没有握寿司；若想挂 C. Sushi 告诉我）。视角从低角度侧拍改成高位 3/4 俯视（和另外两个便当一致），截图里的界面图标/地图缩略图先用 OpenCV 去掉。

## 参数与成本
gpt-image-2.5-sunburst（质量优先档）· 编辑接口 + `background=transparent` · `-q high` · 1024×1024 · 15 张 ≈ $1.28，重做 5 张 ≈ $0.43。
后处理：按透明区域裁边，最长边放到画布 84%，居中到 1000×1000 透明画布，存 webp（alpha 无损），每张 ≤ 250KB。

## 验收
`node seo/check-menu-photos.mjs data|render` · `node seo/check-menu-motion.mjs`（动效）。


## 2026-10-02 补:店家自己的旧拍摄(Google Drive)
Google Drive「Zen Ramen & Sushi」(5 次拍摄 4.13–8.18,594 张照片 + 315 条视频,Sony A7R5,店家自己请人拍的 → 无版权顾虑)。全部看过,精选 63 张存在飞书 `024 Zen Ramen Penn/图片/1002 店家旧拍摄精选(Google Drive)`(token `E2iVfFs0Ql9FSqdfSsuc1C5jnHc`)与 `fyno-proposals/clients/zenramen-midtown/drive-shoot-picks-2026-10-02/`(含 README 索引、每张的 Drive 原片链接、全量缩略总览)。
- **菜单透明图(同一套 prompt,参考=店家自己的照片)新增 8 张 + 替换 1 张**:Spicy Beef Ramen、Tomato Seafood Ramen(去掉了碗里的木勺)、Chicken Yaki Udon(改成正俯拍,和一排俯拍拉面碗统一)、Karaage、Crispy Wings、69 Shrimp、Salmon Lunch — Sushi、Eel Lunch — Sushi;Vegetables Ramen 由「顾客照片参考」换成「店家照片参考」(`dish-vegetables-ramen.webp`,旧 `dish-vegetable-ramen.webp` 已删)。
- **相册加 2 张场景图** `archive-table-spread.webp`(整桌俯拍 THE SPREAD,宽)+ `archive-vegetable-ramen.webp`(素拉面俯拍 VEGGIE RAMEN,窄;手机上占整行):只裁切 + 提亮 + **把桌面色相对齐**,不生成。依据是量出来的——现有相册的木桌色相 32–35°、饱和 0.4–0.75,旧拍摄的桌面是 44–52°(偏黄绿)或灰紫;只把 30–75° 这段色相拉到 34°,绿色蔬菜与红橙色食物不动。三轮独立审稿后的结论:旧拍摄里只有这两张融得进现有相册,唐扬/寿司拼盘/两碗拉面等(灰桌面、虚焦、碗被切)都撤掉,只当菜单抠图的参考。
- **一排必须排满**:每个有配图的分区,图的张数必须是 3 的倍数(`check-menu-photos.mjs data` 强制)。Rainbow / Crazy Yellowtail / Sweetheart 三个卷的透明图已做好但**没上线**(各自分区只有 1 张,会留一大块空白);等同分区再凑 2 张能对上菜名的卷再上。
- Tomato Seafood Ramen 的菜名是按菜单描述推断的(红汤、普通豆芽、无辣椒丝),待店里确认。
- **统一大小(独立审稿后)**:透明图不再按「长边 84%」,而是按**外接框面积占画布 60%、长边不超过 85%**缩放(脚本 `scripts/fit-dish.py`;90% 时长盘子在放大档的格子里几乎贴边)——长盘子(煎饺、鸡翅、便当)不再显得比圆碗小一圈。重新处理要从原始 1024 PNG 做(母版在 `fyno-proposals/clients/zenramen-midtown/menu-dish-cutouts-2026-10-01/png/` 与本次会话的生成目录),不要拿 webp 二次缩放。
- 蔬菜煎饺绿色过艳:只对绿色占优的像素降饱和 22%。

## 第四轮独立审稿后的定稿规则(2026-10-02)
- **件数以菜单为准**:菜名里写了「(N pcs)」的,图上就是 N 个。参考照片是顾客吃到一半拍的(烧卖只剩 4 个、素煎饺 5 个)时,把 prompt 里的 `same pieces and count` 去掉,改写 `EXACTLY SIX …(the menu portion is 6 pieces)`。上线前逐张数一遍。
- **同一分区的三张要同一个机位**:便当三张统一成「45° 俯视、盒子转约 25°、近角朝向镜头、能看到盒子前壁和脚」。做法是把 `Keep a similar camera angle to the reference.` 换成一段 `CAMERA (change from the reference): …`。盒子本身的颜色/格局仍照实物(虾照烧是黑框红格,炸排与刺身是红盒)。
- **同组大小靠眼睛对齐**:虾照烧便当的盒子更方,按面积规则摆进去会比另外两个红盒显大,所以单独把长边收成 78%(其余照 `scripts/fit-dish.py` 的默认)。
- **图注**:便当三张用统一的 `label`(… Bento Box),不显示菜单上的字母编号。
