'use client';
import Ico from '@/components/Ico';
import { useState } from 'react';

/* 首页红色滚动字条的暂停键(无障碍 WCAG 2.2.2:自动滚动超过 5 秒的内容必须能暂停,2026-10-29)。暂停 = 给 .ticker 加 data-paused,CSS 停住动画 */
export default function TickerPause(){
  const [paused, setPaused] = useState(false);
  return <button type="button" className="ticker-pause" aria-pressed={paused} aria-label={paused?'Resume scrolling text':'Pause scrolling text'}
    onClick={e=>{const t=e.currentTarget.closest('.ticker');const next=!paused;setPaused(next);if(next)t?.setAttribute('data-paused','');else t?.removeAttribute('data-paused');}}>
    <Ico n={paused?'play':'pause'}/>
  </button>;
}
