// Signature dishes surfaced with photos at the top of key menu sections.
// Two sources, both real food (no AI-generated dishes):
//  · restaurant photography (2026-09-22 shoot)  → shot-*.webp
//  · customers' Google Maps photos, cropped + lightly corrected (2026-10-01) → dish-*.webp
//    Each guest photo is tied to one menu entry (see content/photo-sources.json and docs/design-references.md);
//    replace them with the restaurant's own shots when available.
// A photo is only shown on the item it depicts; `label` is for one photo that fits two menu entries with the same price.
type Feat = {itemId:string; img:string; badge?:string; label?:string; alt?:string};
const bentoPair = (shrimp:string,katsu:string):Feat[] => [
  {itemId:shrimp, img:'/images/dish-bento-shrimp-teriyaki.webp', alt:'Shrimp teriyaki bento box with sushi rolls, rice and shumai'},
  {itemId:katsu, img:'/images/dish-bento-katsu.webp', label:'Katsu Bento Box', alt:'Katsu bento box with rice, California roll and shumai'},
];
const ricePair = (teri:string,katsu:string,gyu:string):Feat[] => [
  {itemId:teri, img:'/images/dish-chicken-teriyaki.webp', alt:'Grilled chicken teriyaki over white rice with broccoli'},
  {itemId:katsu, img:'/images/dish-katsu-rice.webp', alt:'Katsu cutlet over rice with broccoli'},
  {itemId:gyu, img:'/images/dish-gyu-don.webp', alt:'Marinated sliced beef with bell peppers and onions over rice'},
];
export const featured: Record<string, Feat[]> = {
  // 拉面三碗:都是俯拍黑碗透明图——Tonkotsu、Chicken Yuzu 来自 09-22 店内实拍(只抠背景),Vegetables Ramen 来自顾客照片参考
  'dinner--ramen-noodles': [
    {itemId:'dinner-13-2',  img:'/images/dish-tonkotsu.webp', alt:'Tonkotsu ramen with braised pork belly, soft eggs, corn and arugula in a black bowl'},
    {itemId:'dinner-13-16', img:'/images/dish-chicken-yuzu.webp', alt:'Grilled chicken yuzu ramen with soft eggs, lime and bok choy in a black bowl'},
    {itemId:'dinner-13-11', img:'/images/dish-vegetable-ramen.webp', alt:'Vegetables ramen with glazed tofu, shiitake, bok choy and spinach in a black bowl'},
  ],
  'dinner--appetizers': [
    {itemId:'dinner-0-5',  img:'/images/dish-takoyaki.webp', alt:'Takoyaki with Kewpie mayo and bonito flakes'},
    {itemId:'dinner-0-7',  img:'/images/dish-gyoza.webp', alt:'Pan fried pork gyoza with dipping sauce'},
    {itemId:'dinner-0-14', img:'/images/dish-vegetable-gyoza.webp', alt:'Pan fried vegetable gyoza on a bamboo leaf'},
    {itemId:'dinner-0-6',  img:'/images/dish-shumai.webp', alt:'Fried shrimp shumai'},
    {itemId:'dinner-0-13', img:'/images/dish-ika-yaki.webp', alt:'Grilled whole squid with teriyaki glaze and a lemon wedge'},
    {itemId:'dinner-0-1',  img:'/images/dish-edamame.webp', alt:'A bowl of steamed edamame'},
  ],
  'dinner--sushi-entree': [
    {itemId:'dinner-7-4', img:'/images/dish-zen-don.webp', alt:'Assorted fish over sushi rice'},
    {itemId:'dinner-7-5', img:'/images/dish-salmon-don.webp', alt:'Salmon don with bonito flakes and greens'},
    {itemId:'dinner-7-7', img:'/images/dish-salmon-lover.webp', alt:'Salmon sushi, sashimi and a spicy salmon roll on a black tray'},
  ],
  'dinner--bento-box': bentoPair('dinner-10-8','dinner-10-4'),
  'dinner--rice-dishes': ricePair('dinner-11-2','dinner-11-5','dinner-11-4'),
  'lunch--bento-box': bentoPair('lunch-2-8','lunch-2-4'),
  'lunch--rice-dishes': ricePair('lunch-1-2','lunch-1-5','lunch-1-4'),
  'lunch--sushi-bar': [
    {itemId:'lunch-0-1', img:'/images/dish-lunch-sashimi.webp', alt:'Sashimi plate with sushi rice, tuna tartare, salmon, yellowtail and tuna'},
  ],
};
