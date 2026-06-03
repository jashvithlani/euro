/**
 * 3-pass visual QA for /dealers vs Figma 1079:3487 expectations.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:5173";
const outRoot = path.join(root, "qa-screenshots", "dealers-qa");
const PASSES = 3;

const EXPECT = {
  formWidth: 1024,
  formMinHeight: 1200,
  footprintWidth: 1184,
  footprintHeight: 610.5,
  h1FontSize: 72,
  cardCount: 4,
  statLabels: ["Active Outlets", "States Reached"],
  footprintKicker: "Regional Powerhouse",
  footprintTitlePart: "Western India",
  removedFields: ["Warehouse Capacity", "GST Certificate"],
};

async function runChecks(page) {
  return page.evaluate((expect) => {
    const rect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height), top: Math.round(r.top) };
    };
    const text = (sel) => document.querySelector(sel)?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const count = (sel) => document.querySelectorAll(sel).length;
    const labels = [...document.querySelectorAll(".dealers-field span, .dealers-upload span")].map((n) =>
      n.textContent?.trim(),
    );
    const order = [".dealers-form-section", ".dealers-partnership > h2", ".dealers-why", ".dealers-footprint"]
      .map((sel) => ({ sel, top: rect(sel)?.top ?? -1 }))
      .sort((a, b) => a.top - b.top)
      .map((x) => x.sel);

    return {
      form: rect(".dealers-form-section"),
      footprint: rect(".dealers-footprint"),
      h1Size: getComputedStyle(document.querySelector(".dealers-hero-block h1")).fontSize,
      cardCount: count(".dealers-card"),
      footprintKicker: text(".dealers-footprint-copy > span"),
      footprintTitle: text(".dealers-footprint h2"),
      stats: [...document.querySelectorAll(".dealers-footprint-stat small")].map((n) => n.textContent?.trim()),
      labels,
      order,
      hasUpload: !!document.querySelector(".dealers-upload"),
      hasHeroPill: !!document.querySelector(".dealers-pill"),
    };
  }, EXPECT);
}

function evaluatePass(data, pass) {
  const issues = [];

  if (!data.hasHeroPill) issues.push("missing hero pill");
  if (data.hasUpload) issues.push("GST upload field should be removed");
  if (EXPECT.removedFields.some((f) => data.labels.some((l) => l?.includes(f)))) {
    issues.push("warehouse/GST fields still present");
  }
  if (data.cardCount !== EXPECT.cardCount) issues.push(`card count ${data.cardCount} !== ${EXPECT.cardCount}`);
  if (data.footprintKicker !== EXPECT.footprintKicker) {
    issues.push(`kicker "${data.footprintKicker}" !== "${EXPECT.footprintKicker}"`);
  }
  if (!data.footprintTitle.includes(EXPECT.footprintTitlePart)) {
    issues.push(`footprint title missing "${EXPECT.footprintTitlePart}"`);
  }
  if (!EXPECT.statLabels.every((s) => data.stats.some((t) => t?.includes(s)))) {
    issues.push(`stats mismatch: ${data.stats.join(", ")}`);
  }
  if (Math.abs((data.form?.width ?? 0) - EXPECT.formWidth) > 2) {
    issues.push(`form width ${data.form?.width} !== ${EXPECT.formWidth}`);
  }
  if ((data.form?.height ?? 0) < EXPECT.formMinHeight) {
    issues.push(`form height ${data.form?.height} < ${EXPECT.formMinHeight}`);
  }
  if (Math.abs((data.footprint?.width ?? 0) - EXPECT.footprintWidth) > 2) {
    issues.push(`footprint width ${data.footprint?.width} !== ${EXPECT.footprintWidth}`);
  }
  if (parseFloat(data.h1Size) !== EXPECT.h1FontSize) {
    issues.push(`h1 font-size ${data.h1Size} !== ${EXPECT.h1FontSize}px`);
  }
  const expectedOrder = [
    ".dealers-form-section",
    ".dealers-partnership > h2",
    ".dealers-why",
    ".dealers-footprint",
  ];
  if (JSON.stringify(data.order) !== JSON.stringify(expectedOrder)) {
    issues.push(`section order ${data.order.join(" → ")}`);
  }

  return {
    pass,
    ok: issues.length === 0,
    issues,
    data,
    screenshot: `qa-screenshots/dealers-qa/pass-${pass}.png`,
  };
}

async function main() {
  await mkdir(outRoot, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const results = [];

  for (let pass = 1; pass <= PASSES; pass++) {
    await page.goto(`${baseUrl}/dealers`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(800);
    const shot = path.join(outRoot, `pass-${pass}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    const data = await runChecks(page);
    results.push(evaluatePass(data, pass));
  }

  await browser.close();

  const report = [
    "# Dealers page QA (3 passes)",
    "",
    `Figma: [1079:3487](https://www.figma.com/design/2cZtlXU663ataMAsZYzoGP/EURO-WEBSITE-YASHVI?node-id=1079-3487&m=dev)`,
    `URL: ${baseUrl}/dealers`,
    "",
    ...results.map((r) => {
      const status = r.ok ? "PASS" : "FAIL";
      const lines = [`## Pass ${r.pass} — ${status}`, "", `Screenshot: \`${r.screenshot}\``];
      if (r.issues.length) {
        lines.push("", "**Issues:**", ...r.issues.map((i) => `- ${i}`));
      } else {
        lines.push("", "All automated checks passed.");
      }
      lines.push("");
      return lines.join("\n");
    }),
  ].join("\n");

  await writeFile(path.join(outRoot, "REPORT.md"), report);
  console.log(report);

  if (results.some((r) => !r.ok)) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
