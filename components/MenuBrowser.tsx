'use client';
import { useEffect, useRef, useState } from 'react';
import rawMenus from '@/content/menus.json';
type Item = {id:string;name:string;description:string;cashCents?:number|null;cardCents?:number|null;listedCents?:number;markers?:string[]};
type Section = {id:string;title:string;notes:string[];items:Item[]};
type Menu = {id:string;label:string;pdf:string;availability:string;notice:string;photoNotice:string;sections:Section[]};
const menus = rawMenus as Menu[];
const money = (c:number) => '$'+(c/100).toFixed(2);
export default function MenuBrowser(){
  const [current,setCurrent]=useState('dinner');
  const tabs=useRef<(HTMLButtonElement|null)[]>([]);
  useEffect(()=>{const read=()=>{const hash=window.location.hash.slice(1);const found=menus.find(m=>hash===m.id||hash.startsWith(m.id+'--'));if(found)setCurrent(found.id);};read();window.addEventListener('hashchange',read);window.addEventListener('popstate',read);return()=>{window.removeEventListener('hashchange',read);window.removeEventListener('popstate',read);};},[]);
  const select=(id:string)=>{setCurrent(id);window.history.pushState({},'',`#${id}`);};
  return <div className="container menu-browser"><div className="menu-tabs" role="tablist" aria-label="Choose your menu">{menus.map((m,i)=><button key={m.id} ref={el=>{tabs.current[i]=el;}} id={'tab-'+m.id} role="tab" aria-selected={current===m.id} aria-controls={'panel-'+m.id} tabIndex={current===m.id?0:-1} onClick={()=>select(m.id)} onKeyDown={e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%menus.length;else if(e.key==='ArrowLeft')next=(i+menus.length-1)%menus.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=menus.length-1;else return;e.preventDefault();select(menus[next].id);tabs.current[next]?.focus();}}>{m.label}<span>0{i+1}</span></button>)}</div>
  {menus.map(m=><div key={m.id} id={'panel-'+m.id} role="tabpanel" aria-labelledby={'tab-'+m.id} hidden={current!==m.id} tabIndex={0}>
    <div className="menu-meta"><p>{m.availability}</p><a href={m.pdf} target="_blank" rel="noopener noreferrer">VIEW ORIGINAL PDF ↗</a></div>
    <div className="menu-layout"><aside className="category-navigation"><p className="eyebrow red">ON THE MENU</p><nav aria-label={m.label+' categories'}>{m.sections.map(s=><a key={s.id} href={`#${m.id}--${s.id}`}>{s.title}</a>)}</nav><div className="price-key"><strong>A NOTE ON PRICES</strong><p>Cash and credit/debit card prices are shown separately. All prices in USD.</p></div></aside>
    <div className="menu-sections">{m.sections.map((s,i)=><section className="food-section" id={`${m.id}--${s.id}`} key={s.id}><div className="food-heading"><span className="eyebrow red">{String(i+1).padStart(2,'0')}</span><h2>{s.title}</h2></div>{s.notes.length>0&&<div className="food-notes">{s.notes.map((n,index)=><p key={index}>{n}</p>)}</div>}<div className="food-items">{s.items.map(item=><article className="food-item" key={item.id}><div className="food-copy"><h3>{item.name}</h3>{item.description&&<p>{item.description}</p>}{item.markers?.map(tag=><span className="food-marker" key={tag}>{tag}</span>)}</div><div className="food-prices">{item.listedCents!=null?<span><small>LISTED PRICE</small>{money(item.listedCents)}</span>:<>{item.cashCents!=null&&<span><small>CASH</small>{money(item.cashCents)}</span>}{item.cardCents!=null&&<span><small>CARD</small>{money(item.cardCents)}</span>}</>}</div></article>)}</div></section>)}<div className="allergy-note"><h3>Before you order</h3><p>{m.notice}</p><p>{m.photoNotice}</p><a href={m.pdf} target="_blank" rel="noopener noreferrer">View the original {m.label.toLowerCase()} menu ↗</a></div></div></div>
  </div>)}
  </div>;
}
