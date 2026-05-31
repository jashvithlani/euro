import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const URL = "http://127.0.0.1:4173/investor/annual";
const VIEWPORT = { width: 1280, height: 2100 };
const OUT_DIR = path.join(process.cwd(), "qa-screenshots");

const EXPECT = {
  title: "Annual Reports",
  subtitle:
    "Tracing our journey of artisanal growth and fiscal responsibility through detailed archival documentation.",
  integratedTitle: "Integrated Annual Report 2024 - 25",
  priorArchives: "Prior Archives",
  archiveCardCount: 8,
  activeTab: "Annual Reports",
};

async function runPass(page, pass) {
  const results = { pass, checks: [], screenshot: null };

  await page.setViewportSize(VIEWPORT);
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Investor" }).click();
  await page.waitForSelector(".investor-filter-nav");
  await page.getByRole("link", { name: EXPECT.activeTab }).click();
  await page.waitForSelector(".investor-annual");

  const title = await page.locator("#investor-annual-title").textContent();
  results.checks.push({
    name: "page title",
    ok: title?.trim() === EXPECT.title,
    expected: EXPECT.title,
    actual: title?.trim(),
  });

  const subtitle = await page.locator(".investor-annual__header p").innerText();
  const subtitleNorm = subtitle.replace(/\s+/g, " ").trim();
  results.checks.push({
    name: "subtitle copy",
    ok: subtitleNorm === EXPECT.subtitle,
    expected: EXPECT.subtitle,
    actual: subtitleNorm,
  });

  const integrated = await page.locator(".investor-annual__integrated-copy h4").textContent();
  results.checks.push({
    name: "integrated report title",
    ok: integrated?.trim() === EXPECT.integratedTitle,
    expected: EXPECT.integratedTitle,
    actual: integrated?.trim(),
  });

  for (const year of ["2024-25", "2023-24"]) {
    const visible = await page.getByRole("heading", { name: year, level: 3 }).isVisible();
    results.checks.push({ name: `year divider: ${year}`, ok: visible });
  }

  const prior = await page.locator("#annual-prior-archives").textContent();
  results.checks.push({
    name: "prior archives heading",
    ok: prior?.trim() === EXPECT.priorArchives,
    expected: EXPECT.priorArchives,
    actual: prior?.trim(),
  });

  const archiveCards =
    (await page.locator(".investor-annual__archive-card").count()) +
    (await page.locator(".investor-annual__request-card").count());
  results.checks.push({
    name: "archive grid items",
    ok: archiveCards === EXPECT.archiveCardCount,
    expected: EXPECT.archiveCardCount,
    actual: archiveCards,
  });

  const activeTab = await page.locator(".investor-filter-nav__pill.is-active").textContent();
  results.checks.push({
    name: "active filter tab",
    ok: activeTab?.trim() === EXPECT.activeTab,
    expected: EXPECT.activeTab,
    actual: activeTab?.trim(),
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
  const shotPath = path.join(OUT_DIR, `investor-annual-pass-${pass}.png`);
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
  route: "/investor/annual",
  viewport: VIEWPORT,
  allPassed: passes.every((p) => p.ok),
  passes,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(summary.allPassed ? 0 : 1);
