import Link from '@/components/StaticLink';
import type { Metadata } from 'next';
import { site } from '@/content/site';
import { Arrow, PageHeading } from '@/components/Shared';

export const metadata: Metadata = {
  title: 'Near Penn Station',
  description: 'Five minutes from Penn Station and Moynihan Train Hall: real ramen and fresh sushi, fast enough for a tight train schedule. 150 W 36th St.',
  alternates: { canonical: '/near-penn-station/' },
};

export default function NearPenn() {
  return <main id="main">
    <PageHeading label="5 MINUTES FROM YOUR TRAIN" title="Near Penn Station" description="A real sit-down meal between trains: five minutes on foot from Penn Station and Moynihan Train Hall, with a kitchen fast enough for a tight schedule." />
    <section className="container scene-page">
      <img className="scene-photo" src="/images/zen-sharing-bright.webp" alt="A bright lunch platter of sushi rolls and salmon nigiri by the window" width="1536" height="1024" />
      <div className="scene-body">
        <h2>Better than eating at the station</h2>
        <p>Penn Station and Moynihan Train Hall are a five-minute walk away — up 7th or 8th Avenue to 36th Street. Instead of a rushed sandwich under fluorescent lights, sit down to a slow-simmered bowl of ramen or a plate of fresh-cut sushi, and still make your track announcement.</p>
        <p>Commuters are our home crowd. Our kitchen is built for people who watch the departure board: most plates arrive within minutes of ordering, and lunch service moves fast enough that a one-hour break covers a full meal, unhurried.</p>
        <h2>The commuter&rsquo;s playbook</h2>
        <p><strong>Lunch, Monday–Friday:</strong> our <Link href="/menu/#lunch">lunch menu</Link> runs 11:30 AM–4 PM with bento boxes, sushi sets and rice bowls — most under $20.</p>
        <p><strong>Evening trains:</strong> if you&rsquo;re on a 6 or 7 o&rsquo;clock departure, our <Link href="/happy-hour/">happy hour (4–8 PM daily)</Link> is the smart move — sushi rolls and appetizers at $6.49 each, fast enough to fit between the office and the platform.</p>
        <p><strong>Weekends:</strong> heading to or from a show or a game? We&rsquo;re open until midnight Thursday through Saturday, and 11 PM the rest of the week.</p>
        <h2>Delayed train? Even better.</h2>
        <p>Every commuter knows the sinking feeling of the board flipping to DELAYED. Turn it into found time: we are close enough that you can walk over, order at the counter of the happy hour menu, eat well, and still be back on the platform before your rescheduled departure. Plenty of our regulars discovered us exactly this way — one LIRR delay at a time.</p>
        <h2>Find us</h2>
        <p>We&rsquo;re at 150 W 36th Street, between 7th Avenue and Broadway — look for the cat in the red bowl. Seating on two floors; if downstairs looks full, most of our tables are upstairs.</p>
        <div className="scene-facts">
          <div><strong>From Penn Station</strong><span>5 min walk · 0.25 miles</span></div>
          <div><strong>From Moynihan Hall</strong><span>6 min walk</span></div>
          <div><strong>Lunch</strong><span>Mon–Fri · 11:30 AM–4 PM</span></div>
          <div><strong>Call us</strong><span><a href={site.phoneHref}>{site.phone}</a></span></div>
        </div>
        <div className="scene-ctas"><Link className="button button-red" href="/menu/">SEE THE MENU <Arrow /></Link><a className="button button-dark" href={site.directions} target="_blank" rel="noopener noreferrer">GET DIRECTIONS <Arrow /></a><a className="text-link" href={site.reserve} target="_blank" rel="noopener noreferrer">RESERVE A TABLE <Arrow /></a></div>
      </div>
    </section>
  </main>;
}
