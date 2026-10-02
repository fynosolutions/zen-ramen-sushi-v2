# 菜单菜品透明图：怎么来的、prompt 是什么（2026-10-02）

菜单页 featured 区的 19 张 `public/images/dish-*.webp`（15 道原有 + 10-02 补的拉面三碗 + Bento 的刺身便当），不是 AI 凭空画的菜，也不是直接用顾客照片：
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
- bento-katsu：katsu bento in a red-brown lacquer tray: sliced breaded cutlet with small yellow pickle pieces, white rice, avocado-cucumber roll pieces, fried shumai dumplings, a lemon wedge, a small green salad.
- chicken-teriyaki：grilled chicken teriyaki pieces glazed with dark teriyaki sauce, over white rice with one broccoli floret, in a wide round speckled stoneware plate.
- katsu-rice：breaded fried katsu cutlet, sliced, over white rice with a broccoli floret and sliced scallions, in a wide round cream stoneware bowl.
- gyu-don：marinated sliced beef stir-fried with green and red bell peppers, onions and scallions, in a wide round speckled grey-white stoneware plate.
- lunch-sashimi：sashimi lunch on a white square plate: salmon, yellowtail and tuna slices on shredded carrot and shiso, a mound of white sushi rice with sesame, a small black bowl of chopped tuna tartare with scallions.
- takoyaki：takoyaki octopus balls with Kewpie mayonnaise and takoyaki sauce, bonito flakes and scallions, on a green bamboo leaf on a dark rectangular tray.
- gyoza：pan-fried pork gyoza with golden seared bottoms and a small dish of soy dipping sauce, on a green-glazed dark rectangular plate.
- vegetable-gyoza：five pan-fried vegetable gyoza with green wrappers, seared golden on one side, on a bamboo leaf on a round white plate.
- shumai：four fried shrimp shumai with crispy golden wrappers, on a round cream stoneware plate with a brown pattern.
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
