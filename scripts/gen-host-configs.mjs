// 单一真相源 vercel.json → 各家主机的等效跳转配置(搬家用)
// 用法: node scripts/gen-host-configs.mjs   产出到 dist-host-configs/
import fs from 'fs'; import path from 'path';
const v = JSON.parse(fs.readFileSync('vercel.json','utf8'));
const out = 'dist-host-configs'; fs.mkdirSync(out,{recursive:true});
const plain = v.redirects.filter(r=>!r.has);
const query = v.redirects.filter(r=>r.has);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

// ---- Apache (.htaccess) —— GoDaddy cPanel/Linux 主机、多数虚拟主机 ----
let ht = `# 由 scripts/gen-host-configs.mjs 自动生成,勿手改。真相源: vercel.json
# 适用: Apache (GoDaddy cPanel/Linux Hosting、多数虚拟主机)
Options -MultiViews
RewriteEngine On

# 静态站:目录下的 index.html 直接服务
DirectoryIndex index.html

# 统一带尾斜杠(与 Next.js trailingSlash:true 一致)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} !(/$|\\.) 
RewriteRule ^(.*)$ /$1/ [R=301,L]

# --- 带查询参数的条件跳转 (${query.length} 条) ---\n`;
for(const r of query){
  const k=r.has[0].key, val=r.has[0].value;
  ht += `RewriteCond %{QUERY_STRING} (^|&)${esc(k)}=${esc(val)}($|&)\n`;
  ht += `RewriteRule ^${r.source.replace(/^\//,'').replace(/\/$/,'')}/?$ ${r.destination}? [R=301,L,NE]\n`;
}
ht += `\n# --- 旧 URL 一对一跳转 (${plain.length} 条) ---\n`;
for(const r of plain){
  const src = r.source.replace(/^\//,'').replace(/\/$/,'');
  ht += `RewriteRule ^${esc(src)}/?$ ${r.destination} [R=301,L,NE]\n`;
}
ht += `\n# 自定义 404\nErrorDocument 404 /404.html\n`;
fs.writeFileSync(path.join(out,'.htaccess'), ht);

// ---- IIS (web.config) —— GoDaddy Plesk/Windows 主机 ----
let rules='';
for(const r of query){
  rules += `        <rule name="q-${r.source.replace(/\W/g,'')}-${r.has[0].value}" stopProcessing="true">
          <match url="^${r.source.replace(/^\//,'').replace(/\/$/,'')}/?$" />
          <conditions><add input="{QUERY_STRING}" pattern="(^|&amp;)${r.has[0].key}=${r.has[0].value}($|&amp;)" /></conditions>
          <action type="Redirect" url="${r.destination}" appendQueryString="false" redirectType="Permanent" />
        </rule>\n`;
}
for(const r of plain){
  rules += `        <rule name="r-${r.source.replace(/\W/g,'')}" stopProcessing="true">
          <match url="^${r.source.replace(/^\//,'').replace(/\/$/,'')}/?$" />
          <action type="Redirect" url="${r.destination}" appendQueryString="false" redirectType="Permanent" />
        </rule>\n`;
}
fs.writeFileSync(path.join(out,'web.config'), `<?xml version="1.0" encoding="UTF-8"?>
<!-- 自动生成,勿手改。真相源: vercel.json | 适用: IIS (GoDaddy Plesk/Windows) -->
<configuration><system.webServer>
  <defaultDocument><files><clear /><add value="index.html" /></files></defaultDocument>
  <httpErrors errorMode="Custom"><remove statusCode="404" /><error statusCode="404" path="/404.html" responseMode="ExecuteURL" /></httpErrors>
  <rewrite><rules>
${rules}      </rules></rewrite>
</system.webServer></configuration>\n`);

// ---- Netlify / Cloudflare Pages (_redirects) ----
let nl = `# 自动生成,勿手改。真相源: vercel.json | 适用: Netlify / Cloudflare Pages\n`;
for(const r of query) nl += `${r.source}  ${r.destination}  301  Query=${r.has[0].key}:${r.has[0].value}\n`;
for(const r of plain) nl += `${r.source}  ${r.destination}  301\n`;
fs.writeFileSync(path.join(out,'_redirects'), nl);

// ---- nginx ----
let ng = `# 自动生成,勿手改。真相源: vercel.json | 适用: nginx (自建/VPS)\n`;
for(const r of query) ng += `if ($arg_${r.has[0].key} = "${r.has[0].value}") { rewrite ^${r.source}$ ${r.destination} permanent; }\n`;
for(const r of plain) ng += `rewrite ^${r.source.replace(/\/$/,'')}/?$ ${r.destination} permanent;\n`;
fs.writeFileSync(path.join(out,'nginx-redirects.conf'), ng);

console.log(`已生成 ${v.redirects.length} 条跳转的四份等效配置 → ${out}/`);
console.log('  .htaccess            Apache  (GoDaddy cPanel/Linux)');
console.log('  web.config           IIS     (GoDaddy Plesk/Windows)');
console.log('  _redirects           Netlify / Cloudflare Pages');
console.log('  nginx-redirects.conf nginx   (自建/VPS)');
