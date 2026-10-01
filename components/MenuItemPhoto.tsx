'use client';

import {useState} from 'react';

export type MenuPhoto = {src:string;name:string};

export default function MenuItemPhoto({src,name,onOpen}:{
  src?:string;
  name:string;
  onOpen:(photo:MenuPhoto,trigger:HTMLButtonElement)=>void;
}) {
  const [failedSrc,setFailedSrc] = useState<string>();
  if (!src || failedSrc===src) return <span className="food-photo food-photo-placeholder" aria-hidden="true"/>;
  return <button type="button" className="food-photo food-photo-button" aria-label={`Enlarge photo of ${name}`} aria-haspopup="dialog" onClick={event=>onOpen({src,name},event.currentTarget)}>
    <img src={src} alt={name} width="224" height="224" loading="lazy" decoding="async"
      ref={image=>{if(image?.complete && image.naturalWidth===0)setFailedSrc(src);}}
      onError={()=>setFailedSrc(src)}/>
  </button>;
}
