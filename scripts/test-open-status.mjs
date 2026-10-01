// 营业状态逻辑单测(Node 22 直接跑 TS):node scripts/test-open-status.mjs
import {getOpenStatus} from '../lib/open-status.ts';
import {site} from '../content/site.ts';
const T=(iso)=>getOpenStatus(site.hours,new Date(iso),site.timezone);
const cases=[ // [UTC 时刻, open, 期望 detail] —— 纽约夏令时 EDT=UTC-4(10/05 周一),冬令时 EST=UTC-5
 ['2026-10-05T16:00:00Z',true,'UNTIL 11 PM'],            // 周一 12:00
 ['2026-10-05T14:59:00Z',false,'OPENS 11:30 AM TODAY'],  // 周一 10:59
 ['2026-10-05T15:30:00Z',true,'UNTIL 11 PM'],            // 周一 11:30 整点开
 ['2026-10-06T03:30:00Z',false,'OPENS TOMORROW 11:30 AM'],// 周一 23:30 已打烊
 ['2026-10-09T03:30:00Z',true,'UNTIL 12 AM'],            // 周四 23:30 营业到午夜
 ['2026-10-09T04:30:00Z',false,'OPENS 11:30 AM TODAY'],   // 周五 00:30:周四已于 12AM 关,周五 11:30 开(同一天,不是明天)
 ['2026-10-10T15:00:00Z',false,'OPENS 12 PM TODAY'],     // 周六 11:00 周六中午才开
 ['2026-10-11T02:59:00Z',true,'UNTIL 12 AM'],            // 周六 22:59
 ['2026-10-12T02:30:00Z',true,'UNTIL 11 PM'],            // 周日 22:30
 ['2026-10-12T03:00:00Z',false,'OPENS TOMORROW 11:30 AM'],// 周日 23:00 关
 ['2026-12-07T17:00:00Z',true,'UNTIL 11 PM'],            // 冬令时 周一 12:00 EST
];
let bad=0;
for(const [iso,open,detail] of cases){const r=T(iso); if(r.open!==open||r.detail!==detail){bad++;console.log('✗',iso,JSON.stringify(r),'期望',open,detail);}}
// 负向对照:故意把周一改成全天关,单测必须报错(证明测试能红)
const broken=site.hours.map(h=>h.schemaDays.includes('Monday')?{...h,schemaDays:h.schemaDays.filter(d=>d!=='Monday')}:h);
const neg=getOpenStatus(broken,new Date('2026-10-05T16:00:00Z'),site.timezone);
if(neg.open) {bad++;console.log('✗ 负向对照没变红');}
console.log(bad?`OPEN-STATUS FAIL x${bad}`:`OPEN-STATUS PASS (${cases.length} 例 + 负向对照)`); process.exit(bad?1:0);
