import {chromium,expect} from '@playwright/test';
// Requires a local production preview with the temporary Tonkotsu fixture described
// in docs/reviews/menu-item-photos/README.md. Never commit the fixture.
const browser=await chromium.launch();
try {
const page=await browser.newPage({reducedMotion:'reduce'});
for(const width of [390,1440]){
 await page.setViewportSize({width,height:950});
 await page.goto('http://127.0.0.1:3001/menu/#dinner--ramen-noodles');
 const trigger=page.locator('[data-menu-item="dinner-13-2"] button');
 await trigger.scrollIntoViewIfNeeded();
 await expect(trigger.locator('img')).toBeVisible();
 await expect.poll(()=>trigger.locator('img').evaluate(i=>i.naturalWidth)).toBeGreaterThan(0);
 await trigger.focus();await page.keyboard.press('Enter');
 const dialog=page.getByRole('dialog');
 await expect(dialog).toBeVisible();
 await expect(dialog).toHaveAccessibleName('Tonkotsu');
 await expect(dialog.locator('img')).toHaveAttribute('src','/images/menu/dinner-13-2.webp');
 await expect(page.locator('body')).toHaveCSS('overflow','hidden');
 await expect(dialog.locator('img')).toHaveCSS('object-fit','contain');
 await page.keyboard.press('Tab');
 await expect(dialog.getByRole('button',{name:'Close enlarged photo'})).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(dialog).not.toBeVisible();await expect(trigger).toBeFocused();
 expect(await page.locator('body').evaluate(el=>el.style.overflow)).toBe('');
 await trigger.click();await dialog.getByRole('button',{name:'Close enlarged photo'}).click();
 await expect(dialog).not.toBeVisible();await expect(trigger).toBeFocused();
 await trigger.click();await page.mouse.click(2,2);await expect(dialog).not.toBeVisible();
 console.log(`${width}px: photo discovered, keyboard/click open, full image, focus trap, Escape/button/backdrop close and focus restoration passed`);
}
// If a configured file cannot be served, return to a noninteractive placeholder.
const failurePage=await browser.newPage({reducedMotion:'reduce'});
await failurePage.route('**/images/menu/dinner-13-2.webp',route=>route.abort());
await failurePage.goto('http://127.0.0.1:3001/menu/#dinner--ramen-noodles');
const row=failurePage.locator('[data-menu-item="dinner-13-2"]');await row.scrollIntoViewIfNeeded();
await expect(row.locator('.food-photo-placeholder')).toBeVisible();
await expect(row.locator('button')).toHaveCount(0);
console.log('Broken image safely becomes the blank placeholder');
} finally {
 await browser.close();
}

