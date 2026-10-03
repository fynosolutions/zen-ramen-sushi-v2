// 一键:为「老板自己的 GoDaddy 主机」构建 → 生成并放入跳转规则文件 → 自检 → (可选)上传。
// 为什么要这个脚本:放 GoDaddy 不再是「push main 自动上线」,而是手动构建+上传;统计与「允许收录」两个开关是【构建时】写进页面的,
// 漏了不报错(站会没有统计、还带 noindex);跳转规则文件(.htaccess)是隐藏文件、也不在 out/ 里,上传时最容易漏。三件事都在这里一次做完并回读。
// 用法:
//   node scripts/build-for-host.mjs                      只构建+自检(不上传)
//   HOST_SSH=用户名@主机地址 node scripts/build-for-host.mjs --upload            上传「试运行」:只列出会传什么,不真传
//   HOST_SSH=用户名@主机地址 node scripts/build-for-host.mjs --upload --apply     真上传(默认不删主机上多出来的文件)
//   加 --delete 才会删掉主机上 out/ 里没有的文件(会先要求试运行过一次)
// 环境变量: HOST_SSH(必填于 --upload) · HOST_DIR(默认 public_html) · HOST_PORT(默认 22)。密码/私钥不进这个仓库,走 ssh 自己的密钥。
import fs from 'fs'; import {spawnSync, execFileSync} from 'child_process';
const args = process.argv.slice(2); const has = f => args.includes(f);
const run = (cmd, a, opt = {}) => { const r = spawnSync(cmd, a, { stdio: 'inherit', ...opt }); if (r.status !== 0) { console.error(`✗ 失败: ${cmd} ${a.join(' ')}`); process.exit(r.status || 1); } };
const GA = 'G-JZD3SQCWMP';
console.log('① 构建(带统计编号与「允许收录」开关)');
run('npm', ['run', 'build'], { env: { ...process.env, NEXT_PUBLIC_GA4_ID: GA, NEXT_PUBLIC_SITE_INDEXABLE: 'true', NEXT_TELEMETRY_DISABLED: '1' } });
console.log('② 生成跳转规则并放进 out/');
run('node', ['scripts/gen-host-configs.mjs'], { stdio: 'ignore' });
fs.copyFileSync('dist-host-configs/.htaccess', 'out/.htaccess');
const ht = fs.readFileSync('out/.htaccess', 'utf8');
const need = [['https 规则', /HTTPS\} !=on/], ['www 规则', /\^www\\\.zenramensushiny\\\.com/], ['旧网址跳转 ≥100 条', null], ['缓存头', /must-revalidate/]];
const nRules = (ht.match(/^RewriteRule \^[^ ]+\/\?\$ /gm) || []).length;
let bad = 0; for (const [n, re] of need) { const ok = re ? re.test(ht) : nRules >= 100; console.log(`   ${ok ? '✓' : '✗'} .htaccess 含 ${n}${re ? '' : `(实际 ${nRules} 条)`}`); if (!ok) bad++; }
if (bad) process.exit(1);
console.log('③ 自检统计编号与索引开关');
run('node', ['seo/check-ga4.mjs']);
const files = execFileSync('find', ['out', '-type', 'f'], { encoding: 'utf8' }).trim().split('\n'); const mb = files.reduce((s, f) => s + fs.statSync(f).size, 0) / 1048576;
console.log(`④ out/ 共 ${files.length} 个文件、${mb.toFixed(1)} MB(含隐藏文件 .htaccess: ${fs.existsSync('out/.htaccess') ? '是' : '否'})`);
if (!has('--upload')) { console.log('BUILD-FOR-HOST PASS(未上传。要上传见脚本开头的用法)'); process.exit(0); }
const host = process.env.HOST_SSH; if (!host) { console.error('✗ 没有 HOST_SSH(形如 用户名@主机地址)'); process.exit(2); }
const dir = process.env.HOST_DIR || 'public_html', port = process.env.HOST_PORT || '22', apply = has('--apply');
if (has('--delete') && !apply) { console.error('✗ --delete 必须配合 --apply,并且建议先不带 --apply 看一遍试运行清单'); process.exit(2); }
const rs = ['-rlt', '--itemize-changes', '-e', `ssh -p ${port} -o BatchMode=yes`, ...(apply ? [] : ['--dry-run']), ...(has('--delete') ? ['--delete'] : []), 'out/', `${host}:${dir}/`];
console.log(`⑤ ${apply ? '真上传' : '上传试运行(不会真传)'} → ${host}:${dir}/`);
run('rsync', rs);
console.log(apply ? '上传完成。接着跑: node seo/check-cutover.mjs --host zenramensushiny.com --ip <主机地址>' : '试运行结束。确认清单无误后加 --apply 真上传。');
