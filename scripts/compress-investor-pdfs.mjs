#!/usr/bin/env node
/**
 * Compress every PDF under public/investor-pdfs using ghostscript.
 *
 * - Writes compressed copies to <root>/investor-pdfs-compressed/, preserving
 *   the subfolder structure, so originals are never touched.
 * - Uses the /ebook preset (150 DPI) — a good balance of size vs. on-screen
 *   readability for financial/legal documents. Pass --screen for 72 DPI
 *   (much smaller, lower quality) or --printer for 300 DPI.
 * - Skips a file if the compressed output is not smaller, is empty, or gs
 *   reports an error, so we never regress a file.
 * - Prints a per-file and total savings report at the end.
 */
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_ROOT = path.join(ROOT, "public", "investor-pdfs");
const OUT_ROOT = path.join(ROOT, "investor-pdfs-compressed");

const preset = process.argv.includes("--screen")
  ? "/screen"
  : process.argv.includes("--printer")
    ? "/printer"
    : "/ebook";

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.isFile() && /\.pdf$/i.test(entry.name)) files.push(full);
  }
  return files;
}

async function ensureDir(file) {
  await fs.mkdir(path.dirname(file), { recursive: true });
}

function compressOne(src, dst) {
  // -dPDFSETTINGS=/ebook downsamples images to 150 DPI.
  const args = [
    "-sDEVICE=pdfwrite",
    `-dPDFSETTINGS=${preset}`,
    "-dNOPAUSE",
    "-dBATCH",
    "-dQUIET",
    "-dDetectDuplicateImages",
    "-dCompressFonts=true",
    "-dSubsetFonts=true",
    "-dEmbedAllFonts=true",
    `-sOutputFile=${dst}`,
    src,
  ];
  const result = spawnSync("gs", args, { encoding: "utf8" });
  return result;
}

async function main() {
  if (!existsSync(SRC_ROOT)) {
    console.error(`Source not found: ${SRC_ROOT}`);
    process.exit(1);
  }

  const files = await walk(SRC_ROOT);
  if (files.length === 0) {
    console.error("No PDFs found under public/investor-pdfs");
    process.exit(1);
  }

  console.log(`Compressing ${files.length} PDFs with ghostscript preset ${preset}...`);
  console.log(`Output: ${path.relative(ROOT, OUT_ROOT)}/\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let compressed = 0;
  let skipped = 0;
  let failed = 0;
  const rows = [];

  for (const src of files) {
    const rel = path.relative(SRC_ROOT, src);
    const dst = path.join(OUT_ROOT, rel);
    const before = (await fs.stat(src)).size;
    totalBefore += before;

    await ensureDir(dst);
    const result = compressOne(src, dst);

    let after = 0;
    let status = "OK";
    if (result.status !== 0) {
      status = `FAIL (gs exit ${result.status})`;
      failed++;
      // remove partial output
      await fs.rm(dst, { force: true });
    } else if (!existsSync(dst)) {
      status = "FAIL (no output)";
      failed++;
    } else {
      after = (await fs.stat(dst)).size;
      if (after === 0) {
        status = "FAIL (empty output)";
        failed++;
        await fs.rm(dst, { force: true });
      } else if (after >= before) {
        status = "SKIP (not smaller)";
        skipped++;
        // keep the smaller original; remove the larger compressed copy
        await fs.rm(dst, { force: true });
        after = before; // count as-is
      } else {
        compressed++;
        totalAfter += after;
        rows.push({ rel, before, after });
        const saved = (((before - after) / before) * 100).toFixed(1);
        console.log(
          `${formatBytes(before).padStart(10)} -> ${formatBytes(after).padStart(10)}  (-${saved}%)  ${rel}`,
        );
        continue;
      }
    }

    // For skipped/failed, the file keeps its original size in the output set.
    totalAfter += before;
    console.log(`${formatBytes(before).padStart(10)} -> ${formatBytes(before).padStart(10)}  ${status.padEnd(22)} ${rel}`);
  }

  console.log("\n--- summary ---");
  console.log(`PDFs:        ${files.length}`);
  console.log(`Compressed:  ${compressed}`);
  console.log(`Skipped:     ${skipped} (already optimal)`);
  console.log(`Failed:      ${failed}`);
  console.log(`Total before: ${formatBytes(totalBefore)}`);
  console.log(`Total after:  ${formatBytes(totalAfter)}`);
  const totalSaved = totalBefore - totalAfter;
  const pct = totalBefore > 0 ? ((totalSaved / totalBefore) * 100).toFixed(1) : "0.0";
  console.log(`Saved:        ${formatBytes(Math.max(0, totalSaved))} (-${pct}%)`);
  console.log(`\nCompressed set written to: ${path.relative(ROOT, OUT_ROOT)}/`);
  console.log("Originals are untouched. Review the output, then swap folders when ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
