'use client';
import Ico from '@/components/Ico';
import { useEffect, useRef, useState } from 'react';
import rawMenus from '@/content/menus.json';
import { featured } from '@/content/featured';
import { CateringSections, cateringSections, cateringAnchor } from '@/components/CateringMenu';
import { site } from '@/content/site';
type Item = {id:string;name:string;description:string;cashCents?:number|null;cardCents?:number|null;listedCents?:number;markers?:string[]};
type Section = {id:string;title:string;notes:string[];items:Item[]};
type Menu = {id:string;label:string;pdf:string;availability:string;notice:string;photoNotice:string;sections:Section[]};
const menus = rawMenus as Menu[];
// 第四个标签「Catering」(2026-10-09 毛定,店家要宴会带图菜单):数据 content/catering.json,与 /zrm-menu/ 共用组件
const CAT='catering';
const tabList = [...menus.map(m=>({id:m.id,label:m.label})), {id:CAT,label:'Catering'}];
const money = (c:number) => '$'+(c/100).toFixed(2);
export default function MenuBrowser(){
  const [current,setCurrent]=useState('dinner');
  const [activeSection,setActiveSection]=useState('');
  const tabs=useRef<(HTMLButtonElement|null)[]>([]);
  useEffect(()=>{const read=(initial=false)=>{const hash=window.location.hash.slice(1);const found=tabList.find(m=>hash===m.id||hash.startsWith(m.id+'--'));if(!found)return;const hidden=!!document.getElementById('panel-'+found.id)?.hidden;setCurrent(found.id);if(!initial&&hidden&&hash.includes('--'))requestAnimationFrame(()=>requestAnimationFrame(()=>document.getElementById(hash)?.scrollIntoView({block:'start',behavior:'instant' as ScrollBehavior})));};read(true);
    // 带分区锚点直接打开(如 /menu/#lunch--bento-box):浏览器在页签还没切换/图片还没占位时就算过位置,会落偏。切好页签后补一次滚动(用户没动手才补第二次)。
    const first=window.location.hash.slice(1);
    if(first.includes('--')){let touched=false;const mark=()=>{touched=true;};const opts={once:true,passive:true} as const;window.addEventListener('wheel',mark,opts);window.addEventListener('touchstart',mark,opts);window.addEventListener('keydown',mark,{once:true});
      const go=()=>document.getElementById(first)?.scrollIntoView({block:'start',behavior:'instant' as ScrollBehavior});
      requestAnimationFrame(()=>requestAnimationFrame(go));const t=window.setTimeout(()=>{if(!touched)go();},700);}
const onHash=()=>read();window.addEventListener('hashchange',onHash);window.addEventListener('popstate',onHash);return()=>{window.removeEventListener('hashchange',onHash);window.removeEventListener('popstate',onHash);};},[]);
  useEffect(()=>{ // scrollspy: highlight the category currently in view
    const sections=Array.from(document.querySelectorAll(`#panel-${current} .food-section`));
    if(!sections.length)return;
    const visible=new Set<string>();
    const pick=()=>{const first=sections.find(s=>visible.has(s.id));setActiveSection(first?first.id:'');};
    const io=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)visible.add(e.target.id);else visible.delete(e.target.id);}pick();},{rootMargin:'-30% 0px -55% 0px'});
    sections.forEach(s=>io.observe(s));
    return()=>io.disconnect();
  },[current]);
  const select=(id:string)=>{setCurrent(id);window.history.pushState({},'',`#${id}`);};
  return <div className="container menu-browser"><div className="menu-tabs" role="tablist" aria-label="Choose your menu">{tabList.map((m,i)=><button key={m.id} ref={el=>{tabs.current[i]=el;}} id={'tab-'+m.id} role="tab" aria-selected={current===m.id} aria-controls={'panel-'+m.id} tabIndex={current===m.id?0:-1} onClick={()=>select(m.id)} onKeyDown={e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%tabList.length;else if(e.key==='ArrowLeft')next=(i+tabList.length-1)%tabList.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabList.length-1;else return;e.preventDefault();select(tabList[next].id);tabs.current[next]?.focus();}}>{m.label}</button>)}</div>
  {menus.map(m=><div key={m.id} id={'panel-'+m.id} role="tabpanel" aria-labelledby={'tab-'+m.id} hidden={current!==m.id} tabIndex={0}>
    {m.id==='happy-hour'&&<p className="hh-banner"><strong>EVERYTHING $6.49</strong> CASH · $6.75 CARD — <span style={{whiteSpace:'nowrap'}}>DAILY 4–8 PM</span> <a href="/happy-hour/">SEE THE DEAL <Ico n="ne"/></a></p>}<div className="menu-meta"><p>{m.availability}</p><a href={m.pdf} target="_blank" rel="noopener noreferrer">VIEW ORIGINAL PDF <Ico n="ne"/></a></div>
    <div className="menu-layout"><aside className="category-navigation"><p className="eyebrow red">ON THE MENU</p><nav aria-label={m.label+' categories'}>{m.sections.map(s=>{const id=`${m.id}--${s.id}`;const on=current===m.id&&activeSection===id;return <a key={s.id} href={`#${id}`} className={on?'active':undefined} aria-current={on?'true':undefined}>{s.title}</a>;})}</nav><div className="price-key"><strong>A NOTE ON PRICES</strong><p>Cash and credit/debit card prices are shown separately. All prices in USD.</p></div></aside>
    <div className="menu-sections">{m.sections.map((s,i)=><section className="food-section" id={`${m.id}--${s.id}`} key={s.id}><div className="food-heading"><span className="eyebrow red">{String(i+1).padStart(2,'0')}</span><h2>{s.title}</h2><span className="price-cols" aria-hidden="true">{s.items.some(it=>it.listedCents!=null)?'PRICE':'CASH · CARD'}</span></div>{featured[`${m.id}--${s.id}`]&&<div className={featured[`${m.id}--${s.id}`].length===1?'featured-dishes solo':'featured-dishes'}>{featured[`${m.id}--${s.id}`].map((f,_,all)=>{const it=s.items.find(x=>x.id===f.itemId);if(!it)return null;return <figure className="featured-dish" key={f.itemId}><div className="featured-photo"><img src={f.img} alt={f.alt??f.label??it.name} width="1024" height="1024" loading="lazy"/>{f.badge&&<span className="featured-badge">{f.badge}</span>}</div><figcaption><strong>{f.label??it.name}</strong>{all.length===1&&it.description&&<p className="featured-desc">{it.description}</p>}{all.length===1&&it.markers?.map(tag=><span className="food-marker" key={tag}>{tag}</span>)}{all.length===1&&it.cardCents!=null&&it.cashCents!=null?<span className="featured-prices"><span>{money(it.cashCents)}<small>CASH</small></span><span>{money(it.cardCents)}<small>CARD</small></span></span>:<span>{it.cashCents!=null?'$'+(it.cashCents/100).toFixed(2):''}</span>}</figcaption></figure>;})}</div>}<div className="food-items">{s.items.filter((item,idx)=>!(idx===0&&featured[`${m.id}--${s.id}`]?.length===1&&featured[`${m.id}--${s.id}`][0].itemId===item.id)).map(item=><article className="food-item" key={item.id}><div className="food-copy"><h3>{item.name}</h3>{item.description&&<p>{item.description}</p>}{item.markers?.map(tag=><span className="food-marker" key={tag}>{tag}</span>)}</div><div className="food-prices">{item.listedCents!=null?<span><small>LISTED PRICE</small>{money(item.listedCents)}</span>:<>{item.cashCents!=null&&<span><small>CASH</small>{money(item.cashCents)}</span>}{item.cardCents!=null&&<span><small>CARD</small>{money(item.cardCents)}</span>}</>}</div></article>)}</div>{s.notes.length>0&&<div className="food-notes">{s.notes.map((n,index)=><p key={index}>{n}</p>)}</div>}</section>)}<div className="allergy-note"><h3>Before you order</h3><p>{m.notice}</p><p>{m.photoNotice}</p><a href={m.pdf} target="_blank" rel="noopener noreferrer">View the original {m.label.toLowerCase()} menu <Ico n="ne"/></a></div></div></div>
  </div>)}
  <div id={'panel-'+CAT} role="tabpanel" aria-labelledby={'tab-'+CAT} hidden={current!==CAT} tabIndex={0}>
    <div className="menu-meta"><p>Catering for offices &amp; events · priced per tray, platter or person</p><a href="/zrm-menu/">OPEN FULL PAGE <Ico n="ne"/></a></div>
    <div className="menu-layout"><aside className="category-navigation"><p className="eyebrow red">ON THE MENU</p><nav aria-label="Catering categories">{cateringSections.map(s=><a key={s.id} href={'#'+cateringAnchor(s.id)}>{s.title}</a>)}</nav><div className="price-key"><strong>HOW TO ORDER</strong><p>Prices are the starting price per item. Order by email.</p></div></aside>
    <div className="menu-sections cmenu"><CateringSections/><p className="lunch-note">Email <a href={'mailto:'+site.cateringEmail}>{site.cateringEmail}</a> for sizes, quantities and availability.</p></div></div>
  </div>
  </div>;
}
