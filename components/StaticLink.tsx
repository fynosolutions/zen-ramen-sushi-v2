import type { ComponentProps } from 'react';
// Ordinary links keep the exported site independent of Next's segment-prefetch rewrites.
export default function StaticLink(props:ComponentProps<'a'>){return <a {...props}/>;}
