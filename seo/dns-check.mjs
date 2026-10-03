// 域名记录快照与比对(切换用):直接问 GoDaddy 的权威服务器 ns19/ns20,不经任何缓存。
// 用法:
//   node seo/dns-check.mjs snapshot [文件]            存一份快照(默认 seo/baseline-T-1/dns-snapshot.json)
//   node seo/dns-check.mjs compare  [文件]            与快照逐条比对:必须一字不差(买主机后、切换前用)
//   node seo/dns-check.mjs compare  [文件] --flipped  切换后用:只允许 根域 A 与 www 的记录变化,其余(NS/MX/TXT/邮箱相关)必须不变
//   node seo/dns-check.mjs ttl [--max 600]            看「根域 A / www」的生效等待时间,超过 --max 就失败(切换前要降到 600 秒)
// 数据全是公开 DNS 信息,不含任何密码。
import fs from 'fs'; import {spawnSync} from 'child_process';
const [cmd = 'compare', ...rest] = process.argv.slice(2); const flag = f => rest.includes(f);
const file = rest.find(a => a.endsWith('.json')) || 'seo/baseline-T-1/dns-snapshot.json';
const D = 'zenramensushiny.com'; const NS = 'ns19.domaincontrol.com';
const NAMES = [['@','A'],['@','AAAA'],['@','NS'],['@','MX'],['@','TXT'],['@','CAA'],['@','SOA'],['www','CNAME'],['www','A'],
  ...['autodiscover','email','lyncdiscover','msoid','sip','pay','_domainconnect'].map(n => [n,'CNAME']),
  ['_sip._tls','SRV'],['_sipfederationtls._tcp','SRV'],['_activator_template','TXT']];
const q = (name, type) => { const fq = name === '@' ? D : `${name}.${D}`; const r = spawnSync('dig', ['+noall', '+answer', '+norecurse', `@${NS}`, fq, type], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error('dig 失败: ' + r.stderr); return r.stdout.trim().split('\n').filter(Boolean).map(l => { const p = l.split(/\s+/); return { ttl: +p[1], type: p[3], value: p.slice(4).join(' ') }; }).filter(x => x.type === type); };
const take = () => Object.fromEntries(NAMES.map(([n, t]) => [`${n} ${t}`, q(n, t)]));
const vals = rec => Object.fromEntries(Object.entries(rec).map(([k, v]) => [k, v.map(x => x.value).sort()]));
if (cmd === 'snapshot') { const snap = { when: new Date().toISOString(), ns: NS, records: take() }; fs.mkdirSync(file.replace(/\/[^/]+$/, ''), { recursive: true }); fs.writeFileSync(file, JSON.stringify(snap, null, 1));
  const n = Object.values(snap.records).reduce((s, v) => s + v.length, 0); console.log(`已存快照 ${file}:${n} 条记录(${snap.when})`); process.exit(0); }
if (cmd === 'ttl') { const max = +(rest[rest.indexOf('--max') + 1] || 600); const rows = [['@','A'],['www','CNAME'],['www','A']].flatMap(([n, t]) => q(n, t).map(x => ({ n, t, ...x })));
  rows.forEach(r => console.log(`  ${r.n} ${r.t} ${r.value} 等待时间 ${r.ttl} 秒`)); const bad = rows.filter(r => r.ttl > max); console.log(bad.length ? `DNS-TTL FAIL(${bad.length} 条超过 ${max} 秒)` : `DNS-TTL PASS(全部 ≤ ${max} 秒)`); process.exit(bad.length ? 1 : 0); }
if (cmd === 'compare') { if (!fs.existsSync(file)) { console.error('没有快照: ' + file); process.exit(2); } const snap = JSON.parse(fs.readFileSync(file, 'utf8')); const a = vals(snap.records), b = vals(take()); const flipOK = k => flag('--flipped') && (k === '@ A' || k === 'www CNAME' || k === 'www A');
  const diffs = []; for (const k of Object.keys(a)) if (JSON.stringify(a[k]) !== JSON.stringify(b[k]) && !flipOK(k) && k !== '@ SOA') diffs.push(`${k}\n      快照: ${a[k].join(' | ') || '(无)'}\n      现在: ${b[k].join(' | ') || '(无)'}`);
  if (JSON.stringify(a['@ SOA']) !== JSON.stringify(b['@ SOA'])) console.log(`  (提示)SOA 序号变了:${a['@ SOA'][0]?.split(' ')[2]} → ${b['@ SOA'][0]?.split(' ')[2]},说明这段时间有人改过记录(降等待时间、加验证记录、或主机向导改了)——下面逐条比对会告诉你改的是不是不该动的`);
  if (flag('--flipped')) for (const k of ['@ A', 'www CNAME']) console.log(`  (允许变化) ${k}: ${b[k].join(' | ') || '(无)'}`);
  console.log(diffs.length ? `DNS-COMPARE FAIL ${diffs.length} 处:\n  ` + diffs.join('\n  ') : `DNS-COMPARE PASS(与 ${snap.when.slice(0, 16)} 的快照一致${flag('--flipped') ? ',除了允许变化的 A/www' : ''})`); process.exit(diffs.length ? 1 : 0); }
console.error('用法: snapshot | compare [--flipped] | ttl [--max 600]'); process.exit(2);
