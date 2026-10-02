'use client';
import { useEffect } from 'react';

// 菜品图轻微动效的「看得见才动」开关:只给在屏幕里的菜品加 .is-in,离开就摘掉(省电、不白耗 GPU)。
// 动效本身全在 CSS(globals.css 末尾「菜品图动效」),这里只做可见性。
export default function DishMotion(){
  useEffect(()=>{
    const els = Array.from(document.querySelectorAll('.featured-dish'));
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-in', e.isIntersecting)), {threshold:.25});
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  },[]);
  return null;
}
