import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/khakhra', { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
// Don't freeze anything, just sample computed animation-delay and opacity
const info = await p.evaluate(() => {
  return [...document.querySelectorAll('.category-orbit-pack')].map(e => {
    const cs = getComputedStyle(e);
    return {
      slot: +e.style.getPropertyValue('--slot'),
      delay: cs.animationDelay,
      anim: cs.animationName,
      op: cs.opacity,
    };
  }).sort((a,b)=>a.slot-b.slot);
});
for (const i of info) console.log(JSON.stringify(i));
await b.close();
