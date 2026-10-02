// Signature dishes surfaced with photos at the top of key menu sections.
// Two sources, both real food (no AI-generated dishes):
//  · restaurant photography (2026-09-22 shoot)  → shot-*.webp
//  · customers' Google Maps photos, cropped + lightly corrected (2026-10-01) → dish-*.webp
//    Each guest photo is tied to one menu entry (see content/photo-sources.json and docs/design-references.md);
//    replace them with the restaurant's own shots when available.
// A photo is only shown on the item it depicts; `label` is for one photo that fits two menu entries with the same price, and for the bento trio (the menu's letter codes "I." / "D." read as stray characters under a photo).
type Feat = {itemId:string; img:string; badge?:string; label?:string; alt?:string};
const bentoTrio = (shrimp:string,katsu:string,sashimi:string):Feat[] => [
  {itemId:shrimp, img:'/images/dish-bento-shrimp-teriyaki.webp', label:'Shrimp Teriyaki Bento Box', alt:'Shrimp teriyaki bento box with sushi rolls, rice and shumai'},
  {itemId:katsu, img:'/images/dish-bento-katsu.webp', label:'Katsu Bento Box', alt:'Katsu bento box with rice, California roll and shumai'},
  {itemId:sashimi, img:'/images/dish-bento-sashimi.webp', label:'Sashimi Bento Box', alt:'Sashimi bento box with tuna, salmon and white fish sashimi, rice, California rolls and fried chicken'},
];
const ricePair = (teri:string,katsu:string,gyu:string):Feat[] => [
  {itemId:teri, img:'/images/dish-chicken-teriyaki.webp', alt:'Grilled chicken teriyaki over white rice with broccoli'},
  {itemId:katsu, img:'/images/dish-katsu-rice.webp', alt:'Katsu cutlet over rice with broccoli'},
  {itemId:gyu, img:'/images/dish-gyu-don.webp', alt:'Marinated sliced beef with bell peppers and onions over rice'},
];
export const featured: Record<string, Feat[]> = {
  // 拉面:俯拍黑碗透明图。Tonkotsu / Chicken Yuzu 来自 09-22 店内实拍;其余来自店家早先自己的拍摄(Google Drive 4.13–8.18)
  'dinner--ramen-noodles': [
    {itemId:'dinner-13-2',  img:'/images/dish-tonkotsu.webp', alt:'Tonkotsu ramen with braised pork belly, soft eggs, corn and arugula in a black bowl'},
    {itemId:'dinner-13-16', img:'/images/dish-chicken-yuzu.webp', alt:'Grilled chicken yuzu ramen with soft eggs, lime and bok choy in a black bowl'},
    {itemId:'dinner-13-11', img:'/images/dish-vegetables-ramen.webp', alt:'Vegetables ramen with glazed tofu, shiitake, bok choy and spinach in a black bowl'},
    {itemId:'dinner-13-5',  img:'/images/dish-spicy-beef-ramen.webp', alt:'Spicy beef ramen with roasted chashu beef, arugula and shredded red pepper'},
    {itemId:'dinner-13-13', img:'/images/dish-tomato-seafood-ramen.webp', alt:'Tomato seafood ramen with shrimp, squid, scallops and bean sprouts'},
    {itemId:'dinner-13-21', img:'/images/dish-chicken-yaki-udon.webp', alt:'Chicken yaki udon with bell pepper, onion and broccoli'},
  ],
  'dinner--appetizers': [
    {itemId:'dinner-0-5',  img:'/images/dish-takoyaki.webp', alt:'Takoyaki with Kewpie mayo and bonito flakes'},
    {itemId:'dinner-0-7',  img:'/images/dish-gyoza.webp', alt:'Pan fried pork gyoza with dipping sauce'},
    {itemId:'dinner-0-14', img:'/images/dish-vegetable-gyoza.webp', alt:'Six pan fried vegetable gyoza on a bamboo leaf'},
    {itemId:'dinner-0-6',  img:'/images/dish-shumai.webp', alt:'Six fried shrimp shumai on a stoneware plate'},
    {itemId:'dinner-0-13', img:'/images/dish-ika-yaki.webp', alt:'Grilled whole squid with teriyaki glaze and a lemon wedge'},
    {itemId:'dinner-0-1',  img:'/images/dish-edamame.webp', alt:'A bowl of steamed edamame'},
    {itemId:'dinner-0-8',  img:'/images/dish-karaage.webp', alt:'Karaage fried chicken with sesame seeds and spicy mayo dip'},
    {itemId:'dinner-0-10', img:'/images/dish-crispy-wings.webp', alt:'Crispy chicken wings on lettuce with jalapeño'},
    {itemId:'dinner-0-11', img:'/images/dish-69-shrimp.webp', alt:'Five deep fried shrimp pops on lettuce'},
  ],
  /* 招牌卡:分区只有 1 张配图 → 横向大图 + 右侧菜名/说明/价格(图用 fit-dish.py --wide 摆放) */
  'dinner--sushi-rolls': [{itemId:'dinner-4-7', img:'/images/dish-rainbow-roll.webp', label:'Rainbow Roll', alt:'Rainbow roll topped with tuna, salmon, yellowtail and white fish on a long white plate'}],
  'dinner--special-roll': [{itemId:'dinner-5-0', img:'/images/dish-crazy-yellowtail-roll.webp', alt:'Crazy Yellowtail Roll topped with yellowtail, jalapeño slices and chili sauce'}],
  'dinner--chef-special-rolls': [{itemId:'dinner-6-18', img:'/images/dish-sweetheart-roll.webp', alt:'Sweetheart Roll: heart-shaped pieces wrapped in tuna with salmon, avocado and tobiko'}],
  'dinner--sushi-entree': [
    {itemId:'dinner-7-4', img:'/images/dish-zen-don.webp', alt:'Assorted fish over sushi rice'},
    {itemId:'dinner-7-5', img:'/images/dish-salmon-don.webp', alt:'Salmon don with bonito flakes and greens'},
    {itemId:'dinner-7-7', img:'/images/dish-salmon-lover.webp', alt:'Salmon sushi, sashimi and a spicy salmon roll on a black tray'},
  ],
  'dinner--bento-box': bentoTrio('dinner-10-8','dinner-10-4','dinner-10-3'),
  'dinner--rice-dishes': ricePair('dinner-11-2','dinner-11-5','dinner-11-4'),
  'lunch--bento-box': bentoTrio('lunch-2-8','lunch-2-4','lunch-2-3'),
  'lunch--rice-dishes': ricePair('lunch-1-2','lunch-1-5','lunch-1-4'),
  // Happy Hour 的同名小食沿用晚市那三张(同一道菜;HH 份量店里未另行确认)
  'happy-hour--appetizers': [
    {itemId:'happy-hour-0-2', img:'/images/dish-edamame.webp', alt:'A bowl of steamed edamame'},
    {itemId:'happy-hour-0-5', img:'/images/dish-gyoza.webp', alt:'Pan fried pork gyoza with dipping sauce'},
    {itemId:'happy-hour-0-3', img:'/images/dish-shumai.webp', alt:'Six fried shrimp shumai on a stoneware plate'},
  ],
  'lunch--sushi-bar': [
    {itemId:'lunch-0-1', img:'/images/dish-lunch-sashimi.webp', alt:'Sashimi plate with sushi rice, tuna tartare, salmon, yellowtail and tuna'},
    {itemId:'lunch-0-5', img:'/images/dish-salmon-lunch.webp', alt:'Salmon lunch: four salmon nigiri and a salmon roll'},
    {itemId:'lunch-0-9', img:'/images/dish-eel-lunch.webp', alt:'Eel lunch: four eel nigiri and an eel roll'},
  ],
};
