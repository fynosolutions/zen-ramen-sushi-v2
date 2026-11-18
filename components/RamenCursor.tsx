'use client';
import { useEffect } from 'react';

// 拉面碗鼠标(2026-11-18 毛要):平时的碗是浏览器原生鼠标图(globals.css 末尾「拉面碗鼠标」,不卡不延迟);
// 点一下 → 在鼠标图下面叠一层面条,从碗里挑到筷子尖再落回去(约 0.75 秒)。只在电脑鼠标上,手机/触屏不出现;
// 系统开了「减少动态效果」就只留静态碗。鼠标的点击位置 = 筷子尖(左上角 3,3),和普通箭头一样不挡字。
const HOT = 3;
const NOODLES = ['M6.4 14.8C6.2 13.2 4.4 12.6 4.4 10.6S2.6 7 3.4 4.4','M8.4 15C8.2 13 6.2 12.6 6.2 10.6S4.6 7 4 4.4','M10.6 14.8C10.2 12.8 8.2 12.4 8.2 10.4S6.4 6.6 4.6 4.3'];
const SVG = `<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true"><g class="ramen-lift-sway">${
  NOODLES.map(d=>`<path pathLength="1" d="${d}" stroke="#a8711f" stroke-width="2"/><path pathLength="1" d="${d}" stroke="#f9e09a" stroke-width="1.15"/>`).join('')
}</g></svg>`;

export default function RamenCursor(){
  useEffect(()=>{
    const fine = matchMedia('(hover:hover) and (pointer:fine)');
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    let el: HTMLDivElement | null = null;
    const move = (e:PointerEvent) => { if(el) el.style.transform = `translate3d(${e.clientX-HOT}px,${e.clientY-HOT}px,0)`; };
    const down = (e:PointerEvent) => {
      if(e.pointerType !== 'mouse' || e.button !== 0 || !fine.matches || still.matches) return;
      const t = e.target as Element | null;
      if(t?.closest?.('input,textarea,select,[contenteditable],iframe,video')) return;
      el?.remove();
      el = document.createElement('div');
      el.className = 'ramen-lift';
      el.setAttribute('aria-hidden','true');
      el.innerHTML = SVG;
      move(e);
      document.body.appendChild(el);
      const mine = el;
      mine.addEventListener('animationend', ev => { if(ev.target === mine.querySelector('path') && el === mine){ mine.remove(); el = null; } });
      setTimeout(()=>{ if(el === mine){ mine.remove(); el = null; } }, 1200);
    };
    addEventListener('pointerdown', down, {passive:true});
    addEventListener('pointermove', move, {passive:true});
    return () => { removeEventListener('pointerdown', down); removeEventListener('pointermove', move); el?.remove(); };
  },[]);
  return null;
}
