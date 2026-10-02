'use client';
import { useEffect } from 'react';

type Gtag = (...args:unknown[]) => void;
// 全站 CTA 点击 → GA4 事件(没装 GA 时什么都不做)。给链接加 data-cta="位置-动作" 即被统计。
export default function CtaTracker(){
  useEffect(()=>{
    const onClick = (e:MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('a[data-cta], a[href^="tel:"]') as HTMLAnchorElement | null;
      if(!el) return;
      const gtag = (window as unknown as {gtag?:Gtag}).gtag;
      if(typeof gtag !== 'function') return;
      const href = el.getAttribute('href') ?? '';
      const raw = el.dataset.cta || 'phone';
      const base = {cta_id: raw.replace(/-/g,'_'), cta_location: el.dataset.cta ? raw.split('-')[0] : 'site', link_url: href};
      gtag('event','cta_click',base);
      if(href.startsWith('tel:')) gtag('event','click_to_call',base);
      else if(/google\.com\/maps\/dir/.test(href)) gtag('event','get_directions',base);
      else if(/google\.com\/maps/.test(href)) gtag('event','reviews_click',base);
      else if(/toasttab|ubereats|doordash|grubhub/.test(href)) gtag('event','order_click',{...base, platform:(href.match(/toasttab|ubereats|doordash|grubhub/)||[''])[0]});
      else if(/resy\.com/.test(href)) gtag('event','reserve_click',base);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  },[]);
  return null;
}
