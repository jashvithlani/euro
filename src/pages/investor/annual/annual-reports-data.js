import { investorDocuments } from "../generated/investor-documents.generated.js";

const annualSection = investorDocuments.annual ?? {
  years: [],
  documentsByYear: {},
};

function findDoc(year, matcher) {
  return (annualSection.documentsByYear[year] ?? []).find((document) => matcher.test(document.title));
}

function fallbackDoc(year, index = 0) {
  return annualSection.documentsByYear[year]?.[index] ?? {
    title: "Annual Report",
    meta: "PDF",
    href: "#",
  };
}

function noticeLines(title) {
  const match = title.match(/^(Newspaper Advertisement for)\s+(Public Notice of .+? AGM)\s+(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})$/i);
  if (match) {
    return [match[1], `${match[2]} -`, match[3]];
  }

  const words = title.split(/\s+/);
  if (words.length <= 5) return [title];

  return [
    words.slice(0, Math.ceil(words.length / 3)).join(" "),
    words.slice(Math.ceil(words.length / 3), Math.ceil((words.length * 2) / 3)).join(" "),
    words.slice(Math.ceil((words.length * 2) / 3)).join(" "),
  ].filter(Boolean);
}

function archiveLinks(year) {
  return (annualSection.documentsByYear[year] ?? []).map((document) => ({
    label: document.title.toUpperCase(),
    href: document.href,
  }));
}

const [latestYear, secondYear, ...archiveYears] = annualSection.years;
const latestReport = findDoc(latestYear, /integrated|annual report/i) ?? fallbackDoc(latestYear);
const latestNotice = findDoc(latestYear, /newspaper|notice/i) ?? fallbackDoc(latestYear, 1);
const latestReturn = findDoc(latestYear, /annual return|return/i) ?? fallbackDoc(latestYear, 2);
const secondNotice = findDoc(secondYear, /newspaper|notice/i) ?? fallbackDoc(secondYear);
const secondReport = findDoc(secondYear, /annual report|report/i) ?? fallbackDoc(secondYear, 1);

export const annualReportsIntro = {
  title: "Annual Reports",
  subtitle: [
    "Tracing our journey of artisanal growth and fiscal responsibility through",
    "detailed archival documentation.",
  ],
};

export const annualFeaturedYears = [
  latestYear
    ? {
        id: latestYear,
        yearLabel: latestYear,
        yearAlign: "left",
        integrated: {
          eyebrow: /integrated/i.test(latestReport.title) ? "INTEGRATED REPORT" : "ANNUAL REPORT",
          title: latestReport.title,
          cta: "DOWNLOAD REPORT",
          href: latestReport.href,
        },
        side: {
          notice: {
            eyebrow: "PUBLIC NOTICE",
            titleLines: noticeLines(latestNotice.title),
            cta: "DOWNLOAD PDF",
            href: latestNotice.href,
          },
          returnCard: {
            title: latestReturn.title,
            meta: latestReturn.meta,
            href: latestReturn.href,
          },
        },
      }
    : null,
  secondYear
    ? {
        id: secondYear,
        yearLabel: secondYear,
        yearAlign: "right",
        noticeCard: {
          titleLines: noticeLines(secondNotice.title),
          cta: "VIEW NOTICE",
          href: secondNotice.href,
        },
        reportCard: {
          eyebrow: "FINANCIAL ARCHIVE",
          title: secondReport.title,
          cta: "DOWNLOAD DOCUMENT",
          href: secondReport.href,
        },
      }
    : null,
].filter(Boolean);

export const annualArchiveYears = archiveYears.map((year) => {
  const links = archiveLinks(year);
  return {
    year,
    links,
    compact: links.length === 1,
  };
});

export const annualRequestCard = {
  title: "Request Historical Data",
  copy: "Contact our investor relations for reports prior to 2016.",
};
