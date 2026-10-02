/* 只动排版不动文字:电话号码与「NY 10018」中间用不换行空格,手机上不会被拆成两行 */
const keep = (t:string) => t.replace(/\((\d{3})\) (\d{3}-\d{4})/g,'($1)\u00a0$2').replace(/NY (\d{5})/g,'NY\u00a0$1')
  /* 联系方式两段原文是「一整行」,手机上挤成一团:地址、邮箱、电话各占一行(只加换行,文字不变;.legal-content p 用 pre-line 显示换行) */
  .replace(/^(Zen Ramen & Sushi) (150 W 36th Street) (New York,)/,'$1\n$2\n$3').replace(/^(Email: \S+) (Phone:)/,'$1\n$2');
export default function Legal({blocks}:{blocks:{type:string;text:string}[]}){return <div className="container legal-content">{blocks.map((b,i)=>b.type==='heading'?<h2 key={i}>{b.text}</h2>:<p key={i}>{b.type==='bullet'?'• ':''}{keep(b.text)}</p>)}</div>;}
