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
import { Footer } from '@/components/Shared';
import { site } from '@/content/site';
export const metadata: Metadata = { title: {default:'ZEN RAMEN & SUSHI | Midtown Manhattan',template:'%s | ZEN RAMEN & SUSHI'}, description:'Authentic Japanese ramen and fresh sushi in Midtown Manhattan. Visit us at 150 W 36th St. Explore our menus, reserve a table, or order pickup and delivery.', metadataBase: new URL('https://zenramensushiny.com'), robots: {index:process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true',follow:process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true'}, icons:{icon:'/favicon.svg'} };
export default function Layout({children}:{children:React.ReactNode}) {
  const schema = {'@context':'https://schema.org','@type':'Restaurant',name:site.name,url:'https://zenramensushiny.com',telephone:site.phone,servesCuisine:['Japanese','Ramen','Sushi'],address:{'@type':'PostalAddress',streetAddress:'150 W 36th St',addressLocality:'New York',addressRegion:'NY',postalCode:'10018',addressCountry:'US'},hasMenu:'https://zenramensushiny.com/menu/',openingHoursSpecification:site.hours.map(h=>({'@type':'OpeningHoursSpecification',dayOfWeek:h.schemaDays,opens:h.opens,closes:h.closes}))};
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/></body></html>;
}
