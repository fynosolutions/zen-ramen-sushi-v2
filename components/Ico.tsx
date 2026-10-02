/* 全站小图标一律用这里的内联 SVG,不用 ↗ ✳ ★ ▶ ☰ 这类符号字符:
   iPhone/安卓会把这些字符换成系统彩色 emoji(2026-10-02 毛真机截图),电脑上却正常,本地模拟测不出来。
   图标跟文字同色同大小(1em、currentColor)。检查:node seo/check-device-safe.mjs */
const LINE = {
  ne: 'M4.5 11.5l7-7M5.5 4.5h6v6',
  right: 'M2.5 8h11M9 3.5L13.5 8 9 12.5',
  left: 'M13.5 8h-11M7 3.5L2.5 8 7 12.5',
  down: 'M4 6l4 4 4-4',
  spark: 'M8 1.5v13M1.5 8h13M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2',
  check: 'M3 8.5L6.5 12 13 4.5',
  menu: 'M2.5 4.5h11M2.5 8h11M2.5 11.5h11',
  x: 'M3.5 3.5l9 9M12.5 3.5l-9 9',
} as const;
const SOLID = {
  play: 'M4 2.5v11l9.5-5.5z',
  pause: 'M4 2.5h3v11H4zM9 2.5h3v11H9z',
  star: 'M8 1.2l2.1 4.5 4.9.6-3.6 3.4.9 4.9L8 12.2l-4.3 2.4.9-4.9L1 6.3l4.9-.6z',
} as const;
export type IcoName = keyof typeof LINE | keyof typeof SOLID;
export default function Ico({n}:{n:IcoName}){
  const solid = n in SOLID;
  return <svg className={'ico ico-'+n} aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill={solid?'currentColor':'none'} stroke={solid?'none':'currentColor'} strokeWidth={n==='spark'?2:1.85}><path d={solid?SOLID[n as keyof typeof SOLID]:LINE[n as keyof typeof LINE]}/></svg>;
}
