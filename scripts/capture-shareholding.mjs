import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../tmp/shareholding-qa");

const baseUrl = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const targetPath = "/investor/shareholding";

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 2000 } });
  // Load from site root so relative asset URLs resolve; then client-navigate.
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.locator('a[href="/investor"]').first().click();
  await page.waitForSelector(".investor-filter-nav");
  await page.locator('.investor-filter-nav__pill.is-active, .investor-filter-nav__pill').filter({ hasText: "Shareholding Pattern" }).click();
  await page.waitForSelector(".investor-shareholding", { state: "visible", timeout: 15000 });
  const main = page.locator(".investor-main");
  await main.screenshot({ path: path.join(outDir, "app-investor-main.png") });
  await page.screenshot({ path: path.join(outDir, "app-full-page.png"), fullPage: true });
  await browser.close();
  console.log(`Saved screenshots to ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
