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
  useEffect(() => {
    let ticking = false;
    const onScroll = () => { if(ticking) return; ticking = true; requestAnimationFrame(()=>{document.documentElement.toggleAttribute('data-scrolled', window.scrollY > 40); ticking = false;}); };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
    return () => window.removeEventListener('scroll', onScroll);
  },[]);
  const close = () => {setMobile(false);setDelivery(false);};
  const active = (path:string) => pathname === path ? 'page' as const : undefined;
  return <>
    <div className="utility"><span>150 W 36TH ST · MIDTOWN MANHATTAN</span><span className="utility-right"><a href={site.phoneHref}>{site.phone}</a><a href="/menu/#happy-hour">HAPPY HOUR · 4–8 PM <span aria-hidden="true">↗</span></a></span></div>
    <header className="header"><Link href="/" aria-label="ZEN RAMEN & SUSHI home" className="brand" onClick={close}><img src="/brand/logo.jpg" alt="" width="64" height="64"/><span>ZEN{' '}<small>RAMEN & SUSHI</small></span></Link>
      <span className="header-mobile-actions"><a className="header-call" href={site.phoneHref} aria-label={'Call us at '+site.phone}><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></a>
      <button ref={mobileButton} className="nav-toggle" aria-expanded={mobile} aria-controls="primary-navigation" aria-label={mobile?'Close navigation menu':'Open navigation menu'} onClick={()=>setMobile(!mobile)}>{mobile?'CLOSE ×':'MENU ☰'}</button></span>
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
