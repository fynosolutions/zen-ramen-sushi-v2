import type {Metadata} from 'next';
import Legal from '@/components/Legal';
import {PageHeading} from '@/components/Shared';
import legal from '@/content/legal.json';
export const metadata:Metadata={title:'Terms & Conditions',alternates:{canonical:'/terms-conditions/'}};
export default function Terms(){return <main id="main"><PageHeading label="ZEN RAMEN & SUSHI" title="Terms & conditions"/><Legal blocks={legal.terms}/></main>;}
