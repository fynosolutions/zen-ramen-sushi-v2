import type {Metadata} from 'next';
import Gallery from '@/components/Gallery';
import {Arrow,PageHeading} from '@/components/Shared';
import {site} from '@/content/site';
export const metadata:Metadata={title:'Gallery',description:'Explore ramen, sushi, shared plates and dining inspiration from Zen Ramen & Sushi.',alternates:{canonical:'/gallery/'}};
export default function GalleryPage(){return <main id="main"><PageHeading label="A TASTE OF ZEN" title="Feast your eyes" description="Ramen, sushi and something worth sharing."/><Gallery/><section className="container gallery-cta"><h2>Hungry yet?</h2><a className="button button-red" href={site.reserve} target="_blank" rel="noopener noreferrer">RESERVE A TABLE <Arrow/></a></section></main>;}
