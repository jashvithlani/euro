import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
await p.waitForTimeout(800);
const info = await p.evaluate(() => {
  const el = document.querySelectorAll('.chips-wide-hero-pack')[10];
  const cs = getComputedStyle(el);
  return {
    slot: el.style.getPropertyValue('--slot'),
    animationName: cs.animationName,
    animationDuration: cs.animationDuration,
    animationDelay: cs.animationDelay,
    animationIterationCount: cs.animationIterationCount,
    opacity: cs.opacity,
  };
});
console.log(JSON.stringify(info, null, 2));
await b.close();
