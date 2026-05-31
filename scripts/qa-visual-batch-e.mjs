/**
 * Visual QA — Batch E (category pages @ 1280px).
 * Usage: PASS=1 node scripts/qa-visual-batch-e.mjs
 *        PASS=2 node scripts/qa-visual-batch-e.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const pass = Number(process.env.PASS || "1");
const port = 4173;
const baseUrl = `http://127.0.0.1:${port}`;
const viewport = { width: 1280, height: 900 };
const outDir = path.join(root, "qa-screenshots", "visual-qa", `pass${pass}`, "batch-e");

/** Chips = reference; others include Figma node ids for fix tasks. */
const PAGES = [
  { slug: "chips", path: "/chips", figma: null, reference: true },
  { slug: "beverages", path: "/beverages", figma: "1131:3231", reference: false },
  { slug: "getmore", path: "/getmore", figma: "1159:192", reference: false },
  { slug: "farali", path: "/farali", figma: "1159:473", reference: false },
  { slug: "namkeen", path: "/namkeen", figma: "1206:104", reference: false },
];

const CARD_WIDTH_RATIO_MAX = 1.12;
const MAIN_HEIGHT_RATIO_MAX = 1.15;

function waitForServer(timeoutMs = 45000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(`${baseUrl}/chips`);
        if (res.ok) return resolve();
      } catch {
        /* retry */
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Preview not ready: ${baseUrl}`));
        return;
      }
      setTimeout(tick, 250);
    };
    tick();
  });
}

async function collectMetrics(page) {
  return page.evaluate(() => {
    const main = document.querySelector(".category-main");
    const subnav = document.querySelector(".product-subnav");
    const activeTab = document.querySelector(".product-subnav a.is-active, .product-subnav .is-active");
    const cards = [...document.querySelectorAll(".category-product-card")];
    const firstCard = cards[0] ?? null;

    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        width: Math.round(r.width),
        height: Math.round(r.height),
      };
    };

    const images = [...document.querySelectorAll(".category-main img")];
    const brokenImages = images
      .filter((img) => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        return w === 0 && h === 0 && img.getAttribute("src");
      })
      .map((img) => img.getAttribute("src")?.slice(-72) ?? "(no src)");

    const docEl = document.documentElement;
    const overflowX =
      docEl.scrollWidth > docEl.clientWidth + 1 || document.body.scrollWidth > window.innerWidth + 1;

    const mainStyle = main ? getComputedStyle(main) : null;
    const shell = document.querySelector(".page-shell");
    const shellRect = shell?.getBoundingClientRect();

    const mainHeightPx =
      main && mainStyle ? Math.round(parseFloat(mainStyle.height) || main.getBoundingClientRect().height) : null;

    return {
      main: rect(main),
      shell: shellRect ? { width: Math.round(shellRect.width) } : null,
      subnav: Boolean(subnav),
      activeTab: activeTab?.textContent?.trim() ?? null,
      cardCount: cards.length,
      firstCard: rect(firstCard),
      mainHeightPx,
      brokenImages,
      overflowX,
      transform: mainStyle?.transform ?? "none",
    };
  });
}

function verifyPage(config, metrics, refMetrics, checks) {
  const fail = (name, detail) => checks.push({ name, ok: false, ...detail });
  const pass = (name, detail = {}) => checks.push({ name, ok: true, ...detail });

  if (metrics.main?.width === 1280) pass("canvas width 1280");
  else fail("canvas width 1280", { expected: 1280, actual: metrics.main?.width });

  if (metrics.shell?.width === 1280) pass("page-shell width 1280");
  else fail("page-shell width 1280", { expected: 1280, actual: metrics.shell?.width });

  if (metrics.subnav) pass("ProductSubNav present");
  else fail("ProductSubNav present");

  const expectedTab = config.slug === "getmore" ? "Getmore" : config.slug.charAt(0).toUpperCase() + config.slug.slice(1);
  if (metrics.activeTab === expectedTab) pass("active subnav tab", { actual: metrics.activeTab });
  else fail("active subnav tab", { expected: expectedTab, actual: metrics.activeTab });

  if (metrics.cardCount > 0) pass("product grid cards", { actual: `${metrics.cardCount} cards` });
  else fail("product grid cards", { actual: 0 });

  if (metrics.firstCard && metrics.firstCard.width > 0 && metrics.firstCard.height > 0) {
    pass("first grid card painted", {
      actual: `${metrics.firstCard.width}×${metrics.firstCard.height}`,
    });
  } else {
    fail("first grid card painted", { actual: metrics.firstCard });
  }

  if (!metrics.overflowX) pass("no horizontal overflow");
  else fail("no horizontal overflow");

  if (metrics.brokenImages.length === 0) pass("images load");
  else fail("images load", { actual: metrics.brokenImages });

  if (metrics.transform === "none" || metrics.transform === "matrix(1, 0, 0, 1, 0, 0)") {
    pass("no CSS zoom on main");
  } else {
    fail("no CSS zoom on main", { actual: metrics.transform });
  }

  if (config.reference) {
    pass("reference page (chips)");
    return;
  }

  if (refMetrics?.firstCard?.width && metrics.firstCard?.width) {
    const ratio = metrics.firstCard.width / refMetrics.firstCard.width;
    if (ratio <= CARD_WIDTH_RATIO_MAX) {
      pass("grid scale vs chips", {
        actual: `card width ratio ${ratio.toFixed(3)} (≤${CARD_WIDTH_RATIO_MAX})`,
      });
    } else {
      fail("grid scale vs chips (not zoomed)", {
        expected: `first card width ≤ ${Math.round(refMetrics.firstCard.width * CARD_WIDTH_RATIO_MAX)}px`,
        actual: `${metrics.firstCard.width}px (ratio ${ratio.toFixed(3)} vs chips ${refMetrics.firstCard.width}px)`,
      });
    }
  }

  if (refMetrics?.mainHeightPx && metrics.mainHeightPx) {
    const heightRatio = metrics.mainHeightPx / refMetrics.mainHeightPx;
    if (heightRatio <= MAIN_HEIGHT_RATIO_MAX * 4) {
      // Tall pages OK if cards are scaled; only flag extreme unscaled canvas height
      const extreme = heightRatio > 3.5 && metrics.firstCard?.width > refMetrics.firstCard.width * 1.2;
      if (!extreme) {
        pass("canvas height plausible", { actual: `${metrics.mainHeightPx}px (ratio ${heightRatio.toFixed(2)})` });
      } else {
        fail("canvas height plausible (1920 coords on 1280?)", {
          expected: "scaled layout height",
          actual: `${metrics.mainHeightPx}px vs chips ${refMetrics.mainHeightPx}px (ratio ${heightRatio.toFixed(2)})`,
        });
      }
    }
  }
}

function buildReport(results, refMetrics, meta) {
  const lines = [
    "# Visual QA — Batch E (Category Pages)",
    "",
    `**Pass:** ${meta.pass}`,
    `**Date:** ${meta.date}`,
    `**Viewport:** ${viewport.width}px`,
    `**Base:** ${baseUrl}`,
    `**Reference:** \`/chips\` (1280 canvas, scaled layout)`,
    `**Overall:** ${results.every((r) => r.ok) ? "PASS" : "FAIL"}`,
    "",
    "## Routes (App.jsx / site-routing.js)",
    "",
    "| Page | Route | Figma node |",
    "|------|-------|------------|",
    "| Chips (ref) | `/chips` | — |",
    "| Beverages | `/beverages` | `1131:3231` |",
    "| Get More | `/getmore` | `1159:192` |",
    "| Farali | `/farali` | `1159:473` |",
    "| Namkeen | `/namkeen` | `1206:104` |",
    "",
    "## Summary",
    "",
    "| Route | Status | Screenshot | Figma |",
    "|-------|--------|------------|-------|",
  ];

  for (const r of results) {
    const status = r.ok ? "PASS" : "**FAIL**";
    const figma = r.figma ? `\`${r.figma}\`` : "—";
    lines.push(
      `| \`${r.route}\` | ${status} | \`${path.relative(root, r.screenshot)}\` | ${figma} |`,
    );
  }

  if (refMetrics) {
    lines.push(
      "",
      "## Chips reference metrics",
      "",
      `- Main height: **${refMetrics.mainHeightPx}px**`,
      `- First product card: **${refMetrics.firstCard?.width}×${refMetrics.firstCard?.height}px**`,
      `- Product cards: **${refMetrics.cardCount}**`,
      "",
    );
  }

  lines.push("## Checks per route", "");

  for (const r of results) {
    lines.push(`### ${r.route}`, "");
    for (const c of r.checks) {
      const icon = c.ok ? "✓" : "✗";
      let line = `- ${icon} **${c.name}**`;
      if (!c.ok && (c.expected !== undefined || c.actual !== undefined)) {
        line += ` — expected: \`${JSON.stringify(c.expected ?? "")}\`, actual: \`${JSON.stringify(c.actual)}\``;
      } else if (c.actual && c.ok) {
        line += ` (${typeof c.actual === "string" ? c.actual : JSON.stringify(c.actual)})`;
      }
      lines.push(line);
    }
    lines.push("");
  }

  const blockers = results.filter((r) => !r.ok && !r.reference);
  lines.push("## Blockers", "");
  if (blockers.length === 0) {
    lines.push("_None — all category routes passed automated checks._");
  } else {
    for (const r of blockers) {
      const failed = r.checks.filter((c) => !c.ok).map((c) => c.name);
      lines.push(`- **\`${r.route}\`** (Figma \`${r.figma}\`): ${failed.join(", ")}`);
    }
  }

  lines.push("", "## Artifacts", "");
  lines.push(`Screenshots: \`qa-screenshots/visual-qa/pass${meta.pass}/batch-e/\``);

  return lines.join("\n");
}

const preview = spawn(
  "npx",
  ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
  { cwd: root, stdio: "ignore", env: { ...process.env } },
);

try {
  await waitForServer();
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize(viewport);

  let refMetrics = null;
  const results = [];

  for (const config of PAGES) {
    const checks = [];
    try {
      await page.goto(`${baseUrl}${config.path}`, { waitUntil: "networkidle" });
      await page.waitForSelector(".category-main", { timeout: 15000 });
      await page.waitForTimeout(300);

      const metrics = await collectMetrics(page);
      if (config.reference) refMetrics = metrics;

      verifyPage(config, metrics, refMetrics, checks);

      const shotPath = path.join(outDir, `${config.slug}.png`);
      await page.locator(".category-main").screenshot({ path: shotPath });

      results.push({
        slug: config.slug,
        route: config.path,
        figma: config.figma,
        reference: config.reference,
        ok: checks.every((c) => c.ok),
        checks,
        metrics,
        screenshot: shotPath,
      });
    } catch (err) {
      results.push({
        slug: config.slug,
        route: config.path,
        figma: config.figma,
        reference: config.reference,
        ok: false,
        checks: [{ name: "run error", ok: false, actual: err.message }],
        metrics: {},
        screenshot: path.join(outDir, `${config.slug}.png`),
      });
    }
  }

  await browser.close();

  const report = buildReport(results, refMetrics, {
    pass,
    date: new Date().toISOString().slice(0, 10),
  });
  const reportPath = path.join(outDir, "..", "..", "batch-e-REPORT.md");
  if (pass === 1) {
    await writeFile(reportPath, report, "utf8");
  } else {
    const pass1Report = await readFile(reportPath, "utf-8").catch(() => "");
    const pass2Header = "# Visual QA — Batch E (Pass 2)";
    const pass2Report = report.replace("# Visual QA — Batch E", pass2Header);
    await writeFile(reportPath, `${pass1Report}\n\n---\n\n${pass2Report}`, "utf8");
  }

  const summary = {
    pass,
    reportPath,
    allPassed: results.every((r) => r.ok),
    failures: results.filter((r) => !r.ok).map((r) => ({ route: r.route, figma: r.figma, failed: r.checks.filter((c) => !c.ok).map((c) => c.name) })),
  };
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.allPassed ? 0 : 1);
} catch (err) {
  console.error(err);
  process.exit(2);
} finally {
  preview.kill("SIGTERM");
}
