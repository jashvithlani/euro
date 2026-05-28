#!/usr/bin/env node
/**
 * Colocate pages: src/pages/<name>/{Page.jsx, Page.css, assets/}
 * Moves public/assets/<name> -> src/pages/<name>/assets
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagesDir = path.join(root, "src", "pages");
const publicAssets = path.join(root, "public", "assets");

const PAGES = [
  { key: "home", jsx: "HomePage.jsx", css: null },
  { key: "about", jsx: "AboutPage.jsx", css: null },
  { key: "investor", jsx: "InvestorPage.jsx", css: "InvestorPage.css" },
  { key: "category", jsx: "CategoryPage.jsx", css: "CategoryPage.css" },
  { key: "contact", jsx: "ContactPage.jsx", css: "ContactPage.css" },
  { key: "career", jsx: "CareerPage.jsx", css: null },
  { key: "dealers", jsx: "DealersPage.jsx", css: "DealersPage.css" },
  { key: "exports", jsx: "ExportsPage.jsx", css: null },
  { key: "achievements", jsx: "AchievementsPage.jsx", css: "AchievementsPage.css" },
];

const assetHelper = `/** Resolve a file in this page's ./assets/ folder. */
export function asset(fileName) {
  return new URL(\`./assets/\${fileName}\`, import.meta.url).href;
}
`;

function moveDir(from, to) {
  if (!fs.existsSync(from)) {
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) {
    return;
  }
  fs.mkdirSync(to, { recursive: true });
  for (const name of fs.readdirSync(from)) {
    const src = path.join(from, name);
    const dest = path.join(to, name);
    if (fs.statSync(src).isDirectory()) {
      copyDir(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

// Shared assets -> src/shared/assets
const sharedFrom = path.join(publicAssets, "common");
const sharedTo = path.join(root, "src", "shared", "assets");
if (fs.existsSync(sharedFrom)) {
  fs.mkdirSync(sharedTo, { recursive: true });
  for (const name of fs.readdirSync(sharedFrom)) {
    const src = path.join(sharedFrom, name);
    const dest = path.join(sharedTo, name);
    if (!fs.existsSync(dest)) {
      fs.renameSync(src, dest);
    }
  }
  try {
    fs.rmdirSync(sharedFrom);
  } catch {
    /* not empty */
  }
}

// Favicons to public root for index.html
const favicons = ["favicon-32.png", "favicon-64.png", "apple-touch-icon.png"];
for (const name of favicons) {
  const src = path.join(sharedTo, name);
  const dest = path.join(root, "public", name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

for (const { key, jsx, css } of PAGES) {
  const pageDir = path.join(pagesDir, key);
  fs.mkdirSync(pageDir, { recursive: true });

  const jsxSrc = path.join(pagesDir, jsx);
  const jsxDest = path.join(pageDir, jsx);
  if (fs.existsSync(jsxSrc)) {
    fs.renameSync(jsxSrc, jsxDest);
  }

  if (css) {
    const cssSrc = path.join(pagesDir, css);
    const cssDest = path.join(pageDir, css);
    if (fs.existsSync(cssSrc)) {
      fs.renameSync(cssSrc, cssDest);
    }
  }

  const assetsFrom = path.join(publicAssets, key);
  const assetsDest = path.join(pageDir, "assets");
  moveDir(assetsFrom, assetsDest);

  const helperPath = path.join(pageDir, "asset.js");
  if (!fs.existsSync(helperPath)) {
    fs.writeFileSync(helperPath, assetHelper);
  }
}

console.log("Colocated page folders under src/pages/");
