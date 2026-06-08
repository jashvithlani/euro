import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1366,height:900}, deviceScaleFactor: 2 });
await p.goto('http://127.0.0.1:5173/beverages?cb=' + Date.now(), { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
await p.evaluate(()=>{
  const r = document.querySelector('.category-orbit-ring');
  if (r) { r.style.animation = 'none'; r.style.rotate = '0deg'; }
});
await p.waitForTimeout(300);
const hero = await p.$('.category-hero');
const hr = await hero.boundingBox();
console.log('hero box:', JSON.stringify(hr));
await hero.screenshot({ path:'/tmp/bev-compare.png' });
// Inspect bottle widths
const sizes = await p.$$eval('.beverages-hero-pack', els => els.slice(0,6).map(e => {
  const r = e.getBoundingClientRect();
  return { slot: +e.style.getPropertyValue('--slot'), w: Math.round(r.width), h: Math.round(r.height), opacity: +parseFloat(getComputedStyle(e).opacity).toFixed(2) };
}));
console.log('bottle rects:', JSON.stringify(sizes, null, 2));
await b.close();
