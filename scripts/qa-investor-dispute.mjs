import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = "http://127.0.0.1:4173/investor";
const VIEWPORT = { width: 1280, height: 1760 };
const OUT_DIR = path.join(process.cwd(), "qa-screenshots");

const EXPECT = {
  title: "Online Dispute Resolution",
  subtitle:
    "Euro India Fresh Foods Limited is committed to maintaining transparency and trust with our stakeholders.",
  integratedTitle: "Online Dispute Resolution",
  integratedCta: "DOWNLOAD REPORT",
  portalTitle: "Smart Online Dispute Resolution Portal",
  portalCta: "Proceed to Portal",
  portalHref: "https://smartodr.in/",
  trustLine: "Trust in Quality.",
  activeTab: "Online Dispute Resolution",
};

async function runPass(page, pass) {
  const results = { pass, checks: [], screenshot: null };

  await page.setViewportSize(VIEWPORT);
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Online Dispute Resolution", exact: true }).click();
  await page.waitForURL("**/investor/dispute");
  await page.waitForSelector(".investor-dispute", { state: "visible" });

  const title = await page.locator("#investor-dispute-title").textContent();
  results.checks.push({
    name: "page title",
    ok: title?.trim() === EXPECT.title,
    expected: EXPECT.title,
    actual: title?.trim(),
  });

  const subtitle = await page.locator(".investor-dispute__subtitle").innerText();
  const subtitleNorm = subtitle.replace(/\s+/g, " ").trim();
  results.checks.push({
    name: "subtitle copy",
    ok: subtitleNorm === EXPECT.subtitle,
    expected: EXPECT.subtitle,
    actual: subtitleNorm,
  });

  const integratedTitle = await page.locator(".investor-dispute__integrated h3").textContent();
  results.checks.push({
    name: "integrated card title",
    ok: integratedTitle?.trim() === EXPECT.integratedTitle,
    expected: EXPECT.integratedTitle,
    actual: integratedTitle?.trim(),
  });

  const integratedCta = await page.locator(".investor-dispute__text-cta span").textContent();
  results.checks.push({
    name: "download cta",
    ok: integratedCta?.trim() === EXPECT.integratedCta,
    expected: EXPECT.integratedCta,
    actual: integratedCta?.trim(),
  });

  const portalTitle = await page.locator(".investor-dispute__portal-title").innerText();
  const portalTitleNorm = portalTitle.replace(/\s+/g, " ").trim();
  results.checks.push({
    name: "portal heading",
    ok: portalTitleNorm === EXPECT.portalTitle,
    expected: EXPECT.portalTitle,
    actual: portalTitleNorm,
  });

  const portalCta = await page.locator(".investor-dispute__portal-cta span").textContent();
  results.checks.push({
    name: "portal cta label",
    ok: portalCta?.trim() === EXPECT.portalCta,
    expected: EXPECT.portalCta,
    actual: portalCta?.trim(),
  });

  const portalHref = await page.locator(".investor-dispute__portal-cta").getAttribute("href");
  results.checks.push({
    name: "portal href",
    ok: portalHref === EXPECT.portalHref,
    expected: EXPECT.portalHref,
    actual: portalHref,
  });

  const trustVisible = await page.getByRole("heading", { name: EXPECT.trustLine }).isVisible();
  results.checks.push({ name: "trust section", ok: trustVisible });

  const trustImg = page.locator(".investor-dispute-trust__visual img");
  const trustNaturalWidth = await trustImg.evaluate((el) => el.naturalWidth);
  results.checks.push({
    name: "trust photo loads",
    ok: trustNaturalWidth > 0,
    expected: "> 0",
    actual: trustNaturalWidth,
  });

  const tagCount = await page.locator(".investor-dispute-trust__tag").count();
  results.checks.push({
    name: "trust tags",
    ok: tagCount === 2,
    expected: 2,
    actual: tagCount,
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
  const shotPath = path.join(OUT_DIR, `investor-dispute-pass-${pass}.png`);
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
  route: "/investor/dispute",
  viewport: VIEWPORT,
  allPassed: passes.every((p) => p.ok),
  passes,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(summary.allPassed ? 0 : 1);
