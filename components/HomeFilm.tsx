'use client';
import Ico from '@/components/Ico';
import { useEffect, useRef, useState } from 'react';
import { homeFilm as film } from '@/content/media';

/* 首图下方通栏视频:电脑和手机都是「滑到眼前才静音循环播」(2026-10-02 毛定:手机也要自动播,但不能拖慢页面)。
   不拖慢页面靠三条:① preload="none",滑到之前一个字节都不下;② 等页面自己的东西全部加载完(window load)才开始盯视频;③ 手机用轻量版 srcMobile。
   省流量模式 / 2G / 系统「减少动态效果」/ iPhone 省电模式(系统会拒绝自动播)→ 只显示封面 + 播放按钮。详见 memory ref_web_video_mobile_contract */
export default function HomeFilm(){
  const v = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<'idle'|'ambient'|'sound'>('idle');
  const start = (withSound:boolean) => {
    const el = v.current; if(!el) return;
    el.muted = !withSound;
    if(el.readyState === 0){ el.preload = 'auto'; el.load(); }   /* Safari/iOS: preload=none 必须显式 load */
    /* load 之后立刻 play(不等 loadeddata):iPhone 不会为没在播的视频预加载数据,等 loadeddata 会永远等不到;带声音的播放也必须在点按的同一刻发起 */
    el.play().then(()=>setState(withSound?'sound':'ambient')).catch(()=>{});
  };
  useEffect(()=>{
    const el = v.current; if(!el) return;
    if(film.srcMobile && window.matchMedia('(max-width:650px)').matches){ const s = el.querySelector('source'); if(s && el.readyState === 0) s.src = film.srcMobile; }
    const conn = (navigator as {connection?:{saveData?:boolean;effectiveType?:string}}).connection;
    const thrifty = conn?.saveData || /2g/.test(conn?.effectiveType ?? '');
    if(thrifty || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let io: IntersectionObserver | undefined;
    const arm = () => {
      io = new IntersectionObserver(([e])=>{
        if(e.isIntersecting){ if(el.paused && el.muted) start(false); } else if(el.muted) el.pause();
      },{threshold:.4});
      io.observe(el);
    };
    if(document.readyState === 'complete') arm(); else window.addEventListener('load', arm, {once:true});
    return ()=>{ window.removeEventListener('load', arm); io?.disconnect(); };
  },[]);
  return <section className="home-film" aria-label={film.title}>
    <video ref={v} muted loop playsInline preload="none" poster={film.poster} width="1280" height="720" controls={state==='sound'} aria-label={film.title}>
      <source src={film.src} type="video/mp4"/>
    </video>
    {state!=='sound' && <div className="home-film-overlay">
      <p className="home-film-caption"><span className="red-dot"/>INSIDE ZEN · 150 W 36TH ST</p>
      <button className="home-film-play" onClick={()=>start(true)}><span aria-hidden="true"><Ico n="play"/></span> {state==='ambient'?'WATCH WITH SOUND':'PLAY THE FILM'}</button>
    </div>}
  </section>;
}
