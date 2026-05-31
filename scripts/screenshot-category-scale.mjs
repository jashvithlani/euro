import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "..", "qa-screenshots", "category-scale");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:9876";

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();

async function captureCategory(route, filename) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".category-main");
  await page.screenshot({ path: path.join(outputDir, filename), fullPage: true });
  await page.close();
}

const routes = [
  ["/chips", "chips-1280.png"],
  ["/beverages", "beverages-1280.png"],
  ["/getmore", "getmore-1280.png"],
  ["/farali", "farali-1280.png"],
  ["/namkeen", "namkeen-1280.png"],
  ["/chikki", "chikki-1280.png"],
  ["/khakhra", "khakhra-1280.png"],
  ["/bakery", "bakery-1280.png"],
  ["/fryums", "fryums-1280.png"],
];

for (const [route, filename] of routes) {
  await captureCategory(route, filename);
}

await browser.close();

console.log(`Saved screenshots to ${outputDir}`);
