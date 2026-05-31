#!/usr/bin/env node
/**
 * Capture investor grievance outlet screenshot for QA.
 * Usage: node scripts/screenshot-investor-grievance.mjs [outputPath]
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outputPath = process.argv[2] || path.join(root, "qa-investor-grievance.png");
const port = 4174;
const url = `http://127.0.0.1:${port}/investor/grievance`;

function waitForServer(ms = 15000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch {
        /* retry */
      }
      if (Date.now() - start > ms) return reject(new Error("Dev server did not start"));
      setTimeout(tick, 250);
    };
    tick();
  });
}

const preview = spawn("npm", ["run", "dev", "--", "--port", String(port)], {
  cwd: root,
  stdio: "ignore",
  detached: true,
});

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".investor-grievance");
  await page.screenshot({ path: outputPath, fullPage: false });
  await browser.close();
  console.log(`Screenshot saved: ${outputPath}`);
} finally {
  process.kill(-preview.pid, "SIGTERM");
}
