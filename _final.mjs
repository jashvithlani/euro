import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
for (const route of ['/namkeen', '/farali', '/khakhra']) {
  await p.goto('http://127.0.0.1:5173' + route, { waitUntil:'networkidle' });
  await p.waitForTimeout(1500);
  const data = await p.evaluate(() => {
    const all = [...document.querySelectorAll('.category-orbit-pack')];
    const visible = all.filter(e => parseFloat(getComputedStyle(e).opacity) > 0.5).length;
    const sample = all[0];
    return {
      total: all.length,
      visible,
      sampleAnim: getComputedStyle(sample).animationName,
      sampleDelay: getComputedStyle(sample).animationDelay,
    };
  });
  console.log(`${route}:`, JSON.stringify(data));
  // Test hover for popup
  const mousePos = await p.evaluate(() => {
    const v = [...document.querySelectorAll('.category-orbit-pack')].find(e => parseFloat(getComputedStyle(e).opacity) > 0.5);
    if (!v) return null;
    const r = v.getBoundingClientRect();
    return { cx: Math.round(r.left + r.width/2), cy: Math.round(r.top + r.height/2) };
  });
  if (mousePos) {
    await p.mouse.move(mousePos.cx, mousePos.cy);
    await p.waitForTimeout(400);
    const hov = await p.evaluate(({cx,cy}) => {
      const e = document.elementFromPoint(cx, cy);
      if (!e) return 'no element';
      const cs = getComputedStyle(e);
      return { tag: e.tagName, scale: cs.scale, translate: cs.translate, filter: cs.filter.slice(0, 30) };
    }, mousePos);
    console.log(`  hover at pack:`, JSON.stringify(hov));
  }
}
console.log('ERR:', errs.length?errs.join('|'):'none');
await b.close();
