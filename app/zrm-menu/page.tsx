import type { Metadata } from 'next';
import PhotoMenu from '@/components/PhotoMenu';
import { Arrow, PageHeading } from '@/components/Shared';
import { site } from '@/content/site';

// 带图菜单(2026-10-09):旧站 /zrm-menu/ 是店里二维码的落地页(二维码 = /zrm-menu/?menu=dinner-menu)。切换时被跳到文字菜单页,店家指出扫码看到的不是原来带图的。
// 原样复刻旧页四个菜单,二维码网址不变。旧页在 Google 里没有流量(GSC 16 个月无记录),按二维码落地页处理:不收录、不进 sitemap。
export const metadata: Metadata = {
  title: 'Menu with Photos',
  description: 'Dinner, lunch, happy hour and catering menus with a photo for every dish at Zen Ramen & Sushi, 150 W 36th St, Midtown Manhattan.',
  alternates: { canonical: '/zrm-menu/' },
  robots: { index: false, follow: true },
};

export default function PhotoMenuPage(){
  return <main id="main">
    <PageHeading label="ZEN RAMEN & SUSHI MENU" title="Menu with photos" description="Every dish with its photo — dinner, lunch, happy hour and catering. 150 W 36th St, Midtown Manhattan." />
    <div className="menu-top-cta container"><a className="button button-red" href={site.order} data-cta="pm-order" target="_blank" rel="noopener noreferrer">ORDER ONLINE <Arrow/></a><a className="text-link" href={site.reserve} data-cta="pm-reserve" target="_blank" rel="noopener noreferrer">RESERVE A TABLE <Arrow/></a><a className="text-link" href={site.phoneHref} data-cta="pm-call">CALL {site.phone}</a></div>
    <PhotoMenu cateringEmail={site.cateringEmail} />
  </main>;
}
