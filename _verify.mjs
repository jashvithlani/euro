import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
await p.waitForTimeout(1800);
for (const [name, sel] of [['chips','.card-chips'],['juice','.card-juice'],['namkeen','.card-namkeen']]) {
  await p.locator(sel).hover();
  await p.waitForTimeout(700);
  const r = await p.locator(sel).evaluate(e => {
    const cs = getComputedStyle(e, '::before');
    const img = e.querySelector('img');
    return {
      beforeContent: cs.content,
      beforeOpacity: cs.opacity,
      imgTranslate: img ? getComputedStyle(img).translate : 'no img',
    };
  });
  console.log(name, JSON.stringify(r));
  await p.locator(sel).screenshot({ path:`/tmp/home-${name}-now.png` });
  await p.locator('body').hover({position:{x:1,y:1}});
  await p.waitForTimeout(200);
}
console.log('ERR:', errs.length?errs.join('|'):'none');
await b.close();
