import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
await p.waitForTimeout(1500);

// Take a snapshot of pack-1 position, hover, wait a long time, snapshot again.
// If rotation paused: position barely changes. If not paused: position drifts.
const before = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => e.getBoundingClientRect().left));
// Hover a visible pack — slot 2 (masti, center of arc)
const masti = p.locator('.chips-wide-pack-masti').first();
await masti.hover();
const t0 = Date.now();
await p.waitForTimeout(2500);
const after = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => e.getBoundingClientRect().left));
const elapsed = Date.now() - t0;

// Compute biggest x-drift across all packs over the 2.5s hover
let maxDrift = 0;
for (let i = 0; i < before.length; i++) {
  maxDrift = Math.max(maxDrift, Math.abs(before[i] - after[i]));
}
console.log(`Hover for ${elapsed}ms — max pack x-drift: ${maxDrift.toFixed(1)}px`);
console.log('(if paused → ~0; if not paused over 2.5s @ 40s/360°: ~tens of pixels)');

// Now unhover and verify motion resumes
await p.locator('body').hover({ position: { x: 1, y: 1 } });
const beforeResume = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => e.getBoundingClientRect().left));
await p.waitForTimeout(2000);
const afterResume = await p.$$eval('.chips-wide-hero-pack', els => els.map(e => e.getBoundingClientRect().left));
let drift2 = 0;
for (let i = 0; i < beforeResume.length; i++) {
  drift2 = Math.max(drift2, Math.abs(beforeResume[i] - afterResume[i]));
}
console.log(`After unhover, 2s drift: ${drift2.toFixed(1)}px (should be non-zero, rotation resumed)`);
await b.close();
