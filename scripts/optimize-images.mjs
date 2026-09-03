#!/usr/bin/env node
/**
 * Generate deployable responsive images for the static Vite build.
 *
 * Outputs are content-hashed files under public/image-assets, so Vite copies
 * them directly into dist/image-assets without importing thousands of asset
 * modules into the browser bundle. Source images stay in their src asset directories and
 * remain the legacy-browser fallback emitted by Vite.
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_ROOT = path.join(ROOT, "src");
const OUTPUT_ROOT = path.join(ROOT, "public", "image-assets");
const MANIFEST_PATH = path.join(SRC_ROOT, "shared", "image-manifest.json");
const BACKGROUND_CSS_PATH = path.join(SRC_ROOT, "shared", "generated-image-backgrounds.css");

const force = process.argv.includes("--force");
const clean = process.argv.includes("--clean");
const RASTER_RE = /\.(png|jpe?g)$/i;
const LEGACY_VARIANT_RE = /-\d+w\.(avif|webp)$/i;
const AVIF_QUALITY = 52;
const WEBP_QUALITY = 80;
const PIPELINE_VERSION = 3;

const BACKGROUND_VARIABLES = {
  "contact-texture.png": "--image-contact-texture",
  "category-pattern.png": "--image-category-pattern",
  "section-cta-texture.png": "--image-section-cta-texture",
};

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

function imagePlan(fileName, sourceWidth) {
  const name = fileName.toLowerCase();
  let candidates;
  let maximum;

  if (/(?:favicon|logo-|icon-|avatar|watermark)/.test(name)) {
    candidates = [64, 96, 120, 160, 240];
    maximum = 240;
  } else if (/(?:footer-cert|footer-amazon|incuse)/.test(name)) {
    candidates = [96, 120, 160, 240, 320];
    maximum = 320;
  } else if (/(?:contact-social-card)/.test(name)) {
    candidates = [240, 320, 480, 640];
    maximum = 640;
  } else if (/(?:pattern|texture|hero-bg|hero-shape|figma-wave)/.test(name)) {
    candidates = [320, 512, 768, 1200, 1440];
    maximum = 1440;
  } else if (/(?:about-family)/.test(name)) {
    candidates = [480, 768, 960, 1200, 1536, 1920, 2560];
    maximum = 2560;
  } else if (/(?:board-members-source)/.test(name)) {
    candidates = [768, 960, 1200, 1600, 2000];
    maximum = 2000;
  } else if (/(?:^category-|^bestseller-|mobile)/.test(name)) {
    candidates = [240, 320, 480, 640, 768, 960];
    maximum = 960;
  } else if (/(?:hero|social-strip|social-feed-header)/.test(name)) {
    candidates = [480, 768, 960, 1200, 1440];
    maximum = 1440;
  } else {
    candidates = [320, 480, 768, 960, 1200];
    maximum = 1200;
  }

  const cap = Math.max(1, Math.min(sourceWidth, maximum));
  const widths = candidates.filter((width) => width <= cap);
  if (!widths.length) widths.push(cap);
  else if (cap - widths.at(-1) >= 64) widths.push(cap);
  return [...new Set(widths)].sort((a, b) => a - b);
}

function safeBaseName(fileName) {
  return path.basename(fileName, path.extname(fileName))
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "image";
}

function contentHash(source, widths) {
  return crypto
    .createHash("sha256")
    .update(source)
    .update(JSON.stringify({ PIPELINE_VERSION, widths, AVIF_QUALITY, WEBP_QUALITY }))
    .digest("hex")
    .slice(0, 12);
}

async function generateVariant(sourcePath, width, format, outputPath) {
  const pipeline = sharp(sourcePath, { failOn: "error" })
    .rotate()
    .resize({ width, withoutEnlargement: true });

  if (format === "avif") {
    await pipeline.avif({ quality: AVIF_QUALITY, chromaSubsampling: "4:2:0", effort: 5 }).toFile(outputPath);
  } else {
    await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(outputPath);
  }
}

async function removeLegacyVariants() {
  const legacy = await walk(SRC_ROOT, (name) => LEGACY_VARIANT_RE.test(name));
  await Promise.all(legacy.map((file) => fs.unlink(file)));
  if (legacy.length) console.log(`Removed ${legacy.length} legacy in-source variants.`);
}

async function buildBackgroundCss(manifest) {
  const variables = [];
  const mobileVariables = [];
  for (const [fileName, variable] of Object.entries(BACKGROUND_VARIABLES)) {
    const entry = manifest[fileName];
    if (!entry) throw new Error(`Background image is missing from the manifest: ${fileName}`);
    const mobileTargetWidth = fileName === "category-pattern.png" ? 320 : 512;
    const avif = entry.avif.at(-1)?.src;
    const webp = entry.webp.at(-1)?.src;
    const mobileAvif = entry.avif.filter(({ w }) => w <= mobileTargetWidth).at(-1)?.src || entry.avif[0]?.src;
    const mobileWebp = entry.webp.filter(({ w }) => w <= mobileTargetWidth).at(-1)?.src || entry.webp[0]?.src;
    if (!avif || !webp) throw new Error(`Background image has incomplete variants: ${fileName}`);
    if (!mobileAvif || !mobileWebp) throw new Error(`Background image has incomplete mobile variants: ${fileName}`);
    variables.push(`    ${variable}: image-set(url("${avif}") type("image/avif"), url("${webp}") type("image/webp"));`);
    mobileVariables.push(`      ${variable}: image-set(url("${mobileAvif}") type("image/avif"), url("${mobileWebp}") type("image/webp"));`);
  }

  return `/* Generated by scripts/optimize-images.mjs. Do not edit. */\n@supports (background-image: image-set(url("data:image/avif;base64,AAAA") type("image/avif"))) {\n  :root {\n${variables.join("\n")}\n  }\n\n  @media (max-width: 999px) {\n    :root {\n${mobileVariables.join("\n")}\n    }\n  }\n}\n`;
}

async function cleanAll() {
  await fs.rm(OUTPUT_ROOT, { recursive: true, force: true });
  await fs.rm(MANIFEST_PATH, { force: true });
  await fs.rm(BACKGROUND_CSS_PATH, { force: true });
  await removeLegacyVariants();
  console.log("Removed generated image assets, manifest, CSS, and legacy variants.");
}

async function main() {
  if (clean) return cleanAll();

  await removeLegacyVariants();
  const sources = await walk(SRC_ROOT, (name) => RASTER_RE.test(name) && !LEGACY_VARIANT_RE.test(name));
  const basenames = new Map();
  for (const sourcePath of sources) {
    const fileName = path.basename(sourcePath);
    if (basenames.has(fileName)) {
      throw new Error(`Duplicate raster basename "${fileName}":\n  ${basenames.get(fileName)}\n  ${sourcePath}`);
    }
    basenames.set(fileName, sourcePath);
  }

  await fs.mkdir(OUTPUT_ROOT, { recursive: true });
  const manifest = {};
  const expectedOutputs = new Set();
  let generated = 0;

  for (const sourcePath of sources.sort()) {
    const fileName = path.basename(sourcePath);
    const metadata = await sharp(sourcePath, { failOn: "error" }).metadata();
    const oriented = metadata.autoOrient || metadata;
    const sourceWidth = oriented.width || metadata.width;
    const sourceHeight = oriented.height || metadata.height;
    if (!sourceWidth || !sourceHeight) throw new Error(`Could not read image dimensions: ${sourcePath}`);

    const widths = imagePlan(fileName, sourceWidth);
    const source = await fs.readFile(sourcePath);
    const hash = contentHash(source, widths);
    const base = safeBaseName(fileName);
    const variants = { avif: [], webp: [] };

    for (const width of widths) {
      for (const format of ["avif", "webp"]) {
        const outputName = `${base}-${width}w-${hash}.${format}`;
        const outputPath = path.join(OUTPUT_ROOT, outputName);
        expectedOutputs.add(outputName);
        if (force || !(await fs.stat(outputPath).catch(() => null))) {
          await generateVariant(sourcePath, width, format, outputPath);
          generated += 1;
        }
        variants[format].push({ w: width, src: `/image-assets/${outputName}` });
      }
    }

    manifest[fileName] = {
      w: sourceWidth,
      h: sourceHeight,
      alpha: metadata.hasAlpha === true,
      avif: variants.avif,
      webp: variants.webp,
    };
  }

  const oldOutputs = await fs.readdir(OUTPUT_ROOT).catch(() => []);
  const staleOutputs = oldOutputs.filter((name) => !expectedOutputs.has(name));
  await Promise.all(staleOutputs.map((name) => fs.unlink(path.join(OUTPUT_ROOT, name))));

  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest)}\n`);
  await fs.writeFile(BACKGROUND_CSS_PATH, await buildBackgroundCss(manifest));

  console.log(`Optimized ${sources.length} sources into ${expectedOutputs.size} deployable variants.`);
  console.log(`Generated ${generated}; removed ${staleOutputs.length} stale files.`);
  console.log(`Output: ${path.relative(ROOT, OUTPUT_ROOT)}`);
}

main().catch((error) => {
  console.error(`Image optimization failed: ${error.message}`);
  process.exit(1);
});
