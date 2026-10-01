// Signature dishes surfaced with photos at the top of key menu sections.
// Two sources, both real food (no AI-generated dishes):
//  · restaurant photography (2026-09-22 shoot)  → shot-*.webp
//  · customers' Google Maps photos, cropped + lightly corrected (2026-10-01) → guest-*.webp
//    Each guest photo is tied to one menu entry (see content/photo-sources.json and docs/design-references.md);
//    replace them with the restaurant's own shots when available.
// A photo is only shown on the item it depicts; `label` is for one photo that fits two menu entries with the same price.
type Feat = {itemId:string; img:string; badge?:string; label?:string; alt?:string};
const bentoPair = (shrimp:string,katsu:string):Feat[] => [
  {itemId:shrimp, img:'/images/guest-bento-shrimp-teriyaki.webp', alt:'Shrimp teriyaki bento box with sushi rolls, rice and shumai'},
  {itemId:katsu, img:'/images/guest-bento-katsu.webp', label:'Katsu Bento Box', alt:'Katsu bento box with rice, California roll and shumai'},
];
const ricePair = (teri:string,katsu:string,gyu:string):Feat[] => [
  {itemId:teri, img:'/images/guest-chicken-teriyaki.webp', alt:'Grilled chicken teriyaki over white rice with broccoli'},
  {itemId:katsu, img:'/images/guest-katsu-rice.webp', alt:'Katsu cutlet over rice with broccoli'},
  {itemId:gyu, img:'/images/guest-gyu-don.webp', alt:'Marinated sliced beef with bell peppers and onions over rice'},
];
export const featured: Record<string, Feat[]> = {
  'dinner--ramen-noodles': [
    {itemId:'dinner-13-2',  img:'/images/shot-dish-tonkotsu.webp'},
    {itemId:'dinner-13-16', img:'/images/shot-dish-chicken-yuzu.webp'},
  ],
  'dinner--appetizers': [
    {itemId:'dinner-0-5',  img:'/images/guest-takoyaki.webp', alt:'Takoyaki with Kewpie mayo and bonito flakes'},
    {itemId:'dinner-0-7',  img:'/images/guest-gyoza.webp', alt:'Pan fried pork gyoza with dipping sauce'},
    {itemId:'dinner-0-14', img:'/images/guest-vegetable-gyoza.webp', alt:'Pan fried vegetable gyoza on a bamboo leaf'},
    {itemId:'dinner-0-6',  img:'/images/guest-shumai.webp', alt:'Fried shrimp shumai'},
    {itemId:'dinner-0-13', img:'/images/guest-ika-yaki.webp', alt:'Grilled whole squid with teriyaki glaze and a lemon wedge'},
    {itemId:'dinner-0-1',  img:'/images/guest-edamame.webp', alt:'A bowl of steamed edamame'},
  ],
  'dinner--sushi-entree': [
    {itemId:'dinner-7-4', img:'/images/guest-zen-don.webp', alt:'Assorted fish over sushi rice'},
    {itemId:'dinner-7-5', img:'/images/guest-salmon-don.webp', alt:'Salmon don with bonito flakes and greens'},
    {itemId:'dinner-7-7', img:'/images/guest-salmon-lover.webp', alt:'Salmon sushi, sashimi and a spicy salmon roll on a black tray'},
  ],
  'dinner--bento-box': bentoPair('dinner-10-8','dinner-10-4'),
  'dinner--rice-dishes': ricePair('dinner-11-2','dinner-11-5','dinner-11-4'),
  'lunch--bento-box': bentoPair('lunch-2-8','lunch-2-4'),
  'lunch--rice-dishes': ricePair('lunch-1-2','lunch-1-5','lunch-1-4'),
  'lunch--sushi-bar': [
    {itemId:'lunch-0-1', img:'/images/guest-lunch-sashimi.webp', alt:'Sashimi plate with sushi rice, tuna tartare, salmon, yellowtail and tuna'},
  ],
};
