import type { Metadata } from 'next';
import Link from '@/components/StaticLink';
import { Arrow, PageHeading } from '@/components/Shared';
import { site } from '@/content/site';
import catering from '@/content/catering.json';

// 宴会带图菜单(2026-10-09):旧站 /zrm-menu/ 就是这份(店里宴会二维码扫出来的页面),切换时被跳到堂食菜单页,店家指出不对。
// 内容 = 旧站该页原样复刻(菜名/价格/说明/配图),数据在 content/catering.json;图在 public/images/catering/。
type Item = { id:string; name:string; price:string; label:string; description:string; tags:string[]; image:string|null; imageSize:number[]|null };
type Section = { id:string; title:string; note:string|null; items:Item[] };
const sections = catering.sections as unknown as Section[];

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
      {sections.map(s => <div className="cmenu-section" key={s.id} id={s.id}>
        <h2>{s.title}</h2>
        {s.note ? <p className="lunch-note">{s.note}</p> : null}
        <ul className="cmenu-items">{s.items.map(i => <li key={i.id}>
          {i.image && i.imageSize ? <img src={'/images/catering/'+i.image} alt={i.name} width={i.imageSize[0]} height={i.imageSize[1]} loading="lazy"/> : <div className="cmenu-noimg" aria-hidden="true"/>}
          <div className="cmenu-body">
            <strong>{i.name}</strong>
            <p className="cmenu-price"><b>{i.price}</b>{i.label ? <span>{i.label.startsWith('/') ? i.label : '| '+i.label}</span> : null}</p>
            {i.description ? <p className="cmenu-desc">{i.description}</p> : null}
            {i.tags.length ? <p className="cmenu-tags">{i.tags.map(t => <span key={t}>{t}</span>)}</p> : null}
          </div>
        </li>)}</ul>
      </div>)}
      <p className="lunch-note">Prices shown are the starting price for each item. Email <a href={'mailto:'+site.cateringEmail}>{site.cateringEmail}</a> for sizes, quantities and availability.</p>
    </section>
  </main>;
}
