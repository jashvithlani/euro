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
await hero.screenshot({ path:'/tmp/arc-v2.png' });
const n = await p.$$eval('.chips-wide-hero-pack', els => els.length);
const heroR = await hero.boundingBox();
const pos = await p.$$eval('.chips-wide-hero-pack', (els, heroY) => els.slice(0, 6).map(e => {
  const r = e.getBoundingClientRect();
  return { slot: +e.style.getPropertyValue('--slot'), cx: Math.round(r.left + r.width/2), cyHero: Math.round(r.top + r.height/2 - heroY) };
}), heroR.y);
console.log('total packs:', n);
console.log('first 6 in-hero positions:'); pos.forEach(p => console.log(' ', p));
console.log('\nORIGINAL targets:');
console.log(' slot 0 (salted): cx=249  cy=135');
console.log(' slot 1 (tomato): cx=425  cy=238');
console.log(' slot 2 (masti):  cx=634  cy=270');
console.log(' slot 3 (onion):  cx=861  cy=239');
console.log(' slot 4 (chilli): cx=1055 cy=141');
await b.close();
