import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "qa-screenshots");
const BASE = process.env.PREVIEW_URL || "http://127.0.0.1:4191";
const VIEWPORTS = [1280, 1440, 1920];

async function measure(page) {
  return page.evaluate(() => {
    const shell = document.querySelector(".investor-main");
    const list = document.querySelector(".investor-updates__list");
    const firstItem = document.querySelector(".investor-updates-item");
    const itemInner = document.querySelector(".investor-updates-item__inner");
    const dateBox = document.querySelector(".investor-updates-item__date");
    const title = document.querySelector(".investor-updates-item__title");
    const link = document.querySelector(".investor-updates-item__link");
    const appScale = getComputedStyle(document.documentElement)
      .getPropertyValue("--app-scale")
      .trim();

    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        width: Math.round(r.width * 100) / 100,
        height: Math.round(r.height * 100) / 100,
        fontSize: cs.fontSize,
        minHeight: cs.minHeight,
        padding: cs.padding,
      };
    };

    return {
      appScale: appScale || "1",
      viewportWidth: window.innerWidth,
      shell: box(shell),
      list: box(list),
      firstItem: box(firstItem),
      itemInner: box(itemInner),
      dateBox: box(dateBox),
      title: title
        ? {
            fontSize: getComputedStyle(title).fontSize,
            lineHeight: getComputedStyle(title).lineHeight,
          }
        : null,
      link: box(link),
      hasUpdates: Boolean(document.querySelector(".investor-updates")),
      bodyText: document.body.innerText.slice(0, 200),
    };
  });
}

const labelArg = process.argv[2] || "before";
const labelSuffix = labelArg === "after" ? "after" : "before";

async function capture(browser, viewportWidth, label) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: viewportWidth, height: 1400 });
  await page.goto(`${BASE}/investor/updates`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".investor-updates__list", { timeout: 15000 });
  await page.waitForTimeout(500);

  const dims = await measure(page);
  const fileLabel = viewportWidth === 1280 ? labelSuffix : `${labelSuffix}-${viewportWidth}`;
  const shotPath = path.join(OUT_DIR, `updates-list-scale-${fileLabel}.png`);
  await page.locator(".investor-updates__list").screenshot({ path: shotPath });

  await page.close();
  return { viewportWidth, label: fileLabel, shotPath, dims };
}

await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch();

const results = [];
for (const w of VIEWPORTS) {
  results.push(await capture(browser, w, labelSuffix));
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
