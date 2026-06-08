import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://127.0.0.1:5173/chips', { waitUntil:'networkidle' });
await p.waitForTimeout(1800);
const hero = await p.$('.category-hero-chips-wide');
// Capture at several time points to see the orbit move
for (const t of [0, 4, 8, 12]) {
  // Force rotation to a specific angle so we sample deterministically
  await p.evaluate((deg)=>{
    const r = document.querySelector('.chips-wide-hero-ring');
    if (r) { r.style.animation = 'none'; r.style.rotate = deg + 'deg'; }
  }, t * 9);  // 9 deg per second at 40s/360°
  await p.waitForTimeout(120);
  await hero.screenshot({ path:`/tmp/spin-${t}.png` });
}
// And confirm hover pause works
await p.evaluate(()=>{
  const r = document.querySelector('.chips-wide-hero-ring');
  if (r) r.style.animation = '';   // restore
});
await p.waitForTimeout(500);
// Just confirm the play-state-paused on hover via computed style
const hovered = await p.evaluate(async () => {
  // Simulate hover via class is hard; check the rule exists
  const sheets = [...document.styleSheets];
  let found = false;
  for (const sh of sheets) {
    try {
      for (const r of [...sh.cssRules]) {
        if (r.selectorText && r.selectorText.includes('.chips-wide-hero-ring:hover')) {
          if (r.style.animationPlayState === 'paused') found = true;
        }
      }
    } catch(e){}
  }
  return found;
});
console.log('hover-pause rule present:', hovered);
console.log('ERR:', errs.length?errs.join('|'):'none');
await b.close();
