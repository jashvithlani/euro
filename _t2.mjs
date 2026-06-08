import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
await p.evaluate(()=>{
  const r = document.querySelector('.chips-wide-hero-ring');
  if (r) { r.style.animation = 'none'; r.style.rotate = '0deg'; }
});
await p.waitForTimeout(500);
const hero = await p.$('.category-hero-chips-wide');
await hero.screenshot({ path:'/tmp/arc-0.png' });
await p.evaluate(()=>{ document.querySelector('.chips-wide-hero-ring').style.rotate = '36deg'; });
await p.waitForTimeout(300);
await hero.screenshot({ path:'/tmp/arc-36.png' });
await b.close();
