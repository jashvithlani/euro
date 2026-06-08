import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
// Pin the ring rotation momentarily, then move mouse onto the masti pack
// at its now-known position, then unpin and confirm it stays paused.
const pos = await p.evaluate(() => {
  // Pause via a marker class so we can sample without movement
  const r = document.querySelector('.chips-wide-hero-ring');
  r.style.animationPlayState = 'paused';
  const m = document.querySelector('.chips-wide-pack-masti');
  const rect = m.getBoundingClientRect();
  return { cx: Math.round(rect.left + rect.width/2), cy: Math.round(rect.top + rect.height/2) };
});
await p.mouse.move(pos.cx, pos.cy);
await p.waitForTimeout(100);
// Resume animation (clear inline override). The :has(:hover) CSS rule
// should now keep it paused because cursor is on the pack.
await p.evaluate(() => {
  document.querySelector('.chips-wide-hero-ring').style.animationPlayState = '';
});
await p.waitForTimeout(200);
const before = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => Math.round(e.getBoundingClientRect().left)));
await p.waitForTimeout(2500);
const after = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => Math.round(e.getBoundingClientRect().left)));
let drift = 0;
for (let i=0; i<before.length; i++) drift = Math.max(drift, Math.abs(before[i]-after[i]));
console.log(`Hover on actual masti location: 2.5s drift = ${drift}px (paused → ~0)`);
// Move mouse away
await p.mouse.move(10, 800);
await p.waitForTimeout(200);
const b2 = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => Math.round(e.getBoundingClientRect().left)));
await p.waitForTimeout(2000);
const a2 = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => Math.round(e.getBoundingClientRect().left)));
let d2 = 0;
for (let i=0; i<b2.length; i++) d2 = Math.max(d2, Math.abs(b2[i]-a2[i]));
console.log(`After unhover: 2s drift = ${d2}px (resumed → non-zero)`);
await b.close();
