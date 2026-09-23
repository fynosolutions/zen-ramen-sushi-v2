// 自托管 IG 精选(H.264/yuv420p/faststart, 已去黑边与片头水印)。来源 @zenramen_sushi 公开内容。
export const igHandle = 'zenramen_sushi';
export type Reel = {id:string; href:string; plays?:number; label:string};
const url = (id:string) => `https://www.instagram.com/zenramen_sushi/reel/${id}/`;

export const igReels: Reel[] = [
 {id:'Daj3bH6STR5', href:url('Daj3bH6STR5'), plays:48700, label:'Authentic flavors in Midtown'},
 {id:'DdUV4GCNxwU', href:url('DdUV4GCNxwU'), plays:9085,  label:'Happy hour sushi · $6.49'},
 {id:'DdK0af1Nzf_', href:url('DdK0af1Nzf_'), plays:2671,  label:'Ramen + free fruit tea'},
];

export const igReelsAbout: Reel[] = [
 {id:'Dc_lUkRvbtk', href:url('Dc_lUkRvbtk'), label:'Crispy katsu, Japanese curry'},
 {id:'Dc6XLhhv2mu', href:url('Dc6XLhhv2mu'), label:'Made for your table'},
 {id:'DdCTtNUvjra', href:url('DdCTtNUvjra'), label:'Crispy, spicy, made for sharing'},
];
