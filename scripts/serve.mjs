import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
const root=path.resolve('out');
const port=Number(process.env.PORT||3001);
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.pdf':'application/pdf','.woff2':'font/woff2','.xml':'application/xml','.mp4':'video/mp4'};
http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname.includes('\0'))throw new Error('invalid');let file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}if((await stat(file)).isDirectory())file=path.join(file,'index.html');const data=await readFile(file);const compress=/gzip/.test(req.headers['accept-encoding']||'')&&/\.(html|css|js|json|txt|svg|xml)$/.test(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream',...(compress?{'Content-Encoding':'gzip','Vary':'Accept-Encoding'}:{})});res.end(compress?gzipSync(data):data);}catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')).catch(()=>Buffer.from('Not found')));}}).listen(port,'127.0.0.1',()=>console.log(`Static preview: http://127.0.0.1:${port}`));
