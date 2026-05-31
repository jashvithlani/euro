import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const phase = process.argv[2] === "after" ? "after" : "before";
const outputDir = path.join(__dirname, "..", "qa-screenshots", "category-hero", phase);
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:5173";

const slugs = [
  "chips",
  "beverages",
  "getmore",
  "farali",
  "namkeen",
  "chikki",
  "khakhra",
  "bakery",
  "fryums",
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();

for (const slug of slugs) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${origin}/${slug}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".category-hero");
  const hero = page.locator(".category-hero").first();
  await hero.screenshot({ path: path.join(outputDir, `${slug}.png`) });
  await page.close();
}

await browser.close();
console.log(`Saved ${phase} hero screenshots to ${outputDir}`);
