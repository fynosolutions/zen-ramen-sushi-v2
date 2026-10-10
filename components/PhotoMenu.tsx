'use client';
import { useEffect, useRef, useState } from 'react';
import photo from '@/content/photo-menu.json';
import catering from '@/content/catering.json';
import optionGroups from '@/content/photo-menu-options.json';
import Ico from '@/components/Ico';

// 带图菜单(2026-10-09):旧站 /zrm-menu/ 的互动菜单原样复刻——Catering / Dinner / Happy Hour / Lunch 四个菜单,每道菜带图。
// 店里贴的二维码是 /zrm-menu/?menu=dinner-menu(晚餐),旧页不带参数时默认显示 Catering。数据 content/photo-menu.json + catering.json,图 public/images/pm/ 与 catering/。
type Item = { name:string; prices:string[][]; description:string; tags:string[]; image:string|null; imageSize:number[]|null; dir:string; detail?:string; groups?:number[] };
// 每道菜的选项(旧站单品详情页里的:拉面选面条/加料、寿司卷加料、宴会份数与大小),点开才渲染
const GROUPS = optionGroups as unknown as {title:string;limit:string;options:string[][]}[];
type Section = { id:string; title:string; note:string|null; items:Item[] };
type Menu = { id:string; label:string; param:string; sections:Section[] };

const fromPhoto = (k:'dinner'|'happy-hour'|'lunch') => ((photo as unknown as Record<string,{id:string;title:string;note:string|null;items:Omit<Item,'dir'>[]}[]>)[k]).map(s=>({...s,items:s.items.map(i=>({...i,dir:'/images/pm/'}))})) as Section[];
const cateringSections = (catering.sections as unknown as {id:string;title:string;note:string|null;items:{name:string;price:string;label:string;description:string;tags:string[];image:string|null;imageSize:number[]|null;detail?:string;groups?:number[];perPerson?:string}[]}[]).map(s=>({id:s.id,title:s.title,note:s.note,items:s.items.map(i=>({name:i.name,prices:[[i.price,[i.perPerson?'('+i.perPerson+')':'',i.label.startsWith('/')?i.label:(i.label?'| '+i.label:'')].filter(Boolean).join(' ')]],description:i.description,tags:i.tags,image:i.image,imageSize:i.imageSize,dir:'/images/catering/',detail:i.detail,groups:i.groups}))})) as Section[];

const MENUS:Menu[] = [
  {id:'catering',label:'Catering',param:'catering',sections:cateringSections},
  {id:'dinner',label:'Dinner Menu',param:'dinner-menu',sections:fromPhoto('dinner')},
  {id:'happy-hour',label:'Happy Hour (4-8PM)',param:'happy-hour-4-8pm',sections:fromPhoto('happy-hour')},
  {id:'lunch',label:'Lunch Menu',param:'lunch-menu',sections:fromPhoto('lunch')},
];
const NOTE:Record<string,string> = {lunch:'Mon–Fri 11:30–4PM, excl. holidays',dinner:'Cash and card prices are shown separately. All prices in USD.','happy-hour':'Daily 4–8 PM. Cash and card prices are shown separately.',catering:'Catering for offices & events. Tap OPTIONS on an item for sizes and choices. Email to order:'};
const ALIAS:Record<string,string> = {catering:'catering','dinner-menu':'dinner',dinner:'dinner','happy-hour-4-8pm':'happy-hour','happy-hour':'happy-hour','lunch-menu':'lunch',lunch:'lunch','lunch-specials':'lunch'};

export default function PhotoMenu({cateringEmail}:{cateringEmail:string}){
  const [current,setCurrent]=useState<string|null>(null);
  const [open,setOpen]=useState<string|null>(null);
  const tabs=useRef<(HTMLButtonElement|null)[]>([]);
  useEffect(()=>{const q=new URLSearchParams(window.location.search).get('menu')||'';setCurrent(ALIAS[q]||'catering');},[]);
  const select=(id:string)=>{setCurrent(id);const m=MENUS.find(x=>x.id===id)!;window.history.replaceState({},'',`/zrm-menu/?menu=${m.param}`);window.scrollTo({top:0,behavior:'instant' as ScrollBehavior});};
  const jump=(menu:string,sid:string)=>document.getElementById(`pm-${menu}--${sid}`)?.scrollIntoView({block:'start',behavior:'smooth'});
  return <div className="container pm">
    <div className="pm-tabs" role="tablist" aria-label="Choose menu">{MENUS.map((m,i)=><button key={m.id} ref={el=>{tabs.current[i]=el;}} id={'pm-tab-'+m.id} role="tab" aria-selected={current===m.id} aria-controls={'pm-panel-'+m.id} tabIndex={current===m.id||(current===null&&i===0)?0:-1} onClick={()=>select(m.id)} onKeyDown={e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%MENUS.length;else if(e.key==='ArrowLeft')n=(i+MENUS.length-1)%MENUS.length;else return;e.preventDefault();select(MENUS[n].id);tabs.current[n]?.focus();}}>{m.label}</button>)}</div>
    {MENUS.map(m=><div key={m.id} id={'pm-panel-'+m.id} role="tabpanel" aria-labelledby={'pm-tab-'+m.id} hidden={current!==m.id}>
      <p className="pm-note">{NOTE[m.id]}{m.id==='catering'?<> <a href={'mailto:'+cateringEmail}>{cateringEmail}</a></>:null}</p>
      <div className="pm-chips" role="group" aria-label={m.label+' categories'}>{m.sections.map(s=><button key={s.id} type="button" onClick={()=>jump(m.id,s.id)}>{s.title}</button>)}</div>
      {m.sections.map(s=><section className="pm-section" id={`pm-${m.id}--${s.id}`} key={s.id}>
        <h2>{s.title}</h2>{s.note?<p className="lunch-note">{s.note}</p>:null}
        <ul className="pm-items">{s.items.map((i,n)=><li key={n}>
          {i.image&&i.imageSize?<img src={i.dir+i.image} alt={i.name} width={i.imageSize[0]} height={i.imageSize[1]} loading="lazy" decoding="async"/>:<div className="pm-noimg" aria-hidden="true"/>}
          <div className="pm-body"><strong>{i.name}</strong>
            <p className="pm-prices">{i.prices.map((p,k)=><span key={k}><b>{p[0]}</b>{p[1]?<small>{p[1]}</small>:null}</span>)}</p>
            {i.description?<p className="pm-desc">{i.description}</p>:null}
            {i.tags.length?<p className="cmenu-tags">{i.tags.map(t=><span key={t}>{t}</span>)}</p>:null}
            {(i.groups||i.detail)?(()=>{const k=`${m.id}/${s.id}/${n}`;const on=open===k;return <>
              <button type="button" className="pm-more" aria-expanded={on} onClick={()=>setOpen(on?null:k)}>{i.groups?'OPTIONS':'DETAILS'} <Ico n="down"/></button>
              {on?<div className="pm-opts">{i.detail?<p className="pm-desc">{i.detail}</p>:null}{(i.groups||[]).map(g=><div key={g} className="pm-group"><p><b>{GROUPS[g].title}</b>{GROUPS[g].limit?<small>{GROUPS[g].limit}</small>:null}</p><ul>{GROUPS[g].options.map((o,x)=><li key={x}><span>{o[0]}</span>{o[1]?<small>{o[1]}</small>:null}</li>)}</ul></div>)}</div>:null}
            </>;})():null}
          </div></li>)}</ul>
      </section>)}
    </div>)}
  </div>;
}
