#!/usr/bin/env node
/**
 * Reorganize public/assets: per-page folders + assets/common for site-wide files.
 * Run from repo root: node scripts/reorganize-assets.mjs
 *
 * Layout:
 *   common/     logos, favicons, footer, support icons (Header/Footer)
 *   home/       HomePage-only
 *   about/      AboutPage-only
 *   investor/   InvestorPage-only
 *   category/   CategoryPage-only
 *   contact/    ContactPage-only
 *   career/     CareerPage-only
 *   dealers/    DealersPage-only
 *   exports/    ExportsPage images (icons live in common/)
 *   achievements/
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(root, "public", "assets");

const COMMON_FILES = new Set([
  "logo-main.png",
  "logo-footer.png",
  "favicon-32.png",
  "favicon-64.png",
  "apple-touch-icon.png",
  "footer-amazon.png",
  "footer-cert-fssai.png",
  "footer-cert-apeda.png",
  "footer-cert-ghp.png",
  "footer-cert-gmp.png",
  "footer-cert-haccp.png",
  "footer-cert-iso-22000.png",
  "footer-cert-member.png",
  "exports-icon-arrow.svg",
  "exports-icon-location.svg",
  "exports-icon-mail.svg",
  "exports-icon-phone.svg",
]);

const HOME_ONLY = new Set([
  "category-chips.png",
  "category-juices.png",
  "category-namkeen.png",
  "category-bundle.png",
  "category-pattern.png",
  "hero-products.png",
  "bestseller-masala.png",
  "bestseller-tomato.png",
  "bestseller-guava.png",
  "bestseller-raw-mango.png",
  "story-photo.png",
  "social-feed-header-figma.png",
  "arrow-prev.svg",
  "arrow-next.svg",
  "story-arrow.svg",
  "hero-explore-icon.svg",
  "icon-veg.svg",
  "icon-test.svg",
  "icon-hygiene.svg",
  "icon-quality.svg",
]);

const ABOUT_ONLY = new Set(["social-cards.png"]);

function getDestFolder(filename) {
  if (COMMON_FILES.has(filename)) {
    return "common";
  }

  if (HOME_ONLY.has(filename)) {
    return "home";
  }

  if (ABOUT_ONLY.has(filename)) {
    return "about";
  }

  if (filename.startsWith("about-")) {
    return "about";
  }

  if (filename.startsWith("investor-")) {
    return "investor";
  }

  if (filename.startsWith("category-")) {
    return "category";
  }

  if (filename.startsWith("contact-")) {
    return "contact";
  }

  if (filename.startsWith("career-")) {
    return "career";
  }

  if (filename.startsWith("dealers-")) {
    return "dealers";
  }

  if (filename.startsWith("exports-")) {
    return "exports";
  }

  if (filename.startsWith("achievements-")) {
    return "achievements";
  }

  return null;
}

function listRootFiles() {
  if (!fs.existsSync(assetsDir)) {
    return [];
  }

  return fs.readdirSync(assetsDir).filter((name) => {
    const full = path.join(assetsDir, name);
    return fs.statSync(full).isFile();
  });
}

function walkSourceFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") {
        continue;
      }
      walkSourceFiles(full, out);
    } else if (/\.(jsx|js|css|html|mjs)$/.test(entry.name) && !entry.name.includes("reorganize-assets")) {
      out.push(full);
    }
  }

  return out;
}

const mappings = [];

for (const filename of listRootFiles()) {
  const folder = getDestFolder(filename);
  if (folder === null) {
    console.warn(`Skip (unknown): ${filename}`);
    continue;
  }

  const destDir = path.join(assetsDir, folder);
  fs.mkdirSync(destDir, { recursive: true });

  const from = path.join(assetsDir, filename);
  const to = path.join(destDir, filename);

  if (fs.existsSync(to)) {
    console.warn(`Skip (exists): ${to}`);
    continue;
  }

  fs.renameSync(from, to);

  const oldPath = `assets/${filename}`;
  const newPath = folder === "common" ? `assets/common/${filename}` : `assets/${folder}/${filename}`;
  mappings.push({ oldPath, newPath });
}

mappings.sort((a, b) => b.oldPath.length - a.oldPath.length);

const sourceFiles = [
  ...walkSourceFiles(path.join(root, "src")),
  path.join(root, "public", "styles.css"),
  path.join(root, "index.html"),
];

for (const file of sourceFiles) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  for (const { oldPath, newPath } of mappings) {
    const variants = [oldPath, `/${oldPath}`];

    for (const variant of variants) {
      if (!content.includes(variant)) {
        continue;
      }

      const replacement = variant.startsWith("/") ? `/${newPath}` : newPath;
      content = content.split(variant).join(replacement);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated: ${path.relative(root, file)}`);
  }
}

console.log(`\nMoved ${mappings.length} file(s) from assets root.`);
if (mappings.length === 0) {
  console.log("Root is clean — folders:", fs.readdirSync(assetsDir).join(", "));
}
