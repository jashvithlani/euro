/**
 * Visual QA — Batch B (policies, governance, annual, secretarial).
 * 2 passes @ 1280px → qa-screenshots/visual-qa/pass{1,2}/batch-b/
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = 4322;
const baseUrl = `http://127.0.0.1:${port}`;
const viewport = { width: 1280, height: 2200 };
const PASSES = 2;

const ROUTES = [
  {
    slug: "policies",
    path: "/investor/policies",
    figmaNode: "1117:5551",
    tabLabel: "Corporate Policies",
    section: ".investor-policies",
    titleSelector: "#investor-policies-title",
    expectedTitle: "Corporate Policies",
    transparencyVisible: true,
    extra: async (page) => {
      const cardCount = await page.locator(".investor-policy-card").count();
      return [{ name: "policy cards", ok: cardCount === 12, expected: 12, actual: cardCount, severity: "fail" }];
    },
  },
  {
    slug: "governance",
    path: "/investor/governance",
    figmaNode: "1117:5978",
    tabLabel: "Corporate Governance Reports",
    section: ".investor-governance",
    titleSelector: "#investor-governance-title",
    expectedTitle: "Corporate Governance Reports",
    transparencyVisible: true,
    extra: async (page) => {
      const cardCount = await page.locator(".investor-grid-card").count();
      return [{ name: "governance cards", ok: cardCount === 3, expected: 3, actual: cardCount, severity: "fail" }];
    },
  },
  {
    slug: "annual",
    path: "/investor/annual",
    figmaNode: "1130:449",
    tabLabel: "Annual Reports",
    section: ".investor-annual",
    titleSelector: "#investor-annual-title",
    expectedTitle: "Annual Reports",
    transparencyVisible: false,
    extra: async (page) => {
      const archiveCards =
        (await page.locator(".investor-annual__archive-card").count()) +
        (await page.locator(".investor-annual__request-card").count());
      const integrated = await page.locator(".investor-annual__integrated-copy h4").textContent();
      return [
        {
          name: "archive grid items",
          ok: archiveCards === 8,
          expected: 8,
          actual: archiveCards,
          severity: "fail",
        },
        {
          name: "integrated report title",
          ok: integrated?.trim() === "Integrated Annual Report 2024 - 25",
          expected: "Integrated Annual Report 2024 - 25",
          actual: integrated?.trim(),
          severity: "fail",
        },
      ];
    },
  },
  {
    slug: "secretarial",
    path: "/investor/secretarial",
    figmaNode: "1130:887",
    tabLabel: "Annual Secretarial Compliance Report",
    section: ".secretarial-page",
    titleSelector: ".secretarial-page__title",
    expectedTitle: "Annual Secretarial Compliance Report",
    transparencyVisible: false,
    extra: async (page) => {
      const reportCards = await page.locator(".secretarial-report-card").count();
      return [
        {
          name: "secretarial report cards",
          ok: reportCards >= 4,
          expected: ">=4",
          actual: reportCards,
          severity: "fail",
        },
      ];
    },
  },
];

function waitForServer(url, timeoutMs = 25000) {
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

async function captureRoute(page, route, pass) {
  const outDir = path.join(root, "qa-screenshots", "visual-qa", `pass${pass}`, "batch-b");
  await mkdir(outDir, { recursive: true });

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
        return {
          x: Math.round(r.x),
          y: Math.round(r.y),
          width: Math.round(r.width),
          height: Math.round(r.height),
        };
      };

      const main = document.querySelector(".investor-main");
      const section = document.querySelector(sectionSel);
      const titleEl = document.querySelector(titleSel);
      const activeTab = document.querySelector(".investor-filter-nav__pill.is-active");
      const transparency = document.querySelector(".investor-transparency");

      const imgs = [...document.querySelectorAll("img")].map((img) => ({
        src: img.currentSrc || img.src,
        naturalWidth: img.naturalWidth,
        complete: img.complete,
        visible: img.offsetParent !== null || getComputedStyle(img).display !== "none",
      }));
      const brokenImages = imgs.filter((img) => img.visible && img.complete && img.naturalWidth === 0);

      const transparencyDisplayed =
        transparency &&
        getComputedStyle(transparency).display !== "none" &&
        getComputedStyle(transparency).visibility !== "hidden" &&
        transparency.offsetHeight > 0;

      return {
        main: rect(main),
        section: rect(section),
        title: titleEl?.textContent?.trim() ?? null,
        activeTab: activeTab?.textContent?.trim() ?? null,
        expectedTab: tabLabel,
        transparencyVisible: Boolean(transparencyDisplayed),
        expectedTransparency: transparencyVisible,
        brokenImages,
        docOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        mainOverflow: main ? main.scrollWidth > main.clientWidth + 1 : false,
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
      name: "images loaded",
      ok: metrics.brokenImages.length === 0,
      expected: 0,
      actual: metrics.brokenImages.length,
      severity: "fail",
    },
    ...(route.extra ? await route.extra(page) : []),
  ];

  const hardConsole = routeConsole.filter((e) => !/favicon|devtools|404.*\.map/i.test(e));
  checks.push({
    name: "console errors",
    ok: hardConsole.length === 0,
    expected: 0,
    actual: hardConsole.length,
    severity: hardConsole.length > 0 ? "fail" : "pass",
  });

  page.off("console", onConsole);
  page.off("pageerror", onPageError);

  return {
    pass,
    slug: route.slug,
    path: route.path,
    figmaNode: route.figmaNode,
    status: gradeRoute(checks, routeConsole),
    screenshot: shotPath,
    checks,
    metrics,
    consoleErrors: hardConsole,
  };
}

const preview = spawn(
  "npx",
  ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
  { cwd: root, stdio: "ignore", env: { ...process.env } },
);

try {
  await waitForServer(baseUrl);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  const allResults = [];

  for (let pass = 1; pass <= PASSES; pass += 1) {
    for (const route of ROUTES) {
      allResults.push(await captureRoute(page, route, pass));
    }
  }

  await browser.close();

  const jsonPath = path.join(root, "qa-screenshots", "visual-qa", "batch-b-results.json");
  await mkdir(path.dirname(jsonPath), { recursive: true });
  await writeFile(jsonPath, JSON.stringify({ baseUrl, viewport, passes: PASSES, results: allResults }, null, 2));

  const bySlug = {};
  for (const r of allResults) {
    if (!bySlug[r.slug]) bySlug[r.slug] = [];
    bySlug[r.slug].push(r);
  }

  const summary = Object.entries(bySlug).map(([slug, runs]) => {
    const statuses = runs.map((r) => r.status);
    const passConsistent = runs.every((r) => r.status === runs[0].status);
    const worst =
      statuses.includes("FAIL") ? "FAIL" : statuses.includes("WARN") ? "WARN" : "PASS";
    return { slug, worst, passConsistent, runs: runs.map((r) => ({ pass: r.pass, status: r.status })) };
  });

  console.log(JSON.stringify({ jsonPath, summary, allPass: summary.every((s) => s.worst === "PASS") }, null, 2));
  process.exit(summary.some((s) => s.worst === "FAIL") ? 1 : 0);
} finally {
  preview.kill("SIGTERM");
}
