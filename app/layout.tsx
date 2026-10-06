import type { Metadata } from 'next';
import '@fontsource/nunito-sans/latin-400.css';
import '@fontsource/nunito-sans/latin-600.css';
import '@fontsource/nunito-sans/latin-800.css';
import '@fontsource/nunito-sans/latin-900.css';
import '@fontsource/zen-kaku-gothic-new/latin-700.css';
import '@fontsource/zen-kaku-gothic-new/latin-900.css';
import '@fontsource/zen-old-mincho/japanese-700.css';
import './globals.css';
import Header from '@/components/Header';
import { Footer, MobileActionBar } from '@/components/Shared';
import CtaBand from '@/components/CtaBand';
import CtaTracker from '@/components/CtaTracker';
import { site } from '@/content/site';
export const metadata: Metadata = { title: {default:'Zen Ramen & Sushi | Midtown Manhattan',template:'%s | Zen Ramen & Sushi'}, description:'Japanese restaurant in Midtown Manhattan at 150 W 36th St: ramen and fresh sushi, daily happy hour 4–8 PM, weekday lunch specials, catering and delivery.', metadataBase: new URL('https://zenramensushiny.com'), robots: process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true' ? {index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1} : {index:false,follow:false}, icons:{icon:[{url:'/favicon.svg',type:'image/svg+xml'},{url:'/favicon.ico',sizes:'48x48'}],apple:'/apple-touch-icon.png'}, verification:{google:['NxdE6Sf6t_Sp2Gn7sKCHCN4KUvnSLJLUVlnSON7U_Rg','-xc2nhXkIUAZeP6QnPFK7WmYcMoVfWVfW21__KcaWx0']}, openGraph:{siteName:'Zen Ramen & Sushi',type:'website',locale:'en_US',images:[{url:'/images/shot-og.webp',width:1200,height:630,alt:'Ramen and sushi at Zen Ramen & Sushi in Midtown Manhattan'}]} };
function Analytics(){
  const id = process.env.NEXT_PUBLIC_GA4_ID;
  if(!id) return null;   // 没配 ID 就一行脚本都不加载
  return <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`}/>
    <script dangerouslySetInnerHTML={{__html:
      `if(!/^(localhost|127\\.0\\.0\\.1)$/.test(location.hostname)){` +   // 本地预览不计数,避免误报
      `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
      `gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});` +
      // 旧站 Google Site Kit 里店家自己的 GA4(G-W5EJN9PQ8X,经 Google 标签 GT-MJJQ9P6Z)与 Google Ads 转化编号:切换时漏带,2026-10-05 补回
      `gtag('config','GT-MJJQ9P6Z');gtag('config','AW-17990718317');` +
      // OpenAI 广告转化像素(旧站 WPCode 里的原文)
      `window.oaiq=window.oaiq||function(){(window.oaiq.q=window.oaiq.q||[]).push(arguments)};` +
      `oaiq('init',{pixelId:'XUW55TSpfP5vV7RUmbuTfA'});oaiq('track','page_viewed');` +
      `var o=document.createElement('script');o.async=true;o.src='https://bzrcdn.openai.com/sdk/oaiq.min.js';document.head.appendChild(o);}`
    }}/>
  </>;
}
export default function Layout({children}:{children:React.ReactNode}) {
  const schema = {'@context':'https://schema.org','@type':'Restaurant',name:site.name,url:'https://zenramensushiny.com',telephone:site.phone,email:site.email,priceRange:'$$',image:'https://zenramensushiny.com/images/shot-og.webp',servesCuisine:['Japanese','Ramen','Sushi'],acceptsReservations:site.reserve,foundingDate:'2013',address:{'@type':'PostalAddress',streetAddress:'150 W 36th St',addressLocality:'New York',addressRegion:'NY',postalCode:'10018',addressCountry:'US'},geo:{'@type':'GeoCoordinates',latitude:40.75197,longitude:-73.98944},sameAs:['https://www.instagram.com/zenramen_sushi','https://www.tiktok.com/@zen.ramen.sushi','https://www.facebook.com/profile.php?id=100063822857127'],hasMenu:'https://zenramensushiny.com/menu/',openingHoursSpecification:site.hours.map(h=>({'@type':'OpeningHoursSpecification',dayOfWeek:h.schemaDays,opens:h.opens,closes:h.closes}))};
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<CtaBand/><Footer/><MobileActionBar/><CtaTracker/><Analytics/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:'Zen Ramen & Sushi',alternateName:'Zen Ramen and Sushi',url:'https://zenramensushiny.com/'})}}/></body></html>;
}
