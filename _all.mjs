import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
for (const route of ['/beverages', '/fryums', '/khakhra', '/namkeen', '/farali']) {
  await p.goto('http://127.0.0.1:5173' + route + '?cb=' + Date.now(), { waitUntil:'networkidle' });
  await p.waitForTimeout(1200);
  await p.evaluate(()=>{
    const r = document.querySelector('.category-orbit-ring');
    if (r) { r.style.animation = 'none'; r.style.rotate = '0deg'; }
  });
  await p.waitForTimeout(300);
  const stats = await p.evaluate(() => {
    const all = [...document.querySelectorAll('.category-orbit-pack')];
    return { total: all.length, visible: all.filter(e=>parseFloat(getComputedStyle(e).opacity) > 0.5).length };
  });
  console.log(route, JSON.stringify(stats));
  const hero = await p.$('.category-hero');
  await hero.screenshot({ path: `/tmp/final-${route.slice(1)}.png` });
}
console.log('ERR:', errs.length?errs.join('|'):'none');
await b.close();
