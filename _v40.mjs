import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
for (const route of ['/fryums', '/khakhra', '/beverages', '/namkeen', '/farali']) {
  await p.goto('http://127.0.0.1:5173' + route + '?cb=' + Date.now(), { waitUntil:'networkidle' });
  await p.waitForTimeout(1500);
  const hero = await p.$('.category-hero');
  for (const deg of [0, 22, 45]) {
    await p.evaluate(d => {
      const r = document.querySelector('.category-orbit-ring');
      if (r) { r.style.animation = 'none'; r.style.rotate = d + 'deg'; }
    }, deg);
    await p.waitForTimeout(250);
    await hero.screenshot({ path: `/tmp/v40-${route.slice(1)}-d${deg}.png` });
  }
  const stats = await p.evaluate(() => {
    const all = [...document.querySelectorAll('.category-orbit-pack')];
    return { total: all.length, visible: all.filter(e => parseFloat(getComputedStyle(e).opacity) > 0.5).length };
  });
  console.log(`${route}:`, JSON.stringify(stats));
}
console.log('ERR:', errs.length?errs.join('|'):'none');
await b.close();
