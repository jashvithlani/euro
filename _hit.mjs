import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
// What's at (640, 472)?
const el = await p.evaluate(() => {
  const e = document.elementFromPoint(640, 472);
  return e ? { tag: e.tagName, cls: e.className, pe: getComputedStyle(e).pointerEvents } : null;
});
console.log('at (640, 472):', JSON.stringify(el));
// Try at slot 2 center where the pack actually is
const where = await p.evaluate(() => {
  const m = document.querySelectorAll('.chips-wide-pack-masti')[0];
  const r = m.getBoundingClientRect();
  return { cx: Math.round(r.left + r.width/2), cy: Math.round(r.top + r.height/2), pe: getComputedStyle(m).pointerEvents };
});
console.log('masti at:', JSON.stringify(where));
const elAt = await p.evaluate(({cx,cy}) => {
  const e = document.elementFromPoint(cx, cy);
  return e ? { tag: e.tagName, cls: e.className, pe: getComputedStyle(e).pointerEvents } : null;
}, where);
console.log(`elementFromPoint(${where.cx}, ${where.cy}):`, JSON.stringify(elAt));
await b.close();
