import type {Metadata} from 'next';
import Legal from '@/components/Legal';
import {PageHeading} from '@/components/Shared';
import legal from '@/content/legal.json';
export const metadata:Metadata={title:'Privacy Policy',alternates:{canonical:'/privacy-policy/'}};
export default function Privacy(){return <main id="main"><PageHeading label="ZEN RAMEN & SUSHI" title="Privacy policy"/><Legal blocks={legal.privacy}/></main>;}
