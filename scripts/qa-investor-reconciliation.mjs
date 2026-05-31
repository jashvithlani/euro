import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "qa-screenshots", "reconciliation");
const port = 4321;
const baseUrl = `http://127.0.0.1:${port}`;
const url = `${baseUrl}/investor/reconciliation`;
const viewport = { width: 1280, height: 1801 };

function waitForServer(baseUrl, timeoutMs = 15000) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(baseUrl);
        if (res.ok) {
          resolve();
          return;
        }
      } catch {
        // retry
      }

      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server not ready: ${baseUrl}`));
        return;
      }

      setTimeout(tick, 250);
    };

    tick();
  });
}

const preview = spawn(
  "npx",
  ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
  {
    cwd: root,
    stdio: "ignore",
    env: { ...process.env },
  },
);

try {
  await waitForServer(baseUrl);
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  const results = [];

  async function openReconciliationPage() {
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Investor", exact: true }).click();
    await page.waitForURL("**/investor**");
    await page.getByRole("link", { name: "Reconciliation" }).click();
    await page.waitForURL("**/investor/reconciliation");
    await page.waitForSelector(".investor-reconciliation", { state: "attached", timeout: 10000 });
    await page.waitForSelector(".investor-reconciliation-card", { state: "attached", timeout: 10000 });
  }

  for (let pass = 1; pass <= 3; pass += 1) {
    await openReconciliationPage();

    const metrics = await page.evaluate(() => {
      const main = document.querySelector(".investor-main");
      const section = document.querySelector(".investor-reconciliation");
      const title = document.querySelector("#investor-reconciliation-title");
      const activeTab = document.querySelector(".investor-filter-nav__pill.is-active");
      const activeYear = document.querySelector(".investor-year-tabs__pill.is-active");
      const cards = document.querySelectorAll(".investor-reconciliation-card");
      const transparency = document.querySelector(".investor-transparency");
      const cta = document.querySelector(".investor-reconciliation-cta");

      const rect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      };

      const titleStyle = title ? getComputedStyle(title) : null;

      return {
        main: rect(main),
        section: rect(section),
        titleLines: title?.querySelectorAll("span").length ?? 0,
        titleColor: titleStyle?.color,
        titleSize: titleStyle?.fontSize,
        activeTab: activeTab?.textContent?.trim(),
        activeYear: activeYear?.textContent?.trim(),
        cardCount: cards.length,
        hasTransparency: Boolean(transparency),
        hasCta: Boolean(cta),
      };
    });

    const shotPath = path.join(outDir, `reconciliation-pass-${pass}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    results.push({ pass, shotPath, metrics });
  }

  await browser.close();

  const failed = results.filter(
    (r) =>
      r.metrics.titleLines !== 2 ||
      r.metrics.activeTab !== "Reconciliation" ||
      r.metrics.activeYear !== "2025-26" ||
      r.metrics.cardCount !== 6 ||
      r.metrics.hasTransparency ||
      !r.metrics.hasCta ||
      r.metrics.titleColor !== "rgb(78, 40, 31)" ||
      r.metrics.titleSize !== "32px",
  );

  console.log(JSON.stringify({ url, viewport, results, failed: failed.length }, null, 2));
  if (failed.length > 0) process.exit(1);
} finally {
  preview.kill("SIGTERM");
}
