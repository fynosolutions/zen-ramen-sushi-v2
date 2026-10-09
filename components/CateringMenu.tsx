import catering from '@/content/catering.json';

// 宴会带图菜单的分区列表(2026-10-09):/zrm-menu/ 页和 /menu/ 的第四个标签「Catering」共用同一份,数据只在 content/catering.json。
type Item = { id:string; name:string; price:string; label:string; description:string; tags:string[]; image:string|null; imageSize:number[]|null };
export type CateringSection = { id:string; title:string; note:string|null; items:Item[] };
export const cateringSections = catering.sections as unknown as CateringSection[];
export const cateringAnchor = (id:string) => 'catering--'+id;

export function CateringSections(){
  return <>{cateringSections.map(s => <div className="cmenu-section" key={s.id} id={cateringAnchor(s.id)}>
    <h2>{s.title}</h2>
    {s.note ? <p className="lunch-note">{s.note}</p> : null}
    <ul className="cmenu-items">{s.items.map(i => <li key={i.id}>
      {i.image && i.imageSize ? <img src={'/images/catering/'+i.image} alt={i.name} width={i.imageSize[0]} height={i.imageSize[1]} loading="lazy"/> : <div className="cmenu-noimg" aria-hidden="true"/>}
      <div className="cmenu-body">
        <strong>{i.name}</strong>
        <p className="cmenu-price"><b>{i.price}</b>{i.label ? <span>{i.label.startsWith('/') ? i.label : '| '+i.label}</span> : null}</p>
        {i.description ? <p className="cmenu-desc">{i.description}</p> : null}
        {i.tags.length ? <p className="cmenu-tags">{i.tags.map(t => <span key={t}>{t}</span>)}</p> : null}
      </div>
    </li>)}</ul>
  </div>)}</>;
}
