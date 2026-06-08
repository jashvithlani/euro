import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
// Freeze ring at rotation 0
await p.evaluate(() => {
  const r = document.querySelector('.chips-wide-hero-ring');
  if (r) { r.style.animation = 'none'; r.style.rotate = '0deg'; }
  // Also freeze all pack opacity animations so we can read the values
  // for the current pack positions at this exact moment.
});
await p.waitForTimeout(700);
const hero = await p.$('.category-hero-chips-wide');
await hero.screenshot({ path:'/tmp/perpack-fade-0.png' });
const ops = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => ({
  slot: +e.style.getPropertyValue('--slot'),
  op: +parseFloat(getComputedStyle(e).opacity).toFixed(3),
})));
console.log('At rotation 0°:');
for (const o of ops.sort((a,b)=>a.slot-b.slot)) console.log(`  slot ${String(o.slot).padStart(2)}: opacity ${o.op}`);
await b.close();
