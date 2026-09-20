'use client';
import {useState} from 'react';
import {site} from '@/content/site';
const fields = ['name','email','phone','type','date','time','guests','service','message'] as const;
type Field=typeof fields[number];
type Values=Record<Field,string>;
const initial:Values={name:'',email:'',phone:'',type:'',date:'',time:'',guests:'',service:'',message:''};
export default function InquiryForm(){
 const [values,setValues]=useState(initial);
 const [errors,setErrors]=useState<Partial<Values>>({});
 const [prepared,setPrepared]=useState(false);
 const [busy,setBusy]=useState(false);
 const [copied,setCopied]=useState(false);
 const [copyError,setCopyError]=useState(false);
 const body=()=>`Event inquiry for ZEN RAMEN & SUSHI\n\nFull name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone}\nEvent type: ${values.type}\nEvent date: ${values.date}\nEvent time (New York): ${values.time}\nGuests: ${values.guests}\nService: ${values.service}\n\nAdditional details:\n${values.message}`;
 const update=(key:Field,value:string)=>{setValues(v=>({...v,[key]:value}));setErrors(e=>({...e,[key]:undefined}));setPrepared(false);setCopied(false);};
 const submit=(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();if(busy)return;
  const next:Partial<Values>={};
  for(const key of fields){if(key!=='message'&&!values[key].trim())next[key]='Please complete this field.';}
  if(values.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))next.email='Enter a valid email address.';
  if(values.phone&&values.phone.replace(/\D/g,'').length<7)next.phone='Enter a valid phone number, including area code.';
  if(values.guests&&(!Number.isInteger(Number(values.guests))||Number(values.guests)<1))next.guests='Enter a whole number of at least 1.';
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:site.timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  if(values.date&&values.date<today)next.date='Choose today or a future date in New York.';
  setErrors(next);
  if(Object.keys(next).length){document.getElementById('inquiry-'+Object.keys(next)[0])?.focus();return;}
  setBusy(true);setPrepared(true);
  const href=`mailto:${site.cateringEmail}?subject=${encodeURIComponent('Event inquiry — '+values.type)}&body=${encodeURIComponent(body())}`;
  if(href.length<7500)window.location.href=href;
  window.setTimeout(()=>setBusy(false),1200);
 };
 const field=(key:Field,label:string,type='text',extra:React.InputHTMLAttributes<HTMLInputElement>={})=><div className="form-field"><label htmlFor={'inquiry-'+key}>{label} <span aria-hidden="true">*</span></label><input id={'inquiry-'+key} name={key} type={type} value={values[key]} onChange={e=>update(key,e.target.value)} required aria-invalid={!!errors[key]} aria-describedby={errors[key]?'error-'+key:undefined} {...extra}/>{errors[key]&&<p className="field-error" id={'error-'+key}>{errors[key]}</p>}</div>;
 const select=(key:Field,label:string,options:string[])=><div className="form-field"><label htmlFor={'inquiry-'+key}>{label} <span aria-hidden="true">*</span></label><select id={'inquiry-'+key} name={key} value={values[key]} required aria-invalid={!!errors[key]} aria-describedby={errors[key]?'error-'+key:undefined} onChange={e=>update(key,e.target.value)}><option value="">Please select</option>{options.map(o=><option key={o}>{o}</option>)}</select>{errors[key]&&<p className="field-error" id={'error-'+key}>{errors[key]}</p>}</div>;
 return <form className="inquiry-form" noValidate onSubmit={submit}><div className="form-heading"><span className="eyebrow red">TELL US WHAT YOU HAVE IN MIND</span><h2>Let’s get together.</h2><p>Fields marked * are required. Event times are in New York local time.</p></div><div className="form-grid">{field('name','Full name','text',{autoComplete:'name',maxLength:100})}{field('email','Email address','email',{autoComplete:'email',maxLength:200})}{field('phone','Phone number','tel',{autoComplete:'tel',maxLength:35})}{select('type','Event type',['Corporate lunch','Birthday','Celebration','Other'])}{field('date','Event date','date')}{field('time','Event time','time')}{field('guests','Number of guests','number',{min:1,step:1})}{select('service','Service',['Catering','On-site event'])}<div className="form-field full"><label htmlFor="inquiry-message">Additional details <small>(optional)</small></label><textarea id="inquiry-message" name="message" rows={5} maxLength={1200} value={values.message} onChange={e=>update('message',e.target.value)} placeholder="Tell us a little about your event…"/></div></div><div className="form-submit"><button className="button button-red" type="submit" disabled={busy}>{busy?'OPENING EMAIL…':'OPEN EMAIL APP'} <span aria-hidden="true">↗</span></button><p>This opens your email app with your inquiry.<br/>Review it there and press Send.</p></div>{prepared&&<div className="form-feedback" role="status"><h3>Your inquiry is ready.</h3><p>Please send your message from your email app. Your inquiry has not been sent by this website. If your app did not open, copy the details below and email <a href={'mailto:'+site.cateringEmail}>{site.cateringEmail}</a>.</p><button type="button" className="text-link" onClick={async()=>{try{await navigator.clipboard.writeText(body());setCopied(true);setCopyError(false);}catch{setCopyError(true);}}}>{copied?'COPIED ✓':'COPY INQUIRY DETAILS ↗'}</button>{copyError&&<p>Select and copy the text below.</p>}<details><summary>View your inquiry</summary><pre>{body()}</pre></details></div>}</form>;
}
