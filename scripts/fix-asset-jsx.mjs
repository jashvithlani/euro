#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory() && !["node_modules", "dist"].includes(e.name)) {
      walk(f, out);
    } else if (e.name.endsWith(".jsx")) {
      out.push(f);
    }
  }
  return out;
}

for (const file of walk(path.join(root, "src"))) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  content = content.replace(/src="asset\('([^']+)'\)"/g, "src={asset('$1')}");
  content = content.replace(/icon: "asset\('([^']+)'\)"/g, "icon: asset('$1')");
  content = content.replace(/image: "asset\('([^']+)'\)"/g, "image: asset('$1')");
  content = content.replace(/texture: "asset\('([^']+)'\)"/g, "texture: asset('$1')");

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("Fixed:", path.relative(root, file));
  }
}
