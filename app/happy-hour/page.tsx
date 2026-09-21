import Link from '@/components/StaticLink';
import type { Metadata } from 'next';
import { site } from '@/content/site';
import { Arrow, PageHeading } from '@/components/Shared';

export const metadata: Metadata = {
  title: 'Happy Hour · $6.49 Rolls Daily',
  description: 'Happy hour in Midtown every day 4–8 PM: sushi rolls and appetizers at $6.49, plus sake, beer and cocktails. 150 W 36th St, near Penn Station.',
  alternates: { canonical: '/happy-hour/' },
  openGraph: { title: 'Happy Hour at ZEN RAMEN & SUSHI', description: 'Every day 4–8 PM. Sushi rolls from $6.49.', url: '/happy-hour/' },
};

const rolls = ['California', 'Spicy Tuna (Crunch)', 'Spicy Salmon (Crunch)', 'Avocado', 'Salmon Mango', 'Sweet Potato', 'Eel Cucumber', 'Shrimp Tempura', 'Yellow Tail Scallion', 'Tuna Mango'];
const bites = ['Crispy Wings', 'Gyoza', 'Karaage', 'Fried Shrimp Shumai', 'Edamame', 'Purple Sweet Potato Tempura', 'Kani Salad', 'Seaweed Salad', 'Cucumber Salad', 'Garden Green Salad'];

export default function HappyHour() {
  return <main id="main">
    <PageHeading label="EVERY DAY · 4–8 PM" title="Happy Hour" description="Twenty-five sushi rolls and ten appetizers, one happy little price: $6.49 cash ($6.75 card) per item. Every single day, 4 to 8 PM, at 150 W 36th Street in Midtown Manhattan." />
    <section className="container hh-page">
      <div className="hh-hero-grid">
        <img src="/images/zen-happy-hour.webp" alt="Cold draft beer and izakaya small plates during happy hour at Zen" width="1536" height="1024" />
        <div className="hh-deal-card">
          <p className="eyebrow">THE DEAL</p>
          <p className="hh-price"><strong>$6.49</strong><span>per item · cash ($6.75 card)<br />rolls &amp; appetizers alike</span></p>
          <p className="hh-oneprice">25 sushi rolls + 10 appetizers.<br />One price. No asterisks.</p>
          <p className="hh-hours-line">Every day · 4:00 PM – 8:00 PM<br />Walk-ins welcome, upstairs &amp; down.</p>
          <div className="hh-ctas"><Link className="button button-red" href="/menu/#happy-hour">SEE THE FULL HAPPY HOUR MENU <Arrow /></Link><a className="button button-dark" href={site.reserve} target="_blank" rel="noopener noreferrer">RESERVE A TABLE <Arrow /></a></div>
        </div>
      </div>

      <div className="hh-columns">
        <div>
          <h2>What&rsquo;s on the happy hour menu</h2>
          <p>Our happy hour is not a shortlist of leftovers — it&rsquo;s twenty-five full-size sushi rolls and ten appetizers, each at one flat price. Order a couple of rolls and a plate of karaage and you have dinner in Midtown for under twenty dollars.</p>
          <div className="hh-lists">
            <div><h3>Sushi rolls · $6.49 each</h3><ul>{rolls.map(r => <li key={r}>{r} Roll</li>)}</ul><p className="hh-more"><Link href="/menu/#happy-hour">…and 15 more on the full menu <Arrow /></Link></p></div>
            <div><h3>Appetizers &amp; bites</h3><ul>{bites.map(b => <li key={b}>{b}</li>)}</ul></div>
          </div>
          <h2>Drinks, too</h2>
          <p>Sake, Japanese beer, wine, cocktails and chu-hi all join the party — the happy hour selections are marked in red on our menu. The beer list runs from Sapporo and Kirin Ichiban to the more adventurous Echigo IPA, Matcha IPA and White Yuzu; the chu-hi comes in yuzu, white peach, lychee, Kyoho grape and kabosu. Feeling fancy? There is a sake on our list literally named &ldquo;Drunken Whale.&rdquo;</p>
          <p>Pair a cold Sapporo with crispy wings, or a yuzu chu-hi with a spicy salmon roll, and let the after-work crowd noise do the rest.</p>
          <h2>The Midtown happy hour math</h2>
          <p>Here is what one flat price actually buys you. Two people, two rolls each, one shared plate of gyoza and one of edamame: six items, just under forty dollars before drinks. Try assembling that anywhere else within five blocks of Herald Square at 6 PM on a Thursday. Most nearby bars charge more than that for two rounds of drinks alone — here it covers an actual dinner, made to order, at a table you did not have to fight for.</p>
          <p>It is also the rare happy hour that works for non-drinkers: because the deal is on the food, not just the drinks, you can skip the alcohol entirely and still walk out feeling like you gamed the system. Ramune, Calpico and Japanese teas are on the menu for exactly this crowd.</p>
          <h2>How to do it right</h2>
          <p>Come before 5:30 PM for the calmest seats, or after 6:30 PM when the first office wave clears out. Order in two rounds — rolls first, then whatever the table is still hungry for — since the kitchen is fast enough that a second order will not slow you down. And if you are planning to catch a show, a game at the Garden, or a train home, tell your server; New Yorkers respect a deadline, and so do we.</p>
          <h2>Why regulars love it</h2>
          <blockquote>&ldquo;The food came out minutes after we ordered, and it was the perfect temperature down to the last bite.&rdquo;</blockquote>
          <p>With 4.5 stars across more than 7,800 reviews on Google and Yelp, our happy hour is one of Midtown&rsquo;s worst-kept secrets. Service is famously fast — most plates land on your table within minutes — so even a 45-minute window between the office and your train at Penn Station is enough.</p>
          <h2>Happy hour vs. lunch special: which one is yours?</h2>
          <p>People sometimes mix up our two deals, so here is the clean split. The <Link href="/menu/#lunch">lunch menu</Link> runs weekdays 11:30 AM to 4 PM and is built around sets — bento boxes, sushi combinations and rice bowls with miso soup. Happy hour picks up right where lunch ends: 4 PM, every day including weekends, à la carte, one price per item. If you want a structured meal with soup and sides, come at lunch. If you want to graze, share, and order one more round of rolls because the table voted yes, happy hour is your window.</p>
          <p>And if you land in the gap on a weekend afternoon? Dinner service runs all day — nobody leaves hungry on a technicality.</p>
          <h2>Good to know before you come</h2>
          <ul className="hh-notes">
            <li><strong>Hours:</strong> happy hour runs 4–8 PM every day of the week — including weekends.</li>
            <li><strong>Where to sit:</strong> we have seating on two floors. If the ground floor looks full from the window, come in anyway — most of our tables are upstairs.</li>
            <li><strong>Prices:</strong> listed prices are cash; card prices are slightly higher and shown item-by-item on the menu.</li>
            <li><strong>Groups:</strong> happy hour works beautifully for groups — plates are made for sharing. For parties of 8+, <Link href="/events-catering/">tell us ahead of time</Link>.</li>
            <li><strong>Getting here:</strong> we&rsquo;re at <a href={site.directions} target="_blank" rel="noopener noreferrer">150 W 36th St</a>, five minutes on foot from Penn Station, Herald Square and Bryant Park — or call <a href={site.phoneHref}>{site.phone}</a>.</li>
          </ul>
        </div>
        <aside className="hh-aside">
          <img src="/images/dish-crispy-wings.webp" alt="Crispy fried chicken wings with a lemon wedge" width="1024" height="1024" loading="lazy" />
          <img src="/images/dish-salmon-mango.webp" alt="Salmon mango roll with thin mango slices on top" width="1024" height="1024" loading="lazy" />
          <img src="/images/dish-purple-yam-tempura.webp" alt="Purple sweet potato tempura with dipping sauce" width="1024" height="1024" loading="lazy" />
        </aside>
      </div>
    </section>
  </main>;
}
