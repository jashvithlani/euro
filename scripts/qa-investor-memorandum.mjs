import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = "http://127.0.0.1:4173/investor";
const VIEWPORT = { width: 1280, height: 1760 };
const OUT_DIR = path.join(process.cwd(), "qa-screenshots");

const EXPECT = {
  titleLines: ["Memorandum of Association and", "Articles of Association"],
  lead:
    "Euro India Fresh Foods Limited is committed to maintaining transparency and trust with our stakeholders.",
  cardTitle: "Constitutional Documents",
  cardCopy:
    "A unified PDF containing the Memorandum and Articles of Association as amended from time to time.",
  downloadLabel: "MoA & AoA (Full Version)",
  fileSize: "4.2 MB",
  lastUpdated: "OCT 2023",
  complianceId: "EIF-GOV-042",
  activeTab: "Memorandum of Association",
};

async function runPass(page, pass) {
  const results = { pass, checks: [], screenshot: null };

  await page.setViewportSize(VIEWPORT);
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Memorandum of Association", exact: true }).click();
  await page.waitForURL("**/investor/memorandum");
  await page.waitForSelector(".investor-memorandum", { state: "visible" });

  const titleText = await page.locator("#investor-memorandum-title").innerText();
  const titleNorm = titleText.replace(/\s+/g, " ").trim();
  const expectedTitle = EXPECT.titleLines.join(" ");
  results.checks.push({
    name: "page title",
    ok: titleNorm === expectedTitle,
    expected: expectedTitle,
    actual: titleNorm,
  });

  const lead = await page.locator(".investor-memorandum__lead").innerText();
  const leadNorm = lead.replace(/\s+/g, " ").trim();
  results.checks.push({
    name: "lead copy",
    ok: leadNorm === EXPECT.lead,
    expected: EXPECT.lead,
    actual: leadNorm,
  });

  const cardTitle = await page.locator(".investor-memorandum__card-title").textContent();
  results.checks.push({
    name: "card title",
    ok: cardTitle?.trim() === EXPECT.cardTitle,
    expected: EXPECT.cardTitle,
    actual: cardTitle?.trim(),
  });

  const cardCopy = await page.locator(".investor-memorandum__card-copy").innerText();
  const cardCopyNorm = cardCopy.replace(/\s+/g, " ").trim();
  results.checks.push({
    name: "card copy",
    ok: cardCopyNorm === EXPECT.cardCopy,
    expected: EXPECT.cardCopy,
    actual: cardCopyNorm,
  });

  const downloadLabel = await page.locator(".investor-memorandum__download-main span").textContent();
  results.checks.push({
    name: "download label",
    ok: downloadLabel?.trim() === EXPECT.downloadLabel,
    expected: EXPECT.downloadLabel,
    actual: downloadLabel?.trim(),
  });

  const fileSize = await page.locator(".investor-memorandum__download-meta span").first().textContent();
  results.checks.push({
    name: "file size",
    ok: fileSize?.trim() === EXPECT.fileSize,
    expected: EXPECT.fileSize,
    actual: fileSize?.trim(),
  });

  const metaValues = await page.locator(".investor-memorandum__meta-value").allTextContents();
  results.checks.push({
    name: "last updated meta",
    ok: metaValues[0]?.trim() === EXPECT.lastUpdated,
    expected: EXPECT.lastUpdated,
    actual: metaValues[0]?.trim(),
  });
  results.checks.push({
    name: "compliance id meta",
    ok: metaValues[1]?.trim() === EXPECT.complianceId,
    expected: EXPECT.complianceId,
    actual: metaValues[1]?.trim(),
  });

  const activeTab = await page.locator(".investor-filter-nav__pill.is-active").textContent();
  results.checks.push({
    name: "active filter tab",
    ok: activeTab?.trim() === EXPECT.activeTab,
    expected: EXPECT.activeTab,
    actual: activeTab?.trim(),
  });

  const transparencyVisible = await page.locator(".investor-transparency").isVisible();
  results.checks.push({
    name: "transparency hidden",
    ok: !transparencyVisible,
    expected: false,
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
  const screenshotPath = path.join(OUT_DIR, `investor-memorandum-pass-${pass}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  results.screenshot = screenshotPath;

  return results;
}

const passes = [];
for (let pass = 1; pass <= 3; pass += 1) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  passes.push(await runPass(page, pass));
  await browser.close();
}

let failed = 0;
for (const result of passes) {
  console.log(`\n=== Pass ${result.pass} ===`);
  for (const check of result.checks) {
    const status = check.ok ? "OK" : "FAIL";
    if (!check.ok) failed += 1;
    console.log(`[${status}] ${check.name}`);
    if (!check.ok && check.expected !== undefined) {
      console.log(`  expected: ${JSON.stringify(check.expected)}`);
      console.log(`  actual:   ${JSON.stringify(check.actual)}`);
    }
  }
  console.log(`screenshot: ${result.screenshot}`);
}

if (failed > 0) {
  console.error(`\n${failed} check(s) failed across 3 passes`);
  process.exit(1);
}

console.log("\nAll memorandum QA checks passed (3 passes).");
