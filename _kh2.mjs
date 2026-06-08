import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/khakhra', { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
// Sample at rotation 0, 90, 180 to see if duplicates appear in different positions
for (const deg of [0, 90, 180]) {
  await p.evaluate(d => {
    const r = document.querySelector('.category-orbit-ring');
    if (r) { r.style.animation = 'none'; r.style.rotate = d + 'deg'; }
  }, deg);
  await p.waitForTimeout(300);
  // Find packs that are currently in the visible arc (opacity > 0.5)
  const visible = await p.$$eval('.category-orbit-pack', els =>
    els.filter(e => +parseFloat(getComputedStyle(e).opacity).toFixed(2) > 0.5)
       .map(e => ({
         slot: +e.style.getPropertyValue('--slot'),
         cls: e.className.split(' ').filter(c => c.startsWith('khakhra-pack-'))[0],
       }))
       .sort((a,b)=>a.slot-b.slot)
  );
  console.log(`rotation ${deg}deg → visible:`, visible);
}
await b.close();
