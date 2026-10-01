'use client';
import { useEffect, useState } from 'react';
import { site } from '@/content/site';
import { getOpenStatus, type OpenStatus as Status } from '@/lib/open-status';

// 营业状态:服务端只留一行占位(避免水合不一致),挂载后按纽约时间算,每分钟刷新
export default function OpenStatus(){
  const [s, setS] = useState<Status|null>(null);
  useEffect(()=>{
    const tick = () => setS(getOpenStatus(site.hours, new Date(), site.timezone));
    tick(); const id = window.setInterval(tick, 60000);
    return () => window.clearInterval(id);
  },[]);
  return <p className="open-status" data-state={s ? (s.open ? 'open' : 'closed') : 'pending'}>
    {s && <><span className="open-dot" aria-hidden="true"/><span><strong>{s.label}</strong>{s.detail && ` · ${s.detail}`}</span></>}
  </p>;
}
