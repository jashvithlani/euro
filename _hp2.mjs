import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
// Direct mouse move to where masti was — center of hero, near bottom
await p.mouse.move(640, 152 + 320);
await p.waitForTimeout(200);
// Sample positions, wait, sample again — if paused, no change
const before = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => Math.round(e.getBoundingClientRect().left)));
await p.waitForTimeout(2500);
const after = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => Math.round(e.getBoundingClientRect().left)));
let maxDrift = 0;
for (let i = 0; i < before.length; i++) maxDrift = Math.max(maxDrift, Math.abs(before[i] - after[i]));
console.log(`While hovering: max drift over 2.5s = ${maxDrift}px (expect ~0 if paused)`);

// Move mouse away
await p.mouse.move(0, 800);
await p.waitForTimeout(200);
const before2 = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => Math.round(e.getBoundingClientRect().left)));
await p.waitForTimeout(2000);
const after2 = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => Math.round(e.getBoundingClientRect().left)));
let drift2 = 0;
for (let i = 0; i < before2.length; i++) drift2 = Math.max(drift2, Math.abs(before2[i] - after2[i]));
console.log(`After unhover: drift over 2s = ${drift2}px (expect non-zero, motion resumed)`);
await b.close();
