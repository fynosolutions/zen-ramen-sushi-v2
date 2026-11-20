'use client';
import { useEffect } from 'react';

// 小猫 logo 鼠标(2026-11-18 毛要):平时是浏览器原生鼠标图(globals.css 末尾「小猫鼠标」,不卡不延迟);
// 点一下 → 在鼠标图下面叠一只爪子,从猫头后面伸出去点一下左上角的小红点(点击位置),再缩回来(约 0.7 秒)。
// 手机/触屏(2026-11-20 毛要):没有鼠标图,手指轻点(不是滑动)的位置右下方冒出整只小猫往上伸爪点一下(约 1.4 秒);
// 右边缘中间常驻一只半露头的小猫偶尔眨眼(避开首屏和底部的点单按钮);第一次来的访客小猫先探出来说「Tap anywhere」,只说一次。
// 输入框、视频、系统「减少动态效果」时都不出现。
const HOT = 3;
const SVG = `<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
<circle class="cat-tap-ring" cx="3" cy="3" r="2" fill="none" stroke="#e01d25" stroke-width=".8"/>
<g class="cat-tap-arm"><path d="M14.5 15.5Q8.5 12 4.9 5" fill="none" stroke="#171817" stroke-width="3.8" stroke-linecap="round"/>
<path d="M14.5 15.5Q8.5 12 4.9 5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
<circle cx="4.6" cy="4.5" r="2.05" fill="#fff" stroke="#171817" stroke-width=".85"/>
<circle cx="4.3" cy="4.2" r=".75" fill="#f4a3ae"/></g></svg>`;

// 小猫 logo 本体(同 public/cursor/zen-cat-hover-v1.svg,去掉左上小红点;eyes 组可眨眼)
const CAT = `<g stroke="#171817" stroke-width="1.15" stroke-linecap="round"><path d="M25.2 17L30.4 8.2"/><path d="M26.9 17.4L31.3 10"/></g><path d="M13 17.8C12.3 15.2 12.3 12.6 13.1 10.7L13.5 6.4 16.6 8.8C18.2 8.4 19.8 8.4 21.4 8.8L24.5 6.4 24.9 10.7C25.7 12.6 25.7 15.2 25 17.8Z" fill="#fff" stroke="#171817" stroke-width="1" stroke-linejoin="round"/><path d="M14.2 7.9L14.3 9.9 15.8 9Z M23.8 7.9L23.7 9.9 22.2 9Z" fill="#171817"/><path d="M18.4 13.9h1.2l-.6.7z" fill="#171817" stroke="#171817" stroke-width=".3" stroke-linejoin="round"/><path d="M17.7 15q.65.7 1.3 0q.65.7 1.3 0" fill="none" stroke="#171817" stroke-width=".6" stroke-linecap="round"/><path d="M12.2 13.8l1.6.3M12.3 15.2l1.6-.1M25.8 13.8l-1.6.3M25.7 15.2l-1.6-.1" stroke="#171817" stroke-width=".45" stroke-linecap="round"/><g class="cat-eyes"><circle cx="15.9" cy="11.9" r=".95" fill="#171817"/><circle cx="21.5" cy="11.9" r=".95" fill="#171817"/><circle cx="15.6" cy="11.6" r=".3" fill="#fff"/><circle cx="21.2" cy="11.6" r=".3" fill="#fff"/></g><path d="M7 18H31C31 24.5 26 28.4 19 28.4S7 24.5 7 18Z" fill="#e01d25"/><path d="M16 28h6v2.2h-6z" fill="#e01d25"/><g fill="#fff"><path d="M19 20.2c1 .9 1.2 2.3 0 3.6-1.2-1.3-1-2.7 0-3.6z"/><path d="M15.7 21.8c1.4 0 2.5.8 2.8 2.2-1.4.1-2.6-.7-2.8-2.2zM22.3 21.8c-1.4 0-2.5.8-2.8 2.2 1.4.1 2.6-.7 2.8-2.2z"/><path d="M15.9 24.4h6.2c-.5.7-1.7 1-3.1 1s-2.6-.3-3.1-1z"/></g><ellipse cx="23.6" cy="18" rx="2.1" ry="1.55" fill="#fff" stroke="#171817" stroke-width=".9"/><path d="M23 18.6v.8M24.2 18.6v.8" stroke="#171817" stroke-width=".5" stroke-linecap="round"/>`;

// 触屏:手指点的位置 = (4,8);小猫在右下方,爪子往左上伸(2026-11-20 毛:手向上好看)
const TOUCH_HOT = { x: 4, y: 8 };
const TOUCH_SVG = `<svg viewBox="0 0 48 48" width="56" height="56" aria-hidden="true">
<circle class="cat-tap-ring" cx="4" cy="8" r="2.4" fill="none" stroke="#e01d25" stroke-width=".9"/>
<g class="cat-touch-arm"><path d="M26 22Q12 22 6.3 10" fill="none" stroke="#171817" stroke-width="3.8" stroke-linecap="round"/>
<path d="M26 22Q12 22 6.3 10" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
<circle cx="5.6" cy="9" r="2.2" fill="#fff" stroke="#171817" stroke-width=".85"/>
<circle cx="5.3" cy="8.7" r=".8" fill="#f4a3ae"/></g>
<g class="cat-touch-body" transform="translate(16 10)">${CAT}</g></svg>`;

const PEEK_SVG = `<svg viewBox="6 5 26 26" width="52" height="52" aria-hidden="true">${CAT}</svg>`;
const HINT_KEY = 'zen-cat-hint-v1';

function mountTouch(){
  const peek = document.createElement('div');
  peek.className = 'cat-peek';
  peek.setAttribute('aria-hidden','true');
  peek.innerHTML = PEEK_SVG;
  document.body.appendChild(peek);

  let seen = false;
  try { seen = !!localStorage.getItem(HINT_KEY); } catch {}
  const timers: number[] = [];
  const start = () => {
    if(seen){ peek.classList.add('is-in'); return; }
    peek.classList.add('is-in','is-out');
    const tip = document.createElement('span');
    tip.className = 'cat-peek-tip';
    tip.textContent = 'Tap anywhere 🐾';
    peek.appendChild(tip);
    try { localStorage.setItem(HINT_KEY,'1'); } catch {}
    timers.push(window.setTimeout(()=>{ peek.classList.remove('is-out'); tip.classList.add('is-gone'); }, 3600));
    timers.push(window.setTimeout(()=>tip.remove(), 4200));
  };
  // 首页开场 logo 动画放完再出来
  const wait = window.setInterval(()=>{ if(!document.querySelector('.intro')){ clearInterval(wait); timers.push(window.setTimeout(start, 500)); } }, 200);
  const blink = window.setInterval(()=>{ peek.classList.add('is-blink'); timers.push(window.setTimeout(()=>peek.classList.remove('is-blink'), 180)); }, 6500);

  let fx: HTMLDivElement | null = null;
  let downAt: {x:number;y:number;t:number;id:number} | null = null;
  const down = (e:PointerEvent) => {
    if(e.pointerType === 'mouse') return;
    downAt = { x:e.clientX, y:e.clientY, t:e.timeStamp, id:e.pointerId };
  };
  const cancel = () => { downAt = null; };
  const up = (e:PointerEvent) => {
    const d = downAt; downAt = null;
    if(!d || d.id !== e.pointerId || e.timeStamp - d.t > 500 || Math.hypot(e.clientX-d.x, e.clientY-d.y) > 10) return;
    const t = e.target as Element | null;
    if(t?.closest?.('input,textarea,select,[contenteditable],iframe,video')) return;
    fx?.remove();
    fx = document.createElement('div');
    fx.className = 'cat-tap cat-tap-touch';
    fx.setAttribute('aria-hidden','true');
    fx.innerHTML = TOUCH_SVG;
    const s = 56/48;
    fx.style.transform = `translate3d(${e.clientX-TOUCH_HOT.x*s}px,${e.clientY-TOUCH_HOT.y*s}px,0)`;
    document.body.appendChild(fx);
    const mine = fx;
    timers.push(window.setTimeout(()=>{ mine.remove(); if(fx === mine) fx = null; }, 1450));
  };
  addEventListener('pointerdown', down, {passive:true});
  addEventListener('pointerup', up, {passive:true});
  addEventListener('pointercancel', cancel, {passive:true});
  return () => {
    removeEventListener('pointerdown', down); removeEventListener('pointerup', up); removeEventListener('pointercancel', cancel);
    clearInterval(wait); clearInterval(blink); timers.forEach(clearTimeout);
    peek.remove(); fx?.remove();
  };
}

function mountMouse(fine: MediaQueryList, still: MediaQueryList){
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
}

export default function CatCursor(){
  useEffect(()=>{
    const fine = matchMedia('(hover:hover) and (pointer:fine)');
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const offMouse = mountMouse(fine, still);
    const offTouch = !fine.matches && !still.matches && matchMedia('(pointer:coarse)').matches ? mountTouch() : null;
    return () => { offMouse(); offTouch?.(); };
  },[]);
  return null;
}
