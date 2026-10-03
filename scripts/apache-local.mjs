// 在本机起一个真 Apache(macOS 自带 /usr/sbin/httpd),把 out/ 当网站根目录,用来在上线前验证 .htaccess。
// 用法: node scripts/apache-local.mjs start [目录=out] [端口=8911]   |   stop [端口=8911]
// 配置只在 /tmp 里,不动系统 Apache。AllowOverride All = 和 GoDaddy cPanel 共享主机一样读 .htaccess。
import fs from 'fs'; import path from 'path'; import {execFileSync, spawnSync} from 'child_process';
const [cmd='start', a1, a2] = process.argv.slice(2);
const port = cmd === 'stop' ? (a1 || '8911') : (a2 || '8911');
const dir = '/tmp/zen-apache-' + port, conf = dir + '/httpd.conf', pid = dir + '/httpd.pid';
if (cmd === 'stop') { try { process.kill(+fs.readFileSync(pid, 'utf8'), 'SIGTERM'); console.log('已停止 Apache :' + port); } catch { console.log('没有在跑'); } process.exit(0); }
const root = path.resolve(a1 || 'out'); if (!fs.existsSync(root)) { console.error('目录不存在: ' + root); process.exit(2); }
fs.mkdirSync(dir, { recursive: true });
// Apache 的 _www 用户读不了 ~/Desktop 下的文件(返回 403),所以先把网站复制到 /tmp 再服务;每次 start 都重新同步(含 .htaccess 等隐藏文件)
const www = dir + '/www'; fs.mkdirSync(www, { recursive: true });
execFileSync('rsync', ['-a', '--delete', root + '/', www + '/']);
const mods = ['mpm_prefork','authz_core','authz_host','mime','dir','alias','rewrite','headers','deflate','log_config','unixd','env','setenvif','filter'];
fs.writeFileSync(conf, `ServerRoot "/usr"
PidFile "${pid}"
Listen 127.0.0.1:${port}
${mods.map(m => `LoadModule ${m}_module libexec/apache2/mod_${m}.so`).join('\n')}
User _www
Group _www
ServerName localhost
DocumentRoot "${www}"
ErrorLog "${dir}/error.log"
LogLevel warn
<Directory />
  AllowOverride None
  Require all denied
</Directory>
<Directory "${www}">
  AllowOverride All
  Require all granted
</Directory>
TypesConfig /private/etc/apache2/mime.types
AddType video/mp4 .mp4
AddType image/webp .webp
`);
const t = spawnSync('/usr/sbin/httpd', ['-f', conf, '-t'], { encoding: 'utf8' }); if (t.status !== 0) { console.error('Apache 配置不通过:\n' + t.stderr); process.exit(1); }
try { process.kill(+fs.readFileSync(pid, 'utf8'), 0); console.log('已经在跑 :' + port); process.exit(0); } catch {}
execFileSync('/usr/sbin/httpd', ['-f', conf, '-k', 'start']);
for (let i = 0; i < 20; i++) { try { const r = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', `http://127.0.0.1:${port}/`], { encoding: 'utf8' }); if (r.stdout.trim() !== '000') { console.log(`Apache 已启动 http://127.0.0.1:${port}/ (网站复制自 ${root}, 首页 ${r.stdout.trim()})`); process.exit(0); } } catch {} spawnSync('sleep', ['0.3']); }
console.error('Apache 没起来,看 ' + dir + '/error.log'); process.exit(1);
