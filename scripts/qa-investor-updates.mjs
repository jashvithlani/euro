import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const VIEWPORT = { width: 1280, height: 1900 };
const OUT_DIR = path.join(process.cwd(), "qa-screenshots");

const EXPECT = {
  title: "Corporate Updates",
  description:
    "Real-time disclosures and regulatory filings for Euro India Fresh Foods Limited. Precision in every announcement.",
  activeTab: "Updates",
  itemCount: 4,
  firstTitle: "26.07.2025 - Credit Rating",
  ctaHeading: "Want to receive these",
  ctaButton: "Subscribe to News",
};

async function runPass(page, pass) {
  const results = { pass, checks: [], screenshot: null };

  await page.setViewportSize(VIEWPORT);
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Investor" }).click();
  await page.waitForSelector(".investor-filter-nav");
  await page.getByRole("link", { name: EXPECT.activeTab }).click();
  await page.waitForSelector(".investor-updates");

  const title = await page.locator("#investor-updates-title").textContent();
  results.checks.push({
    name: "page title",
    ok: title?.trim() === EXPECT.title,
    expected: EXPECT.title,
    actual: title?.trim(),
  });

  const description = await page.locator(".investor-updates__header p").innerText();
  const descriptionNorm = description.replace(/\s+/g, " ").trim();
  results.checks.push({
    name: "description copy",
    ok: descriptionNorm === EXPECT.description,
    expected: EXPECT.description,
    actual: descriptionNorm,
  });

  const itemCount = await page.locator(".investor-updates-item").count();
  results.checks.push({
    name: "update item count",
    ok: itemCount === EXPECT.itemCount,
    expected: EXPECT.itemCount,
    actual: itemCount,
  });

  const firstTitle = await page.locator(".investor-updates-item__title").first().textContent();
  results.checks.push({
    name: "first update title",
    ok: firstTitle?.trim() === EXPECT.firstTitle,
    expected: EXPECT.firstTitle,
    actual: firstTitle?.trim(),
  });

  const activeYear = await page.locator(".investor-year-tabs__pill.is-active").textContent();
  results.checks.push({
    name: "default FY tab",
    ok: activeYear?.trim() === "2025-26",
    expected: "2025-26",
    actual: activeYear?.trim(),
  });

  const activeTab = await page.locator(".investor-filter-nav__pill.is-active").textContent();
  results.checks.push({
    name: "active filter tab",
    ok: activeTab?.trim() === EXPECT.activeTab,
    expected: EXPECT.activeTab,
    actual: activeTab?.trim(),
  });

  const ctaHeading = await page.locator("#investor-updates-cta-title").textContent();
  results.checks.push({
    name: "cta heading",
    ok: ctaHeading?.includes(EXPECT.ctaHeading),
    expected: EXPECT.ctaHeading,
    actual: ctaHeading?.replace(/\s+/g, " ").trim(),
  });

  const ctaButton = await page.locator(".investor-updates-cta__button").textContent();
  results.checks.push({
    name: "cta button label",
    ok: ctaButton?.trim() === EXPECT.ctaButton,
    expected: EXPECT.ctaButton,
    actual: ctaButton?.trim(),
  });

  const transparencyVisible = await page.locator(".investor-transparency").count();
  results.checks.push({
    name: "transparency hidden",
    ok: transparencyVisible === 0,
    expected: 0,
    actual: transparencyVisible,
  });

  const shell = page.locator(".investor-main");
  const shellBox = await shell.boundingBox();
  results.checks.push({
    name: "canvas width",
    ok: shellBox?.width === 1280,
    expected: 1280,
    actual: shellBox?.width,
  });

  await mkdir(OUT_DIR, { recursive: true });
  const shotPath = path.join(OUT_DIR, `investor-updates-pass-${pass}.png`);
  await page.locator(".investor-main").screenshot({ path: shotPath });
  results.screenshot = shotPath;

  results.ok = results.checks.every((c) => c.ok);
  return results;
}

const passes = [];
for (let i = 1; i <= 3; i += 1) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  passes.push(await runPass(page, i));
  await browser.close();
}

const summary = {
  route: "/investor/updates",
  viewport: VIEWPORT,
  allPassed: passes.every((p) => p.ok),
  passes,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(summary.allPassed ? 0 : 1);
