'use client';

import {useEffect,useRef} from 'react';
import type {MenuPhoto} from './MenuItemPhoto';

export default function MenuPhotoDialog({photo,onClose}:{photo:MenuPhoto|null;onClose:()=>void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    if (!photo) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow='hidden';
    return ()=>{
      element?.close();
      document.body.style.overflow=previousOverflow;
    };
  },[photo]);

  const close = ()=>{dialog.current?.close();onClose();};
  return <dialog ref={dialog} className="menu-photo-dialog" aria-labelledby="menu-photo-title"
    onCancel={event=>{event.preventDefault();close();}}
    onKeyDown={event=>{if(event.key==='Tab'){event.preventDefault();dialog.current?.querySelector('button')?.focus();}}}
    onClick={event=>{if(event.target===event.currentTarget)close();}}>
    {photo&&<div className="menu-photo-dialog-content">
      <div className="menu-photo-dialog-heading"><h2 id="menu-photo-title">{photo.name}</h2><button type="button" onClick={close} aria-label="Close enlarged photo" autoFocus>CLOSE <span aria-hidden="true">×</span></button></div>
      <img src={photo.src} alt={photo.name}/>
    </div>}
  </dialog>;
}
