#!/usr/bin/env node
/**
 * Restore every asset.js helper under src/ to its original form:
 *   <comment>
 *   export function NAME(fileName) {
 *     return new URL(`./assets/${fileName}`, import.meta.url).href;
 *   }
 * The webp logic now lives in a Vite plugin that rewrites
 * call sites (asset("foo.png") -> asset("foo.webp")), so the
 * helper itself goes back to the plain version.
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

async function main() {
  const files = await walk(path.join(ROOT, "src"));
  for (const f of files) {
  let src = await fs.readFile(f, "utf8");
  const fnMatch = src.match(/export\s+(?:function\s+(\w+)|const\s+(\w+)\s*=)/);
  if (!fnMatch) continue;
  const fnName = fnMatch[1] || fnMatch[2];
  const commentMatch = src.match(/^(\/\*\*[\s\S]*?\*\/)\s*/);
  const comment = commentMatch ? commentMatch[1] + "\n" : "";
  const restored = `${comment}export function ${fnName}(fileName) {
  return new URL(\`./assets/\${fileName}\`, import.meta.url).href;
}
`;
  await fs.writeFile(f, restored);
  console.log(`restored ${path.relative(ROOT, f)}`);
}
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
