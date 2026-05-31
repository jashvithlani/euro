import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = "http://127.0.0.1:4173/investor";
const VIEWPORT = { width: 1280, height: 1760 };
const OUT_DIR = path.join(process.cwd(), "qa-screenshots");

const EXPECT = {
  title: "Corporate Policies",
  subtitle:
    "A commitment to transparency, ethical conduct, and the highest standards of culinary integrity across all global operations.",
  groupLabels: ["Financial Year 2021-22", "Corporate Policies"],
  cardCount: 12,
  viewAll: "View All",
  activeTab: "Corporate Policies",
};

async function runPass(page, pass) {
  const results = { pass, checks: [], screenshot: null };

  await page.setViewportSize(VIEWPORT);
  // Relative `base: "./"` assets resolve from /investor/* — enter via /investor then client-navigate.
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Corporate Policies", exact: true }).click();
  await page.waitForURL("**/investor/policies");
  await page.waitForSelector(".investor-policies", { state: "visible" });

  const title = await page.locator("#investor-policies-title").textContent();
  results.checks.push({
    name: "page title",
    ok: title?.trim() === EXPECT.title,
    expected: EXPECT.title,
    actual: title?.trim(),
  });

  const subtitle = await page.locator(".investor-policies-subtitle").innerText();
  const subtitleNorm = subtitle.replace(/\s+/g, " ").trim();
  results.checks.push({
    name: "subtitle copy",
    ok: subtitleNorm === EXPECT.subtitle,
    expected: EXPECT.subtitle,
    actual: subtitleNorm,
  });

  for (const label of EXPECT.groupLabels) {
    const visible = await page.getByRole("heading", { name: label, level: 3 }).isVisible();
    results.checks.push({ name: `group: ${label}`, ok: visible });
  }

  const cardCount = await page.locator(".investor-policy-card").count();
  results.checks.push({
    name: "document cards",
    ok: cardCount === EXPECT.cardCount,
    expected: EXPECT.cardCount,
    actual: cardCount,
  });

  const viewAll = await page.locator(".investor-policies-view-all a").textContent();
  results.checks.push({
    name: "view all link",
    ok: viewAll?.trim() === EXPECT.viewAll,
    expected: EXPECT.viewAll,
    actual: viewAll?.trim(),
  });

  const activeTab = await page.locator(".investor-filter-nav__pill.is-active").textContent();
  results.checks.push({
    name: "active filter tab",
    ok: activeTab?.trim() === EXPECT.activeTab,
    expected: EXPECT.activeTab,
    actual: activeTab?.trim(),
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
  const shotPath = path.join(OUT_DIR, `investor-policies-pass-${pass}.png`);
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
  route: "/investor/policies",
  viewport: VIEWPORT,
  allPassed: passes.every((p) => p.ok),
  passes,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(summary.allPassed ? 0 : 1);
