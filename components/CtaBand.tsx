'use client';
import { usePathname } from 'next/navigation';
import { site } from '@/content/site';
import { Arrow } from '@/components/Shared';

// 页尾 CTA 条:读完内容的人最该看到「下一步」。法律页与活动页(自带表单)不放。
const HIDE = ['/privacy-policy/','/terms-conditions/','/events-catering/'];
export default function CtaBand(){
  const path = usePathname();
  if(HIDE.includes(path)) return null;
  return <section className="cta-band" aria-labelledby="cta-band-title">
    <div className="cta-band-inner">
      <div><p className="eyebrow">HUNGRY?</p><h2 id="cta-band-title">Ramen &amp; sushi, ready when you are.</h2><p className="cta-band-note"><span>150 W 36th St, Midtown</span> · <span>Walk-ins welcome</span> · <span>Happy hour daily 4–8 PM</span></p></div>
      <div className="cta-band-actions">
        <a className="button button-cream" href={site.order} data-cta="band-order" target="_blank" rel="noopener noreferrer">ORDER ONLINE <Arrow/></a>
        <a className="button button-ghost" href={site.reserve} data-cta="band-reserve" target="_blank" rel="noopener noreferrer">RESERVE A TABLE <Arrow/></a>
        <a className="cta-band-link" href={site.phoneHref} data-cta="band-call">CALL {site.phone}</a>
        <a className="cta-band-link" href={site.directions} data-cta="band-directions" target="_blank" rel="noopener noreferrer">GET DIRECTIONS <Arrow/></a>
      </div>
    </div>
  </section>;
}
