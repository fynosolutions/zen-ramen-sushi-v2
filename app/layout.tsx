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
import { site } from '@/content/site';
export const metadata: Metadata = { title: {default:'Zen Ramen & Sushi | Midtown Manhattan',template:'%s | Zen Ramen & Sushi'}, description:'Authentic Japanese ramen and fresh sushi in Midtown Manhattan at 150 W 36th St. Daily happy hour 4–8 PM, weekday lunch specials, catering and delivery.', metadataBase: new URL('https://zenramensushiny.com'), robots: {index:process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true',follow:process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true'}, icons:{icon:'/favicon.svg'}, openGraph:{images:['/images/photo-10.webp']} };
function Analytics(){
  const id = process.env.NEXT_PUBLIC_GA4_ID;
  if(!id) return null;   // 没配 ID 就一行脚本都不加载
  return <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`}/>
    <script dangerouslySetInnerHTML={{__html:
      `if(!/^(localhost|127\\.0\\.0\\.1)$/.test(location.hostname)){` +   // 本地预览不计数,避免误报
      `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
      `gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});}`
    }}/>
  </>;
}
export default function Layout({children}:{children:React.ReactNode}) {
  const schema = {'@context':'https://schema.org','@type':'Restaurant',name:site.name,url:'https://zenramensushiny.com',telephone:site.phone,email:site.email,priceRange:'$$',image:'https://zenramensushiny.com/images/photo-10.webp',servesCuisine:['Japanese','Ramen','Sushi'],acceptsReservations:site.reserve,foundingDate:'2013',address:{'@type':'PostalAddress',streetAddress:'150 W 36th St',addressLocality:'New York',addressRegion:'NY',postalCode:'10018',addressCountry:'US'},geo:{'@type':'GeoCoordinates',latitude:40.75197,longitude:-73.98944},sameAs:['https://www.instagram.com/zenramen_sushi','https://www.tiktok.com/@zen.ramen.sushi','https://www.facebook.com/profile.php?id=100063822857127'],hasMenu:'https://zenramensushiny.com/menu/',openingHoursSpecification:site.hours.map(h=>({'@type':'OpeningHoursSpecification',dayOfWeek:h.schemaDays,opens:h.opens,closes:h.closes}))};
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<Footer/><MobileActionBar/><Analytics/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/></body></html>;
}
