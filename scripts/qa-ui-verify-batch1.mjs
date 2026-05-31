#!/usr/bin/env node
/**
 * UI verification — investor batch 1 (5 routes @ 1280px).
 * Usage: QA_PORT=5177 node scripts/qa-ui-verify-batch1.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.QA_PORT || 5177);
const BASE = `http://127.0.0.1:${PORT}/investor`;
const OUT_DIR = path.join(ROOT, "qa-screenshots/ui-verify/batch1");
const VIEWPORT = { width: 1280, height: 900 };

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
  },
  {
    slug: "policies",
    tabLabel: "Corporate Policies",
    urlSuffix: "/policies",
    selector: ".investor-policies",
    activeTab: "Corporate Policies",
    figmaNode: "1117:5551",
    figmaName: "Corporate Policies",
    expectTransparency: true,
  },
];

function statusFrom(issues, warnings) {
  if (issues.some((i) => i.severity === "fail")) return "FAIL";
  if (warnings.length > 0 || issues.some((i) => i.severity === "warn")) return "WARN";
  return "PASS";
}

async function checkImages(page) {
  return page.evaluate(() => {
    const broken = [];
    const imgs = [...document.querySelectorAll("img")];
    for (const img of imgs) {
      const rect = img.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0 && !img.complete) continue;
      if (!img.complete || img.naturalWidth === 0) {
        broken.push({ src: img.currentSrc || img.src, alt: img.alt || "" });
      }
    }
    const bgBroken = [];
    for (const el of document.querySelectorAll("*")) {
      const bg = getComputedStyle(el).backgroundImage;
      if (!bg || bg === "none") continue;
      const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (!m) continue;
      const url = m[1];
      if (url.startsWith("data:")) continue;
      // Playwright can't easily verify CSS bg loads; flag only if element is visible and url looks relative-broken
    }
    return { broken, bgBroken };
  });
}

async function checkClipping(page) {
  return page.evaluate(() => {
    const main = document.querySelector(".investor-main");
    if (!main) return { clipped: [], mainHeight: 0, mainScrollHeight: 0, overflow: "" };
    const mainRect = main.getBoundingClientRect();
    const mainStyle = getComputedStyle(main);
    const clipped = [];
    const selectors = [
      ".investor-hero",
      ".investor-filter-nav",
      ".investor-transparency",
      ".investor-grievance",
      ".investor-shareholding",
      ".investor-board",
      ".investor-policies",
      ".investor-documents",
      ".investor-shareholding__promo",
      ".investor-board-committee",
    ];
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (r.height === 0 && r.width === 0) continue;
        const bottom = r.bottom - mainRect.top;
        const mainH = mainRect.height;
        if (bottom > mainH + 2) {
          clipped.push({
            selector: sel,
            overflowPx: Math.round(bottom - mainH),
            id: el.id || null,
            className: el.className?.toString?.().slice(0, 80) || "",
          });
        }
      }
    }
    return {
      clipped,
      mainHeight: Math.round(mainRect.height),
      mainScrollHeight: main.scrollHeight,
      overflow: mainStyle.overflow,
    };
  });
}

async function checkOverlaps(page) {
  return page.evaluate(() => {
    const overlaps = [];
    const targets = [...document.querySelectorAll(".investor-filter-nav__pill.is-active, .investor-hero h1, .investor-grievance__title, .investor-shareholding__title, #investor-board-title, #investor-policies-title")];
    for (let i = 0; i < targets.length; i += 1) {
      const a = targets[i].getBoundingClientRect();
      for (let j = i + 1; j < targets.length; j += 1) {
        const b = targets[j].getBoundingClientRect();
        const intersect =
          a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        if (intersect) {
          overlaps.push({
            a: targets[i].className?.toString?.().slice(0, 60),
            b: targets[j].className?.toString?.().slice(0, 60),
          });
        }
      }
    }
    return overlaps;
  });
}

async function verifyRoute(page, route, consoleErrors, network404) {
  const issues = [];
  const warnings = [];
  const screenshotPath = path.join(OUT_DIR, `${route.slug}.png`);

  await page.setViewportSize(VIEWPORT);

  if (route.tabLabel) {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: route.tabLabel, exact: true }).click();
    await page.waitForURL(`**${route.urlSuffix}`, { timeout: 10000 });
  } else {
    await page.goto(BASE, { waitUntil: "networkidle" });
  }

  await page.waitForSelector(route.selector, { state: "visible", timeout: 10000 });
  await page.waitForTimeout(300);

  await page.screenshot({ path: screenshotPath, fullPage: true });

  const heroVisible = await page.locator(".investor-hero").isVisible();
  if (!heroVisible) {
    issues.push({ severity: "fail", message: "Hero section not visible" });
  }

  const activeTab = (await page.locator(".investor-filter-nav__pill.is-active").textContent())?.trim();
  if (activeTab !== route.activeTab) {
    issues.push({
      severity: "fail",
      message: `Active filter tab mismatch: expected "${route.activeTab}", got "${activeTab}"`,
    });
  }

  const ariaCurrent = await page.locator(".investor-filter-nav__pill.is-active").getAttribute("aria-current");
  if (ariaCurrent !== "page") {
    warnings.push({ message: `Active pill missing aria-current="page" (got ${ariaCurrent})` });
  }

  const outletVisible = await page.locator(route.selector).first().isVisible();
  if (!outletVisible) {
    issues.push({ severity: "fail", message: `Outlet content (${route.selector}) not visible` });
  }

  const transparencyVisible = await page.locator(".investor-transparency").isVisible();
  if (transparencyVisible !== route.expectTransparency) {
    issues.push({
      severity: route.expectTransparency ? "warn" : "fail",
      message: `Transparency band ${transparencyVisible ? "shown" : "hidden"} but design expects ${route.expectTransparency ? "shown" : "hidden"}`,
    });
  }

  const mainWidth = await page.locator(".investor-main").evaluate((el) => Math.round(el.getBoundingClientRect().width));
  if (mainWidth !== 1280) {
    issues.push({ severity: "fail", message: `.investor-main width is ${mainWidth}px, expected 1280px` });
  }

  const { broken } = await checkImages(page);
  if (broken.length > 0) {
    issues.push({
      severity: "fail",
      message: `${broken.length} broken <img> element(s)`,
      detail: broken.slice(0, 5),
    });
  }

  const route404 = network404.filter((u) => u.includes(route.urlSuffix || "/investor"));
  if (route404.length > 0) {
    issues.push({
      severity: "fail",
      message: `${route404.length} network 404(s) on page load`,
      detail: route404.slice(0, 5),
    });
  }

  const clipping = await checkClipping(page);
  if (clipping.overflow === "hidden" && clipping.clipped.length > 0) {
    const significant = clipping.clipped.filter((c) => c.overflowPx > 20);
    if (significant.length > 0) {
      issues.push({
        severity: "warn",
        message: `Content clipped by .investor-main (height ${clipping.mainHeight}px, overflow: hidden)`,
        detail: significant.slice(0, 5),
      });
    }
  }

  const overlaps = await checkOverlaps(page);
  if (overlaps.length > 0) {
    warnings.push({ message: "Possible element overlap detected", detail: overlaps });
  }

  const routeConsole = consoleErrors.slice();
  const pageErrors = routeConsole.filter((e) => e.type === "error");
  if (pageErrors.length > 0) {
    issues.push({
      severity: "fail",
      message: `${pageErrors.length} console error(s)`,
      detail: pageErrors.slice(0, 5),
    });
  }

  return {
    route: `/investor${route.urlSuffix}`,
    slug: route.slug,
    status: statusFrom(issues, warnings),
    figma: { node: route.figmaNode, name: route.figmaName },
    screenshot: `qa-screenshots/ui-verify/batch1/${route.slug}.png`,
    checks: {
      hero: heroVisible,
      activeTab,
      outlet: outletVisible,
      transparency: transparencyVisible,
      mainWidth,
      clipping,
      brokenImages: broken.length,
      consoleErrors: pageErrors.length,
    },
    issues,
    warnings,
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const consoleErrors = [];
  const network404 = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push({ type: "error", text: msg.text() });
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push({ type: "pageerror", text: err.message });
  });
  page.on("response", (res) => {
    if (res.status() === 404) {
      network404.push(res.url());
    }
  });

  const results = [];
  for (const route of ROUTES) {
    const startErrors = consoleErrors.length;
    const start404 = network404.length;
    const result = await verifyRoute(page, route, consoleErrors.slice(startErrors), network404.slice(start404));
    results.push(result);
    console.log(`${result.status.padEnd(4)} /investor${route.urlSuffix}`);
  }

  await browser.close();

  const criticalBlockers = results.reduce((n, r) => n + r.issues.filter((i) => i.severity === "fail").length, 0);

  const report = buildReport(results, criticalBlockers, PORT);
  const reportPath = path.join(OUT_DIR, "REPORT.md");
  await writeFile(reportPath, report, "utf8");

  console.log("\n" + report.split("\n").slice(0, 20).join("\n"));
  console.log(`\nReport: ${reportPath}`);
  console.log(`Critical blockers: ${criticalBlockers}`);
}

function buildReport(results, criticalBlockers, port) {
  const lines = [
    "# UI Verification — Investor Batch 1",
    "",
    `**Date:** ${new Date().toISOString().slice(0, 10)}`,
    `**Viewport:** 1280×900 (full-page screenshots)`,
    `**Server:** \`npm run dev\` @ port ${port}`,
    `**Figma file:** \`2cZtlXU663ataMAsZYzoGP\``,
    "",
    "## Summary",
    "",
    "| Route | Status | Figma node | Screenshot | Issues |",
    "|-------|--------|------------|------------|--------|",
  ];

  for (const r of results) {
    const issueCount = r.issues.length + r.warnings.length;
    lines.push(
      `| \`${r.route}\` | **${r.status}** | \`${r.figma.node}\` | [\`${r.slug}.png\`](./${r.slug}.png) | ${issueCount} |`,
    );
  }

  lines.push(
    "",
    `**Critical blockers (FAIL severity):** ${criticalBlockers}`,
    "",
    "---",
    "",
  );

  for (const r of results) {
    lines.push(`## ${r.route}`, "");
    lines.push(`- **Status:** ${r.status}`);
    lines.push(`- **Figma:** \`${r.figma.node}\` — ${r.figma.name}`);
    lines.push(`- **Screenshot:** \`${r.screenshot}\``);
    lines.push(`- **Hero:** ${r.checks.hero ? "visible" : "missing"}`);
    lines.push(`- **Active tab:** \`${r.checks.activeTab}\``);
    lines.push(`- **Outlet:** ${r.checks.outlet ? "visible" : "missing"}`);
    lines.push(`- **Transparency:** ${r.checks.transparency ? "shown" : "hidden"} (expected ${ROUTES.find((x) => x.slug === r.slug)?.expectTransparency ? "shown" : "hidden"})`);
    lines.push(`- **Canvas width:** ${r.checks.mainWidth}px`);
    lines.push(`- **Main height / overflow:** ${r.checks.clipping.mainHeight}px / \`${r.checks.clipping.overflow}\``);
    if (r.checks.clipping.clipped.length > 0) {
      lines.push(`- **Clipped elements:** ${r.checks.clipping.clipped.length}`);
    }
    lines.push(`- **Broken images:** ${r.checks.brokenImages}`);
    lines.push(`- **Console errors:** ${r.checks.consoleErrors}`);
    lines.push("");

    if (r.issues.length > 0) {
      lines.push("### Issues");
      for (const i of r.issues) {
        lines.push(`- **[${i.severity.toUpperCase()}]** ${i.message}`);
        if (i.detail) {
          lines.push("  ```json");
          lines.push(`  ${JSON.stringify(i.detail, null, 2).split("\n").join("\n  ")}`);
          lines.push("  ```");
        }
      }
      lines.push("");
    }

    if (r.warnings.length > 0) {
      lines.push("### Warnings");
      for (const w of r.warnings) {
        lines.push(`- ${w.message}`);
        if (w.detail) {
          lines.push("  ```json");
          lines.push(`  ${JSON.stringify(w.detail, null, 2).split("\n").join("\n  ")}`);
          lines.push("  ```");
        }
      }
      lines.push("");
    }

    lines.push("---", "");
  }

  return lines.join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
