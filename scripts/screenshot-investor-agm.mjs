import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "..", "qa-screenshots");
const outputPath = path.join(outputDir, "investor-agm-1280.png");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:9876";

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// base: "./" requires loading from site root before client-side routing
await page.goto(`${origin}/`, { waitUntil: "networkidle" });
await page.getByRole("link", { name: "Investor", exact: true }).click();
await page.getByRole("link", { name: "AGM/EGM" }).click();

await page.waitForSelector("#investor-agm-title");
const title = await page.locator("#investor-agm-title").textContent();
if (title?.trim() !== "AGM/EGM") {
  throw new Error(`Expected AGM/EGM page, got title: ${title}`);
}

await page.screenshot({ path: outputPath, fullPage: true });
await browser.close();

console.log(`Saved ${outputPath}`);
