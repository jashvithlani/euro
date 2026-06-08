import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
for (const route of ['/fryums', '/khakhra', '/beverages']) {
  await p.goto('http://127.0.0.1:5173' + route + '?cb=' + Date.now(), { waitUntil:'networkidle' });
  await p.waitForTimeout(1500);
  const hero = await p.$('.category-hero');
  for (const deg of [0, 22, 45, 68]) {
    await p.evaluate(d => {
      const r = document.querySelector('.category-orbit-ring');
      if (r) { r.style.animation = 'none'; r.style.rotate = d + 'deg'; }
    }, deg);
    await p.waitForTimeout(250);
    await hero.screenshot({ path: `/tmp/gap2-${route.slice(1)}-d${deg}.png` });
    const vis = await p.$$eval('.category-orbit-pack', els =>
      els.filter(e => parseFloat(getComputedStyle(e).opacity) > 0.5).map(e => +e.style.getPropertyValue('--slot')).sort((a,b)=>a-b)
    );
    console.log(`${route} @ ${deg}deg → visible slots:`, vis);
  }
}
await b.close();
