'use client';
import { useEffect, useRef, useState } from 'react';
import { homeFilm as film } from '@/content/media';

// 首图下方通栏视频:桌面进视野静音循环;手机/省流量/减少动效只给封面+播放按钮(见 memory ref_web_video_mobile_contract)
export default function HomeFilm(){
  const v = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<'idle'|'ambient'|'sound'>('idle');
  const start = (withSound:boolean) => {
    const el = v.current; if(!el) return;
    el.muted = !withSound;
    if(el.readyState === 0){ el.preload = 'auto'; el.load(); }   // Safari/iOS: preload=none 必须显式 load
    const go = () => el.play().then(()=>setState(withSound?'sound':'ambient')).catch(()=>{});
    el.readyState >= 2 ? go() : el.addEventListener('loadeddata', go, {once:true});
  };
  useEffect(()=>{
    const el = v.current; if(!el) return;
    const conn = (navigator as {connection?:{saveData?:boolean;effectiveType?:string}}).connection;
    const thrifty = conn?.saveData || /2g/.test(conn?.effectiveType ?? '');
    if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches || thrifty || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ if(el.paused && el.muted) start(false); } else if(el.muted) el.pause();
    },{threshold:.4});
    io.observe(el);
    return ()=>io.disconnect();
  },[]);
  return <section className="home-film" aria-label={film.title}>
    <video ref={v} muted loop playsInline preload="none" poster={film.poster} width="1280" height="720" controls={state==='sound'} aria-label={film.title}>
      <source src={film.src} type="video/mp4"/>
    </video>
    {state!=='sound' && <div className="home-film-overlay">
      <p className="home-film-caption"><span className="red-dot"/>INSIDE ZEN · 150 W 36TH ST</p>
      <button className="home-film-play" onClick={()=>start(true)}><span aria-hidden="true">▶</span> {state==='ambient'?'WATCH WITH SOUND':'PLAY THE FILM'}</button>
    </div>}
  </section>;
}
