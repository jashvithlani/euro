import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
await p.evaluate(()=>{
  const r = document.querySelector('.chips-wide-hero-ring');
  if (r) r.style.animationPlayState = 'paused';
});
await p.waitForTimeout(800);
const info = await p.$$eval('.chips-wide-hero-pack', els => els.slice(0,3).map(e=>{
  const cs = getComputedStyle(e);
  return {
    slot: e.style.getPropertyValue('--slot'),
    cls: e.className,
    top: cs.top,
    left: cs.left,
    width: cs.width,
    height: cs.height,
    transform: cs.transform.slice(0, 120),
  };
}));
for (const x of info) console.log(JSON.stringify(x, null, 2));
await b.close();
