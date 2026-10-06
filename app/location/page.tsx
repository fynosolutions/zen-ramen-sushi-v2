import type { Metadata } from 'next';
import Link from '@/components/StaticLink';
import LocationMap from '@/components/LocationMap';
import { Arrow, PageHeading } from '@/components/Shared';
import { site } from '@/content/site';

// 旧站 /location/ 的同网址页(旧页近 3 个月 1.1 万次搜索曝光);切换时曾被跳到 /about/,2026-10-06 改回真页面
export const metadata: Metadata = {
  title: 'Location & Hours',
  description: 'Zen Ramen & Sushi is at 150 W 36th St in Midtown Manhattan, between 7th Avenue and Broadway. Hours, directions, and how to reach us from Penn Station.',
  alternates: { canonical: '/location/' },
};

export default function Location(){
  return <main id="main">
    <PageHeading label="150 W 36TH ST · MIDTOWN MANHATTAN" title="Location & hours" description="We're on 36th Street between 7th Avenue and Broadway, five minutes on foot from Penn Station. Seating on two floors." />
    <section className="container scene-page">
      <div className="location-card"><div className="location-info"><span className="location-tag">ONE LITTLE CORNER OF NYC</span><h2 className="location-title">Come on in.</h2><p className="address">150 W 36th St<br/>New York, NY 10018</p><a className="phone" href={site.phoneHref}>{site.phone} <Arrow/></a><div className="hours">{site.hours.map(h=><div key={h.days}><span>{h.days}</span><span>{h.time}</span></div>)}</div><a href={site.directions} className="button button-dark" target="_blank" rel="noopener noreferrer">GET DIRECTIONS <Arrow/></a></div><LocationMap/></div>
      <div className="scene-body location-body">
        <h2>Getting here</h2>
        <p>Zen Ramen & Sushi is at 150 W 36th Street, between 7th Avenue and Broadway in Midtown Manhattan — look for the cat in the red bowl. From Penn Station or Moynihan Train Hall, walk up 7th or 8th Avenue to 36th Street; it takes about five minutes. Herald Square, Bryant Park and Koreatown on 32nd Street are all a short walk away.</p>
        <p>Coming from a train? See our guide to eating <Link href="/near-penn-station/">near Penn Station</Link>. Heading to a game or a show? Here is how to fit a meal in <Link href="/near-madison-square-garden/">near Madison Square Garden</Link>.</p>
        <h2>Two floors of seating</h2>
        <p>If the ground floor looks full from the window, come in anyway: most of our tables are upstairs.</p>
        <h2>When to come</h2>
        <p>Our <Link href="/lunch-specials/">lunch specials</Link> run Monday to Friday, 11:30 AM to 4:00 PM, except holidays. <Link href="/happy-hour/">Happy hour</Link> is every day from 4 to 8 PM. We stay open until midnight Thursday through Saturday and until 11 PM the rest of the week.</p>
        <div className="scene-ctas"><Link className="button button-red" href="/menu/">SEE THE MENU <Arrow /></Link><a className="button button-dark" href={site.order} data-cta="location-order" target="_blank" rel="noopener noreferrer">ORDER ONLINE <Arrow /></a><a className="text-link" href={site.reserve} data-cta="location-reserve" target="_blank" rel="noopener noreferrer">RESERVE A TABLE <Arrow /></a></div>
      </div>
    </section>
  </main>;
}
