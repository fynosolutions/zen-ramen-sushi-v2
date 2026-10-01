// 营业状态:按店所在时区(纽约)判断现在开没开、几点关/几点开。纯函数,便于单测。
export type HoursRow = {opens:string; closes:string; schemaDays:string[]};
export type OpenStatus = {open:boolean; label:'OPEN NOW'|'CLOSED'; detail:string};
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const mins = (t:string) => { const [h,m] = t.split(':').map(Number); return h*60+m; };
const fmt = (total:number) => { const m = total % 1440, h24 = Math.floor(m/60), mm = m % 60; const h12 = h24 % 12 || 12; return `${h12}${mm ? ':'+String(mm).padStart(2,'0') : ''} ${h24 >= 12 ? 'PM' : 'AM'}`; };

export function getOpenStatus(hours:HoursRow[], now:Date, timeZone='America/New_York'): OpenStatus {
  const parts = new Intl.DateTimeFormat('en-US',{timeZone,weekday:'long',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);
  const get = (t:string) => parts.find(p=>p.type===t)!.value;
  const day = DAYS.indexOf(get('weekday')), cur = (+get('hour') % 24)*60 + +get('minute');
  // 某天的营业区间;closes <= opens 视为过了午夜(00:00 记作 24:00)
  const slot = (i:number) => { const row = hours.find(h=>h.schemaDays.includes(DAYS[((i%7)+7)%7])); if(!row) return null; const o = mins(row.opens); let c = mins(row.closes); if(c <= o) c += 1440; return {o,c}; };
  const today = slot(day), yesterday = slot(day-1);
  if (yesterday && cur + 1440 < yesterday.c) return {open:true,label:'OPEN NOW',detail:`UNTIL ${fmt(yesterday.c)}`};   // 昨天的营业时段还没结束(跨午夜)
  if (today && cur >= today.o && cur < today.c) return {open:true,label:'OPEN NOW',detail:`UNTIL ${fmt(today.c)}`};
  if (today && cur < today.o) return {open:false,label:'CLOSED',detail:`OPENS ${fmt(today.o)} TODAY`};
  for (let k=1;k<=7;k++){ const s = slot(day+k); if(s) return {open:false,label:'CLOSED',detail:`OPENS ${k===1?'TOMORROW':DAYS[(day+k)%7].toUpperCase()} ${fmt(s.o)}`}; }
  return {open:false,label:'CLOSED',detail:''};
}
