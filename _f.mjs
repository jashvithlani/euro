import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
// Freeze at a few angles
const hero = await p.$('.category-hero-chips-wide');
for (const deg of [0, 9, 18]) {
  await p.evaluate(d => {
    const r = document.querySelector('.chips-wide-hero-ring');
    if (r) { r.style.animation = 'none'; r.style.rotate = d + 'deg'; }
  }, deg);
  await p.waitForTimeout(300);
  await hero.screenshot({ path:`/tmp/fade-${deg}.png` });
}
await b.close();
