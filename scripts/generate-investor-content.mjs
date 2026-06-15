#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MANIFEST = JSON.parse(await fs.readFile(path.join(__dirname, "investor-manifest.json"), "utf8"));

function js(value, indent = 0) {
  const pad = "  ".repeat(indent);
  if (value === null || value === undefined) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    return `[\n${value.map((v) => `${pad}  ${js(v, indent + 1)}`).join(",\n")}\n${pad}]`;
  }
  const entries = Object.entries(value).filter(([, v]) => v !== undefined);
  return `{\n${entries.map(([k, v]) => `${pad}  ${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${js(v, indent + 1)}`).join(",\n")}\n${pad}}`;
}

function page(key) {
  return MANIFEST.pages.find((p) => p.key === key);
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractPdfPairs(html) {
  const results = [];
  const re = /<a[^>]+href=["']([^"']+\.pdf[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const url = m[1].replace(/&amp;/g, "&");
    const title = stripHtml(m[2]);
    if (title) results.push({ title, url });
  }
  return results;
}

function lookupMapped(section, key, title, url) {
  const pool = section.mapped || [];
  const hit = pool.find((d) => d.url === url || d.title === title);
  if (hit) return hit.localPath;
  const global = MANIFEST.pages.flatMap((p) => p.parsed?.sections?.flatMap((s) => s.mapped || []) || p.parsed?.mapped || []);
  const g = global.find((d) => d.url === url);
  return g?.localPath || url;
}

function pdfMeta(fileSize) {
  if (!fileSize || fileSize === "?") return "PDF";
  return fileSize.startsWith("PDF") ? fileSize : `PDF • ${fileSize}`;
}

function parseDateFromTitle(title) {
  const m = title.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!m) return title.slice(0, 40);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[Number(m[2]) - 1]} ${Number(m[1])}, ${m[3]}`;
}

function shareTitleLines(title) {
  const cleaned = title.replace(/^\d{2}\.\d{2}\.\d{4}\s*-\s*/, "");
  const asOn = cleaned.match(/as on\s+(.+)$/i);
  if (asOn) return ["Shareholding pattern as on", asOn[1].trim()];
  if (/reconcil/i.test(cleaned)) return [cleaned];
  return [cleaned];
}

function chunk(arr, size) {
  const rows = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
}

function docCard(title, mapped, opts = {}) {
  return {
    title,
    date: parseDateFromTitle(title),
    fileSize: mapped?.fileSize?.replace(/^PDF\s*•\s*/, "") || "1 MB",
    href: mapped?.localPath || "#",
    ...opts,
  };
}

function buildUrlLookup() {
  const lookup = new Map();
  for (const p of MANIFEST.pages) {
    for (const s of p.parsed?.sections || []) {
      for (const d of s.mapped || []) lookup.set(d.url, d);
    }
    for (const d of p.parsed?.mapped || []) lookup.set(d.url, d);
  }
  return lookup;
}

function parseAnnouncementBlock(block, urlLookup) {
  const out = {};
  const parts = block.split(/<div class="vc_tta-panel[\s"]/);
  for (const part of parts.slice(1)) {
    const yearMatch = part.match(/vc_tta-title-text">([^<]+)<\/span>/);
    if (!yearMatch) continue;
    const y = yearMatch[1].trim();
    const bodyStart = part.indexOf("vc_tta-panel-body");
    const body = bodyStart === -1 ? part : part.slice(bodyStart);
    const sections = body.split(/<h4>\s*General\s+announcement[s]?\s*<\/h4>/i);
    const boardPairs = extractPdfPairs(sections[0] || "");
    const generalPairs = extractPdfPairs(sections[1] || "");
    const mapPair = (pair) => {
      const mapped = urlLookup.get(pair.url);
      return {
        title: pair.title,
        meta: pdfMeta(mapped?.fileSize),
        icon: /notice|agm|postal|newspaper/i.test(pair.title)
          ? "notice"
          : /return/i.test(pair.title)
            ? "return"
            : "report",
        href: mapped?.localPath || pair.url,
        tall: /notice|agm|postal/i.test(pair.title),
      };
    };
    out[y] = {
      boardMeetings: chunk(boardPairs.map(mapPair), 3),
      general: chunk(generalPairs.map(mapPair), 3),
    };
  }
  return out;
}

async function parseAnnouncements() {
  const html = await fetch("https://euroindiafoods.com/corporate-announcements/", {
    signal: AbortSignal.timeout(60000),
  }).then((r) => r.text());

  const urlLookup = buildUrlLookup();
  const c1 = html.indexOf('class="vc_tta-container"');
  const c2 = html.indexOf('class="vc_tta-container"', c1 + 1);
  const fyBlock = c1 === -1 ? "" : html.slice(c1, c2 === -1 ? undefined : c2);
  const calendarBlock = c2 === -1 ? "" : html.slice(c2);

  return {
    fy: parseAnnouncementBlock(fyBlock, urlLookup),
    calendar: parseAnnouncementBlock(calendarBlock, urlLookup),
  };
}

function buildShareholding() {
  const p = page("shareholding");
  const years = p.parsed.sections.map((s) => s.year).filter(Boolean);
  const byYear = {};
  for (const s of p.parsed.sections) {
    byYear[s.year] = s.mapped.map((d, i) => ({
      id: `${s.year}-${i}`,
      titleLines: shareTitleLines(d.title),
      dateLabel: parseDateFromTitle(d.title),
      fileMeta: pdfMeta(d.fileSize),
      href: d.localPath,
      isNew: i === 0 && s.year === years[0],
    }));
  }
  return { years, byYear };
}

function buildYearDocs(pkey, idPrefix = "doc") {
  const p = page(pkey);
  const years = p.parsed.sections.map((s) => s.year).filter(Boolean);
  const byYear = {};
  for (const s of p.parsed.sections) {
    byYear[s.year] = s.mapped.map((d, i) => ({
      id: `${idPrefix}-${s.year}-${i}`,
      title: d.title,
      date: parseDateFromTitle(d.title),
      fileSize: pdfMeta(d.fileSize),
      href: d.localPath,
      isNew: i === 0 && s.year === years[0],
    }));
  }
  return { years, byYear };
}

function buildGovernance() {
  const { years, byYear } = buildYearDocs("governance", "gov");
  const out = {};
  for (const [year, docs] of Object.entries(byYear)) {
    out[year] = docs.map(({ id, ...rest }) => rest);
  }
  return { years, byYear: out };
}

function buildAgm() {
  const p = page("agm");
  const years = p.parsed.sections.filter((s) => s.year && s.year !== "Postal Ballot").map((s) => s.year);
  const byYear = {};
  let postal = null;
  for (const s of p.parsed.sections) {
    if (s.year === "Postal Ballot") {
      postal = {
        title: "Postal Ballot",
        documents: s.mapped.map((d) => docCard(d.title, d)),
      };
      continue;
    }
    const cards = s.mapped.map((d) => docCard(d.title, d));
    byYear[s.year] = { grids: chunk(cards, 3), postalBallot: s.year === years[0] ? postal : null };
  }
  if (years[0] && byYear[years[0]] && postal) byYear[years[0]].postalBallot = postal;
  return { years, byYear };
}

function buildPolicies() {
  const p = page("policies");
  const groups = p.parsed.sections.map((section, gi) => ({
    id: gi === 0 ? "fy-2021-22" : "corporate-policies",
    label: section.label,
    variant: gi === 0 ? "accent" : "soft",
    rows: chunk(
      section.mapped.map((d) => ({
        title: d.title,
        meta: pdfMeta(d.fileSize),
        icon: /notice|meeting/i.test(d.title) ? "notice" : /return/i.test(d.title) ? "return" : "report",
        href: d.localPath,
        tall: /notice|meeting|annual report/i.test(d.title),
      })),
      3,
    ),
  }));
  return groups;
}

function buildAnnual() {
  const p = page("annual");
  const sections = p.parsed.sections;
  const featured = [];
  const archive = [];

  for (const s of sections) {
    const docs = s.mapped;
    if (s.year === "2024-25") {
      featured.push({
        id: "2024-25",
        yearLabel: "2024-25",
        yearAlign: "left",
        integrated: {
          eyebrow: "INTEGRATED REPORT",
          title: docs[0]?.title || "Integrated Annual Report 2024-25",
          cta: "DOWNLOAD REPORT",
          href: docs[0]?.localPath || "#",
        },
        side: {
          notice: {
            eyebrow: "PUBLIC NOTICE",
            titleLines: (docs[2]?.title || "Newspaper Advertisement").split(/\s*-\s*/).slice(0, 3).concat() ,
            cta: "DOWNLOAD PDF",
            href: docs[2]?.localPath || "#",
          },
          returnCard: {
            title: docs[1]?.title || "Annual Return 2024-25",
            meta: pdfMeta(docs[1]?.fileSize),
            href: docs[1]?.localPath || "#",
          },
        },
      });
      featured[0].side.notice.titleLines = [
        "Newspaper Advertisement for",
        "Public Notice of 15th AGM -",
        "05.09.2024",
      ];
    } else if (s.year === "2023-24") {
      featured.push({
        id: "2023-24",
        yearLabel: "2023-24",
        yearAlign: "right",
        noticeCard: {
          titleLines: [
            "Newspaper Advertisement",
            "for Public Notice of 14th AGM",
            "- 06.09.2023",
          ],
          cta: "VIEW NOTICE",
          href: docs[2]?.localPath || "#",
        },
        reportCard: {
          eyebrow: "FINANCIAL ARCHIVE",
          title: docs[0]?.title || "Annual Report 2023-24",
          cta: "DOWNLOAD DOCUMENT",
          href: docs[0]?.localPath || "#",
        },
      });
    } else {
      const links = docs.map((d) => ({
        label: d.title.replace(/\.$/, "").toUpperCase(),
        href: d.localPath,
      }));
      archive.push({
        year: s.year,
        links,
        compact: docs.length === 1,
      });
    }
  }
  return { featured, archive };
}

function buildSecretarial() {
  const s = page("secretarial").parsed.sections[0]?.mapped || [];
  return s.map((d, i) => ({
    id: d.title.match(/31\.03\.(\d{4})/)?.[1] || `report-${i}`,
    title: d.title.replace(/^\d{2}\.\d{2}\.\d{4}\s*-\s*/, "Compliance Report ").replace(/for the year ended 31\.03\./, ""),
    status: i === 0 ? "Final" : "Archived",
    size: d.fileSize?.replace(/^PDF\s*•\s*/, "") || d.fileSize,
    featured: i === 0,
    href: d.localPath,
  }));
}

function buildUpdates() {
  const p = page("updates");
  const tabs = p.parsed.sections.map((s) => s.year).filter(Boolean);
  const byYear = {};
  for (const s of p.parsed.sections) {
    byYear[s.year] = s.mapped.map((d) => {
      const dm = d.title.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
      const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
      return {
        month: dm ? months[Number(dm[2]) - 1] : "UPDATE",
        day: dm ? dm[1] : "01",
        year: dm ? dm[3] : "2025",
        badge: /credit/i.test(d.title) ? "REGULATION 30" : /disclosure/i.test(d.title) ? "DISCLOSURE" : /kyc|window|compliance/i.test(d.title) ? "COMPLIANCE" : /nse|clarification/i.test(d.title) ? "NSE FILING" : "UPDATE",
        badgeTone: /credit|nse|clarification/i.test(d.title) ? "regulation" : /disclosure/i.test(d.title) ? "disclosure" : "compliance",
        title: d.title,
        href: d.localPath,
      };
    });
  }
  return { tabs, byYear };
}

async function main() {
  const announcements = await parseAnnouncements();
  const shareholding = buildShareholding();
  const governance = buildGovernance();
  const financial = buildYearDocs("financial", "fin");
  const reconciliation = buildGovernance();
  Object.assign(reconciliation, buildYearDocs("reconciliation", "reco"));
  const reco = buildYearDocs("reconciliation", "reco");
  const agm = buildAgm();
  const policies = buildPolicies();
  const annual = buildAnnual();
  const secretarial = buildSecretarial();
  const updates = buildUpdates();

  const prospectus = page("prospectus").parsed.sections[0]?.mapped[0];
  const memorandum = page("memorandum").parsed.sections[0]?.mapped[0];
  const dispute = page("dispute").parsed.sections[0]?.mapped[0];

  const fyTabs = Object.keys(announcements.fy);
  const normalizedFyTabs = fyTabs.map((y) => (y === "2025-2026" ? "2025-26" : y));
  const fyData = {};
  fyTabs.forEach((y, i) => {
    fyData[normalizedFyTabs[i]] = announcements.fy[y];
  });

  const calTabs = Object.keys(announcements.calendar);
  const calData = announcements.calendar;

  // Write shareholding-data.js
  await fs.writeFile(
    path.join(ROOT, "src/pages/investor/shareholding/shareholding-data.js"),
    `export const shareholdingYears = ${js(shareholding.years)};\n\nexport const shareholdingDocumentsByYear = ${js(shareholding.byYear)};\n`,
  );

  // governance-content.js
  await fs.writeFile(
    path.join(ROOT, "src/pages/investor/governance/governance-content.js"),
    `/** Corporate Governance Reports — synced from euroindiafoods.com */\nexport const governanceYears = ${js(governance.years)};\n\nconst governanceDocumentsByYear = ${js(governance.byYear)};\n\nexport function getGovernanceDocuments(year) {\n  return governanceDocumentsByYear[year] ?? [];\n}\n`,
  );

  // financial-content.js
  await fs.writeFile(
    path.join(ROOT, "src/pages/investor/financial/financial-content.js"),
    `/** Financial Information — synced from euroindiafoods.com */\nexport const financialYearTabs = ${js(financial.years)};\n\nconst financialDocumentsByYear = ${js(
      Object.fromEntries(Object.entries(financial.byYear).map(([y, docs]) => [y, docs.map(({ id, ...d }) => d)])),
    )};\n\nexport function getFinancialDocuments(year) {\n  return financialDocumentsByYear[year] ?? [];\n}\n`,
  );

  // reconciliation-content.js
  await fs.writeFile(
    path.join(ROOT, "src/pages/investor/reconciliation/reconciliation-content.js"),
    `/** Reconciliation — synced from euroindiafoods.com */\nexport const reconciliationYears = ${js(reco.years)};\n\nconst reconciliationDocumentsByYear = ${js(
      Object.fromEntries(Object.entries(reco.byYear).map(([y, docs]) => [
        y,
        docs.map(({ id, title, date, fileSize, href, isNew }) => ({
          title,
          date,
          fileSize: fileSize.replace(/^PDF • /, ""),
          href,
          ...(isNew ? { isNew } : {}),
        })),
      ])),
    )};\n\nexport function getReconciliationDocuments(year) {\n  return reconciliationDocumentsByYear[year] ?? [];\n}\n`,
  );

  // agm-content.js
  const agmCardFn = `const card = (title, date, fileSize, options = {}) => ({
  title,
  date,
  fileSize,
  href: options.href || "#",
  ...options,
});`;
  const agmByYear = Object.fromEntries(
    Object.entries(agm.byYear).map(([year, content]) => [
      year,
      {
        grids: content.grids.map((row) =>
          row.map((c) => ({
            title: c.title,
            date: c.date,
            fileSize: c.fileSize,
            href: c.href,
            ...(c.isNew ? { isNew: true } : {}),
          })),
        ),
        postalBallot: content.postalBallot
          ? {
              title: content.postalBallot.title,
              documents: content.postalBallot.documents.map((c) => ({
                title: c.title,
                date: c.date,
                fileSize: c.fileSize,
                href: c.href,
                ...(c.isNew ? { isNew: true } : {}),
              })),
            }
          : null,
      },
    ]),
  );
  await fs.writeFile(
    path.join(ROOT, "src/pages/investor/agm/agm-content.js"),
    `export const agmYears = ${js(agm.years)};\n\n${agmCardFn}\n\nconst agmDocumentsByYear = ${js(agmByYear)};\n\nexport function getAgmContent(year) {\n  return (\n    agmDocumentsByYear[year] || {\n      grids: [],\n      postalBallot: null,\n    }\n  );\n}\n`,
  );

  // policies-content.js
  await fs.writeFile(
    path.join(ROOT, "src/pages/investor/policies/policies-content.js"),
    `/** Corporate Policies — synced from euroindiafoods.com */\nexport const policiesPageCopy = {\n  title: "Corporate Policies",\n  subtitle: [\n    "A commitment to transparency, ethical conduct, and the highest standards of",\n    "culinary integrity across all global operations.",\n  ],\n};\n\nexport const policiesDocumentGroups = ${js(policies)};\n`,
  );

  // annual-reports-data.js
  await fs.writeFile(
    path.join(ROOT, "src/pages/investor/annual/annual-reports-data.js"),
    `/** Annual Reports — synced from euroindiafoods.com */\nexport const annualReportsIntro = {\n  title: "Annual Reports",\n  subtitle: [\n    "Tracing our journey of artisanal growth and fiscal responsibility through",\n    "detailed archival documentation.",\n  ],\n};\n\nexport const annualFeaturedYears = ${js(annual.featured)};\n\nexport const annualArchiveYears = ${js(annual.archive)};\n\nexport const annualRequestCard = {\n  title: "Request Historical Data",\n  copy: "Contact our investor relations for reports prior to 2016.",\n};\n`,
  );

  // updates-content.js
  await fs.writeFile(
    path.join(ROOT, "src/pages/investor/updates/updates-content.js"),
    `export const updatesPageCopy = {\n  title: "Corporate Updates",\n  description:\n    "Real-time disclosures and regulatory filings for Euro India Fresh Foods Limited. Precision in every announcement.",\n  ctaTitle: ["Want to receive these", "updates automatically?"],\n  ctaBody:\n    "Subscribe to our investor newsletter to get real-time regulatory filings and corporate announcements delivered to your inbox.",\n  ctaButton: "Subscribe to News",\n};\n\nexport const fyYearTabs = ${js(updates.tabs)};\n\nexport const updatesByYear = ${js(updates.byYear)};\n\nexport function getUpdatesForYear(year) {\n  return updatesByYear[year] ?? [];\n}\n`,
  );

  // announcement-content.js
  await fs.writeFile(
    path.join(ROOT, "src/pages/investor/announcements/announcement-content.js",
    ),
    `/** Corporate Announcements — synced from euroindiafoods.com */\nexport const fyYearTabs = ${js(normalizedFyTabs)};\n\nexport const calendarYearTabs = ${js(calTabs)};\n\nconst announcementsByFy = ${js(fyData)};\n\nconst announcementsByCalendarYear = ${js(calData)};\n\nexport const announcementsPageCopy = {\n  title: "Corporate Announcements",\n  description:\n    "Transparent communication and timely disclosures regarding our operational milestones, board decisions, and strategic shifts.",\n  boardMeetingsLabel: "Board Meetings",\n  generalLabel: "General Announcements",\n};\n\nexport function getAnnouncementGroups(fyYear) {\n  const data = announcementsByFy[fyYear] || { boardMeetings: [], general: [] };\n  return [\n    { id: "board-meetings", label: announcementsPageCopy.boardMeetingsLabel, rows: data.boardMeetings },\n    { id: "general", label: announcementsPageCopy.generalLabel, rows: data.general },\n  ];\n}\n\nexport function getCalendarAnnouncementCards(calendarYear) {\n  const data = announcementsByCalendarYear[calendarYear] || { boardMeetings: [] };\n  const flat = (data.boardMeetings || []).flat();\n  return flat.map((card) => ({\n    title: card.title,\n    date: card.title,\n    size: card.meta,\n    href: card.href,\n  }));\n}\n`,
  );

  // investor-content.jsx - only update downloadHref via a small patch file
  await fs.writeFile(
    path.join(ROOT, "scripts/generated-prospectus.json"),
    JSON.stringify({ downloadHref: prospectus?.localPath || "#" }),
  );

  // memorandum
  await fs.writeFile(
    path.join(ROOT, "src/pages/investor/memorandum/memorandum-content.js"),
    `/** Memorandum of Association — synced from euroindiafoods.com */\nexport const memorandumDocument = {\n  title: "MoA & AoA (Full Version)",\n  fileSize: ${JSON.stringify(memorandum?.fileSize?.replace(/^PDF • /, "") || "4.2 MB")},\n  lastUpdated: "OCT 2023",\n  complianceId: "EIF-GOV-042",\n  href: ${JSON.stringify(memorandum?.localPath || "#")},\n};\n`,
  );

  // dispute
  await fs.writeFile(
    path.join(ROOT, "src/pages/investor/dispute/dispute-content.js"),
    await fs.readFile(path.join(ROOT, "src/pages/investor/dispute/dispute-content.js"), "utf8").then((txt) =>
      txt.replace(/href: "#",\n  \},\n  portal:/, `href: ${JSON.stringify(dispute?.localPath || "#")},\n  },\n  portal:`),
    ),
  );

  // secretarial data file (new)
  await fs.writeFile(
    path.join(ROOT, "src/pages/investor/secretarial/secretarial-content.js"),
    `export const complianceReports = ${js(secretarial)};\n`,
  );

  console.log("Generated investor content files");
  console.log("Prospectus:", prospectus?.localPath);
  console.log("FY announcement years:", normalizedFyTabs.length);
  console.log("Calendar years:", calTabs.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
