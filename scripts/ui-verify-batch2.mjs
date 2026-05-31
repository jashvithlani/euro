import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "qa-screenshots", "ui-verify", "batch2");
const port = 4321;
const baseUrl = `http://127.0.0.1:${port}`;
const viewport = { width: 1280, height: 2200 };

const ROUTES = [
  {
    slug: "governance",
    path: "/investor/governance",
    tabLabel: "Corporate Governance Reports",
    section: ".investor-governance",
    titleSelector: "#investor-governance-title",
    expectedTitle: "Corporate Governance Reports",
    transparencyVisible: true,
  },
  {
    slug: "annual",
    path: "/investor/annual",
    tabLabel: "Annual Reports",
    section: ".investor-annual",
    titleSelector: "#investor-annual-title",
    expectedTitle: "Annual Reports",
    transparencyVisible: false,
  },
  {
    slug: "secretarial",
    path: "/investor/secretarial",
    tabLabel: "Annual Secretarial Compliance Report",
    section: ".secretarial-page",
    titleSelector: ".secretarial-page__title",
    expectedTitle: "Annual Secretarial Compliance Report",
    transparencyVisible: false,
  },
  {
    slug: "announcements",
    path: "/investor/announcements",
    tabLabel: "Corporate Announcements",
    section: ".investor-announcements",
    titleSelector: "#investor-announcements-title",
    expectedTitle: "Corporate Announcements",
    transparencyVisible: true,
  },
  {
    slug: "agm",
    path: "/investor/agm",
    tabLabel: "AGM/EGM",
    section: ".investor-agm",
    titleSelector: "#investor-agm-title",
    expectedTitle: "AGM/EGM",
    transparencyVisible: false,
  },
];

function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          resolve();
          return;
        }
      } catch {
        // retry
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server not ready: ${url}`));
        return;
      }
      setTimeout(tick, 250);
    };
    tick();
  });
}

function gradeRoute(checks, consoleErrors) {
  const fails = checks.filter((c) => c.severity === "fail" && !c.ok);
  const warns = checks.filter((c) => c.severity === "warn" && !c.ok);
  const hardConsole = consoleErrors.filter((e) => !/favicon|devtools|404.*\.map/i.test(e));

  if (fails.length > 0 || hardConsole.length > 0) return "FAIL";
  if (warns.length > 0) return "WARN";
  return "PASS";
}

function mdRow(c) {
  const status = c.ok ? "✓" : c.severity === "fail" ? "✗" : "⚠";
  const detail = c.ok ? "ok" : `expected ${JSON.stringify(c.expected)}, got ${JSON.stringify(c.actual)}`;
  return `| ${c.name} | ${status} | ${detail} |`;
}

const preview = spawn(
  "npx",
  ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
  { cwd: root, stdio: "ignore", env: { ...process.env } },
);

try {
  await waitForServer(baseUrl);
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  const routeResults = [];

  for (const route of ROUTES) {
    const routeConsole = [];
    const onConsole = (msg) => {
      if (msg.type() === "error") routeConsole.push(msg.text());
    };
    const onPageError = (err) => routeConsole.push(err.message);
    page.on("console", onConsole);
    page.on("pageerror", onPageError);

    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Investor", exact: true }).click();
    await page.waitForURL("**/investor**");
    await page.getByRole("link", { name: route.tabLabel, exact: true }).click();
    await page.waitForURL(`**${route.path}`);
    await page.waitForSelector(route.section, { state: "visible", timeout: 10000 });
    await page.waitForTimeout(300);

    const metrics = await page.evaluate(
      ({ sectionSel, titleSel, tabLabel, transparencyVisible }) => {
        const rect = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
        };

        const main = document.querySelector(".investor-main");
        const section = document.querySelector(sectionSel);
        const titleEl = document.querySelector(titleSel);
        const activeTab = document.querySelector(".investor-filter-nav__pill.is-active");
        const transparency = document.querySelector(".investor-transparency");
        const hero = document.querySelector(".investor-hero");
        const filterNav = document.querySelector(".investor-filter-nav");

        const imgs = [...document.querySelectorAll("img")].map((img) => ({
          src: img.currentSrc || img.src,
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
          visible: img.offsetParent !== null || getComputedStyle(img).display !== "none",
        }));

        const brokenImages = imgs.filter((img) => img.visible && img.complete && img.naturalWidth === 0);

        const docOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
        const bodyOverflow = document.body.scrollWidth > document.body.clientWidth + 1;
        const mainOverflow = main ? main.scrollWidth > main.clientWidth + 1 : false;

        const transparencyRect = transparency ? rect(transparency) : null;
        const transparencyDisplayed =
          transparency &&
          getComputedStyle(transparency).display !== "none" &&
          getComputedStyle(transparency).visibility !== "hidden" &&
          transparency.offsetHeight > 0;

        return {
          main: rect(main),
          section: rect(section),
          hero: rect(hero),
          filterNav: rect(filterNav),
          title: titleEl?.textContent?.trim() ?? null,
          activeTab: activeTab?.textContent?.trim() ?? null,
          expectedTab: tabLabel,
          transparencyVisible: Boolean(transparencyDisplayed),
          expectedTransparency: transparencyVisible,
          transparencyRect,
          brokenImages,
          imageCount: imgs.length,
          loadedImages: imgs.filter((i) => i.naturalWidth > 0).length,
          docOverflow,
          bodyOverflow,
          mainOverflow,
        };
      },
      {
        sectionSel: route.section,
        titleSel: route.titleSelector,
        tabLabel: route.tabLabel,
        transparencyVisible: route.transparencyVisible,
      },
    );

    const shotPath = path.join(outDir, `${route.slug}.png`);
    await page.locator(".investor-main").screenshot({ path: shotPath });

    const checks = [
      {
        name: "canvas width",
        ok: metrics.main?.width === 1280,
        expected: 1280,
        actual: metrics.main?.width,
        severity: "fail",
      },
      {
        name: "page section visible",
        ok: Boolean(metrics.section && metrics.section.height > 0),
        expected: "visible",
        actual: metrics.section,
        severity: "fail",
      },
      {
        name: "page title",
        ok: metrics.title === route.expectedTitle,
        expected: route.expectedTitle,
        actual: metrics.title,
        severity: "fail",
      },
      {
        name: "active filter tab",
        ok: metrics.activeTab === route.tabLabel,
        expected: route.tabLabel,
        actual: metrics.activeTab,
        severity: "fail",
      },
      {
        name: "transparency visibility",
        ok: metrics.transparencyVisible === route.transparencyVisible,
        expected: route.transparencyVisible,
        actual: metrics.transparencyVisible,
        severity: "fail",
      },
      {
        name: "horizontal overflow (document)",
        ok: !metrics.docOverflow,
        expected: false,
        actual: metrics.docOverflow,
        severity: "fail",
      },
      {
        name: "horizontal overflow (main)",
        ok: !metrics.mainOverflow,
        expected: false,
        actual: metrics.mainOverflow,
        severity: "warn",
      },
      {
        name: "images loaded",
        ok: metrics.brokenImages.length === 0,
        expected: 0,
        actual: metrics.brokenImages.length,
        severity: metrics.brokenImages.length > 0 ? "fail" : "pass",
      },
      {
        name: "hero margins (left edge)",
        ok: metrics.hero?.x === 0,
        expected: 0,
        actual: metrics.hero?.x,
        severity: "warn",
      },
      {
        name: "filter nav width",
        ok: metrics.filterNav?.width === 1280,
        expected: 1280,
        actual: metrics.filterNav?.width,
        severity: "warn",
      },
    ];

    const hardConsole = routeConsole.filter((e) => !/favicon|devtools|404.*\.map/i.test(e));
    checks.push({
      name: "console errors",
      ok: hardConsole.length === 0,
      expected: 0,
      actual: hardConsole.length,
      severity: hardConsole.length > 0 ? "fail" : "pass",
    });

    const status = gradeRoute(checks, routeConsole);

    routeResults.push({
      ...route,
      status,
      screenshot: shotPath,
      checks,
      metrics,
      consoleErrors: hardConsole,
      brokenImageSrcs: metrics.brokenImages.map((i) => i.src),
    });

    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }

  await browser.close();

  const timestamp = new Date().toISOString();
  const reportLines = [
    "# UI Verification — Batch 2",
    "",
    `**Date:** ${timestamp}`,
    `**Viewport:** ${viewport.width}×${viewport.height}px`,
    `**Base URL:** ${baseUrl}`,
    `**Navigation:** client-side from \`/investor\` via filter nav`,
    "",
    "## Summary",
    "",
    "| Route | Status | Screenshot |",
    "| --- | --- | --- |",
    ...routeResults.map(
      (r) => `| \`${r.path}\` | **${r.status}** | \`${path.relative(root, r.screenshot)}\` |`,
    ),
    "",
  ];

  for (const r of routeResults) {
    reportLines.push(`## ${r.path} — ${r.status}`, "");
    reportLines.push("### Checks", "", "| Check | | Detail |", "| --- | --- | --- |");
    reportLines.push(...r.checks.map(mdRow));
    reportLines.push("");

    if (r.brokenImageSrcs.length) {
      reportLines.push("### Broken images", "", ...r.brokenImageSrcs.map((s) => `- \`${s}\``), "");
    }
    if (r.consoleErrors.length) {
      reportLines.push("### Console errors", "", ...r.consoleErrors.map((e) => `- \`${e}\``), "");
    }

    reportLines.push(
      "### Layout metrics",
      "",
      "```json",
      JSON.stringify(
        {
          main: r.metrics.main,
          section: r.metrics.section,
          hero: r.metrics.hero,
          filterNav: r.metrics.filterNav,
          images: `${r.metrics.loadedImages}/${r.metrics.imageCount} loaded`,
          transparencyRect: r.metrics.transparencyRect,
        },
        null,
        2,
      ),
      "```",
      "",
    );
  }

  const blockers = routeResults.filter((r) => r.status === "FAIL");
  reportLines.push("## Blockers", "");
  if (blockers.length === 0) {
    reportLines.push("_None._");
  } else {
    for (const b of blockers) {
      const failed = b.checks.filter((c) => !c.ok && c.severity === "fail");
      reportLines.push(`- **${b.path}**: ${failed.map((c) => c.name).join(", ")}`);
    }
  }

  const reportPath = path.join(outDir, "REPORT.md");
  await writeFile(reportPath, reportLines.join("\n"), "utf8");

  console.log(
    JSON.stringify(
      {
        report: reportPath,
        summary: routeResults.map((r) => ({ path: r.path, status: r.status, blockers: r.consoleErrors })),
        allPass: routeResults.every((r) => r.status === "PASS"),
      },
      null,
      2,
    ),
  );

  process.exit(routeResults.some((r) => r.status === "FAIL") ? 1 : 0);
} finally {
  preview.kill("SIGTERM");
}
