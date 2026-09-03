import { investorDocuments } from "../generated/investor-documents.generated.js";

const secretarialSection = investorDocuments.secretarial ?? {
  years: [],
  documentsByYear: {},
};

function reportYearFromTitle(title, fallbackYear) {
  return title.match(/\b(20\d{2})\b/)?.[1] ?? fallbackYear.match(/\d{4}/)?.[0] ?? fallbackYear;
}

export const complianceReports = secretarialSection.years.flatMap((year, yearIndex) =>
  (secretarialSection.documentsByYear[year] ?? []).map((document, documentIndex) => {
    const reportYear = reportYearFromTitle(document.title, year);
    const featured = yearIndex === 0 && documentIndex === 0;

    return {
      id: `${year}-${documentIndex}`,
      title: document.title,
      status: featured ? "Final" : "Archived",
      size: document.size,
      featured,
      href: document.href,
      reportYear,
    };
  }),
);

export const latestComplianceFiscalYear = secretarialSection.years[0] ?? "";

const complianceCalendarYears = complianceReports
  .map((report) => Number(report.reportYear))
  .filter(Number.isFinite);

export const complianceReportRange = {
  first: complianceCalendarYears.length ? Math.min(...complianceCalendarYears) : null,
  last: complianceCalendarYears.length ? Math.max(...complianceCalendarYears) : null,
};
