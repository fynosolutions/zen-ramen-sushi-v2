import type { Metadata } from 'next';
import Link from '@/components/StaticLink';
import { Arrow, PageHeading } from '@/components/Shared';
import { posts, fmtDate, cardImage } from '@/lib/journal';

export const metadata: Metadata = {
  title: 'Ramen & Sushi Guides',
  description: 'Guides from the Zen Ramen & Sushi kitchen in Midtown Manhattan: ramen broths and noodles, sushi and sashimi, sake pairings, and how to order like a regular.',
  alternates: { canonical: '/blog/' },
};
const mostRead = [...posts].sort((a,b) => b.clicks-a.clicks).slice(0,6);
const byDate = [...posts].sort((a,b) => b.date.localeCompare(a.date));

export default function Blog(){
  return <main id="main">
    <PageHeading label="ZEN JOURNAL" title="Ramen & sushi guides" description="Notes from our kitchen on 36th Street: how ramen broths differ, what makes sushi fish great, what to drink with it, and how to order like a regular." />
    <section className="container scene-page journal-index">
      <h2>Most read</h2>
      <ul className="journal-cards">{mostRead.map(p => { const im = cardImage(p); return <li key={p.path}><Link href={p.path}><img src={im.src} alt={im.alt} width={im.width} height={im.height} loading="lazy" /><strong>{p.title}</strong><span>{p.description}</span></Link></li>; })}</ul>
      <h2>All guides</h2>
      <ul className="journal-list">{byDate.map(p => <li key={p.path}><Link href={p.path}>{p.title}</Link><time dateTime={p.date}>{fmtDate(p.date)}</time></li>)}</ul>
      <div className="scene-ctas"><Link className="button button-red" href="/menu/">SEE THE MENU <Arrow /></Link><Link className="text-link" href="/happy-hour/">HAPPY HOUR · 4–8 PM DAILY <Arrow /></Link></div>
    </section>
  </main>;
}
