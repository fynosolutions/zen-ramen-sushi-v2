import {test,expect} from '@playwright/test';

test('menu photo slots preserve readable rows and aligned prices at every size',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/menu/');
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:950});
    for (const menu of ['Dinner','Lunch','Happy Hour']) {
      await page.getByRole('tab',{name:menu,exact:true}).click();
      const panel=page.getByRole('tabpanel',{name:menu,exact:true});
      const section=panel.locator('.food-section').first();
      await section.scrollIntoViewIfNeeded();
      const rows=section.locator('.food-item');
      const geometry=await rows.evaluateAll(elements=>elements.map(row=>{
        const bounds=row.getBoundingClientRect();
        const photo=row.querySelector('.food-photo')!.getBoundingClientRect();
        const copy=row.querySelector('.food-copy')!.getBoundingClientRect();
        const prices=row.querySelector('.food-prices')!.getBoundingClientRect();
        return {height:bounds.height,photoWidth:photo.width,photoHeight:photo.height,gap:copy.left-photo.right,
          priceRight:prices.right,rowRight:bounds.right,photoTop:photo.top,copyTop:copy.top};
      }));
      expect(geometry.length).toBeGreaterThan(0);
      expect(Math.max(...geometry.map(row=>row.height))-Math.min(...geometry.map(row=>row.height))).toBeLessThan(1);
      for (const row of geometry) {
        expect(row.photoWidth).toBe(geometry[0].photoWidth);
        expect(row.photoHeight).toBe(row.photoWidth);
        expect(row.gap).toBeGreaterThanOrEqual(12);
        expect(row.priceRight).toBeLessThanOrEqual(row.rowRight+1);
        if(width>650) expect(Math.abs(row.priceRight-row.rowRight)).toBeLessThan(1);
      }
      await expect(panel.locator('button.food-photo-placeholder')).toHaveCount(0);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    }
  }
});
