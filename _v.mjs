import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});

// Beverages — separate orbit class
await p.goto('http://127.0.0.1:5173/beverages?cb=' + Date.now(), { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
await p.evaluate(()=>{
  const r = document.querySelector('.beverages-orbit-ring');
  if (r) { r.style.animation = 'none'; r.style.rotate = '0deg'; }
});
await p.waitForTimeout(300);
let hero = await p.$('.category-hero');
await hero.screenshot({ path:'/tmp/bev-isolated.png' });

// Probe geometric consistency: all packs at same radius from ring center
const radii = await p.evaluate(() => {
  const ring = document.querySelector('.beverages-orbit-ring');
  const r = ring.getBoundingClientRect();
  // ring center in viewport coords
  const cx = r.left + r.width / 2;
  const cs = getComputedStyle(ring);
  // parse --orbit-center-y
  const cyVar = parseFloat(cs.getPropertyValue('--orbit-center-y'));
  const cy = r.top + cyVar;  // -332 means 332 above ring top
  // For each pack, measure center and distance from (cx, cy)
  return [...document.querySelectorAll('.beverages-orbit-pack')].slice(0,5).map(e => {
    const pr = e.getBoundingClientRect();
    const pcx = pr.left + pr.width/2;
    const pcy = pr.top + pr.height/2;
    return {
      slot: +e.style.getPropertyValue('--slot'),
      dist: Math.round(Math.hypot(pcx - cx, pcy - cy)),
    };
  });
});
console.log('beverages — pack distances from ring centre:');
for (const r of radii) console.log(`  slot ${r.slot}: ${r.dist}px (expected ~630)`);

// Verify other 4 pages still work
for (const route of ['/fryums', '/khakhra', '/namkeen', '/farali']) {
  await p.goto('http://127.0.0.1:5173' + route + '?cb=' + Date.now(), { waitUntil:'networkidle' });
  await p.waitForTimeout(1200);
  const stats = await p.evaluate(() => {
    const all = [...document.querySelectorAll('.category-orbit-pack')];
    return { total: all.length, visible: all.filter(e=>parseFloat(getComputedStyle(e).opacity) > 0.5).length };
  });
  console.log(route, JSON.stringify(stats));
}
console.log('ERR:', errs.length?errs.join('|'):'none');
await b.close();
