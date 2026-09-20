import {test,expect} from '@playwright/test';

test('first visit intro exits and records the session',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'AUTHENTIC RAMEN & SUSHI.'})).toBeVisible();
 await expect(page.locator('.intro')).toHaveCount(0,{timeout:6000});
 expect(await page.evaluate(()=>sessionStorage.getItem('zen-intro-v2'))).toBe('1');
 expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
 await page.reload();await expect(page.locator('.intro')).toHaveCount(0);
});
test('reduced motion and JavaScript failure keep the page readable',async({browser})=>{
 for(const options of [{reducedMotion:'reduce' as const},{javaScriptEnabled:false}]){const c=await browser.newContext(options);const p=await c.newPage();await p.goto('http://127.0.0.1:3001/');await expect(p.locator('h1')).toBeVisible();await expect(p.locator('.intro')).toHaveCount(0);expect(await p.locator('body').evaluate(el=>getComputedStyle(el).overflow)).not.toBe('hidden');await c.close();}
});
test('menu links, prices, keyboard tabs and browser history',async({page})=>{
 await page.goto('/menu/#lunch');await expect(page.getByRole('tab',{name:'Lunch'})).toHaveAttribute('aria-selected','true');
 const lunch=page.getByRole('tabpanel',{name:'Lunch'});await expect(lunch.getByText('Lunch Roll — 2 Rolls')).toBeVisible();
 await expect(lunch.locator('.food-item').filter({hasText:'Lunch Roll — 2 Rolls'})).toContainText('$10.99');
 await expect(lunch.locator('.food-item').filter({hasText:'Lunch Roll — 2 Rolls'})).toContainText('$11.43');
 await page.getByRole('tab',{name:'Happy Hour'}).click();await expect(page.getByRole('tabpanel',{name:'Happy Hour'}).getByText('$6.49').first()).toBeVisible();
 await page.goBack();await expect(page.getByRole('tab',{name:'Lunch'})).toHaveAttribute('aria-selected','true');
 await page.getByRole('tab',{name:'Lunch'}).focus();await page.keyboard.press('ArrowLeft');await expect(page.getByRole('tab',{name:'Dinner'})).toHaveAttribute('aria-selected','true');
 await expect(page.getByRole('tabpanel',{name:'Dinner'}).locator('.food-item').filter({hasText:'Miso Soup'}).first()).toContainText('$4.13');
});
test('mobile navigation, delivery menu and Escape',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('button',{name:'ORDER DELIVERY/PICKUP'}).click();
 await expect(page.getByText('Coming soon')).toBeVisible();await expect(page.getByRole('link',{name:'TOAST ONLINE'})).toHaveAttribute('href',/toasttab/);
 await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'ORDER DELIVERY/PICKUP'})).toHaveAttribute('aria-expanded','false');
 await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Open navigation'})).toHaveAttribute('aria-expanded','false');
});
test('gallery dialog keyboard controls and focus restoration',async({page})=>{
 await page.goto('/gallery/');const first=page.getByRole('button',{name:/Enlarge:/}).first();await first.click();
 await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('ArrowRight');await expect(page.locator('.lightbox-controls')).toContainText('2 / 9');
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();await expect(first).toBeFocused();
});
test('map loads on request and directions remain available',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('iframe')).toHaveCount(0);
 await page.getByRole('button',{name:'EXPLORE GOOGLE MAPS'}).click();await expect(page.locator('iframe')).toHaveAttribute('src',/150.*36th/);
 await expect(page.getByRole('link',{name:'GET DIRECTIONS'})).toHaveAttribute('href',/destination=Zen/);
});
test('inquiry validates before preparing a mailto message',async({page})=>{
 await page.goto('/events-catering/');await page.getByRole('button',{name:'OPEN EMAIL APP'}).click();await expect(page.locator('#inquiry-name')).toBeFocused();await expect(page.locator('.field-error')).toHaveCount(8);
 await page.getByLabel('Full name').fill('Test Guest');await page.getByLabel('Email address').fill('test@example.com');await page.getByLabel('Phone number').fill('+1 212 555 0123');
 await page.getByLabel('Event type').selectOption('Corporate lunch');await page.getByLabel('Event date').fill('2020-01-01');await page.getByLabel('Event time').fill('13:00');await page.getByLabel('Number of guests').fill('12');await page.getByLabel('Service',{exact:false}).selectOption('Catering');
 await page.getByRole('button',{name:'OPEN EMAIL APP'}).click();await expect(page.locator('#error-date')).toBeVisible();
 await page.getByLabel('Event date').fill('2030-12-10');await page.getByRole('button',{name:'OPEN EMAIL APP'}).click();await expect(page.getByText('Your inquiry is ready.')).toBeVisible();
 await expect(page.locator('.form-feedback')).toContainText('has not been sent');await page.getByText('View your inquiry').click();await expect(page.locator('.form-feedback pre')).toContainText('Guests: 12');
});
test('responsive routes load without broken images or overflow',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [360,768,1440]){await page.setViewportSize({width,height:950});for(const route of ['/','/menu/','/about/','/events-catering/','/gallery/','/privacy-policy/','/terms-conditions/']){const response=await page.goto(route);expect(response?.status(),route).toBe(200);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),`${width}px ${route}`).toBe(true);await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(150);const broken=await page.locator('img').evaluateAll(imgs=>(imgs as HTMLImageElement[]).filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src));expect(broken).toEqual([]);}}
});

