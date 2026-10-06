import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from '@/components/StaticLink';
import { Arrow } from '@/components/Shared';
import { site } from '@/content/site';
import { posts, byPath, params, fmtDate, withTz, related } from '@/lib/journal';

type P = { params: Promise<{year:string;month:string;day:string;slug:string}> };
const pathOf = (p:{year:string;month:string;day:string;slug:string}) => `/${p.year}/${p.month}/${p.day}/${p.slug}/`;
export const dynamicParams = false;
export function generateStaticParams(){ return posts.map(params); }

export async function generateMetadata({params}:P): Promise<Metadata> {
  const post = byPath.get(pathOf(await params)); if(!post) return {};
  // 标题和描述逐字沿用旧站被 Google 收录的原文(所以不套全站的标题模板,长度也不裁)
  return { title:{absolute:post.pageTitle}, description:post.description, alternates:{canonical:post.path},
    openGraph:{ siteName:'Zen Ramen & Sushi', locale:'en_US', type:'article', title:post.title, description:post.description, url:post.path, publishedTime:withTz(post.date), modifiedTime:withTz(post.modified),
      images: post.hero ? [{url:post.hero.src,width:post.hero.width,height:post.hero.height,alt:post.hero.alt}] : ['/images/shot-og.webp'] } };
}

export default async function JournalPost({params}:P){
  const post = byPath.get(pathOf(await params)); if(!post) notFound();
  const ld = {'@context':'https://schema.org','@type':'BlogPosting',headline:post.title,description:post.description,datePublished:withTz(post.date),dateModified:withTz(post.modified),
    mainEntityOfPage:'https://zenramensushiny.com'+post.path, image: post.hero ? ['https://zenramensushiny.com'+post.hero.src] : undefined,
    author:{'@type':'Organization',name:site.name,url:'https://zenramensushiny.com'}, publisher:{'@type':'Organization',name:site.name,url:'https://zenramensushiny.com'}};
  // 面包屑(旧站每页都有 BreadcrumbList)
  const crumbs = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[['Home','/'],['Journal','/blog/'],[post.title,post.path]].map(([name,path],i) => ({'@type':'ListItem',position:i+1,name,item:'https://zenramensushiny.com'+path}))};
  return <main id="main">
    <section className="page-heading journal-heading container">
      <p className="eyebrow red"><Link href="/blog/">ZEN JOURNAL</Link></p>
      <h1>{post.title}</h1>
      <p className="journal-meta"><span>Published <time dateTime={post.date}>{fmtDate(post.date)}</time></span> <span>Zen Ramen & Sushi, Midtown Manhattan</span></p>
    </section>
    <article className="container scene-page journal-article">
      {post.hero && <img className="journal-hero" src={post.hero.src} alt={post.hero.alt} width={post.hero.width} height={post.hero.height} />}
      <div className="scene-body journal-body" dangerouslySetInnerHTML={{__html:post.html}} />
      <aside className="journal-visit" aria-label="Visit Zen Ramen & Sushi">
        <h2>Taste it for yourself in Midtown</h2>
        <p>Zen Ramen & Sushi is at {site.address}, five minutes from Penn Station. Slow-simmered ramen, fresh-cut sushi, a weekday <Link href="/lunch-specials/">lunch specials menu</Link> and a daily <Link href="/happy-hour/">happy hour (4–8 PM)</Link>.</p>
        <div className="scene-ctas"><Link className="button button-red" href="/menu/">SEE THE MENU <Arrow /></Link><a className="button button-dark" href={site.order} data-cta="journal-order" target="_blank" rel="noopener noreferrer">ORDER ONLINE <Arrow /></a><a className="text-link" href={site.reserve} data-cta="journal-reserve" target="_blank" rel="noopener noreferrer">RESERVE A TABLE <Arrow /></a></div>
      </aside>
      <nav className="journal-more" aria-label="More from the journal">
        <h2>Keep reading</h2>
        <ul>{related(post).map(r => <li key={r.path}><Link href={r.path}>{r.title}</Link></li>)}</ul>
        <Link className="text-link" href="/blog/">ALL GUIDES <Arrow /></Link>
      </nav>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld).replace(/</g,'\\u003c')}} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(crumbs).replace(/</g,'\\u003c')}} />
  </main>;
}
