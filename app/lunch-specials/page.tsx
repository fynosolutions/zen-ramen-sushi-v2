import type { Metadata } from 'next';
import Link from '@/components/StaticLink';
import { Arrow, PageHeading } from '@/components/Shared';
import { site } from '@/content/site';
import menus from '@/content/menus.json';

// 午市套餐独立页(2026-10-06):旧站 /lunch-specials-2/ 近 3 个月 117 次搜索点击,切换时只跳到菜单页的一个位置。
// 菜名、价格、说明全部读 content/menus.json(午市菜单的唯一真相),这里不手写任何一道菜。
type Item = { id:string; name:string; cashCents?:number|null; cardCents?:number|null; description?:string };
type Section = { id:string; title:string; notes?:string[]; items:Item[] };
const lunch = (menus as unknown as {id:string;availability:string;pdf:string;notice:string;sections:Section[]}[]).find(m => m.id==='lunch')!;
const money = (c:number) => '$'+(c/100).toFixed(2);
const mains = lunch.sections.filter(s => s.id!=='extra-topping');
const from = Math.min(...mains.flatMap(s => s.items.map(i => i.cashCents ?? Infinity)));

export const metadata: Metadata = {
  title: 'Lunch Specials',
  description: `Weekday lunch specials in Midtown Manhattan: sushi sets, bento boxes, rice dishes and lunch rolls from ${money(from)}. ${lunch.availability.split(' · ').slice(0,2).join(', ')}.`,
  alternates: { canonical: '/lunch-specials/' },
};

export default function LunchSpecials(){
  return <main id="main">
    <PageHeading label={lunch.availability.split(' · ').slice(0,2).join(' · ').toUpperCase()} title="Lunch specials" description={`Sushi bar sets, bento boxes, rice dishes and lunch rolls from ${money(from)} (cash price), at 150 W 36th Street — five minutes from Penn Station.`} />
    <section className="container scene-page lunch-page">
      <div className="scene-body">
        <h2>A full lunch in a Midtown lunch break</h2>
        <p>Our lunch menu is served {lunch.availability.split(' · ')[0]}, {lunch.availability.split(' · ')[1]} ({lunch.availability.split(' · ')[2]?.toLowerCase()}). Every set below comes with the sides listed under its heading. Prices are shown as cash and card.</p>
        <div className="scene-ctas"><a className="button button-red" href={site.order} data-cta="lunch-order" target="_blank" rel="noopener noreferrer">ORDER ONLINE <Arrow /></a><Link className="button button-dark" href="/menu/#lunch">FULL LUNCH MENU <Arrow /></Link><a className="text-link" href={site.reserve} data-cta="lunch-reserve" target="_blank" rel="noopener noreferrer">RESERVE A TABLE <Arrow /></a></div>
      </div>
      {lunch.sections.map(s => <div className="lunch-section" key={s.id}>
        <h2>{s.title}</h2>
        {(s.notes||[]).map(n => <p className="lunch-note" key={n}>{n}</p>)}
        <ul className="lunch-items">{s.items.map(i => <li key={i.id}><div><strong>{i.name}</strong>{i.description ? <span>{i.description}</span> : null}</div>{i.cashCents!=null && <p className="lunch-price"><span><small>CASH</small>{money(i.cashCents)}</span>{i.cardCents!=null && <span><small>CARD</small>{money(i.cardCents)}</span>}</p>}</li>)}</ul>
      </div>)}
      <div className="scene-body">
        <p className="lunch-note">{lunch.notice}</p>
        <h2>After work instead?</h2>
        <p><Link href="/happy-hour/">Happy hour</Link> runs every day from 4 to 8 PM. Planning lunch for the office? See <Link href="/events-catering/">events &amp; catering</Link>. Find us on the <Link href="/location/">location &amp; hours</Link> page.</p>
      </div>
    </section>
  </main>;
}
