import type {Metadata} from 'next';
import Legal from '@/components/Legal';
import {PageHeading} from '@/components/Shared';
import legal from '@/content/legal.json';
export const metadata:Metadata={description:'Our commitment to an accessible website at Zen Ramen & Sushi, and how to contact us if you need help.',title:'Accessibility Statement',alternates:{canonical:'/accessibility/'}};
export default function Accessibility(){return <main id="main"><PageHeading label="ZEN RAMEN & SUSHI" title="Accessibility statement"/><Legal blocks={legal.accessibility}/></main>;}
