import type {Metadata} from 'next';
import Gallery from '@/components/Gallery';
import {PageHeading} from '@/components/Shared';
export const metadata:Metadata={title:'Gallery',description:'Explore ramen, sushi, shared plates and dining inspiration from Zen Ramen & Sushi.',alternates:{canonical:'/gallery/'}};
export default function GalleryPage(){return <main id="main"><PageHeading label="A TASTE OF ZEN" title="Feast your eyes" description="Ramen, sushi and something worth sharing."/><Gallery/></main>;}
