import Link from '@/components/StaticLink';
import type { Metadata } from 'next';
import { site } from '@/content/site';
import { Arrow, PageHeading } from '@/components/Shared';

export const metadata: Metadata = {
  title: 'Near Madison Square Garden',
  description: 'Eating before a game or concert at MSG? We are a 6-minute walk away — fast service, ramen, sushi and a daily 4–8 PM happy hour.',
  alternates: { canonical: '/near-madison-square-garden/' },
};

export default function NearMSG() {
  return <main id="main">
    <PageHeading label="6 MINUTES ON FOOT" title="Near Madison Square Garden" description="Game night, concert night, or just passing through — we are the warm bowl of ramen six minutes from the Garden, at 150 W 36th Street." />
    <section className="container scene-page">
      <img className="scene-photo" src="/images/zen-storefront.webp" alt="Diners at wooden tables seen through the Zen storefront at dusk" width="1536" height="1024" />
      <div className="scene-body">
        <h2>Eat well before the Garden, without the wait</h2>
        <p>Madison Square Garden is a six-minute walk from our door: straight down 7th Avenue from 36th to 33rd Street. That makes us the easy answer to the eternal pre-game question — somewhere you can sit down, eat real food, and still make tip-off or the opening act.</p>
        <p>Speed is the point. Our kitchen is famous with regulars for how fast plates land — most orders are on your table within minutes. Arrive 45 minutes before doors open and you have time for a bowl of tonkotsu shoyu, a couple of rolls, and a beer, without watching the clock in a panic.</p>
        <p><a className="text-link" href={site.reserve} target="_blank" rel="noopener noreferrer">RESERVE BEFORE THE SHOW <Arrow /></a></p>
        <h2>Doors at 7? Come at happy hour</h2>
        <p>Most MSG events line up perfectly with our <Link href="/happy-hour/">daily happy hour, 4–8 PM</Link> — twenty-five sushi rolls and ten appetizers at $6.49 each (cash). Feed two people well for the price of one arena hot dog and a soda… almost.</p>
        <h2>After the buzzer</h2>
        <p>Coming out of a late game or an encore instead? We serve until 11 PM Sunday through Wednesday and until midnight Thursday through Saturday, which covers almost every MSG calendar night. A bowl of spicy tonkotsu at 10:45 PM beats a cold slice on the walk to the subway — and the 34th Street stations for the 1, 2, 3, A, C and E are all between us and the Garden, so you are heading home right past our door anyway.</p>
        <h2>Room for your whole crew</h2>
        <p>We seat on two floors — if the ground floor looks full from the window, come in anyway: most of our tables are upstairs. Going to the Garden with a bigger group? <Link href="/events-catering/">Let us know ahead</Link> and we&rsquo;ll take care of you.</p>
        <div className="scene-facts">
          <div><strong>From MSG</strong><span>6 min walk · 0.3 miles</span></div>
          <div><strong>Address</strong><span>150 W 36th St, NY 10018</span></div>
          <div><strong>Open until</strong><span>11 PM Sun–Wed · midnight Thu–Sat</span></div>
          <div><strong>Call us</strong><span><a href={site.phoneHref}>{site.phone}</a></span></div>
        </div>
        <div className="scene-ctas"><Link className="button button-red" href="/menu/">SEE THE MENU <Arrow /></Link><a className="button button-dark" href={site.directions} target="_blank" rel="noopener noreferrer">GET DIRECTIONS <Arrow /></a><a className="text-link" href={site.reserve} target="_blank" rel="noopener noreferrer">RESERVE A TABLE <Arrow /></a></div>
      </div>
    </section>
  </main>;
}
