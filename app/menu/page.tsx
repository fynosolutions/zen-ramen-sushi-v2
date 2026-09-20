import type { Metadata } from 'next';
import MenuBrowser from '@/components/MenuBrowser';
import { PageHeading } from '@/components/Shared';
export const metadata:Metadata={title:'Our Menu',description:'Explore our dinner, lunch and happy hour menus. Ramen, sushi, Japanese favorites and drinks, with cash and card prices.',alternates:{canonical:'/menu/'},openGraph:{title:'Our Menu | ZEN RAMEN & SUSHI',description:'Dinner, lunch and happy hour in Midtown Manhattan.',url:'/menu/'}};
export default function MenuPage(){return <main id="main"><PageHeading label="RAMEN · SUSHI · JAPANESE FAVORITES" title="Follow your craving" description="Explore our dinner, lunch and happy hour menus. Find your favorites, then join us on 36th Street."/><MenuBrowser/></main>;}
