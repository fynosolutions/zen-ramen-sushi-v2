'use client';
import { useEffect } from 'react';

// 小猫 logo 鼠标(2026-11-18 毛要):平时是浏览器原生鼠标图(globals.css 末尾「小猫鼠标」,不卡不延迟);
// 点一下 → 在鼠标图下面叠一只爪子,从猫头后面伸出去点一下左上角的小红点(点击位置),再缩回来(约 0.7 秒)。
// 只在电脑鼠标上;手机/触屏、输入框、系统「减少动态效果」时不出现。
const HOT = 3;
const SVG = `<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
<circle class="cat-tap-ring" cx="3" cy="3" r="2" fill="none" stroke="#e01d25" stroke-width=".8"/>
<g class="cat-tap-arm"><path d="M14.5 15.5Q8.5 12 4.9 5" fill="none" stroke="#171817" stroke-width="3.8" stroke-linecap="round"/>
<path d="M14.5 15.5Q8.5 12 4.9 5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
<circle cx="4.6" cy="4.5" r="2.05" fill="#fff" stroke="#171817" stroke-width=".85"/>
<circle cx="4.3" cy="4.2" r=".75" fill="#f4a3ae"/></g></svg>`;

export default function CatCursor(){
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
      el.className = 'cat-tap';
      el.setAttribute('aria-hidden','true');
      el.innerHTML = SVG;
      move(e);
      document.body.appendChild(el);
      const mine = el;
      setTimeout(()=>{ mine.remove(); if(el === mine) el = null; }, 800);
    };
    addEventListener('pointerdown', down, {passive:true});
    addEventListener('pointermove', move, {passive:true});
    return () => { removeEventListener('pointerdown', down); removeEventListener('pointermove', move); el?.remove(); };
  },[]);
  return null;
}
