import {readdir} from 'node:fs/promises';
import path from 'node:path';
import menus from '@/content/menus.json';

// Runs during static export. No requests for missing photos are sent to visitors.
export async function getMenuImages(): Promise<Record<string,string>> {
  const directory = path.join(process.cwd(),'public','images','menu');
  const entries = await readdir(directory,{withFileTypes:true});
  const itemIds = new Set(menus.flatMap(menu=>menu.sections.flatMap(section=>section.items.map(item=>item.id))));
  const images: Record<string,string> = {};
  for (const entry of entries.sort((a,b)=>a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !/\.(avif|webp|png|jpe?g)$/i.test(entry.name)) continue;
    const id = path.parse(entry.name).name;
    if (!itemIds.has(id)) continue;
    if (images[id]) throw new Error(`Multiple menu photos for ${id}. Keep one image per item ID.`);
    images[id] = `/images/menu/${entry.name}`;
  }
  return images;
}
