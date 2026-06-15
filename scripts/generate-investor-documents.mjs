#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_ROOT = path.join(ROOT, "public");
const INVESTOR_PDFS_ROOT = path.join(PUBLIC_ROOT, "investor-pdfs");
const OUTPUT_DIR = path.join(ROOT, "src/pages/investor/generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "investor-documents.generated.js");

const YEAR_SECTIONS = [
  "financial",
  "governance",
  "agm",
  "annual",
  "shareholding",
  "reconciliation",
  "updates",
  "secretarial",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

async function readDirSafe(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

function isPdf(fileName) {
  return /\.pdf$/i.test(fileName);
}

function js(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function chunk(items, size) {
  const rows = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function groupLabelFromFolder(folder) {
  const lower = folder.toLowerCase();
  if (lower === "board-meetings") return "Board Meetings";
  if (lower === "general-announcements") return "General Announcements";
  if (lower === "postal-ballot") return "Postal Ballot";
  if (lower === "corporate-policies") return "Corporate Policies";
  if (lower === "financial-2021-22") return "Financial Year 2021-22";
  if (lower === "financial-year-2021-22") return "Financial Year 2021-22";
  return titleCase(folder);
}

function yearLabelFromFolder(section, folder) {
  if (section === "updates" && /^\d{4}$/.test(folder)) {
    return `Year ${folder}`;
  }
  return folder;
}

function yearSortValue(label) {
  const text = String(label || "");
  const calendar = text.match(/^Year\s+(\d{4})$/i);
  if (calendar) return Number(calendar[1]);
  const fiscal = text.match(/^(\d{4})(?:-(\d{2}|\d{4}))?$/);
  if (fiscal) return Number(fiscal[1]);
  const loose = text.match(/(\d{4})/);
  return loose ? Number(loose[1]) : Number.NEGATIVE_INFINITY;
}

function sortYearsDesc(a, b) {
  const diff = yearSortValue(b) - yearSortValue(a);
  return diff || String(b).localeCompare(String(a));
}

function publicHref(filePath) {
  const relative = path.relative(PUBLIC_ROOT, filePath).split(path.sep).join("/");
  return encodeURI(`/${relative}`);
}

function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function stripOrderPrefix(fileName) {
  return fileName.replace(/^\d{1,4}[-_.\s]+/, "");
}

function titleFromFileName(fileName) {
  return stripOrderPrefix(fileName)
    .replace(/\.pdf$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b((?:19|20)\d{2})\s+(\d{2})\b/g, "$1-$2")
    .replace(/\s+/g, " ")
    .trim();
}

function orderFromFileName(fileName) {
  const match = fileName.match(/^(\d{1,4})[-_.\s]+/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function formatDate(day, month, year) {
  const monthIndex = Number(month) - 1;
  if (!MONTHS[monthIndex]) return null;
  return `${MONTHS[monthIndex]} ${Number(day)}, ${year}`;
}

function parseDate(title, fallback) {
  const numeric = title.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/);
  if (numeric) {
    const year = numeric[3].length === 2 ? `20${numeric[3]}` : numeric[3];
    const label = formatDate(numeric[1], numeric[2], year);
    if (label) {
      return {
        label,
        calendarYear: Number(year),
        timestamp: Date.UTC(Number(year), Number(numeric[2]) - 1, Number(numeric[1])),
      };
    }
  }

  const monthName = title.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/i,
  );
  if (monthName) {
    const monthIndex = MONTHS.findIndex((month) => month.toLowerCase() === monthName[1].toLowerCase());
    return {
      label: `${MONTHS[monthIndex]} ${Number(monthName[2])}, ${monthName[3]}`,
      calendarYear: Number(monthName[3]),
      timestamp: Date.UTC(Number(monthName[3]), monthIndex, Number(monthName[2])),
    };
  }

  const year = title.match(/\b(20\d{2}|19\d{2})\b/);
  if (year) {
    return {
      label: fallback || year[1],
      calendarYear: Number(year[1]),
      timestamp: Date.UTC(Number(year[1]), 0, 1),
    };
  }

  return {
    label: fallback || "Published",
    calendarYear: yearSortValue(fallback),
    timestamp: 0,
  };
}

function iconForTitle(title) {
  if (/notice|newspaper|agm|egm|postal/i.test(title)) return "notice";
  if (/return/i.test(title)) return "return";
  return "report";
}

function badgeForTitle(title) {
  if (/credit/i.test(title)) return { badge: "REGULATION 30", badgeTone: "regulation" };
  if (/disclosure|regulation/i.test(title)) return { badge: "DISCLOSURE", badgeTone: "disclosure" };
  if (/nse|clarification/i.test(title)) return { badge: "NSE FILING", badgeTone: "regulation" };
  if (/kyc|window|compliance|trading/i.test(title)) return { badge: "COMPLIANCE", badgeTone: "compliance" };
  return { badge: "UPDATE", badgeTone: "compliance" };
}

async function makeDoc(filePath, fallbackDateLabel) {
  const stats = await fs.stat(filePath);
  const fileName = path.basename(filePath);
  const title = titleFromFileName(fileName);
  const parsedDate = parseDate(title, fallbackDateLabel);
  const size = formatFileSize(stats.size);
  const badge = badgeForTitle(title);

  return {
    title,
    date: parsedDate.label,
    calendarYear: parsedDate.calendarYear,
    timestamp: parsedDate.timestamp,
    size,
    meta: `PDF • ${size}`,
    href: publicHref(filePath),
    order: orderFromFileName(fileName),
    icon: iconForTitle(title),
    tall: /notice|agm|egm|postal/i.test(title),
    ...badge,
  };
}

async function collectPdfs(dir) {
  const entries = await readDirSafe(dir);
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectPdfs(fullPath)));
    } else if (entry.isFile() && isPdf(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function sortDocs(docs) {
  return docs.sort((a, b) => {
    const orderDiff = a.order - b.order;
    if (Number.isFinite(orderDiff) && orderDiff !== 0) return orderDiff;
    const dateDiff = b.timestamp - a.timestamp;
    return dateDiff || a.title.localeCompare(b.title);
  });
}

async function readYearSection(section) {
  const sectionDir = path.join(INVESTOR_PDFS_ROOT, section);
  const folders = (await readDirSafe(sectionDir))
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name);

  const labels = folders.map((folder) => yearLabelFromFolder(section, folder)).sort(sortYearsDesc);
  const folderByLabel = new Map(folders.map((folder) => [yearLabelFromFolder(section, folder), folder]));
  const documentsByYear = {};

  for (const label of labels) {
    const folder = folderByLabel.get(label);
    const files = await collectPdfs(path.join(sectionDir, folder));
    const docs = [];

    for (const file of files) {
      docs.push(await makeDoc(file, label));
    }

    documentsByYear[label] = sortDocs(docs);
  }

  return { years: labels, documentsByYear };
}

async function readAnnouncements() {
  const sectionDir = path.join(INVESTOR_PDFS_ROOT, "announcements");
  const yearFolders = (await readDirSafe(sectionDir))
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "general-announcements"
    )
    .map((entry) => entry.name)
    .sort(sortYearsDesc);

  const fiscalYears = [];
  const calendarDocs = [];

  for (const year of yearFolders) {
    const yearDir = path.join(sectionDir, year);
    const groupFolders = (await readDirSafe(yearDir))
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => entry.name);
    const groups = [];

    for (const groupId of groupFolders.sort((a, b) => {
      const preferred = ["board-meetings", "general-announcements"];
      return (preferred.indexOf(a) === -1 ? 99 : preferred.indexOf(a)) - (preferred.indexOf(b) === -1 ? 99 : preferred.indexOf(b));
    })) {
      const docs = [];
      for (const file of await collectPdfs(path.join(yearDir, groupId))) {
        const doc = await makeDoc(file, year);
        docs.push(doc);
      }

      groups.push({
        id: groupId,
        label: groupLabelFromFolder(groupId),
        documents: sortDocs(docs),
      });
    }

    const directFiles = (await readDirSafe(yearDir)).filter((entry) => entry.isFile() && isPdf(entry.name));
    if (directFiles.length > 0) {
      const docs = [];
      for (const file of directFiles) {
        const doc = await makeDoc(path.join(yearDir, file.name), year);
        docs.push(doc);
      }
      groups.push({
        id: "general-announcements",
        label: "General Announcements",
        documents: sortDocs(docs),
      });
    }

    fiscalYears.push({ year, groups });
  }

  const rootGeneralAnnouncementsDir = path.join(sectionDir, "general-announcements");
  const rootGeneralAnnouncementFolders = (await readDirSafe(rootGeneralAnnouncementsDir))
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name);

  for (const year of rootGeneralAnnouncementFolders) {
    for (const file of await collectPdfs(path.join(rootGeneralAnnouncementsDir, year))) {
      calendarDocs.push(await makeDoc(file, `Year ${year}`));
    }
  }

  const calendarByYear = {};
  for (const doc of calendarDocs) {
    if (!Number.isFinite(doc.calendarYear) || doc.calendarYear <= 0) continue;
    const label = `Year ${doc.calendarYear}`;
    if (!calendarByYear[label]) calendarByYear[label] = [];
    calendarByYear[label].push(doc);
  }

  const calendarYears = Object.keys(calendarByYear).sort(sortYearsDesc);
  const calendarDocumentsByYear = Object.fromEntries(
    calendarYears.map((year) => [year, sortDocs(calendarByYear[year])]),
  );

  return { fiscalYears, calendarYears, calendarDocumentsByYear };
}

async function readPolicies() {
  const sectionDir = path.join(INVESTOR_PDFS_ROOT, "policies");
  const groupFolders = (await readDirSafe(sectionDir))
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort((a, b) => {
      const aFinancial = /financial/.test(a);
      const bFinancial = /financial/.test(b);
      if (aFinancial !== bFinancial) return aFinancial ? -1 : 1;
      return a.localeCompare(b);
    });

  return groupFolders.map(async (groupId, index) => {
    const files = await collectPdfs(path.join(sectionDir, groupId));
    const documents = [];

    for (const file of files) {
      documents.push(await makeDoc(file, groupLabelFromFolder(groupId)));
    }

    return {
      id: groupId,
      label: groupLabelFromFolder(groupId),
      variant: index === 0 ? "accent" : "soft",
      documents: sortDocs(documents),
    };
  });
}

function countDocuments(value) {
  if (!value || typeof value !== "object") return 0;
  if (Array.isArray(value)) return value.reduce((sum, item) => sum + countDocuments(item), 0);
  if (value.href) return 1;
  return Object.values(value).reduce((sum, item) => sum + countDocuments(item), 0);
}

async function buildManifest() {
  const manifest = {};

  for (const section of YEAR_SECTIONS) {
    manifest[section] = await readYearSection(section);
  }

  manifest.announcements = await readAnnouncements();
  manifest.policies = await Promise.all(await readPolicies());

  return manifest;
}

async function main() {
  const manifest = await buildManifest();
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(
    OUTPUT_FILE,
    `// Generated by scripts/generate-investor-documents.mjs. Do not edit by hand.\nexport const investorDocuments = ${js(manifest)};\n\nexport default investorDocuments;\n`,
  );

  console.log(`Generated ${path.relative(ROOT, OUTPUT_FILE)}`);
  console.log(`Investor documents indexed: ${countDocuments(manifest)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
