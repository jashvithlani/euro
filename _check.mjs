import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});

for (const route of ['/beverages', '/fryums', '/khakhra']) {
  await p.goto('http://127.0.0.1:5173' + route + '?cb=' + Date.now(), { waitUntil:'networkidle' });
  await p.waitForTimeout(1500);
  const hero = await p.$('.category-hero');
  // Snapshot at 4 evenly-spaced rotation angles to spot any gap
  for (const deg of [0, 22, 45, 68]) {
    await p.evaluate(d => {
      const r = document.querySelector('.category-orbit-ring');
      if (r) { r.style.animation = 'none'; r.style.rotate = d + 'deg'; }
    }, deg);
    await p.waitForTimeout(250);
    await hero.screenshot({ path: `/tmp/gap-${route.slice(1)}-d${deg}.png` });
  }
  // Get visible count + their slot indexes at each angle
  for (const deg of [0, 22, 45]) {
    await p.evaluate(d => {
      const r = document.querySelector('.category-orbit-ring');
      if (r) { r.style.animation = 'none'; r.style.rotate = d + 'deg'; }
    }, deg);
    await p.waitForTimeout(200);
    const vis = await p.$$eval('.category-orbit-pack', els =>
      els.filter(e => parseFloat(getComputedStyle(e).opacity) > 0.5)
         .map(e => +e.style.getPropertyValue('--slot'))
         .sort((a,b)=>a-b)
    );
    console.log(`${route} @ ${deg}deg → visible slots:`, vis);
  }
}
console.log('ERR:', errs.length?errs.join('|'):'none');
await b.close();
