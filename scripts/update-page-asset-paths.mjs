#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !["node_modules", "dist", "assets"].includes(e.name)) {
      walk(full, out);
    } else if (/\.(jsx|css)$/.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

function ensureImport(content, importLine) {
  if (content.includes(importLine.trim())) {
    return content;
  }
  const idx = content.match(/^import .+;\n/m);
  if (idx) {
    const lastImport = [...content.matchAll(/^import .+;\n/gm)].pop();
    const pos = lastImport.index + lastImport[0].length;
    return content.slice(0, pos) + importLine + content.slice(pos);
  }
  return importLine + content;
}

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;
  const rel = path.relative(path.join(root, "src"), filePath);
  const pageMatch = rel.match(/^pages\/([^/]+)\//);

  if (pageMatch) {
    const pageKey = pageMatch[1];

    // CSS: absolute public paths -> relative ./assets/
    content = content.replaceAll(`url("/assets/${pageKey}/`, 'url("./assets/');
    content = content.replaceAll(`url('/assets/${pageKey}/`, "url('./assets/");

    // JSX strings: assets/<page>/file -> asset('file')
    const re = new RegExp(`assets/${pageKey}/([^"'\`)]+)`, "g");
    content = content.replace(re, (_, file) => `asset('${file}')`);

    if (content !== original && filePath.endsWith(".jsx")) {
      content = ensureImport(content, "import { asset } from './asset.js';\n");
    }
  }

  // About page shared cert
  if (rel === "pages/about/AboutPage.jsx") {
    content = content.replace(
      /asset\('([^']+)'\)/g,
      (m, file) => (file.startsWith("footer-cert") ? `sharedAsset('${file}')` : m),
    );
    if (content.includes("sharedAsset(") && !content.includes("shared/asset.js")) {
      content = ensureImport(content, "import { sharedAsset } from '../../shared/asset.js';\n");
    }
  }

  // Global components
  if (rel === "components/Header.jsx") {
    content = content.replace(/src="assets\/common\/([^"]+)"/g, (_, f) => `src={sharedAsset('${f}')}`);
    content = ensureImport(content, "import { sharedAsset } from '../shared/asset.js';\n");
  }

  if (rel === "components/Footer.jsx") {
    content = content.replace(/assets\/common\//g, "");
    content = content.replace(/icon: "([^"]+)"/g, (m, f) => `icon: sharedAsset('${f}')`);
    content = content.replace(/src: "([^"]+\.(png|svg))"/g, (m, f) => `src: sharedAsset('${f}')`);
    content = content.replace(/src=\{sharedAsset\('([^']+)'\)\}/g, "src={sharedAsset('$1')}");
    content = content.replace(/<img src="([^"]+)" alt="" \/>/g, (m, f) => {
      if (f.includes("exports-icon")) {
        return `<img src={sharedAsset('${path.basename(f)}')} alt="" />`;
      }
      return m;
    });
    content = content.replace(
      '<img src="assets/common/logo-footer.png"',
      "<img src={sharedAsset('logo-footer.png')}",
    );
    content = content.replace(
      '<img src="assets/common/footer-amazon.png"',
      "<img src={sharedAsset('footer-amazon.png')}",
    );
    content = ensureImport(content, "import { sharedAsset } from '../shared/asset.js';\n");
  }

  if (rel === "pages/exports/ExportsPage.jsx") {
    content = content.replace(/src="assets\/common\/([^"]+)"/g, (_, f) => `src={sharedAsset('${f}')}`);
    if (content.includes("sharedAsset")) {
      content = ensureImport(content, "import { sharedAsset } from '../../shared/asset.js';\n");
    }
  }

  // styles.css global
  if (rel.includes("public/styles.css")) {
    content = content.replace(
      'url("assets/home/category-pattern.png")',
      'url("../src/pages/home/assets/category-pattern.png")',
    );
    content = content.replace(
      'url("assets/about/about-pillar-bg-source.png")',
      'url("../src/pages/about/assets/about-pillar-bg-source.png")',
    );
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log("Updated:", rel);
  }
}

// App.jsx imports
const appPath = path.join(root, "src", "App.jsx");
let app = fs.readFileSync(appPath, "utf8");
const pages = [
  "home/HomePage",
  "about/AboutPage",
  "exports/ExportsPage",
  "career/CareerPage",
  "contact/ContactPage",
  "dealers/DealersPage",
  "achievements/AchievementsPage",
  "investor/InvestorPage",
  "category/CategoryPage",
];
for (const p of pages) {
  const name = p.split("/")[1];
  app = app.replace(`./pages/${name}.jsx`, `./pages/${p}.jsx`);
}
fs.writeFileSync(appPath, app);
console.log("Updated: src/App.jsx");

walk(path.join(root, "src"), []).forEach(updateFile);
fs.readFileSync(path.join(root, "public", "styles.css"), "utf8");
updateFile(path.join(root, "public", "styles.css"));

// Investor import path
const invPath = path.join(root, "src", "pages", "investor", "InvestorPage.jsx");
let inv = fs.readFileSync(invPath, "utf8");
inv = inv.replace(
  '../components/InvestorFilterNav.jsx',
  '../../components/InvestorFilterNav.jsx',
);
fs.writeFileSync(invPath, inv);

// DealersPage - remove old asset helper
const dealersPath = path.join(root, "src", "pages", "dealers", "DealersPage.jsx");
let dealers = fs.readFileSync(dealersPath, "utf8");
dealers = dealers.replace(
  /const asset = \(name\) => `assets\/dealers\/\$\{name\}`;\n\n/,
  "",
);
if (!dealers.includes("./asset.js")) {
  dealers = "import { asset } from './asset.js';\n" + dealers;
}
fs.writeFileSync(dealersPath, dealers);

// index.html favicons
const indexPath = path.join(root, "index.html");
let index = fs.readFileSync(indexPath, "utf8");
index = index.replace(/\/assets\/common\//g, "/");
fs.writeFileSync(indexPath, index);
console.log("Updated: index.html");
