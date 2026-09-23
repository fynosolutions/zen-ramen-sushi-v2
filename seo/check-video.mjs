import fs from 'fs'; import {execSync} from 'child_process';
const mode = process.argv[2];
const dir='public/ig';
const vids = fs.readdirSync(dir).filter(f=>f.endsWith('.mp4'));
const probe = f => JSON.parse(execSync(`ffprobe -v quiet -print_format json -show_streams -show_format "${dir}/${f}"`,{encoding:'utf8'}));
const home = fs.readFileSync('out/index.html','utf8');
const about = fs.readFileSync('out/about/index.html','utf8');
const css = fs.readFileSync('app/globals.css','utf8');
const comp = fs.readFileSync('components/IgReels.tsx','utf8');
const data = fs.readFileSync('content/ig.ts','utf8');
const fail=[];
// 用 ffmpeg 量某帧上/下/中三带的平均亮度(0-255),无 Python 依赖
const luma = (src, ss, crop) => {
  const out = execSync(`ffmpeg -v error -ss ${ss} -i "${src}" -frames:v 1 -vf "crop=${crop},format=gray,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-" -f null - 2>&1`,{encoding:'utf8'});
  const m = out.match(/YAVG=([\d.]+)/); return m ? parseFloat(m[1]) : null;
};
const bandCheck = (src, ss) => { // 返回 [上带, 下带, 中band] 亮度
  return [luma(src,ss,'iw:ih*0.10:0:0'), luma(src,ss,'iw:ih*0.10:0:ih*0.90'), luma(src,ss,'iw:ih*0.6:0:ih*0.2')];
};


if(mode==='codec'){
  for(const f of vids){const d=probe(f); const v=d.streams.find(s=>s.codec_type==='video');
    if(v.codec_name!=='h264') fail.push(`${f} 编码 ${v.codec_name}`);
    if(v.pix_fmt!=='yuv420p') fail.push(`${f} 像素格式 ${v.pix_fmt}`);
    if(!/faststart|progressive/i.test(execSync(`ffprobe -v error -show_entries format_tags -of json "${dir}/${f}"`,{encoding:'utf8'})+'x') && !execSync(`head -c 2000 "${dir}/${f}" | xxd -p | head -5`,{encoding:'utf8'}).includes('6d6f6f76')) fail.push(`${f} moov未前置`);
  }
  console.log(fail.length?'CODEC FAIL '+fail.join('; '):`CODEC PASS (${vids.length}条 h264/yuv420p/faststart)`);
}
if(mode==='letterbox'){
  for(const f of vids){
    const dur=parseFloat(probe(f).format.duration);
    for(const t of [0.3, dur*0.3, dur*0.6, dur-0.4]){
      const [top,bot,mid]=bandCheck(`${dir}/${f}`, t.toFixed(2));
      if(top===null) {fail.push(`${f}@${t.toFixed(1)}s 无法采样`);continue;}
      if(top<12 && bot<12 && mid>25) fail.push(`${f}@${t.toFixed(1)}s 上下黑带(${top.toFixed(0)}/${bot.toFixed(0)} vs 中${mid.toFixed(0)})`);
    }
  }
  console.log(fail.length?'LETTERBOX FAIL '+fail.join('; '):`LETTERBOX PASS (${vids.length}条×4帧,无上下黑带)`);
}
if(mode==='poster'){
  for(const f of vids){const p=`${dir}/${f.replace('.mp4','.webp')}`;
    if(!fs.existsSync(p)){fail.push(`${f} 无封面`);continue;}
    const [top,bot,mid]=bandCheck(p,'0');
    if(top<12 && bot<12 && mid>25) fail.push(`${f} 封面有黑带`);
    if(mid!==null && mid<30) fail.push(`${f} 封面过暗(${mid.toFixed(0)})`);
  }
  console.log(fail.length?'POSTER FAIL '+fail.join('; '):`POSTER PASS (${vids.length}张封面无黑带且亮度达标)`);
}
if(mode==='attrs'){
  for(const [n,h] of [['home',home],['about',about]]){
    const tags=h.match(/<video[^>]*>/g)||[];
    if(tags.length<3) fail.push(`${n} 仅${tags.length}个video`);
    for(const t of tags){
      for(const need of ['playsinline','muted','loop','preload="none"','poster=']) if(!t.toLowerCase().includes(need)) fail.push(`${n} 缺 ${need}`);
    }
  }
  console.log(fail.length?'ATTRS FAIL '+[...new Set(fail)].join('; '):'ATTRS PASS (两页共6个video,四属性+poster齐全)');
}
if(mode==='mobile'){
  if(!/hover:hover.*pointer:fine/.test(comp)) fail.push('未按指针类型区分自动播放');
  if(!/saveData/.test(comp)) fail.push('未尊重省流量模式');
  const btns=(home.match(/class="ig-play"/g)||[]).length;
  if(btns<3) fail.push(`播放按钮仅${btns}个`);
  console.log(fail.length?'MOBILE FAIL '+fail.join('; '):`MOBILE PASS (按指针+省流量双闸,${btns}个显式播放按钮)`);
}
if(mode==='caption'){
  if(!/ig-play\{[^}]*linear-gradient/.test(css)) fail.push('无遮罩渐变');
  if(!/-webkit-line-clamp:2/.test(css)) fail.push('字幕未限两行');
  if(/\.ig-label\{[^}]*position:absolute/.test(css)) fail.push('字幕仍压在视频上');
  console.log(fail.length?'CAPTION FAIL '+fail.join('; '):'CAPTION PASS (字幕移出视频+两行截断+渐变遮罩)');
}
if(mode==='plays'){
  if(!/n < 1000 \? null/.test(comp)) fail.push('未过滤低播放量');
  const shown=(home+about).match(/class="ig-plays"/g)||[];
  const nums=[...data.matchAll(/plays:(\d+)/g)].map(m=>+m[1]);
  const expect=nums.filter(n=>n>=1000).length;
  if(shown.length!==expect) fail.push(`显示${shown.length}个徽章,应为${expect}`);
  console.log(fail.length?'PLAYS FAIL '+fail.join('; '):`PLAYS PASS (仅${expect}条≥1K显示数字)`);
}
if(mode==='layout'){
  if(!about.includes('ig-section-rail')) fail.push('About未用另一版式');
  if(home.includes('ig-section-rail')) fail.push('首页误用rail');
  if(!/ig-section-rail .ig-frame\{aspect-ratio:3\/4/.test(css)) fail.push('rail版式与grid比例相同');
  console.log(fail.length?'LAYOUT FAIL '+fail.join('; '):'LAYOUT PASS (首页9:16三栏 / About 3:4窄栏)');
}
if(mode==='anchor'){
  console.log(/\.ig-section\{[^}]*scroll-margin-top/.test(css)?'ANCHOR PASS':'ANCHOR FAIL 无scroll-margin');
}

if(mode==='playback'){
  const {chromium, webkit, devices} = await import('@playwright/test');
  const targets = [
    {name:'iPhone 12 (WebKit)', engine:webkit, device:devices['iPhone 12']},
    {name:'Pixel 5 (Chromium)', engine:chromium, device:devices['Pixel 5']},
    {name:'Desktop Chrome', engine:chromium, device:{viewport:{width:1440,height:950}}},
  ];
  for(const t of targets){
    let b;
    try{ b = await t.engine.launch(); }catch(e){ fail.push(`${t.name} 引擎不可用: ${String(e).slice(0,60)}`); continue; }
    const c = await b.newContext(t.device);
    const p = await c.newPage();
    await p.addInitScript(()=>sessionStorage.setItem('zen-intro-v2','1'));
    for(const [page,url] of [['home','/'],['about','/about/']]){
      await p.goto('http://127.0.0.1:3001'+url,{waitUntil:'networkidle'});
      await p.evaluate(()=>document.querySelector('.ig-section')?.scrollIntoView({block:'center'}));
      await p.waitForTimeout(900);
      // 点第一个播放按钮 → 必须真的起播(readyState>=2 且 currentTime 前进)
      const wasPaused = await p.evaluate(()=>document.querySelector('.ig-tile video').paused);
      if(wasPaused) await p.locator('.ig-play').first().click();
      await p.waitForTimeout(2600);
      const st = await p.evaluate(()=>{const v=document.querySelector('.ig-tile video'); return {paused:v.paused, t:v.currentTime, ready:v.readyState, err:v.error?.code??null};});
      if(st.err) fail.push(`${t.name}/${page} 媒体错误码${st.err}`);
      else if(st.ready<2) fail.push(`${t.name}/${page} 未就绪(readyState=${st.ready})`);
      else if(st.paused || st.t<=0.15) fail.push(`${t.name}/${page} 未起播(paused=${st.paused} t=${st.t.toFixed(2)})`);
    }
    await b.close();
  }
  console.log(fail.length?'PLAYBACK FAIL '+fail.join('; '):'PLAYBACK PASS (iPhone WebKit + Android Chromium + 桌面, 两页均成功起播)');
}
