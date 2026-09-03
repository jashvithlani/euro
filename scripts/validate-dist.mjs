#!/usr/bin/env node
/**
 * Browser smoke test for a running production preview.
 *
 * Start `npm run preview -- --port 4173`, then run `npm run validate:dist`.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.DIST_URL || "http://127.0.0.1:4173";
const screenshotDir = process.env.VALIDATION_SCREENSHOT_DIR;
const categoryPriorityCounts = new Map([
  ["/chips", 5],
  ["/beverages", 5],
  ["/getmore", 3],
  ["/namkeen", 5],
  ["/chikki", 5],
  ["/khakhra", 5],
  ["/bakery", 5],
  ["/fryums", 5],
  ["/farali", 5],
]);
const routePairs = [
  ...categoryPriorityCounts.keys(),
  "/exports",
  "/about",
  "/achievements",
  "/contact",
  "/investor",
];
const cases = [
  { route: "/", width: 375, height: 812 },
  { route: "/", width: 768, height: 1024 },
  { route: "/", width: 1366, height: 900 },
  { route: "/", width: 1920, height: 1080 },
  ...routePairs.flatMap((route) => [
    { route, width: 375, height: 812 },
    { route, width: 1366, height: 900 },
  ]),
];

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

const browser = await chromium.launch({ headless: true });
const results = [];
let failures = 0;

try {
  if (screenshotDir) await fs.mkdir(screenshotDir, { recursive: true });

  for (const testCase of cases) {
    const context = await browser.newContext({
      viewport: { width: testCase.width, height: testCase.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const imageResponses = [];
    const requestFailures = [];
    const pageErrors = [];

    page.on("response", (response) => {
      if (response.request().resourceType() === "image") {
        imageResponses.push({ url: response.url(), status: response.status() });
      }
    });
    page.on("requestfailed", (request) => {
      if (request.resourceType() === "image") {
        requestFailures.push(`${request.url()}: ${request.failure()?.errorText || "failed"}`);
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto(`${baseUrl}${testCase.route}`, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForTimeout(250);

    const dom = await page.evaluate(() => {
      const pictures = [...document.querySelectorAll("picture")];
      const pictureImages = pictures.map((picture) => picture.querySelector("img")).filter(Boolean);
      const high = [...document.images].filter((image) => image.fetchPriority === "high");
      const broken = [...document.images].filter((image) => image.currentSrc && image.complete && image.naturalWidth === 0);
      const resources = performance.getEntriesByType("resource")
        .filter((entry) => /\/image-assets\/.*\.(?:avif|webp)(?:\?|$)/.test(entry.name));
      const responsive = [...document.querySelectorAll(".category-product-img--responsive, .category-feature-img--responsive")];
      const srcSetUrls = (source) => source
        ? source.srcset.split(",").map((candidate) => new URL(candidate.trim().split(/\s+/)[0], document.baseURI).href)
        : [];
      return {
        pictures: pictures.length,
        modernSelected: pictureImages.filter((image) => /\/image-assets\/.*\.avif(?:\?|$)/.test(image.currentSrc)).length,
        fallbackSelected: pictureImages.filter((image) => image.currentSrc && !image.currentSrc.startsWith("data:image/") && !/\/image-assets\//.test(image.currentSrc)).length,
        missingDimensions: pictureImages.filter((image) => !image.hasAttribute("width") || !image.hasAttribute("height")).length,
        highPriority: high.length,
        highPrioritySource: high[0]?.currentSrc || "",
        lazyImages: [...document.images].filter((image) => image.loading === "lazy").length,
        brokenImages: broken.length,
        responsiveSources: responsive.map((image) => ({
          current: image.currentSrc,
          mobile: srcSetUrls(image.parentElement.querySelector('source[media*="max-width: 767px"][type="image/avif"], source[media*="max-width: 999px"][type="image/avif"]')),
          desktop: srcSetUrls(image.parentElement.querySelector('source[media*="min-width: 1000px"][type="image/avif"], source:not([media])[type="image/avif"]')),
        })),
        transferredModernBytes: resources.reduce((sum, entry) => sum + entry.transferSize, 0),
      };
    });

    const responseCounts = new Map();
    for (const response of imageResponses) responseCounts.set(response.url, (responseCounts.get(response.url) || 0) + 1);
    const duplicateResponses = [...responseCounts.entries()].filter(([, count]) => count > 1);
    const duplicates = duplicateResponses.length;
    const httpErrors = imageResponses.filter((response) => response.status >= 400);
    const artDirectionInvalid = testCase.route === "/beverages" && dom.responsiveSources.some((sources) => {
      if (!sources.current) return false;
      const expected = testCase.width <= 999 ? sources.mobile : sources.desktop;
      return !expected.includes(sources.current);
    });

    const issues = [];
    if (!dom.pictures) issues.push("no <picture> elements");
    if (!dom.modernSelected) issues.push("no AVIF selected");
    if (dom.fallbackSelected) issues.push(`${dom.fallbackSelected} picture fallback(s) selected`);
    if (dom.missingDimensions) issues.push(`${dom.missingDimensions} picture image(s) lack dimensions`);
    const expectedHighPriority = testCase.route === "/exports"
      ? 0
      : categoryPriorityCounts.has(testCase.route)
        ? categoryPriorityCounts.get(testCase.route)
        : 1;
    if (dom.highPriority !== expectedHighPriority) issues.push(`expected ${expectedHighPriority} high-priority image${expectedHighPriority === 1 ? "" : "s"}, found ${dom.highPriority}`);
    if (dom.brokenImages) issues.push(`${dom.brokenImages} broken image(s)`);
    if (duplicates) {
      const duplicateNames = duplicateResponses
        .map(([url, count]) => `${new URL(url).pathname.split("/").pop()} ×${count}`)
        .join(", ");
      issues.push(`${duplicates} duplicate image response(s): ${duplicateNames}`);
    }
    if (httpErrors.length) issues.push(`${httpErrors.length} image HTTP error(s)`);
    if (requestFailures.length) issues.push(`${requestFailures.length} failed request(s)`);
    if (pageErrors.length) issues.push(`${pageErrors.length} page error(s)`);
    if (artDirectionInvalid) issues.push("beverage mobile/desktop art direction selected the wrong source");
    failures += issues.length ? 1 : 0;

    if (screenshotDir) {
      const routeName = testCase.route === "/" ? "home" : testCase.route.slice(1).replaceAll("/", "-");
      await page.screenshot({ path: path.join(screenshotDir, `${routeName}-${testCase.width}.png`), fullPage: false });
    }

    results.push({
      viewport: `${testCase.width}x${testCase.height}`,
      route: testCase.route,
      pictures: dom.pictures,
      avif: dom.modernSelected,
      imageRequests: imageResponses.length,
      modernTransfer: formatKb(dom.transferredModernBytes),
      lazy: dom.lazyImages,
      priority: dom.highPriority,
      status: issues.length ? `FAIL: ${issues.join("; ")}` : "PASS",
    });
    await context.close();
  }
} finally {
  await browser.close();
}

console.table(results);
if (failures) {
  console.error(`Production browser validation failed in ${failures} case(s).`);
  process.exit(1);
}
console.log(`Production browser validation passed for ${results.length} route/viewport cases.`);
