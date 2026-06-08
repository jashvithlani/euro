import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
await p.evaluate(()=>{
  const r = document.querySelector('.chips-wide-hero-ring');
  if (r) r.style.animationPlayState = 'paused';
});
await p.waitForTimeout(800);
const hero = await p.$('.category-hero-chips-wide');
await hero.screenshot({ path:'/tmp/ring-fit.png' });
const positions = await p.$$eval('.chips-wide-hero-pack', els => els.map(e=>{
  const r = e.getBoundingClientRect();
  return { slot: e.style.getPropertyValue('--slot'), cx: Math.round(r.left + r.width/2), cy: Math.round(r.top + r.height/2) };
}));
for (const p of positions) console.log(p);
await b.close();
