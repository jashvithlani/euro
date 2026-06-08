import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
await p.goto('http://127.0.0.1:5173/khakhra', { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
const hero = await p.$('.category-hero');
// Capture at three points
for (const t of [0, 8, 16, 24]) {
  await p.evaluate(d => {
    const r = document.querySelector('.category-orbit-ring');
    if (r) { r.style.animation = 'none'; r.style.rotate = d + 'deg'; }
  }, t * 4.5); // ~4.5deg per second at 80s/360
  await p.waitForTimeout(300);
  await hero.screenshot({ path:`/tmp/kh-t${t}.png` });
}
// Check what's behind the orbit pack on hover
await p.evaluate(()=>{
  document.querySelector('.category-orbit-ring').style.animation = 'none';
  document.querySelector('.category-orbit-ring').style.rotate = '0deg';
});
await p.waitForTimeout(300);
// Hover one of the visible packs
const packEl = await p.$('.khakhra-pack-fafda');
if (packEl) {
  await packEl.hover({ force: true });
  await p.waitForTimeout(700);
  await hero.screenshot({ path:'/tmp/kh-hover.png' });
  // Read what classes the hovered pack has
  const cls = await packEl.evaluate(e => e.className);
  console.log('hovered pack class:', cls);
  // Does any ::after or ::before pseudo render on it?
  const ps = await packEl.evaluate(e => {
    return {
      after: getComputedStyle(e, '::after').content,
      afterBg: getComputedStyle(e, '::after').backgroundColor,
      afterOp: getComputedStyle(e, '::after').opacity,
      before: getComputedStyle(e, '::before').content,
      beforeBg: getComputedStyle(e, '::before').backgroundColor,
      beforeOp: getComputedStyle(e, '::before').opacity,
    };
  });
  console.log('pseudos:', JSON.stringify(ps, null, 2));
}
await b.close();
