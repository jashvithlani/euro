import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
// Park mouse on the masti pack location (center of arc, ~bottom of hero)
await p.mouse.move(640, 152 + 320);
await p.waitForTimeout(200);
const before = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => Math.round(e.getBoundingClientRect().left)));
await p.waitForTimeout(2500);
const after = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => Math.round(e.getBoundingClientRect().left)));
let maxDrift = 0;
for (let i = 0; i < before.length; i++) maxDrift = Math.max(maxDrift, Math.abs(before[i] - after[i]));
console.log(`Hovering masti pack: 2.5s drift = ${maxDrift}px (paused → ~0)`);
// Move away
await p.mouse.move(0, 800);
await p.waitForTimeout(200);
const b2 = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => Math.round(e.getBoundingClientRect().left)));
await p.waitForTimeout(2000);
const a2 = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => Math.round(e.getBoundingClientRect().left)));
let d2 = 0;
for (let i = 0; i < b2.length; i++) d2 = Math.max(d2, Math.abs(b2[i] - a2[i]));
console.log(`After unhover: 2s drift = ${d2}px (resumed → non-zero)`);
await b.close();
