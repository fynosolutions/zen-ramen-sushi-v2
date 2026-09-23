'use client';
import { useEffect, useRef, useState } from 'react';
import { igHandle, igReels, type Reel } from '@/content/ig';
import { Arrow } from '@/components/Shared';

const fmt = (n?:number) => !n || n < 1000 ? null : n >= 1000 ? (n/1000).toFixed(n>=10000?0:1).replace('.0','')+'K' : String(n);

function Tile({reel}:{reel:Reel}){
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const plays = fmt(reel.plays);
  const toggle = (e:React.MouseEvent) => {
    e.preventDefault();
    const v = video.current; if(!v) return;
    if(v.paused){
      if(v.readyState === 0){ v.preload = 'auto'; v.load(); }   // Safari/iOS: preload=none 必须显式 load
      const go = () => v.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false));
      v.readyState >= 2 ? go() : v.addEventListener('loadeddata', go, {once:true});
    } else { v.pause(); setPlaying(false); }
  };
  return <figure className="ig-tile">
    <div className="ig-frame">
      <video ref={video} muted loop playsInline preload="none" poster={`/ig/${reel.id}.webp`} width="1080" height="1920"
        onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}>
        <source src={`/ig/${reel.id}.mp4`} type="video/mp4"/>
      </video>
      <button className="ig-play" onClick={toggle} aria-label={playing?`Pause: ${reel.label}`:`Play: ${reel.label}`} data-playing={playing||undefined}>
        <span aria-hidden="true">{playing ? '❙❙' : '▶'}</span>
      </button>
      {plays && <span className="ig-plays" aria-label={`${plays} plays on Instagram`}>{plays}</span>}
    </div>
    <figcaption className="ig-meta">
      <span className="ig-label">{reel.label}</span>
      <a className="ig-link" href={reel.href} target="_blank" rel="noopener noreferrer">WATCH ON INSTAGRAM <Arrow/></a>
    </figcaption>
  </figure>;
}

export default function IgReels({reels=igReels, variant='grid', eyebrow='@'+igHandle.toUpperCase()+' · REELS', title=<>Fresh from<br/>Instagram.</>}:{reels?:Reel[]; variant?:'grid'|'rail'; eyebrow?:string; title?:React.ReactNode}){
  const root = useRef<HTMLDivElement>(null);
  useEffect(()=>{ // 仅桌面(指针精确)且未开省流量时,进入视野自动静音播放
    const mq = window.matchMedia('(hover:hover) and (pointer:fine)');
    const conn = (navigator as {connection?:{saveData?:boolean;effectiveType?:string}}).connection;
    const thrifty = conn?.saveData || /2g/.test(conn?.effectiveType ?? '');
    if(!mq.matches || thrifty || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const vids = Array.from(root.current?.querySelectorAll('video') ?? []);
    const io = new IntersectionObserver(es=>{for(const e of es){const v=e.target as HTMLVideoElement;
      if(e.isIntersecting){ v.preload='auto'; v.play().catch(()=>{}); } else v.pause();}},{threshold:.4});
    vids.forEach(v=>io.observe(v));
    return ()=>io.disconnect();
  },[]);
  return <section className={variant==='rail'?'ig-section ig-section-rail':'ig-section'} id="instagram">
    <div className="container">
      <div className="section-heading"><div><p className="eyebrow red">{eyebrow}</p><h2>{title}</h2></div>
      <a className="text-link" href={`https://www.instagram.com/${igHandle}/`} target="_blank" rel="noopener noreferrer">FOLLOW ALONG <Arrow/></a></div>
      <div className="ig-grid" ref={root}>{reels.map(r=><Tile key={r.id} reel={r}/>)}</div>
    </div>
  </section>;
}
