// Signature dishes surfaced with photos at the top of key menu sections.
// Images are AI-generated placeholders based strictly on the printed menu
// descriptions — replace with restaurant photography (same filenames) when available.
export const featured: Record<string, {itemId:string; img:string; badge?:string}[]> = {
  'dinner--appetizers': [
    {itemId:'dinner-0-5',  img:'/images/dish-takoyaki.webp', badge:'BEST SELLER'},
    {itemId:'dinner-0-7',  img:'/images/dish-gyoza.webp'},
    {itemId:'dinner-0-8',  img:'/images/dish-karaage.webp'},
  ],
  'dinner--sushi-rolls': [
    {itemId:'dinner-4-6',  img:'/images/dish-dragon-roll.webp'},
    {itemId:'dinner-4-7',  img:'/images/dish-rainbow-roll.webp', badge:'BEST SELLER'},
    {itemId:'dinner-4-11', img:'/images/dish-spicy-tuna.webp'},
  ],
  'dinner--ramen-noodles': [
    {itemId:'dinner-13-0', img:'/images/dish-tonkotsu-shoyu.webp', badge:'BEST SELLER'},
    {itemId:'dinner-13-3', img:'/images/dish-spicy-tonkotsu.webp'},
    {itemId:'dinner-13-4', img:'/images/dish-beef-ramen.webp'},
  ],
  'dinner--special-roll': [
    {itemId:'dinner-5-13', img:'/images/dish-zen-roll.webp', badge:'HOUSE SPECIAL'},
  ],
  'dinner--sushi-entree': [
    {itemId:'dinner-7-4',  img:'/images/dish-zen-don.webp'},
  ],
  'dinner--rice-dishes': [
    {itemId:'dinner-11-0', img:'/images/dish-katsu-curry.webp'},
  ],
  'lunch--sushi-bar': [
    {itemId:'lunch-0-0',   img:'/images/dish-lunch-sushi.webp'},
    {itemId:'lunch-0-1',   img:'/images/dish-lunch-sashimi.webp'},
  ],
  'lunch--bento-box': [
    {itemId:'lunch-2-0',   img:'/images/dish-bento-teriyaki.webp'},
    {itemId:'lunch-2-4',   img:'/images/dish-bento-katsu.webp'},
  ],
  'lunch--rice-dishes': [
    {itemId:'lunch-1-2',   img:'/images/dish-chicken-teriyaki.webp'},
  ],
  'lunch--lunch-roll': [
    {itemId:'lunch-3-1',   img:'/images/dish-lunch-roll-set.webp'},
  ],
  'happy-hour--appetizers': [
    {itemId:'happy-hour-0-1', img:'/images/dish-crispy-wings.webp'},
    {itemId:'happy-hour-0-3', img:'/images/dish-shrimp-shumai.webp'},
    {itemId:'happy-hour-0-8', img:'/images/dish-purple-yam-tempura.webp'},
  ],
  'happy-hour--sushi-rolls': [
    {itemId:'happy-hour-1-2',  img:'/images/dish-california.webp'},
    {itemId:'happy-hour-1-13', img:'/images/dish-salmon-mango.webp'},
    {itemId:'happy-hour-1-17', img:'/images/dish-sweet-potato-roll.webp'},
  ],
};
