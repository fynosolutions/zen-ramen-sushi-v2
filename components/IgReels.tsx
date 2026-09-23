'use client';
import { useEffect, useRef } from 'react';
import { igHandle, igReels } from '@/content/ig';
import { Arrow } from '@/components/Shared';

export default function IgReels(){
  const root = useRef<HTMLDivElement>(null);
  useEffect(()=>{ // 进入视野自动静音播放,离开暂停;尊重省流量/减弱动态
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const vids = Array.from(root.current?.querySelectorAll('video')??[]);
    const io = new IntersectionObserver(es=>{for(const e of es){const v=e.target as HTMLVideoElement; if(e.isIntersecting){v.play().catch(()=>{});} else v.pause();}},{threshold:.35});
    vids.forEach(v=>io.observe(v));
    return ()=>io.disconnect();
  },[]);
  return <section className="ig-section" aria-label="Zen Ramen & Sushi on Instagram">
    <div className="container">
      <div className="section-heading"><div><p className="eyebrow red">@{igHandle.toUpperCase()} · REELS</p><h2>Fresh from<br/>Instagram.</h2></div>
      <a className="text-link" href={`https://www.instagram.com/${igHandle}/`} target="_blank" rel="noopener noreferrer">FOLLOW ALONG <Arrow/></a></div>
      <div className="ig-grid" ref={root}>
        {igReels.map(r=><a className="ig-tile" key={r.id} href={r.href} target="_blank" rel="noopener noreferrer" aria-label={`Watch on Instagram: ${r.label}`}>
          <video muted loop playsInline preload="none" poster={`/ig/${r.id}.webp`} width="1080" height="1920"><source src={`/ig/${r.id}.mp4`} type="video/mp4"/></video>
          <span className="ig-caption"><span className="ig-plays" aria-hidden="true">▶ {r.plays}</span>{r.label}<span aria-hidden="true">↗</span></span>
        </a>)}
      </div>
    </div>
  </section>;
}
