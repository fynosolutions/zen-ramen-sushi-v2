'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const finish = useRef<() => void>(() => {});
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try { if (sessionStorage.getItem('zen-intro-v2')) return; } catch {}
    const timer = window.setTimeout(() => setActive(true), 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!active || !root.current) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const background = Array.from(document.querySelectorAll<HTMLElement>('header, main, footer'));
    const originalInert = background.map(element=>element.inert);
    background.forEach(element=>{element.inert=true;});
    const wasFocused=document.activeElement as HTMLElement|null;
    root.current.querySelector<HTMLButtonElement>('button')?.focus({preventScroll:true});
    let complete = false;
    const done = () => {
      if (complete) return;
      complete = true;
      document.body.style.overflow = previous;
      background.forEach((element,i)=>{element.inert=originalInert[i];});
      if(root.current?.contains(document.activeElement)){
        if(wasFocused&&wasFocused!==document.body)wasFocused.focus({preventScroll:true});
        else {const main=document.querySelector('main');main?.setAttribute('tabindex','-1');main?.focus({preventScroll:true});}
      }
      try { sessionStorage.setItem('zen-intro-v2', '1'); } catch {}
      setActive(false);
    };
    finish.current = done;
    const timeout = window.setTimeout(done, 2200);
    const timeline = gsap.timeline({ onComplete: done });
    const assetsReady = Promise.allSettled([document.fonts.ready, root.current.querySelector('img')?.decode()]);
    timeline.fromTo(root.current.querySelectorAll('.intro-tile'), { scale: 1 }, { scale: 0, stagger: { each: .006, from: 'random' }, duration: .32, ease: 'power2.inOut' })
      .fromTo(root.current.querySelector('.intro-caption'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .25 }, .28)
      .addPause(0.62,()=>{void assetsReady.then(()=>{if(!complete)timeline.resume();});})
      .to(root.current, { yPercent: -100, duration: .5, ease: 'power3.inOut' }, 0.68);
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') done(); };
    window.addEventListener('keydown', escape);
    return () => { clearTimeout(timeout); timeline.kill(); document.body.style.overflow = previous; background.forEach((element,i)=>{element.inert=originalInert[i];}); window.removeEventListener('keydown', escape); };
  }, [active]);
  if (!active) return null;
  return <div ref={root} className="intro" role="dialog" aria-modal="true" aria-label="Welcome to Zen Ramen and Sushi">
    <button className="intro-skip" onClick={() => finish.current()}>SKIP INTRO ↗</button>
    <div className="intro-brand"><img src="/brand/logo.jpg" alt="Zen Ramen and Sushi" width="240" height="240" /><div className="intro-tiles" aria-hidden="true">{Array.from({length:48},(_,i)=><span className="intro-tile" key={i}/>)}</div></div>
    <p className="intro-caption">AUTHENTIC RAMEN & SUSHI.</p><span className="intro-loading" role="status">LOADING</span>
  </div>;
}
