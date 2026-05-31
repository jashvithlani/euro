/**
 * UI verification — investor batch 3 (6 routes @ 1280px).
 * Screenshots → qa-screenshots/ui-verify/batch3/{slug}.png
 * Report → qa-screenshots/ui-verify/batch3/REPORT.md
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = 4173;
const baseUrl = `http://127.0.0.1:${port}`;
const investorBase = `${baseUrl}/investor`;
const viewport = { width: 1280, height: 1900 };
const outDir = path.join(root, "qa-screenshots", "ui-verify", "batch3");

const PAGES = [
  {
    slug: "financial",
    path: "/investor/financial",
    link: "Financial Information",
    selector: ".investor-financial",
    activeTab: "Financial Information",
    expectTransparency: false,
  },
  {
    slug: "dispute",
    path: "/investor/dispute",
    link: "Online Dispute Resolution",
    selector: ".investor-dispute",
    activeTab: "Online Dispute Resolution",
    expectTransparency: false,
  },
  {
    slug: "memorandum",
    path: "/investor/memorandum",
    link: "Memorandum of Association",
    selector: ".investor-memorandum",
    activeTab: "Memorandum of Association",
    expectTransparency: false,
  },
  {
    slug: "kmp",
    path: "/investor/kmp",
    link: "Authorized KMP's",
    selector: ".investor-kmp",
    activeTab: "Authorized KMP's",
    expectTransparency: false,
  },
  {
    slug: "updates",
    path: "/investor/updates",
    link: "Updates",
    selector: ".investor-updates",
    activeTab: "Updates",
    expectTransparency: false,
  },
  {
    slug: "reconciliation",
    path: "/investor/reconciliation",
    link: "Reconciliation",
    selector: ".investor-reconciliation",
    activeTab: "Reconciliation",
    expectTransparency: false,
  },
];

function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(investorBase);
        if (res.ok) return resolve();
      } catch {
        /* retry */
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Preview not ready: ${investorBase}`));
        return;
      }
      setTimeout(tick, 250);
    };
    tick();
  });
}

async function verifyPage(page, config, consoleLog, pageErrors) {
  const checks = [];
  const fail = (name, detail) => checks.push({ name, ok: false, ...detail });
  const pass = (name, detail = {}) => checks.push({ name, ok: true, ...detail });

  await page.setViewportSize(viewport);
  await page.goto(investorBase, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: config.link, exact: true }).click();
  await page.waitForURL(`**${config.path}`);
  // Outlet sections use absolute children — attached, not Playwright "visible".
  await page.waitForSelector(config.selector, { state: "attached", timeout: 10000 });

  const urlOk = page.url().includes(config.path);
  if (urlOk) pass("client-nav route", { actual: page.url() });
  else fail("client-nav route", { expected: config.path, actual: page.url() });

  const metrics = await page.evaluate((sel) => {
    const main = document.querySelector(".investor-main");
    const section = document.querySelector(sel);
    const activeTab = document.querySelector(".investor-filter-nav__pill.is-active");
    const transparency = document.querySelector(".investor-transparency");
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
    };

    const images = [...document.querySelectorAll(`${sel} img, .investor-hero img, .investor-filter-nav img`)];
    const brokenImages = images
      .filter((img) => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        return w === 0 && h === 0 && img.getAttribute("src");
      })
      .map((img) => img.getAttribute("src")?.slice(-60) ?? "(no src)");

    const docEl = document.documentElement;
    const overflowX =
      docEl.scrollWidth > docEl.clientWidth + 1 || document.body.scrollWidth > window.innerWidth + 1;

    const mainRect = main?.getBoundingClientRect();
    const sectionRect = section?.getBoundingClientRect();
    const marginLeft = mainRect && sectionRect ? Math.round(sectionRect.left - mainRect.left) : null;
    const marginRight =
      mainRect && sectionRect ? Math.round(mainRect.right - sectionRect.right) : null;

    const mainScrollH = main?.scrollHeight ?? 0;
    const mainClientH = main?.clientHeight ?? 0;
    const mainClipped = mainScrollH > mainClientH + 2;

    return {
      main: rect(main),
      section: rect(section),
      activeTab: activeTab?.textContent?.trim() ?? null,
      hasTransparency: Boolean(transparency),
      brokenImages,
      overflowX,
      marginLeft,
      marginRight,
      mainClipped,
      mainScrollH,
      mainClientH,
      imageCount: images.length,
    };
  }, config.selector);

  if (metrics.main?.width === 1280) pass("canvas width 1280");
  else fail("canvas width 1280", { expected: 1280, actual: metrics.main?.width });

  const sectionVisible = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) {
      const child = el.querySelector("[class*='card'], h2, article, .investor-dispute__integrated");
      if (child) {
        const cr = child.getBoundingClientRect();
        return cr.width > 0 && cr.height > 0;
      }
      return false;
    }
    return true;
  }, config.selector);
  if (metrics.section && sectionVisible) pass("section content painted");
  else fail("section content painted", { expected: config.selector, actual: { section: Boolean(metrics.section), visible: sectionVisible } });

  if (metrics.activeTab === config.activeTab) pass("active filter tab");
  else fail("active filter tab", { expected: config.activeTab, actual: metrics.activeTab });

  if (metrics.hasTransparency === config.expectTransparency) pass("transparency visibility");
  else
    fail("transparency visibility", {
      expected: config.expectTransparency ? "visible" : "hidden",
      actual: metrics.hasTransparency ? "visible" : "hidden",
    });

  if (!metrics.overflowX) pass("no horizontal overflow");
  else fail("no horizontal overflow");

  if (metrics.brokenImages.length === 0) pass("images load");
  else fail("images load", { actual: metrics.brokenImages });

  const marginOk =
    metrics.marginLeft !== null &&
    metrics.marginLeft >= 40 &&
    metrics.marginLeft <= 48 &&
    metrics.marginRight !== null &&
    metrics.marginRight >= 40 &&
    metrics.marginRight <= 48;
  if (marginOk) pass("content margins (~44px)", { actual: `L${metrics.marginLeft} R${metrics.marginRight}` });
  else
    fail("content margins (~44px)", {
      expected: "left/right ~44px",
      actual: `L${metrics.marginLeft} R${metrics.marginRight}`,
    });

  if (!metrics.mainClipped) pass("main outlet not clipped");
  else
    fail("main outlet not clipped", {
      actual: `scroll ${metrics.mainScrollH} > client ${metrics.mainClientH}`,
    });

  const shotPath = path.join(outDir, `${config.slug}.png`);
  await page.locator(".investor-main").screenshot({ path: shotPath });
  metrics.screenshot = shotPath;

  const pageConsole = consoleLog.filter((e) => e.slug === config.slug);
  const errors = pageConsole.filter((e) => e.type === "error" || e.type === "pageerror");
  if (errors.length === 0) pass("console clean");
  else fail("console clean", { actual: errors.map((e) => e.text).join("; ") });

  if (pageErrors.filter((e) => e.slug === config.slug).length === 0) pass("no page errors");
  else fail("no page errors", { actual: pageErrors.filter((e) => e.slug === config.slug).map((e) => e.message) });

  return {
    slug: config.slug,
    route: config.path,
    ok: checks.every((c) => c.ok),
    checks,
    metrics,
  };
}

function buildReport(results, meta) {
  const lines = [
    "# UI Verification — Batch 3",
    "",
    `**Date:** ${meta.date}`,
    `**Viewport:** ${viewport.width}×${viewport.height}`,
    `**Base:** ${investorBase} (client-nav from \`/investor\`)`,
    `**Overall:** ${results.every((r) => r.ok) ? "PASS" : "FAIL"}`,
    "",
    "## Summary",
    "",
    "| Route | Status | Screenshot |",
    "|-------|--------|------------|",
  ];

  for (const r of results) {
    const status = r.ok ? "PASS" : "**FAIL**";
    lines.push(`| \`${r.route}\` | ${status} | \`${path.relative(root, r.metrics.screenshot)}\` |`);
  }

  lines.push("", "## Checks per route", "");

  for (const r of results) {
    lines.push(`### ${r.route}`, "");
    for (const c of r.checks) {
      const icon = c.ok ? "✓" : "✗";
      let line = `- ${icon} **${c.name}**`;
      if (!c.ok && (c.expected !== undefined || c.actual !== undefined)) {
        line += ` — expected: \`${JSON.stringify(c.expected ?? c.ok)}\`, actual: \`${JSON.stringify(c.actual)}\``;
      } else if (c.actual && c.ok) {
        line += ` (${c.actual})`;
      }
      lines.push(line);
    }
    lines.push("");
    if (r.metrics.brokenImages?.length) {
      lines.push(`**Broken images:** ${r.metrics.brokenImages.join(", ")}`, "");
    }
    if (!r.ok && r.metrics.mainClipped) {
      lines.push(
        `**Clipping note:** main scrollHeight ${r.metrics.mainScrollH} vs clientHeight ${r.metrics.mainClientH}`,
        "",
      );
    }
  }

  const blockers = results.filter((r) => !r.ok);
  lines.push("## Blockers", "");
  if (blockers.length === 0) {
    lines.push("_None — all routes passed automated checks._");
  } else {
    for (const r of blockers) {
      const failed = r.checks.filter((c) => !c.ok).map((c) => c.name);
      lines.push(`- **\`${r.route}\`:** ${failed.join(", ")}`);
    }
  }

  lines.push("", "## Artifacts", "");
  lines.push("Screenshots in `qa-screenshots/ui-verify/batch3/`.");

  return lines.join("\n");
}

const preview = spawn(
  "npx",
  ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
  { cwd: root, stdio: "ignore", env: { ...process.env } },
);

const consoleLog = [];
const pageErrors = [];

try {
  await waitForServer();
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on("console", (msg) => {
    const type = msg.type();
    if (type === "error" || type === "warning") {
      consoleLog.push({ slug: "_global", type, text: msg.text() });
    }
  });

  const results = [];
  for (const config of PAGES) {
    const slugConsole = [];
    const slugPageErrors = [];

    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");
    page.on("console", (msg) => {
      const entry = { slug: config.slug, type: msg.type(), text: msg.text() };
      if (msg.type() === "error") slugConsole.push(entry);
      consoleLog.push(entry);
    });
    page.on("pageerror", (err) => {
      const entry = { slug: config.slug, message: err.message };
      slugPageErrors.push(entry);
      pageErrors.push(entry);
    });

    try {
      results.push(await verifyPage(page, config, slugConsole, slugPageErrors));
    } catch (err) {
      results.push({
        slug: config.slug,
        route: config.path,
        ok: false,
        checks: [{ name: "run error", ok: false, actual: err.message }],
        metrics: { screenshot: null },
      });
    }
  }

  await browser.close();

  const report = buildReport(results, { date: new Date().toISOString().slice(0, 10) });
  const reportPath = path.join(outDir, "REPORT.md");
  await writeFile(reportPath, report, "utf8");

  console.log(JSON.stringify({ reportPath, allPassed: results.every((r) => r.ok), results }, null, 2));
  process.exit(results.every((r) => r.ok) ? 0 : 1);
} catch (err) {
  console.error(err);
  process.exit(2);
} finally {
  preview.kill("SIGTERM");
}
