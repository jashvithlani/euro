#!/usr/bin/env node
/**
 * For each image file currently DELETED from the working tree (tracked but
 * missing), search the codebase for an exact quoted occurrence of its
 * basename — i.e. `asset("basename")`, `homeAsset('basename')`, CSS
 * `url(.../basename)`, etc. Reports any real references so we can restore
 * files that were wrongly deleted.
 *
 *   node scripts/check-deleted-refs.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Get deleted (tracked, missing) image files via git.
const git = spawnSync("git", ["status", "--short"], { encoding: "utf8" });
const deleted = git.stdout
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.startsWith("D ") && /\.(png|jpe?g|webp|svg|gif|avif)$/i.test(l))
  .map((l) => l.replace(/^D\s+/, "").trim());

console.log(`Deleted image files to verify: ${deleted.length}\n`);

let flagged = 0;
for (const relPath of deleted) {
  const base = path.basename(relPath);
  // Search for the basename as an exact literal, quoted with " or ' or `.
  // Using ripgrep -F (fixed string) per quote style; check the actual exit code.
  const patterns = [`"${base}"`, `'${base}'`, `\`${base}\``];
  let found = [];
  for (const pat of patterns) {
    const r = spawnSync(
      "rg",
      ["-n", "-F", "--no-ignore", "-g", "!node_modules", "-g", "!dist", "-g", "!.git", pat, ROOT],
      { encoding: "utf8" },
    );
    if (r.status === 0 && r.stdout.trim()) {
      for (const line of r.stdout.trim().split("\n")) {
        // Skip matches inside the deleted file's own path / bak files.
        if (line.includes(".bak")) continue;
        found.push(line);
      }
    }
  }
  if (found.length > 0) {
    flagged++;
    console.log(`POSSIBLE REFERENCE: ${base}`);
    // Dedupe and show up to 4 match lines.
    const uniq = [...new Set(found)];
    for (const m of uniq.slice(0, 4)) console.log(`    ${m}`);
    if (uniq.length > 4) console.log(`    ... +${uniq.length - 4} more`);
    console.log("");
  }
}

if (flagged === 0) {
  console.log("No quoted references found for any deleted image. All clear.");
} else {
  console.log(`${flagged} deleted image(s) have quoted references — review above before committing.`);
}
