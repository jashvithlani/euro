import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
for (const route of ['/namkeen', '/farali', '/khakhra']) {
  await p.goto('http://127.0.0.1:5173' + route, { waitUntil:'networkidle' });
  await p.waitForTimeout(1500);
  // Freeze ring at rotation 0 for deterministic snapshot
  await p.evaluate(()=>{
    const r = document.querySelector('.category-orbit-ring');
    if (r) { r.style.animation = 'none'; r.style.rotate = '0deg'; }
    for (const e of document.querySelectorAll('.category-orbit-pack')) {
      e.style.animationPlayState = 'paused';
    }
  });
  await p.waitForTimeout(500);
  const hero = await p.$('.category-hero');
  await hero.screenshot({ path: `/tmp/orbit-${route.slice(1)}.png` });
  const n = await p.$$eval('.category-orbit-pack', els => els.length);
  const visible = await p.$$eval('.category-orbit-pack', els =>
    els.filter(e => +parseFloat(getComputedStyle(e).opacity).toFixed(2) > 0.05).length);
  console.log(`${route}: ${n} packs, ${visible} visible (opacity > 0.05)`);
}
console.log('ERR:', errs.length?errs.join('|'):'none');
await b.close();
