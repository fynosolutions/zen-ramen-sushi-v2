// Signature dishes surfaced with photos at the top of key menu sections.
// Only restaurant photography (2026-09-22 shoot) is used here, and only for dishes
// that can be matched to a menu item — sections without a real photo show no photo row.
export const featured: Record<string, {itemId:string; img:string; badge?:string}[]> = {
  'dinner--ramen-noodles': [
    {itemId:'dinner-13-2',  img:'/images/shot-dish-tonkotsu.webp'},
    {itemId:'dinner-13-16', img:'/images/shot-dish-chicken-yuzu.webp'},
  ],
};
