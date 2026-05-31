/**
 * Visual QA — Batch D (4 routes, 2 passes @ 1280px).
 * Screenshots → qa-screenshots/visual-qa/pass{1,2}/batch-d/
 * Report → qa-screenshots/visual-qa/batch-d-REPORT.md
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
const viewport = { width: 1280, height: 2000 };
const visualRoot = path.join(root, "qa-screenshots", "visual-qa");
const PASSES = 2;

const PAGES = [
  {
    slug: "memorandum",
    path: "/investor/memorandum",
    link: "Memorandum of Association",
    selector: ".investor-memorandum",
    activeTab: "Memorandum of Association",
    figmaNode: "1131:2316",
    checks: async (page) => {
      const title = await page.locator("#investor-memorandum-title").innerText();
      const titleNorm = title.replace(/\s+/g, " ").trim();
      const expectedTitle = "Memorandum of Association and Articles of Association";
      const cardTitle = (await page.locator(".investor-memorandum__card-title").textContent())?.trim();
      const transparency = await page.locator(".investor-transparency").count();
      return [
        { name: "page title", ok: titleNorm === expectedTitle, expected: expectedTitle, actual: titleNorm },
        { name: "constitutional card", ok: cardTitle === "Constitutional Documents", expected: "Constitutional Documents", actual: cardTitle },
        { name: "transparency hidden", ok: transparency === 0, expected: 0, actual: transparency },
      ];
    },
  },
  {
    slug: "kmp",
    path: "/investor/kmp",
    link: "Authorized KMP's",
    selector: ".investor-kmp",
    activeTab: "Authorized KMP's",
    figmaNode: "1130:1288",
    checks: async (page) => {
      const cards = await page.locator(".investor-kmp-card").count();
      const transparency = await page.locator(".investor-transparency").count();
      const title = (await page.locator(".investor-kmp-title").textContent())?.trim();
      return [
        { name: "kmp profile cards", ok: cards === 5, expected: 5, actual: cards },
        { name: "section title present", ok: Boolean(title?.length), actual: title },
        { name: "transparency hidden", ok: transparency === 0, expected: 0, actual: transparency },
      ];
    },
  },
  {
    slug: "updates",
    path: "/investor/updates",
    link: "Updates",
    selector: ".investor-updates",
    activeTab: "Updates",
    figmaNode: "1131:2538",
    checks: async (page) => {
      const title = (await page.locator("#investor-updates-title").textContent())?.trim();
      const items = await page.locator(".investor-updates-item").count();
      const cta = await page.locator(".investor-updates-cta").count();
      const transparency = await page.locator(".investor-transparency").count();
      return [
        { name: "page title", ok: title === "Corporate Updates", expected: "Corporate Updates", actual: title },
        { name: "update list items", ok: items === 4, expected: 4, actual: items },
        { name: "subscribe CTA", ok: cta === 1, expected: 1, actual: cta },
        { name: "transparency hidden", ok: transparency === 0, expected: 0, actual: transparency },
      ];
    },
  },
  {
    slug: "reconciliation",
    path: "/investor/reconciliation",
    link: "Reconciliation",
    selector: ".investor-reconciliation",
    activeTab: "Reconciliation",
    figmaNode: "1131:1615",
    checks: async (page) => {
      const titleLines = await page.locator("#investor-reconciliation-title span").count();
      const cards = await page.locator(".investor-reconciliation-card").count();
      const cta = await page.locator(".investor-reconciliation-cta").count();
      const transparency = await page.locator(".investor-transparency").count();
      const activeYear = (await page.locator(".investor-year-tabs__pill.is-active").textContent())?.trim();
      return [
        { name: "two-line title", ok: titleLines === 2, expected: 2, actual: titleLines },
        { name: "reconciliation cards", ok: cards === 6, expected: 6, actual: cards },
        { name: "bottom CTA band", ok: cta === 1, expected: 1, actual: cta },
        { name: "default FY tab", ok: activeYear === "2025-26", expected: "2025-26", actual: activeYear },
        { name: "transparency hidden", ok: transparency === 0, expected: 0, actual: transparency },
      ];
    },
  },
];

function waitForServer(timeoutMs = 45000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(investorBase);
        if (res.ok) return resolve();
      } catch {
        /* retry */
      }
      if (Date.now() - start > timeoutMs) reject(new Error(`Preview not ready: ${investorBase}`));
      else setTimeout(tick, 250);
    };
    tick();
  });
}

async function shellMetrics(page, selector) {
  return page.evaluate((sel) => {
    const main = document.querySelector(".investor-main");
    const section = document.querySelector(sel);
    const activeTab = document.querySelector(".investor-filter-nav__pill.is-active");
    const transparency = document.querySelector(".investor-transparency");
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
    };
    const docEl = document.documentElement;
    const overflowX =
      docEl.scrollWidth > docEl.clientWidth + 1 || document.body.scrollWidth > window.innerWidth + 1;
    const mainScrollH = main?.scrollHeight ?? 0;
    const mainClientH = main?.clientHeight ?? 0;
    const mainClipped = mainScrollH > mainClientH + 2;
    const images = [...document.querySelectorAll(`${sel} img, .investor-hero img, .investor-filter-nav img`)];
    const brokenImages = images
      .filter((img) => img.naturalWidth === 0 && img.naturalHeight === 0 && img.getAttribute("src"))
      .map((img) => img.getAttribute("src")?.slice(-48) ?? "(no src)");
    return {
      main: rect(main),
      section: rect(section),
      activeTab: activeTab?.textContent?.trim() ?? null,
      hasTransparency: Boolean(transparency),
      overflowX,
      mainClipped,
      mainScrollH,
      mainClientH,
      brokenImages,
    };
  }, selector);
}

async function verifyPage(page, config, pass) {
  const checks = [];
  const fail = (name, detail) => checks.push({ name, ok: false, ...detail });
  const passCheck = (name, detail = {}) => checks.push({ name, ok: true, ...detail });

  const outDir = path.join(visualRoot, `pass${pass}`, "batch-d");
  await mkdir(outDir, { recursive: true });

  await page.setViewportSize(viewport);
  await page.goto(investorBase, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: config.link, exact: true }).click();
  await page.waitForURL(`**${config.path}`);
  await page.waitForSelector(config.selector, { state: "attached", timeout: 15000 });

  if (page.url().includes(config.path)) passCheck("client-nav route");
  else fail("client-nav route", { expected: config.path, actual: page.url() });

  const metrics = await shellMetrics(page, config.selector);

  if (metrics.main?.width === 1280) passCheck("canvas width 1280");
  else fail("canvas width 1280", { expected: 1280, actual: metrics.main?.width });

  if (metrics.activeTab === config.activeTab) passCheck("active filter tab");
  else fail("active filter tab", { expected: config.activeTab, actual: metrics.activeTab });

  if (!metrics.hasTransparency) passCheck("transparency hidden");
  else fail("transparency hidden", { actual: "visible" });

  if (!metrics.overflowX) passCheck("no horizontal overflow");
  else fail("no horizontal overflow");

  if (metrics.brokenImages.length === 0) passCheck("images load");
  else fail("images load", { actual: metrics.brokenImages });

  if (!metrics.mainClipped) passCheck("main outlet not clipped");
  else
    fail("main outlet not clipped", {
      actual: `scroll ${metrics.mainScrollH} > client ${metrics.mainClientH}`,
    });

  const contentChecks = await config.checks(page);
  for (const c of contentChecks) {
    if (c.ok) passCheck(c.name, c.actual ? { actual: c.actual } : {});
    else fail(c.name, { expected: c.expected, actual: c.actual });
  }

  const shotPath = path.join(outDir, `${config.slug}.png`);
  await page.locator(".investor-main").screenshot({ path: shotPath });
  metrics.screenshot = path.relative(root, shotPath);

  return {
    slug: config.slug,
    route: config.path,
    figmaNode: config.figmaNode,
    pass,
    ok: checks.every((c) => c.ok),
    checks,
    metrics,
  };
}

function buildReport(allResults) {
  const bySlug = {};
  for (const r of allResults) {
    if (!bySlug[r.slug]) bySlug[r.slug] = [];
    bySlug[r.slug].push(r);
  }

  const routePass = (slug) => bySlug[slug].every((r) => r.ok);
  const overallPass = allResults.every((r) => r.ok);

  const lines = [
    "# Visual QA — Batch D",
    "",
    `**Date:** ${new Date().toISOString().slice(0, 10)}`,
    `**Viewport:** ${viewport.width}px (Playwright)`,
    `**Passes:** ${PASSES}`,
    `**Figma file:** \`2cZtlXU663ataMAsZYzoGP\``,
    `**Overall:** ${overallPass ? "PASS" : "FAIL"}`,
    "",
    "## Figma nodes",
    "",
    "| Route | Node |",
    "|-------|------|",
    "| `/investor/memorandum` | `1131:2316` |",
    "| `/investor/kmp` | `1130:1288` |",
    "| `/investor/updates` | `1131:2538` (list `1131:2733`) |",
    "| `/investor/reconciliation` | `1131:1615` (CTA `1131:1980`) |",
    "",
    "## Summary",
    "",
    "| Route | Pass 1 | Pass 2 | Status |",
    "|-------|--------|--------|--------|",
  ];

  for (const slug of ["memorandum", "kmp", "updates", "reconciliation"]) {
    const passes = bySlug[slug] ?? [];
    const p1 = passes.find((p) => p.pass === 1);
    const p2 = passes.find((p) => p.pass === 2);
    const status = routePass(slug) ? "PASS" : "**FAIL**";
    lines.push(
      `| \`/investor/${slug}\` | ${p1?.ok ? "PASS" : "FAIL"} | ${p2?.ok ? "PASS" : "FAIL"} | ${status} |`,
    );
  }

  lines.push("", "## Checks (both passes must pass)", "");

  for (const slug of ["memorandum", "kmp", "updates", "reconciliation"]) {
    const passes = bySlug[slug] ?? [];
    lines.push(`### /investor/${slug}`, "");
    for (const r of passes) {
      lines.push(`**Pass ${r.pass}** — screenshot: \`${r.metrics.screenshot}\``, "");
      for (const c of r.checks) {
        const icon = c.ok ? "✓" : "✗";
        let line = `- ${icon} **${c.name}**`;
        if (!c.ok && (c.expected !== undefined || c.actual !== undefined)) {
          line += ` — expected: \`${JSON.stringify(c.expected)}\`, actual: \`${JSON.stringify(c.actual)}\``;
        }
        lines.push(line);
      }
      lines.push("");
    }
  }

  lines.push("## Visual review", "");
  lines.push(
    "Compare implementation screenshots under `qa-screenshots/visual-qa/pass{1,2}/batch-d/` with Figma reference PNGs in `qa-screenshots/visual-qa/figma/batch-d/`.",
  );
  lines.push("", "## Blockers", "");
  const blockers = Object.keys(bySlug).filter((slug) => !routePass(slug));
  if (blockers.length === 0) lines.push("_None — automated checks passed on both passes._");
  else {
    for (const slug of blockers) {
      const failedNames = new Set();
      for (const r of bySlug[slug].filter((x) => !x.ok)) {
        for (const c of r.checks.filter((x) => !x.ok)) failedNames.add(c.name);
      }
      lines.push(`- **\`/investor/${slug}\`:** ${[...failedNames].join(", ")}`);
    }
  }

  return { content: lines.join("\n"), overallPass };
}

const preview = spawn(
  "npx",
  ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
  { cwd: root, stdio: "ignore", env: { ...process.env } },
);

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const allResults = [];

  for (let pass = 1; pass <= PASSES; pass += 1) {
    for (const config of PAGES) {
      try {
        allResults.push(await verifyPage(page, config, pass));
      } catch (err) {
        allResults.push({
          slug: config.slug,
          route: config.path,
          pass,
          ok: false,
          checks: [{ name: "run error", ok: false, actual: err.message }],
          metrics: { screenshot: null },
        });
      }
    }
  }

  await browser.close();

  const { content, overallPass } = buildReport(allResults);
  const reportPath = path.join(visualRoot, "batch-d-REPORT.md");
  await mkdir(visualRoot, { recursive: true });
  await writeFile(reportPath, content, "utf8");

  console.log(
    JSON.stringify(
      {
        reportPath: path.relative(root, reportPath),
        overallPass,
        results: allResults.map((r) => ({
          slug: r.slug,
          pass: r.pass,
          ok: r.ok,
          screenshot: r.metrics?.screenshot,
        })),
      },
      null,
      2,
    ),
  );
  process.exit(overallPass ? 0 : 1);
} catch (err) {
  console.error(err);
  process.exit(2);
} finally {
  preview.kill("SIGTERM");
}
