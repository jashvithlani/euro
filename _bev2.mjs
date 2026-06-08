import { chromium } from 'playwright';
const b = await chromium.launch({});
const p = await b.newPage({ viewport:{width:1366,height:900} });
await p.goto('http://127.0.0.1:5173/beverages?cb=' + Date.now(), { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
await p.evaluate(()=>{
  const r = document.querySelector('.category-orbit-ring');
  if (r) { r.style.animation = 'none'; r.style.rotate = '0deg'; }
});
await p.waitForTimeout(300);
const hero = await p.$('.category-hero');
await hero.screenshot({ path:'/tmp/bev-figma.png' });
const stats = await p.evaluate(() => {
  const all = [...document.querySelectorAll('.category-orbit-pack')];
  return {
    total: all.length,
    visible: all.filter(e=>parseFloat(getComputedStyle(e).opacity)>0.5).length,
    sample: all[0] && { w: all[0].getBoundingClientRect().width.toFixed(0), h: all[0].getBoundingClientRect().height.toFixed(0) },
  };
});
console.log('stats:', JSON.stringify(stats));
await b.close();
