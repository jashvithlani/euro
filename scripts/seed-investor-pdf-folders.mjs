#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { agmYears, getAgmContent } from "../src/pages/investor/agm/agm-content.js";
import {
  calendarYearTabs as announcementCalendarYears,
  fyYearTabs as announcementFyYears,
  getAnnouncementGroups,
  getCalendarAnnouncementCards,
} from "../src/pages/investor/announcements/announcement-content.js";
import {
  annualArchiveYears,
  annualFeaturedYears,
} from "../src/pages/investor/annual/annual-reports-data.js";
import {
  financialYearTabs,
  getFinancialDocuments,
} from "../src/pages/investor/financial/financial-content.js";
import {
  getGovernanceDocuments,
  governanceYears,
} from "../src/pages/investor/governance/governance-content.js";
import {
  policiesDocumentGroups,
} from "../src/pages/investor/policies/policies-content.js";
import {
  getReconciliationDocuments,
  reconciliationYears,
} from "../src/pages/investor/reconciliation/reconciliation-content.js";
import {
  complianceReports,
} from "../src/pages/investor/secretarial/secretarial-content.js";
import {
  shareholdingDocumentsByYear,
  shareholdingYears,
} from "../src/pages/investor/shareholding/shareholding-data.js";
import {
  fyYearTabs as updateYearTabs,
  getUpdatesForYear,
} from "../src/pages/investor/updates/updates-content.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_ROOT = path.join(ROOT, "public");
const INVESTOR_PDFS_ROOT = path.join(PUBLIC_ROOT, "investor-pdfs");

const entries = [];
const folderCounters = new Map();
const usedTargets = new Set();

function cleanText(value) {
  return String(value || "")
    .replace(/&amp;/g, "and")
    .replace(/&/g, "and")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function slugPart(value) {
  const slug = cleanText(value)
    .toLowerCase()
    .replace(/fy\s+/g, "")
    .replace(/year\s+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "documents";
}

function filenameFromTitle(title) {
  const base = cleanText(title)
    .replace(/<[^>]+>/g, "")
    .replace(/[/:*?"<>|\\]+/g, " ")
    .replace(/[^\w\s().,-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);

  return `${base || "Document"}.pdf`;
}

function sourcePathFromHref(href) {
  if (!href || !href.startsWith("/investor-pdfs/")) {
    return null;
  }

  return path.join(PUBLIC_ROOT, decodeURIComponent(href.replace(/^\//, "")));
}

function folderLabelToName(label) {
  const text = cleanText(label);
  const yearMatch = text.match(/^Year\s+(\d{4})$/i);
  return yearMatch ? yearMatch[1] : text;
}

function fiscalYearFromCalendarYear(year) {
  const n = Number(year);
  if (!Number.isFinite(n)) return String(year);
  return `${n - 1}-${String(n).slice(-2)}`;
}

function nextTarget(section, parts, title) {
  const dir = path.join(INVESTOR_PDFS_ROOT, section, ...parts.map(folderLabelToName));
  const count = (folderCounters.get(dir) || 0) + 1;
  folderCounters.set(dir, count);
  const prefix = String(count).padStart(2, "0");
  let target = path.join(dir, `${prefix}-${filenameFromTitle(title)}`);
  let suffix = 2;

  while (usedTargets.has(target)) {
    const parsed = path.parse(target);
    target = path.join(parsed.dir, `${parsed.name}-${suffix}${parsed.ext}`);
    suffix += 1;
  }

  usedTargets.add(target);
  return target;
}

function addEntry(section, parts, title, href) {
  const source = sourcePathFromHref(href);
  if (!source) return;

  entries.push({
    source,
    target: nextTarget(section, parts, title),
  });
}

function addYearDocs(section, years, getDocs) {
  for (const year of years) {
    for (const doc of getDocs(year) || []) {
      addEntry(section, [year], doc.title, doc.href);
    }
  }
}

addYearDocs("financial", financialYearTabs, getFinancialDocuments);
addYearDocs("governance", governanceYears, getGovernanceDocuments);
addYearDocs("reconciliation", reconciliationYears, getReconciliationDocuments);

for (const year of shareholdingYears) {
  for (const doc of shareholdingDocumentsByYear[year] || []) {
    addEntry("shareholding", [year], doc.titleLines.join(" "), doc.href);
  }
}

for (const year of agmYears) {
  const content = getAgmContent(year);
  const seen = new Set();

  for (const row of content.grids || []) {
    for (const doc of row) {
      seen.add(`${doc.href}|${doc.title}`);
      addEntry("agm", [year], doc.title, doc.href);
    }
  }

  for (const doc of content.postalBallot?.documents || []) {
    const key = `${doc.href}|${doc.title}`;
    if (!seen.has(key)) {
      addEntry("agm", [year, "postal-ballot"], doc.title, doc.href);
    }
  }
}

const fiscalAnnouncementHrefs = new Set();

for (const year of announcementFyYears) {
  for (const group of getAnnouncementGroups(year)) {
    for (const row of group.rows || []) {
      for (const card of row) {
        fiscalAnnouncementHrefs.add(card.href);
        addEntry("announcements", [year, slugPart(group.label)], card.title, card.href);
      }
    }
  }
}

for (const year of announcementCalendarYears) {
  const calendarYear = year.replace(/^Year\s+/i, "");
  for (const card of getCalendarAnnouncementCards(year)) {
    if (!fiscalAnnouncementHrefs.has(card.href)) {
      addEntry("announcements", ["general-announcements", calendarYear, "board-meetings"], card.title, card.href);
    }
  }
}

for (const year of updateYearTabs) {
  for (const item of getUpdatesForYear(year) || []) {
    addEntry("updates", [folderLabelToName(year)], item.title, item.href);
  }
}

for (const report of complianceReports) {
  addEntry("secretarial", [fiscalYearFromCalendarYear(report.id)], report.title, report.href);
}

for (const year of annualFeaturedYears) {
  if (year.integrated) {
    addEntry("annual", [year.yearLabel], year.integrated.title, year.integrated.href);
  }
  if (year.side?.notice) {
    addEntry("annual", [year.yearLabel], year.side.notice.titleLines.join(" "), year.side.notice.href);
  }
  if (year.side?.returnCard) {
    addEntry("annual", [year.yearLabel], year.side.returnCard.title, year.side.returnCard.href);
  }
  if (year.noticeCard) {
    addEntry("annual", [year.yearLabel], year.noticeCard.titleLines.join(" "), year.noticeCard.href);
  }
  if (year.reportCard) {
    addEntry("annual", [year.yearLabel], year.reportCard.title, year.reportCard.href);
  }
}

for (const year of annualArchiveYears) {
  for (const link of year.links || []) {
    addEntry("annual", [year.year], link.label, link.href);
  }
}

for (const group of policiesDocumentGroups) {
  for (const row of group.rows || []) {
    for (const card of row) {
      addEntry("policies", [slugPart(group.label)], card.title, card.href);
    }
  }
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function seed() {
  const groupedBySource = new Map();

  for (const entry of entries) {
    if (!groupedBySource.has(entry.source)) {
      groupedBySource.set(entry.source, []);
    }
    groupedBySource.get(entry.source).push(entry);
  }

  let moved = 0;
  let copied = 0;
  let skipped = 0;
  let missing = 0;

  for (const [source, sourceEntries] of groupedBySource) {
    const existingTargets = [];

    for (const entry of sourceEntries) {
      await fs.mkdir(path.dirname(entry.target), { recursive: true });
      if (await pathExists(entry.target)) {
        existingTargets.push(entry.target);
      }
    }

    if (!(await pathExists(source))) {
      if (existingTargets.length === sourceEntries.length) {
        skipped += sourceEntries.length;
      } else {
        missing += 1;
        console.warn(`Missing source: ${path.relative(ROOT, source)}`);
      }
      continue;
    }

    for (const entry of sourceEntries.slice(1)) {
      if (await pathExists(entry.target)) {
        skipped += 1;
        continue;
      }
      await fs.copyFile(source, entry.target);
      copied += 1;
    }

    const primary = sourceEntries[0];
    if (await pathExists(primary.target)) {
      skipped += 1;
      continue;
    }

    await fs.rename(source, primary.target);
    moved += 1;
  }

  console.log(`Seeded investor PDFs: ${moved} moved, ${copied} copied, ${skipped} skipped, ${missing} missing.`);
  console.log(`Fiscal announcement folders were created from ${announcementFyYears.length} year tabs.`);
  console.log(`Calendar announcement tabs (${announcementCalendarYears.length}) are now derived by the generator from announcement dates.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
