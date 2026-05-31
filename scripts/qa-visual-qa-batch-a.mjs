#!/usr/bin/env node
/**
 * Visual QA — Batch A (4 investor routes @ 1280px, client-nav from /investor).
 * Usage:
 *   QA_PASS=1 node scripts/qa-visual-qa-batch-a.mjs   # pass1 screenshots
 *   QA_PASS=2 node scripts/qa-visual-qa-batch-a.mjs   # pass2 screenshots
 * Spawns preview on 4173 unless QA_PORT set. Set QA_SKIP_BUILD=1 to skip build.
 */
import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PASS = Number(process.env.QA_PASS || 1);
const PORT = Number(process.env.QA_PORT || 4173);
const BASE = `http://127.0.0.1:${PORT}/investor`;
const OUT_DIR = path.join(ROOT, "qa-screenshots", "visual-qa", `pass${PASS}`, "batch-a");
const VIEWPORT = { width: 1280, height: 900 };
const FIGMA_FILE = "2cZtlXU663ataMAsZYzoGP";

const ROUTES = [
  {
    slug: "index",
    tabLabel: null,
    urlSuffix: "",
    selector: ".investor-documents",
    activeTab: "Prospectus",
    figmaNode: "1103:4364",
    figmaName: "Investor Relations - Multi-Line Navigation",
    expectTransparency: true,
    contentMarginSel: ".investor-documents",
  },
  {
    slug: "grievance",
    tabLabel: "Investor Grievance",
    urlSuffix: "/grievance",
    selector: ".investor-grievance",
    activeTab: "Investor Grievance",
    figmaNode: "1105:4593",
    figmaName: "Investor Grievance",
    expectTransparency: false,
    contentMarginSel: ".investor-grievance",
  },
  {
    slug: "shareholding",
    tabLabel: "Shareholding Pattern",
    urlSuffix: "/shareholding",
    selector: ".investor-shareholding",
    activeTab: "Shareholding Pattern",
    figmaNode: "1110:4838",
    figmaName: "Shareholding Pattern",
    expectTransparency: true,
    contentMarginSel: ".investor-shareholding",
  },
  {
    slug: "board",
    tabLabel: "Composition of Board and Committees",
    urlSuffix: "/board",
    selector: ".investor-board",
    activeTab: "Composition of Board and Committees",
    figmaNode: "1110:5167",
    figmaName: "Composition of Board",
    expectTransparency: true,
    contentMarginSel: ".investor-board",
  },
];

function statusFrom(issues, warnings) {
  if (issues.some((i) => i.severity === "fail")) return "FAIL";
  if (warnings.length > 0 || issues.some((i) => i.severity === "warn")) return "WARN";
  return "PASS";
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: ROOT, stdio: "inherit", ...opts });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
  });
}

function waitForServer(timeoutMs = 45000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(BASE);
        if (res.ok) return resolve();
      } catch {
        /* retry */
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Preview not ready: ${BASE}`));
        return;
      }
      setTimeout(tick, 250);
    };
    tick();
  });
}

async function checkImages(page, scopeSel) {
  return page.evaluate((sel) => {
    const root = sel ? document.querySelector(sel) : document;
    const scope = root || document;
    const broken = [];
    const imgs = [...scope.querySelectorAll("img"), ...document.querySelectorAll(".investor-hero img, .investor-filter-nav img")];
    const seen = new Set();
    for (const img of imgs) {
      const key = img.currentSrc || img.src;
      if (seen.has(key)) continue;
      seen.add(key);
      const rect = img.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      if (!img.complete || img.naturalWidth === 0) {
        broken.push({ src: key, alt: img.alt || "" });
      }
    }
    return { broken };
  }, scopeSel);
}

async function checkMargins(page, contentSel) {
  return page.evaluate((sel) => {
    const main = document.querySelector(".investor-main");
    const content = document.querySelector(sel);
    if (!main || !content) return { ok: false, reason: "missing main or content" };
    const m = main.getBoundingClientRect();
    const c = content.getBoundingClientRect();
    const left = Math.round(c.left - m.left);
    const right = Math.round(m.right - c.right);
    const ok = left >= 36 && left <= 52 && right >= 36 && right <= 52;
    return { ok, left, right, expected: "~44px" };
  }, contentSel);
}

async function checkClipping(page) {
  return page.evaluate(() => {
    const main = document.querySelector(".investor-main");
    if (!main) return { clipped: [], mainHeight: 0, overflow: "" };
    const mainRect = main.getBoundingClientRect();
    const mainStyle = getComputedStyle(main);
    const clipped = [];
    for (const el of document.querySelectorAll(
      ".investor-hero, .investor-filter-nav, .investor-transparency, .investor-grievance, .investor-shareholding, .investor-board, .investor-documents",
    )) {
      const r = el.getBoundingClientRect();
      if (r.height === 0 && r.width === 0) continue;
      const bottom = r.bottom - mainRect.top;
      if (bottom > mainRect.height + 2) {
        clipped.push({
          className: el.className?.toString?.().slice(0, 60) || "",
          overflowPx: Math.round(bottom - mainRect.height),
        });
      }
    }
    return {
      clipped,
      mainHeight: Math.round(mainRect.height),
      overflow: mainStyle.overflow,
    };
  });
}

async function verifyRoute(page, route, consoleErrors) {
  const issues = [];
  const warnings = [];
  const screenshotPath = path.join(OUT_DIR, `${route.slug}.png`);

  await page.setViewportSize(VIEWPORT);

  await page.goto(BASE, { waitUntil: "networkidle" });
  if (route.tabLabel) {
    await page.getByRole("link", { name: route.tabLabel, exact: true }).click();
    await page.waitForURL(`**${route.urlSuffix}`, { timeout: 10000 });
  }

  await page.waitForSelector(route.selector, { state: "visible", timeout: 10000 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const heroVisible = await page.locator(".investor-hero").isVisible();
  if (!heroVisible) issues.push({ severity: "fail", message: "Hero section not visible" });

  const activeTab = (await page.locator(".investor-filter-nav__pill.is-active").textContent())?.trim();
  if (activeTab !== route.activeTab) {
    issues.push({
      severity: "fail",
      message: `Active filter tab mismatch: expected "${route.activeTab}", got "${activeTab}"`,
    });
  }

  const transparencyVisible = await page.locator(".investor-transparency").isVisible();
  if (transparencyVisible !== route.expectTransparency) {
    issues.push({
      severity: route.expectTransparency ? "fail" : "warn",
      message: `Transparency band ${transparencyVisible ? "shown" : "hidden"}; expected ${route.expectTransparency ? "shown" : "hidden"}`,
    });
  }

  const mainWidth = await page.locator(".investor-main").evaluate((el) => Math.round(el.getBoundingClientRect().width));
  if (mainWidth !== 1280) {
    issues.push({ severity: "fail", message: `.investor-main width is ${mainWidth}px, expected 1280px` });
  }

  const margins = await checkMargins(page, route.contentMarginSel);
  if (!margins.ok) {
    issues.push({
      severity: "warn",
      message: `Content horizontal margins off (L${margins.left ?? "?"} R${margins.right ?? "?"}, expected ${margins.expected})`,
      detail: margins,
    });
  }

  const { broken } = await checkImages(page, route.selector);
  if (broken.length > 0) {
    issues.push({
      severity: "fail",
      message: `${broken.length} broken <img> element(s)`,
      detail: broken.slice(0, 8),
    });
  }

  const clipping = await checkClipping(page);
  const significant = clipping.clipped.filter((c) => c.overflowPx > 20);
  if (clipping.overflow === "hidden" && significant.length > 0) {
    issues.push({
      severity: "warn",
      message: `Content clipped by .investor-main (height ${clipping.mainHeight}px)`,
      detail: significant.slice(0, 5),
    });
  }

  const pageErrors = consoleErrors.filter((e) => e.type === "error" || e.type === "pageerror");
  if (pageErrors.length > 0) {
    issues.push({
      severity: "fail",
      message: `${pageErrors.length} console error(s)`,
      detail: pageErrors.slice(0, 5),
    });
  }

  const h1 = await page.locator(".investor-hero h1, .investor-grievance__title, .investor-shareholding__title, #investor-board-title").first();
  const h1Font = await h1.evaluate((el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    return { family: s.fontFamily, size: s.fontSize, weight: s.fontWeight };
  }).catch(() => null);

  return {
    route: `/investor${route.urlSuffix}`,
    slug: route.slug,
    status: statusFrom(issues, warnings),
    figma: { fileKey: FIGMA_FILE, node: route.figmaNode, name: route.figmaName },
    screenshot: `qa-screenshots/visual-qa/pass${PASS}/batch-a/${route.slug}.png`,
    checks: {
      hero: heroVisible,
      activeTab,
      transparency: transparencyVisible,
      mainWidth,
      margins,
      clipping,
      brokenImages: broken.length,
      consoleErrors: pageErrors.length,
      h1Font,
    },
    issues,
    warnings,
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  if (!process.env.QA_SKIP_BUILD) {
    await run("npm", ["run", "build"]);
  }

  const preview = spawn(
    "npx",
    ["vite", "preview", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"],
    { cwd: ROOT, stdio: "pipe" },
  );

  try {
    await waitForServer();
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const consoleErrors = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push({ type: "error", text: msg.text() });
    });
    page.on("pageerror", (err) => {
      consoleErrors.push({ type: "pageerror", text: err.message });
    });

    const results = [];
    for (const route of ROUTES) {
      const start = consoleErrors.length;
      const result = await verifyRoute(page, route, consoleErrors.slice(start));
      results.push(result);
      console.log(`pass${PASS} ${result.status.padEnd(4)} ${result.route}`);
    }

    await browser.close();

    const jsonPath = path.join(OUT_DIR, `results-pass${PASS}.json`);
    await writeFile(jsonPath, JSON.stringify({ pass: PASS, port: PORT, results }, null, 2), "utf8");
    console.log(`\nWrote ${jsonPath}`);
  } finally {
    preview.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
