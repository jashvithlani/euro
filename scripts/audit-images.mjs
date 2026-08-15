#!/usr/bin/env node
/**
 * Validate the deployable responsive-image manifest and enforce lightweight
 * transfer-size budgets. Source files are intentionally retained as fallbacks;
 * this audit measures the AVIF/WebP files browsers actually select.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_ROOT = path.join(ROOT, "src");
const OUTPUT_ROOT = path.join(ROOT, "public", "image-assets");
const MANIFEST_PATH = path.join(SRC_ROOT, "shared", "image-manifest.json");
const BACKGROUND_CSS_PATH = path.join(SRC_ROOT, "shared", "generated-image-backgrounds.css");
const RASTER_RE = /\.(png|jpe?g)$/i;
const LEGACY_VARIANT_RE = /-\d+w\.(avif|webp)$/i;

const BUDGETS = {
  thumbnail: { warn: 150, fail: 400 },
  card: { warn: 200, fail: 500 },
  content: { warn: 300, fail: 700 },
  hero: { warn: 500, fail: 1200 },
  other: { warn: 300, fail: 700 },
};

function classify(fileName) {
  const name = fileName.toLowerCase();
  if (/(?:favicon|logo-|icon-|avatar|watermark|footer-cert|footer-amazon)/.test(name)) return "thumbnail";
  if (/(?:hero|banner|social-strip|social-feed-header)/.test(name)) return "hero";
  if (/(?:pattern|texture)/.test(name)) return "other";
  if (/(?:^category-|^bestseller-|product|pack)/.test(name)) return "card";
  if (/(?:story-|about-|achievements-|contact-|exports-)/.test(name)) return "content";
  return "other";
}

async function walk(dir, predicate, files = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(fullPath, predicate, files);
    else if (entry.isFile() && predicate(entry.name, fullPath)) files.push(fullPath);
  }
  return files;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "n/a";
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function relativeOutputPath(src) {
  if (typeof src !== "string" || !src.startsWith("/image-assets/")) return null;
  const fileName = src.slice("/image-assets/".length);
  if (!fileName || fileName.includes("/") || fileName.includes("\\")) return null;
  return path.join(OUTPUT_ROOT, fileName);
}

async function validateIntegration() {
  const [component, resolver, backgrounds, main, homeCss, contactCss, achievementsCss] = await Promise.all([
    fs.readFile(path.join(SRC_ROOT, "components", "OptimizedImage.jsx"), "utf8"),
    fs.readFile(path.join(SRC_ROOT, "shared", "responsive-image.js"), "utf8"),
    fs.readFile(BACKGROUND_CSS_PATH, "utf8"),
    fs.readFile(path.join(SRC_ROOT, "main.jsx"), "utf8"),
    fs.readFile(path.join(SRC_ROOT, "pages", "home", "HomePage.css"), "utf8"),
    fs.readFile(path.join(SRC_ROOT, "pages", "contact", "ContactPage.css"), "utf8"),
    fs.readFile(path.join(SRC_ROOT, "pages", "achievements", "AchievementsPage.css"), "utf8"),
  ]);

  const issues = [];
  if (!component.includes('type="image/avif"') || !component.includes('type="image/webp"')) {
    issues.push("OptimizedImage is not rendering both AVIF and WebP sources");
  }
  if (!resolver.includes('import manifest from "./image-manifest.json"')) {
    issues.push("responsive-image.js is not wired to the generated manifest");
  }
  if (!main.includes('import "./shared/generated-image-backgrounds.css"')) {
    issues.push("main.jsx does not import the generated background CSS");
  }
  const backgroundConsumers = [
    [homeCss, "--image-category-pattern"],
    [contactCss, "--image-contact-texture"],
    [achievementsCss, "--image-section-cta-texture"],
  ];
  for (const [css, variable] of backgroundConsumers) {
    if (!css.includes(`var(${variable}`)) issues.push(`site CSS does not consume ${variable}`);
  }
  for (const variable of ["--image-contact-texture", "--image-category-pattern", "--image-section-cta-texture"]) {
    if (!backgrounds.includes(variable)) issues.push(`generated background CSS is missing ${variable}`);
  }
  return issues;
}

async function inspectRawMarkup() {
  const jsxFiles = await walk(SRC_ROOT, (name) => /\.jsx?$/.test(name));
  const rawRasterImages = [];
  for (const file of jsxFiles) {
    const source = await fs.readFile(file, "utf8");
    for (const match of source.matchAll(/<img\b[\s\S]*?>/g)) {
      if (/\.(?:png|jpe?g)\b/i.test(match[0])) rawRasterImages.push(path.relative(ROOT, file));
    }
  }
  return [...new Set(rawRasterImages)].sort();
}

async function main() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  const entries = Object.entries(manifest);
  if (!entries.length) throw new Error("Image manifest contains no sources");

  const sourceFiles = await walk(SRC_ROOT, (name) => RASTER_RE.test(name) && !LEGACY_VARIANT_RE.test(name));
  const sourceNames = sourceFiles.map((file) => path.basename(file)).sort();
  const manifestNames = entries.map(([name]) => name).sort();
  const globalIssues = await validateIntegration();

  if (new Set(sourceNames).size !== sourceNames.length) globalIssues.push("source raster basenames are not unique");
  if (JSON.stringify(sourceNames) !== JSON.stringify(manifestNames)) {
    globalIssues.push("manifest source list does not match the current raster source files");
  }

  const rows = [];
  const expectedOutputs = new Set();
  let variantCount = 0;

  for (const [fileName, entry] of entries.sort(([a], [b]) => a.localeCompare(b))) {
    const issues = [];
    let maxBytes = 0;
    const sourceWidth = Number(entry.w);
    const sourceHeight = Number(entry.h);
    if (!Number.isInteger(sourceWidth) || sourceWidth < 1 || !Number.isInteger(sourceHeight) || sourceHeight < 1) {
      issues.push("invalid source dimensions");
    }

    const widthSets = {};
    for (const format of ["avif", "webp"]) {
      const variants = Array.isArray(entry[format]) ? entry[format] : [];
      widthSets[format] = variants.map((variant) => variant.w);
      if (!variants.length) issues.push(`missing ${format} variants`);

      for (const variant of variants) {
        variantCount += 1;
        const outputPath = relativeOutputPath(variant.src);
        if (!outputPath) {
          issues.push(`invalid ${format} output path`);
          continue;
        }
        expectedOutputs.add(path.basename(outputPath));
        if (!Number.isInteger(variant.w) || variant.w < 1 || variant.w > sourceWidth) {
          issues.push(`${format} ${variant.w}w upscales or is invalid`);
        }

        try {
          const [stat, metadata] = await Promise.all([fs.stat(outputPath), sharp(outputPath).metadata()]);
          maxBytes = Math.max(maxBytes, stat.size);
          const formatMatches = format === "avif"
            ? metadata.format === "heif" || metadata.format === "avif"
            : metadata.format === format;
          if (!formatMatches) issues.push(`${path.basename(outputPath)} has image format ${metadata.format}`);
          if (metadata.width !== variant.w) issues.push(`${path.basename(outputPath)} is ${metadata.width}w, expected ${variant.w}w`);
          if (entry.alpha === true && metadata.hasAlpha !== true) {
            issues.push(`${path.basename(outputPath)} lost source transparency`);
          }
        } catch {
          issues.push(`missing or unreadable ${path.basename(outputPath)}`);
        }
      }
    }

    if (JSON.stringify(widthSets.avif) !== JSON.stringify(widthSets.webp)) {
      issues.push("AVIF and WebP width candidates differ");
    }

    const category = classify(fileName);
    const budget = BUDGETS[category];
    const sizeKb = maxBytes / 1024;
    let status = "PASS";
    let action = "none";
    if (issues.length || sizeKb > budget.fail) {
      status = "FAIL";
      action = issues[0] || "reduce dimensions/quality or document an exception";
    } else if (sizeKb > budget.warn) {
      status = "WARN";
      action = "review visual quality versus transfer size";
    }

    rows.push({ fileName, dimensions: `${sourceWidth}x${sourceHeight}`, category, maxBytes, status, action, issues });
  }

  if (!variantCount) globalIssues.push("manifest contains no responsive variants");
  const outputNames = (await fs.readdir(OUTPUT_ROOT).catch(() => [])).filter((name) => /\.(avif|webp)$/i.test(name));
  const staleOutputs = outputNames.filter((name) => !expectedOutputs.has(name));
  if (staleOutputs.length) globalIssues.push(`${staleOutputs.length} stale generated output(s) are not in the manifest`);

  const nameWidth = Math.min(58, Math.max(16, ...rows.map((row) => row.fileName.length)));
  console.log(`${"file".padEnd(nameWidth)}  ${"dimensions".padEnd(12)}  ${"formats".padEnd(10)}  ${"max".padStart(9)}  ${"category".padEnd(9)}  status  suggested action`);
  console.log("-".repeat(nameWidth + 79));
  for (const row of rows) {
    const name = row.fileName.length > nameWidth ? `${row.fileName.slice(0, nameWidth - 1)}…` : row.fileName;
    console.log(`${name.padEnd(nameWidth)}  ${row.dimensions.padEnd(12)}  ${"AVIF+WebP".padEnd(10)}  ${formatBytes(row.maxBytes).padStart(9)}  ${row.category.padEnd(9)}  ${row.status.padEnd(6)}  ${row.action}`);
  }

  const warned = rows.filter((row) => row.status === "WARN").length;
  const failed = rows.filter((row) => row.status === "FAIL").length;
  const rawRasterImages = await inspectRawMarkup();
  console.log(`\nSources: ${rows.length}; variants: ${variantCount}; PASS: ${rows.length - warned - failed}; WARN: ${warned}; FAIL: ${failed}`);
  console.log(`Generated output: ${formatBytes((await Promise.all(outputNames.map(async (name) => (await fs.stat(path.join(OUTPUT_ROOT, name))).size))).reduce((sum, size) => sum + size, 0))}`);
  console.log(`Raw raster <img> files: ${rawRasterImages.length}${rawRasterImages.length ? ` (${rawRasterImages.join(", ")})` : ""}`);

  if (globalIssues.length) {
    console.error("\nIntegration failures:");
    for (const issue of globalIssues) console.error(`  - ${issue}`);
  }
  for (const row of rows.filter((item) => item.issues.length)) {
    for (const issue of row.issues) console.error(`  - ${row.fileName}: ${issue}`);
  }

  if (globalIssues.length || failed) process.exit(1);
}

main().catch((error) => {
  console.error(`Image audit failed: ${error.message}`);
  process.exit(1);
});
