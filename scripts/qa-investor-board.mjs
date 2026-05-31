import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const PAGE_URL = process.env.QA_URL || "http://127.0.0.1:5176/investor/board";
const OUT_DIR = fileURLToPath(new URL("../qa-screenshots/", import.meta.url));
const SCREENSHOT_PATH = join(OUT_DIR, "investor-board-1280.png");

const checks = [];

function record(name, pass, detail = "") {
  checks.push({ name, pass, detail });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 2800 } });

  await page.goto(PAGE_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  await page.screenshot({ path: SCREENSHOT_PATH, fullPage: true });

  const title = await page.locator("#investor-board-title").textContent();
  record("Board title", title?.trim() === "Composition of Board", title ?? "");

  const activeTab = await page.locator(".investor-filter-nav__pill.is-active").textContent();
  record(
    "Active filter tab",
    activeTab?.includes("Composition of Board"),
    activeTab ?? "",
  );

  const memberCount = await page.locator(".investor-board-member").count();
  record("Board member cards", memberCount === 3, `count=${memberCount}`);

  const committeeCount = await page.locator(".investor-board-committee").count();
  record("Committee sections", committeeCount === 3, `count=${committeeCount}`);

  const tableRows = await page.locator(".investor-board-table__row").count();
  record("Committee table rows", tableRows === 9, `count=${tableRows}`);

  const mainWidth = await page.locator(".investor-main").evaluate((el) => el.getBoundingClientRect().width);
  record("Canvas width 1280px", Math.round(mainWidth) === 1280, `width=${mainWidth}`);

  const heroVisible = await page.locator(".investor-hero").isVisible();
  record("Shared hero visible", heroVisible);

  const transparencyVisible = await page.locator(".investor-transparency").isVisible();
  record("Transparency section visible", transparencyVisible);

  await browser.close();

  const passed = checks.filter((c) => c.pass).length;
  const failed = checks.filter((c) => !c.pass);

  console.log(JSON.stringify({ url: PAGE_URL, passed, total: checks.length, checks, failed }, null, 2));
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
