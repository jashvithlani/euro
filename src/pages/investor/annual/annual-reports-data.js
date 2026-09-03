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

function archiveLinks(year) {
  return (annualSection.documentsByYear[year] ?? [])
    .filter((document) => !/newspaper|public notice/i.test(document.title))
    .map((document) => ({
      label: document.title.toUpperCase(),
      href: document.href,
    }));
}

const [latestYear, secondYear, ...archiveYears] = annualSection.years;
const latestReport = findDoc(latestYear, /integrated|annual report/i) ?? fallbackDoc(latestYear);
const latestReturn = findDoc(latestYear, /annual return|return/i);
const secondReport = findDoc(secondYear, /annual report|report/i) ?? fallbackDoc(secondYear, 1);
const secondReturn = findDoc(secondYear, /annual return|return/i);

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
        returnCard: latestReturn
          ? {
              title: latestReturn.title,
              meta: latestReturn.meta,
              href: latestReturn.href,
            }
          : null,
      }
    : null,
  secondYear
    ? {
        id: secondYear,
        yearLabel: secondYear,
        yearAlign: "right",
        reportCard: {
          eyebrow: "FINANCIAL ARCHIVE",
          title: secondReport.title,
          cta: "DOWNLOAD DOCUMENT",
          href: secondReport.href,
        },
        returnCard: secondReturn
          ? {
              title: secondReturn.title,
              meta: secondReturn.meta,
              href: secondReturn.href,
            }
          : null,
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
