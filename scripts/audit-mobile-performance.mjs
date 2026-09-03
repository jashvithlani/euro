#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const PUBLIC = path.join(ROOT, "public");
const MANIFEST_PATH = path.join(ROOT, "src", "shared", "image-manifest.json");
const SITE_BOOTSTRAP_PATH = path.join(ROOT, "src", "site-bootstrap.js");

const BUDGETS = {
  initialJsGzipKb: 120,
  initialCssGzipKb: 25,
  mobileHeroAvifKb: 100,
  flavorSceneAvifKb: 80,
  mobilePatternAvifKb: 70,
};

function publicFile(src) {
  return path.join(PUBLIC, src.replace(/^\//, ""));
}

function pickWidth(entry, targetWidth, format = "avif") {
  return entry?.[format]?.find(({ w }) => w >= targetWidth) || entry?.[format]?.at(-1);
}

async function fileKb(file) {
  return (await fs.stat(file)).size / 1024;
}

async function gzipKb(file) {
  return gzipSync(await fs.readFile(file)).length / 1024;
}

async function main() {
  const [html, manifest, siteBootstrap] = await Promise.all([
    fs.readFile(path.join(DIST, "index.html"), "utf8"),
    fs.readFile(MANIFEST_PATH, "utf8").then(JSON.parse),
    fs.readFile(SITE_BOOTSTRAP_PATH, "utf8"),
  ]);

  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]);
  const styles = [...html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"/g)].map((match) => match[1]);
  const initialJsGzipKb = (await Promise.all(scripts.map((src) => gzipKb(path.join(DIST, src))))).reduce((sum, size) => sum + size, 0);
  const initialCssGzipKb = (await Promise.all(styles.map((src) => gzipKb(path.join(DIST, src))))).reduce((sum, size) => sum + size, 0);

  const hero = pickWidth(manifest["hero-products.png"], 768);
  const mobilePattern = pickWidth(manifest["category-pattern.png"], 320);
  const flavorTargets = [
    ["category-chips-wide-hero-onion.png", 640],
    ["category-getmore-tomato.png", 480],
    ["category-namkeen-royal-peanuts.png", 480],
    ["category-beverage-fig-mango.png", 320],
  ];
  const flavorVariants = flavorTargets.map(([name, width]) => ({ name, variant: pickWidth(manifest[name], width) }));

  const heroKb = await fileKb(publicFile(hero.src));
  const mobilePatternKb = await fileKb(publicFile(mobilePattern.src));
  const flavorRows = await Promise.all(
    flavorVariants.map(async ({ name, variant }) => ({ name, width: variant.w, kb: await fileKb(publicFile(variant.src)) })),
  );

  const failures = [];
  if (!html.includes("euro-site-bootstrap-v1")) failures.push("first-visit bootstrap gate is missing");
  if (!siteBootstrap.includes("startSiteBootstrap")) failures.push("site bootstrap runner is missing");
  if (html.includes("euro-route-loader-active") || html.includes("euro-page-loader")) {
    failures.push("legacy per-route loader is still present");
  }
  for (const [name] of flavorTargets) {
    if (!siteBootstrap.includes(`"${name}"`)) failures.push(`bootstrap image metadata is missing for ${name}`);
  }
  if (initialJsGzipKb > BUDGETS.initialJsGzipKb) failures.push(`initial JS is ${initialJsGzipKb.toFixed(1)}KB gzip`);
  if (initialCssGzipKb > BUDGETS.initialCssGzipKb) failures.push(`initial CSS is ${initialCssGzipKb.toFixed(1)}KB gzip`);
  if (heroKb > BUDGETS.mobileHeroAvifKb) failures.push(`mobile hero candidate is ${heroKb.toFixed(1)}KB`);
  if (mobilePatternKb > BUDGETS.mobilePatternAvifKb) failures.push(`mobile pattern candidate is ${mobilePatternKb.toFixed(1)}KB`);
  for (const row of flavorRows) {
    if (row.kb > BUDGETS.flavorSceneAvifKb) failures.push(`${row.name} ${row.width}w is ${row.kb.toFixed(1)}KB`);
  }

  console.log(`Initial JS: ${initialJsGzipKb.toFixed(1)}KB gzip (budget ${BUDGETS.initialJsGzipKb}KB)`);
  console.log(`Initial CSS: ${initialCssGzipKb.toFixed(1)}KB gzip (budget ${BUDGETS.initialCssGzipKb}KB)`);
  console.log(`Mobile hero: ${hero.w}w, ${heroKb.toFixed(1)}KB AVIF (budget ${BUDGETS.mobileHeroAvifKb}KB)`);
  console.log(`Mobile pattern: ${mobilePattern.w}w, ${mobilePatternKb.toFixed(1)}KB AVIF (budget ${BUDGETS.mobilePatternAvifKb}KB)`);
  for (const row of flavorRows) console.log(`Flavor scene: ${row.name}, ${row.width}w, ${row.kb.toFixed(1)}KB AVIF`);

  if (failures.length) {
    for (const failure of failures) console.error(`FAIL: ${failure}`);
    process.exit(1);
  }

  console.log("Mobile performance budgets: PASS");
}

main().catch((error) => {
  console.error(`Mobile performance audit failed: ${error.message}`);
  process.exit(1);
});
