import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
await p.waitForTimeout(1800);
const hero = await p.$('.category-hero-chips-wide');
await hero.screenshot({ path:'/tmp/ring-t0.png' });
const n = await p.$$eval('.chips-wide-hero-pack', els => els.length);
console.log('packs in DOM:', n);
const positions = await p.$$eval('.chips-wide-hero-pack', els => els.map((e,i)=>{
  const r = e.getBoundingClientRect();
  return { i, slot: e.style.getPropertyValue('--slot'), x: Math.round(r.left), y: Math.round(r.top) };
}));
console.log('positions:', JSON.stringify(positions, null, 2));
await p.waitForTimeout(5000);
await hero.screenshot({ path:'/tmp/ring-t5.png' });
console.log('ERR:', errs.length?errs.join('|'):'none');
await b.close();
