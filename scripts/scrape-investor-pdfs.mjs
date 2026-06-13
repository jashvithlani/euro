#!/usr/bin/env node
/**
 * Scrapes euroindiafoods.com investor pages, downloads PDFs,
 * and writes scripts/investor-manifest.json
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PDF_DIR = path.join(ROOT, "public/investor-pdfs");
const MANIFEST_PATH = path.join(__dirname, "investor-manifest.json");

const PAGES = [
  { key: "prospectus", url: "https://euroindiafoods.com/prospectus/" },
  { key: "grievance", url: "https://euroindiafoods.com/investor-grievance/" },
  { key: "shareholding", url: "https://euroindiafoods.com/shareholding-pattern/" },
  { key: "board", url: "https://euroindiafoods.com/composition-of-board-and-committees/" },
  { key: "policies", url: "https://euroindiafoods.com/corporate-policies/" },
  { key: "governance", url: "https://euroindiafoods.com/corporate-governance-reports/" },
  { key: "annual", url: "https://euroindiafoods.com/annual-reports/" },
  { key: "secretarial", url: "https://euroindiafoods.com/annual-secretarial-compliance-report/" },
  { key: "announcements", url: "https://euroindiafoods.com/corporate-announcements/" },
  { key: "agm", url: "https://euroindiafoods.com/agm-egm/" },
  { key: "financial", url: "https://euroindiafoods.com/financial-information/" },
  { key: "dispute", url: "https://euroindiafoods.com/online-dispute-resolution/" },
  { key: "memorandum", url: "https://euroindiafoods.com/memorandum-of-association-and-articles-of-association/" },
  { key: "kmp", url: "https://euroindiafoods.com/authorized-kmps-for-determining-materiality-of-an-event-or-information/" },
  { key: "updates", url: "https://euroindiafoods.com/updates/" },
  { key: "reconciliation", url: "https://euroindiafoods.com/reconciliation-of-share-capital-audit-report/" },
  { key: "newspaper", url: "https://euroindiafoods.com/newspaper-advertisements/" },
];

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractPdfLinks(html) {
  const results = [];
  const re = /<a[^>]+href=["']([^"']+\.pdf[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const url = m[1].replace(/&amp;/g, "&");
    const title = stripHtml(m[2]);
    if (title && !url.includes("fav.png")) {
      results.push({ title, url });
    }
  }
  return results;
}

function extractYearSections(html) {
  const sections = [];
  const parts = html.split(/<h4[^>]*>/i);
  for (const part of parts.slice(1)) {
    const yearEnd = part.indexOf("</h4>");
    if (yearEnd === -1) continue;
    const year = stripHtml(part.slice(0, yearEnd));
    const sectionHtml = part.slice(yearEnd);
    const docs = extractPdfLinks(sectionHtml);
    if (docs.length) sections.push({ year, docs });
  }
  if (!sections.length) {
    const docs = extractPdfLinks(html);
    if (docs.length) sections.push({ year: null, docs });
  }
  return sections;
}

function extractAnnouncementSections(html) {
  const sections = [];
  const fyParts = html.split(/<h4[^>]*>\s*(\d{4}-\d{2,4}|\d{4}-\d{4}|\d{4}-\d{2})\s*<\/h4>/i);
  if (fyParts.length > 1) {
    for (let i = 1; i < fyParts.length; i += 2) {
      const year = stripHtml(fyParts[i]);
      const block = fyParts[i + 1] ?? "";
      const boardBlock = block.split(/General\s+announcement/i)[0] ?? block;
      const generalBlock = block.split(/General\s+announcement/i)[1] ?? "";
      sections.push({
        year,
        boardMeetings: extractPdfLinks(boardBlock),
        general: extractPdfLinks(generalBlock),
      });
    }
    return sections;
  }
  return [{ year: null, boardMeetings: extractPdfLinks(html), general: [] }];
}

function extractPoliciesSections(html) {
  const sections = [];
  const parts = html.split(/<h4[^>]*>/i);
  for (const part of parts.slice(1)) {
    const yearEnd = part.indexOf("</h4>");
    if (yearEnd === -1) continue;
    const label = stripHtml(part.slice(0, yearEnd));
    const docs = extractPdfLinks(part.slice(yearEnd));
    if (docs.length) sections.push({ label, docs });
  }
  if (!sections.length) {
    const docs = extractPdfLinks(html);
    if (docs.length) sections.push({ label: "Corporate Policies", docs });
  }
  return sections;
}

function extractUpdatesSections(html) {
  const sections = [];
  const parts = html.split(/<h4[^>]*>/i);
  for (const part of parts.slice(1)) {
    const yearEnd = part.indexOf("</h4>");
    if (yearEnd === -1) continue;
    const year = stripHtml(part.slice(0, yearEnd));
    const docs = extractPdfLinks(part.slice(yearEnd));
    if (docs.length) sections.push({ year, docs });
  }
  if (!sections.length) {
    const docs = extractPdfLinks(html);
    if (docs.length) sections.push({ year: null, docs });
  }
  return sections;
}

function safeFilename(url, title, index) {
  const base = path.basename(new URL(url).pathname);
  if (base && base !== ".pdf") return base.replace(/[^\w.\-]+/g, "_");
  const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 8);
  const slug = title.slice(0, 40).replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
  return `${slug || "doc"}-${hash}.pdf`;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fetchHtml(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; EuroInvestorScraper/1.0)" },
        signal: AbortSignal.timeout(60000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

async function downloadPdf(url, destPath) {
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  try {
    await fs.access(destPath);
    const stat = await fs.stat(destPath);
    if (stat.size > 1000) return stat.size;
  } catch {
    /* download */
  }
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(destPath, buf);
  return buf.length;
}

async function mapDocs(section, docs, seenUrls) {
  const mapped = [];
  for (let i = 0; i < docs.length; i++) {
    const { title, url } = docs[i];
    if (seenUrls.has(url)) {
      const existing = seenUrls.get(url);
      mapped.push({ title, url, localPath: existing.localPath, fileSize: existing.fileSize });
      continue;
    }
    const filename = safeFilename(url, title, i);
    const localRel = `/investor-pdfs/${section}/${filename}`;
    const localAbs = path.join(PDF_DIR, section, filename);
    try {
      const bytes = await downloadPdf(url, localAbs);
      const entry = { title, url, localPath: localRel, fileSize: formatSize(bytes), bytes };
      seenUrls.set(url, entry);
      mapped.push(entry);
      process.stdout.write(`  ✓ ${section}/${filename}\n`);
    } catch (err) {
      console.error(`  ✗ ${url}: ${err.message}`);
      mapped.push({ title, url, localPath: url, fileSize: "?", error: err.message });
    }
  }
  return mapped;
}

async function scrapePage(page, seenUrls) {
  console.log(`\nFetching ${page.key}...`);
  const html = await fetchHtml(page.url);

  let parsed;
  switch (page.key) {
    case "announcements":
      parsed = { type: "announcements", sections: extractAnnouncementSections(html) };
      break;
    case "policies":
      parsed = { type: "policies", sections: extractPoliciesSections(html) };
      break;
    case "updates":
      parsed = { type: "updates", sections: extractUpdatesSections(html) };
      break;
    case "board":
    case "kmp":
    case "grievance":
      parsed = { type: "static", sections: [] };
      break;
    default:
      parsed = { type: "year-tabs", sections: extractYearSections(html) };
  }

  if (parsed.sections.length) {
    for (const section of parsed.sections) {
      const key = section.year ?? section.label ?? "default";
      const docs = section.docs ?? section.boardMeetings ?? [];
      const allDocs = [
        ...(section.boardMeetings ?? []),
        ...(section.general ?? []),
        ...(section.docs ?? []),
      ];
      const unique = [];
      const urls = new Set();
      for (const d of allDocs.length ? allDocs : docs) {
        if (!urls.has(d.url)) {
          urls.add(d.url);
          unique.push(d);
        }
      }
      if (unique.length) {
        section.mapped = await mapDocs(page.key, unique, seenUrls);
      }
      if (section.boardMeetings) {
        section.boardMeetingsMapped = await mapDocs(page.key, section.boardMeetings, seenUrls);
      }
      if (section.general) {
        section.generalMapped = await mapDocs(page.key, section.general, seenUrls);
      }
    }
  } else if (page.key === "prospectus" || page.key === "memorandum" || page.key === "dispute") {
    const docs = extractPdfLinks(html);
    parsed.mapped = await mapDocs(page.key, docs, seenUrls);
  }

  return { ...page, parsed };
}

async function main() {
  const seenUrls = new Map();
  const manifest = { scrapedAt: new Date().toISOString(), pages: [] };

  for (const page of PAGES) {
    try {
      const result = await scrapePage(page, seenUrls);
      manifest.pages.push(result);
    } catch (err) {
      console.error(`FAILED ${page.key}: ${err.message}`);
      manifest.pages.push({ ...page, error: err.message });
    }
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to ${MANIFEST_PATH}`);
  console.log(`Total unique PDFs: ${seenUrls.size}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
