export const gallery = [
 {src:'/images/shot-gallery-ramen-wide.webp',alt:'Grilled chicken ramen with a soft egg, bok choy and lime',label:'RAMEN',wide:true},
 {src:'/images/shot-gallery-sushi-plate.webp',alt:'A seared special roll with spicy mayo, eel sauce and an orchid',label:'SUSHI',wide:false},
 {src:'/images/shot-hero-noodle-lift.webp',alt:'Chopsticks lifting thick noodles from a bowl of grilled chicken noodle soup',label:'NOODLES',wide:false},
 {src:'/images/shot-long-table.webp',alt:'A long communal table set for a group in the Zen dining room',label:'THE SPACE',wide:false},
 {src:'/images/shot-shared-table.webp',alt:'Ramen, sushi rolls and an iced drink shared across one table',label:'AT THE TABLE',wide:false},
 // 以下两张来自店家早先自己的拍摄(Google Drive 4.13–8.18),只裁切+提亮+把桌面色相对齐现有木桌(琥珀 ≈34°),不生成。电脑 3 列:宽+窄排满一行;手机 2 列:素拉面那张也占整行(wideSm),不留空格。三轮独立审稿后只留这两张——其余旧拍摄的灰桌面/虚焦融不进现有相册,只做菜单抠图的参考。
 {src:'/images/archive-table-spread.webp',alt:'A full table seen from above: ramen, yaki udon, sushi rolls, gyoza and karaage',label:'THE SPREAD',wide:true},
 {src:'/images/archive-vegetable-ramen.webp',alt:'Vegetable ramen with glazed tofu, bok choy and greens, seen from above',label:'VEGGIE RAMEN',wide:false,wideSm:true},
 {src:'/images/shot-sashimi-box.webp',alt:'A wooden box of salmon, tuna and yellowtail sashimi with sushi rolls',label:'SUSHI & SASHIMI',wide:true},
 {src:'/images/shot-hh-martini.webp',alt:'A pink martini on the wooden bar',label:'HAPPY HOUR',wide:false},
 {src:'/images/shot-gallery-lantern.webp',alt:'A paper lantern and hanging banners in the dining room',label:'THE DETAILS',wide:false},
 {src:'/images/shot-dining-room-bright.webp',alt:'A bright dining room with a large shared table by the windows',label:'THE DINING ROOM',wide:true},
];
// 靳晓宇 0925 横版混剪(毛 09-26 过审),720p H.264 Main L4.0 faststart;换片务必换文件名
/* srcMobile:手机专用的轻量版(把 16:9 居中裁成手机上实际显示的 4:5,576×720、约 650kbps、5.4MB;原片 13MB)。换片时两个文件都要换:
   ffmpeg -i 原片.mp4 -vf crop=576:720 -c:v libx264 -profile:v main -level 3.1 -preset slow -crf 27 -maxrate 900k -bufsize 1800k -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart 原片-m.mp4 */
export const homeFilm = {src:'/video/zen-film-0925.mp4',srcMobile:'/video/zen-film-0925-m.mp4',poster:'/video/zen-film-0925.webp',title:'A look inside Zen Ramen & Sushi'};
export const galleryVideo: {src:string;poster:string;title:string}|null = homeFilm;
