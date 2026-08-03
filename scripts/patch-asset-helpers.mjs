#!/usr/bin/env node
/**
 * Patch every asset.js helper under src/ so it prefers a sibling
 * .webp (smaller, same quality) and falls back to the requested file
 * (e.g., .png) when no .webp exists. Preserves each helper's existing
 * function name (asset / sharedAsset) and leading comment.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

async function walk(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, files);
    else if (entry.isFile() && entry.name === "asset.js") files.push(full);
  }
  return files;
}

const GLOB_BLOCK = `const webpModules = import.meta.glob("./assets/*.webp", { eager: true, query: "?url" });
const webpByName = {};
for (const [globPath, mod] of Object.entries(webpModules)) {
  const base = globPath.split("/").pop().replace(/\\.[^.]+$/, "");
  webpByName[base] = mod.default;
}`;

function bodyFor(fnName) {
  return `${GLOB_BLOCK}

export function ${fnName}(fileName) {
  const stem = fileName.replace(/\.png$/i, "");
  if (webpByName[stem]) return webpByName[stem];
  return new URL(\`./assets/\${fileName}\`, import.meta.url).href;
}`;
}

async function main() {
  const files = await walk(path.join(ROOT, "src"));
  for (const f of files) {
  let src = await fs.readFile(f, "utf8");

  // Detect function name (asset / sharedAsset).
  const fnMatch = src.match(/export\s+(?:function\s+(\w+)|const\s+(\w+)\s*=)/);
  if (!fnMatch) { console.warn(`skip (no export): ${f}`); continue; }
  const fnName = fnMatch[1] || fnMatch[2];
  const isArrow = /export\s+const\s+\w+\s*=/.test(src);

  // Preserve the leading comment block (up to the first export).
  const commentMatch = src.match(/^(\/\*\*[\s\S]*?\*\/)\s*/);
  const comment = commentMatch ? commentMatch[1] + "\n" : "";

  const body = bodyFor(fnName);
  const newSrc = `${comment}${body}\n`;
  await fs.writeFile(f, newSrc);
  console.log(`patched ${path.relative(ROOT, f)}`);
}
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
