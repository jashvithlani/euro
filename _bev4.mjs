import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/beverages?cb=' + Date.now(), { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
await p.evaluate(()=>{
  const r = document.querySelector('.category-orbit-ring');
  if (r) { r.style.animation = 'none'; r.style.rotate = '0deg'; }
});
await p.waitForTimeout(300);
const hero = await p.$('.category-hero');
await hero.screenshot({ path:'/tmp/bev-final.png' });
await b.close();
