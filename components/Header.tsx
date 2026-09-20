'use client';
import Link from '@/components/StaticLink';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';

export default function Header() {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const deliveryButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const key = (e:KeyboardEvent) => { if(e.key === 'Escape') { if(delivery) {setDelivery(false);deliveryButton.current?.focus();} else if(mobile){setMobile(false);mobileButton.current?.focus();} } };
    const click = (e:PointerEvent) => { if(!nav.current?.contains(e.target as Node) && !mobileButton.current?.contains(e.target as Node)){setDelivery(false);setMobile(false);} };
    document.addEventListener('keydown',key); document.addEventListener('pointerdown',click);
    return () => {document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',click);};
  },[mobile,delivery]);
  const close = () => {setMobile(false);setDelivery(false);};
  const active = (path:string) => pathname === path ? 'page' as const : undefined;
  return <>
    <div className="utility"><span>150 W 36TH ST · MIDTOWN MANHATTAN</span><a href="/menu/#happy-hour">HAPPY HOUR · 4–8 PM <span aria-hidden="true">↗</span></a></div>
    <header className="header"><Link href="/" aria-label="ZEN RAMEN & SUSHI home" className="brand" onClick={close}><img src="/brand/logo.jpg" alt="" width="64" height="64"/><span>ZEN{' '}<small>RAMEN & SUSHI</small></span></Link>
      <button ref={mobileButton} className="nav-toggle" aria-expanded={mobile} aria-controls="primary-navigation" aria-label={mobile?'Close navigation menu':'Open navigation menu'} onClick={()=>setMobile(!mobile)}>{mobile?'CLOSE ×':'MENU ☰'}</button>
      <nav ref={nav} id="primary-navigation" aria-label="Main navigation" className={mobile?'navigation mobile-open':'navigation'}>
        <Link href="/menu/" aria-current={active('/menu/')} onClick={close}>MENU</Link><Link href="/about/" aria-current={active('/about/')} onClick={close}>ABOUT</Link><Link href="/#hours-location" onClick={close}>HOURS & LOCATION</Link>
        <div className="delivery" onMouseEnter={()=>{if(window.matchMedia('(hover:hover)').matches)setDelivery(true);}} onMouseLeave={()=>{if(window.matchMedia('(hover:hover)').matches&&!nav.current?.querySelector('.delivery')?.contains(document.activeElement))setDelivery(false);}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setDelivery(false);}}>
          <button ref={deliveryButton} aria-expanded={delivery} aria-controls="delivery-links" onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))setDelivery(true);}} onClick={()=>setDelivery(!delivery)}>ORDER DELIVERY/PICKUP <span aria-hidden="true">⌄</span></button>
          {delivery&&<div className="delivery-links" id="delivery-links">{site.delivery.map(item=>item.href?<a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" onClick={close}>{item.name}<span aria-hidden="true">↗</span></a>:<span className="unavailable" key={item.name} aria-disabled="true">{item.name}<small>Coming soon</small></span>)}</div>}
        </div>
        <Link href="/events-catering/" aria-current={active('/events-catering/')} onClick={close}>EVENTS/CATERING</Link><a className="button button-red nav-reserve" href={site.reserve} target="_blank" rel="noopener noreferrer">RESERVE TODAY <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  </>;
}
