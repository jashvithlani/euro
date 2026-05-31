/**
 * Visual QA — Batch C (4 investor routes, 2 passes @ 1280px).
 * Screenshots → qa-screenshots/visual-qa/pass{1,2}/batch-c/{slug}.png
 * Report JSON → qa-screenshots/visual-qa/batch-c-results.json
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
const viewportWidth = 1280;

const PAGES = [
  {
    slug: "announcements",
    path: "/investor/announcements",
    link: "Corporate Announcements",
    selector: ".investor-announcements",
    titleSelector: "#investor-announcements-title",
    expectedTitle: "Corporate Announcements",
    activeTab: "Corporate Announcements",
    expectTransparency: true,
    viewportHeight: 2600,
    figmaNode: "1117:6898",
  },
  {
    slug: "agm",
    path: "/investor/agm",
    link: "AGM/EGM",
    selector: ".investor-agm",
    titleSelector: "#investor-agm-title",
    expectedTitle: "AGM/EGM",
    activeTab: "AGM/EGM",
    expectTransparency: false,
    viewportHeight: 1800,
    figmaNode: "1119:7391",
  },
  {
    slug: "financial",
    path: "/investor/financial",
    link: "Financial Information",
    selector: ".investor-financial",
    titleSelector: "#investor-financial-title",
    expectedTitle: "Financial Information",
    activeTab: "Financial Information",
    expectTransparency: false,
    viewportHeight: 1550,
    figmaNode: "1130:37",
  },
  {
    slug: "dispute",
    path: "/investor/dispute",
    link: "Online Dispute Resolution",
    selector: ".investor-dispute",
    titleSelector: "#investor-dispute-title",
    expectedTitle: "Online Dispute Resolution",
    activeTab: "Online Dispute Resolution",
    expectTransparency: false,
    viewportHeight: 1750,
    figmaNode: "1131:1994",
    trustSelector: ".investor-dispute-trust__visual img",
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
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Preview not ready: ${investorBase}`));
        return;
      }
      setTimeout(tick, 250);
    };
    tick();
  });
}

async function verifyPage(page, config, pass) {
  const checks = [];
  const fail = (name, detail) => checks.push({ name, ok: false, severity: "fail", ...detail });
  const warn = (name, detail) => checks.push({ name, ok: false, severity: "warn", ...detail });
  const passCheck = (name, detail = {}) => checks.push({ name, ok: true, severity: "pass", ...detail });

  const outDir = path.join(root, "qa-screenshots", "visual-qa", `pass${pass}`, "batch-c");
  await mkdir(outDir, { recursive: true });

  await page.setViewportSize({ width: viewportWidth, height: config.viewportHeight });
  await page.goto(investorBase, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: config.link, exact: true }).click();
  await page.waitForURL(`**${config.path}`);
  await page.waitForSelector(config.selector, { state: "attached", timeout: 12000 });

  const title = await page.locator(config.titleSelector).textContent();
  if (title?.trim() === config.expectedTitle) passCheck("page title", { actual: title?.trim() });
  else fail("page title", { expected: config.expectedTitle, actual: title?.trim() });

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

    const images = [...document.querySelectorAll(`${sel} img, .investor-dispute-trust img, .investor-hero img`)];
    const brokenImages = images
      .filter((img) => {
        const src = img.getAttribute("src") ?? "";
        const box = img.getBoundingClientRect();
        if (box.width > 0 && box.height > 0) return false;
        if (/\.svg($|\?|#)/i.test(src) || src.includes("image/svg") || src.startsWith("data:")) {
          return false;
        }
        return img.naturalWidth === 0 && img.naturalHeight === 0 && src.length > 0;
      })
      .map((img) => img.getAttribute("src")?.slice(-72) ?? "(no src)");

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

    const trustImg = document.querySelector(".investor-dispute-trust__visual img");
    const trustNatural = trustImg?.naturalWidth ?? null;

    const titleEl = section?.querySelector("h2, .investor-financial__title");
    const titleStyle = titleEl ? getComputedStyle(titleEl) : null;

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
      trustNatural,
      titleFontSize: titleStyle ? Math.round(parseFloat(titleStyle.fontSize)) : null,
      imageCount: images.length,
    };
  }, config.selector);

  if (metrics.main?.width === viewportWidth) passCheck("canvas width 1280");
  else fail("canvas width 1280", { expected: viewportWidth, actual: metrics.main?.width });

  const sectionVisible = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (r.width >= 1 && r.height >= 1) return true;
    const child = el.querySelector("[class*='card'], h2, article, .investor-dispute__integrated");
    if (child) {
      const cr = child.getBoundingClientRect();
      return cr.width > 0 && cr.height > 0;
    }
    return false;
  }, config.selector);
  if (sectionVisible) passCheck("section content painted");
  else fail("section content painted", { actual: metrics.section });

  if (metrics.activeTab === config.activeTab) passCheck("active filter tab");
  else fail("active filter tab", { expected: config.activeTab, actual: metrics.activeTab });

  if (metrics.hasTransparency === config.expectTransparency) passCheck("transparency visibility");
  else
    fail("transparency visibility", {
      expected: config.expectTransparency,
      actual: metrics.hasTransparency,
    });

  if (!metrics.overflowX) passCheck("no horizontal overflow");
  else fail("no horizontal overflow");

  if (metrics.brokenImages.length === 0) passCheck("images load", { actual: `${metrics.imageCount} imgs` });
  else fail("images load", { actual: metrics.brokenImages });

  const marginOk =
    metrics.marginLeft !== null &&
    metrics.marginLeft >= 0 &&
    metrics.marginLeft <= 48 &&
    (metrics.marginRight === null || (metrics.marginRight >= 0 && metrics.marginRight <= 48));
  if (marginOk) passCheck("content alignment", { actual: `L${metrics.marginLeft} R${metrics.marginRight}` });
  else fail("content alignment", { actual: `L${metrics.marginLeft} R${metrics.marginRight}` });

  if (!metrics.mainClipped) passCheck("main outlet not clipped");
  else warn("main outlet not clipped", { actual: `scroll ${metrics.mainScrollH} > client ${metrics.mainClientH}` });

  if (metrics.titleFontSize === 32) passCheck("title font size 32px");
  else warn("title font size 32px", { expected: 32, actual: metrics.titleFontSize });

  if (config.slug === "dispute") {
    if (metrics.trustNatural && metrics.trustNatural > 0) passCheck("trust photo loads (1131:2315)");
    else fail("trust photo loads (1131:2315)", { actual: metrics.trustNatural });
  }

  const shotPath = path.join(outDir, `${config.slug}.png`);
  await page.locator(".investor-main").screenshot({ path: shotPath });

  const hardFails = checks.filter((c) => !c.ok && c.severity === "fail");
  const grade = hardFails.length > 0 ? "FAIL" : checks.some((c) => !c.ok) ? "WARN" : "PASS";

  return {
    slug: config.slug,
    route: config.path,
    figmaNode: config.figmaNode,
    pass,
    grade,
    ok: grade !== "FAIL",
    checks,
    metrics,
    screenshot: shotPath,
  };
}

function buildMarkdown(allPasses, meta) {
  const bySlug = {};
  for (const r of allPasses) {
    if (!bySlug[r.slug]) bySlug[r.slug] = { pass1: null, pass2: null };
    bySlug[r.slug][`pass${r.pass}`] = r;
  }

  const overallFail = allPasses.some((r) => r.grade === "FAIL");
  const overallWarn = !overallFail && allPasses.some((r) => r.grade === "WARN");

  const lines = [
    "# Visual QA — Batch C",
    "",
    `**Date:** ${meta.date}`,
    `**Viewport:** ${viewportWidth}px width (per-route height)`,
    `**Figma file:** \`2cZtlXU663ataMAsZYzoGP\``,
    `**Overall:** ${overallFail ? "**FAIL**" : overallWarn ? "WARN" : "PASS"}`,
    "",
    "## Summary",
    "",
    "| Route | Figma | Pass 1 | Pass 2 | Screenshot (pass 2) |",
    "|-------|-------|--------|--------|---------------------|",
  ];

  for (const [slug, passes] of Object.entries(bySlug)) {
    const p1 = passes.pass1;
    const p2 = passes.pass2;
    const route = p1?.route ?? p2?.route;
    const node = p1?.figmaNode ?? p2?.figmaNode;
    const shot = p2?.screenshot ? path.relative(root, p2.screenshot) : "—";
    lines.push(
      `| \`${route}\` | \`${node}\` | ${p1?.grade ?? "—"} | ${p2?.grade ?? "—"} | \`${shot}\` |`,
    );
  }

  lines.push("", "## Checks (pass 2)", "");

  for (const [slug, passes] of Object.entries(bySlug)) {
    const r = passes.pass2 ?? passes.pass1;
    if (!r) continue;
    lines.push(`### ${r.route} (\`${r.figmaNode}\`)`, "");
    for (const c of r.checks) {
      const icon = c.ok ? "✓" : c.severity === "warn" ? "⚠" : "✗";
      let line = `- ${icon} **${c.name}**`;
      if (!c.ok) line += ` — expected \`${JSON.stringify(c.expected)}\`, actual \`${JSON.stringify(c.actual)}\``;
      else if (c.actual) line += ` (${c.actual})`;
      lines.push(line);
    }
    lines.push("");
  }

  const regressions = [];
  for (const [slug, passes] of Object.entries(bySlug)) {
    if (!passes.pass1 || !passes.pass2) continue;
    if (passes.pass1.grade === "FAIL" && passes.pass2.grade !== "FAIL") {
      regressions.push(`- \`${passes.pass1.route}\`: improved ${passes.pass1.grade} → ${passes.pass2.grade}`);
    } else if (passes.pass1.grade !== "FAIL" && passes.pass2.grade === "FAIL") {
      regressions.push(`- \`${passes.pass1.route}\`: regressed ${passes.pass1.grade} → ${passes.pass2.grade}`);
    } else if (passes.pass1.grade !== passes.pass2.grade) {
      regressions.push(`- \`${passes.pass1.route}\`: ${passes.pass1.grade} → ${passes.pass2.grade}`);
    }
  }

  lines.push("## Pass 1 vs Pass 2", "");
  if (regressions.length === 0) lines.push("_Stable — no grade changes between passes._");
  else regressions.forEach((l) => lines.push(l));

  const blockers = allPasses.filter((r) => r.pass === 2 && r.grade === "FAIL");
  lines.push("", "## Blockers (pass 2)", "");
  if (blockers.length === 0) {
    lines.push("_None — all routes passed automated checks on pass 2._");
  } else {
    for (const r of blockers) {
      const failed = r.checks.filter((c) => !c.ok && c.severity === "fail").map((c) => c.name);
      lines.push(`- **\`${r.route}\`** (\`${r.figmaNode}\`): ${failed.join(", ")}`);
    }
  }

  lines.push("", "## Artifacts", "");
  lines.push("- Impl: `qa-screenshots/visual-qa/pass{1,2}/batch-c/*.png`");
  lines.push("- Figma refs: `qa-screenshots/visual-qa/figma/batch-c/*.png` (if downloaded)");

  return lines.join("\n");
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

  for (let pass = 1; pass <= 2; pass += 1) {
    for (const config of PAGES) {
      try {
        allResults.push(await verifyPage(page, config, pass));
      } catch (err) {
        allResults.push({
          slug: config.slug,
          route: config.path,
          figmaNode: config.figmaNode,
          pass,
          grade: "FAIL",
          ok: false,
          checks: [{ name: "run error", ok: false, severity: "fail", actual: err.message }],
          metrics: {},
          screenshot: null,
        });
      }
    }
  }

  await browser.close();

  const jsonPath = path.join(root, "qa-screenshots", "visual-qa", "batch-c-results.json");
  await mkdir(path.dirname(jsonPath), { recursive: true });
  await writeFile(jsonPath, JSON.stringify(allResults, null, 2), "utf8");

  const reportPath = path.join(root, "qa-screenshots", "visual-qa", "batch-c-REPORT.md");
  const report = buildMarkdown(allResults, { date: new Date().toISOString().slice(0, 10) });
  await writeFile(reportPath, report, "utf8");

  const pass2 = allResults.filter((r) => r.pass === 2);
  const summary = {
    reportPath,
    jsonPath,
    allPassed: pass2.every((r) => r.ok),
    pass2: pass2.map((r) => ({ route: r.route, grade: r.grade, slug: r.slug })),
  };
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.allPassed ? 0 : 1);
} catch (err) {
  console.error(err);
  process.exit(2);
} finally {
  preview.kill("SIGTERM");
}
