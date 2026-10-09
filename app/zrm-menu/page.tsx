import type { Metadata } from 'next';
import Link from '@/components/StaticLink';
import { Arrow, PageHeading } from '@/components/Shared';
import { site } from '@/content/site';
import { CateringSections } from '@/components/CateringMenu';

// 宴会带图菜单(2026-10-09):旧站 /zrm-menu/ 就是这份(店里宴会二维码扫出来的页面),切换时被跳到堂食菜单页,店家指出不对。
// 内容 = 旧站该页原样复刻(菜名/价格/说明/配图),数据在 content/catering.json;图在 public/images/catering/。
export const metadata: Metadata = {
  title: 'Catering Menu',
  description: 'Catering menu with photos: party platters, entrée trays, sides, individual bento meals and drinks for offices and events in Midtown Manhattan.',
  alternates: { canonical: '/zrm-menu/' },
};

export default function CateringMenu(){
  return <main id="main">
    <PageHeading label="CATERING MENU" title="Catering menu" description="Party platters, trays, bento meals and drinks from Zen Ramen & Sushi, 150 W 36th St. To order, email us." />
    <section className="container cmenu">
      <div className="scene-ctas"><a className="button button-red" href={'mailto:'+site.cateringEmail} data-cta="catering-menu-email">EMAIL TO ORDER <Arrow /></a><Link className="button button-dark" href="/events-catering/">EVENTS &amp; CATERING <Arrow /></Link><Link className="text-link" href="/menu/">DINE-IN MENU <Arrow /></Link></div>
      <CateringSections />
      <p className="lunch-note">Prices shown are the starting price for each item. Email <a href={'mailto:'+site.cateringEmail}>{site.cateringEmail}</a> for sizes, quantities and availability.</p>
    </section>
  </main>;
}
