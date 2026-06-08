import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
await p.evaluate(() => {
  const r = document.querySelector('.chips-wide-hero-ring');
  if (r) { r.style.animation = 'none'; r.style.rotate = '0deg'; }
  // Pause every pack's opacity animation so we read deterministic values
  for (const e of document.querySelectorAll('.chips-wide-hero-pack')) {
    e.style.animationPlayState = 'paused';
  }
});
await p.waitForTimeout(400);
const ops = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => ({
  slot: +e.style.getPropertyValue('--slot'),
  op: +parseFloat(getComputedStyle(e).opacity).toFixed(2),
})));
for (const o of ops.sort((a,b)=>a.slot-b.slot)) console.log(`slot ${String(o.slot).padStart(2)}: opacity ${o.op}`);
const hero = await p.$('.category-hero-chips-wide');
await hero.screenshot({ path:'/tmp/perpack-fade.png' });
await b.close();
