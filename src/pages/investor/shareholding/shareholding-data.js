import { investorDocuments } from "../generated/investor-documents.generated.js";

const shareholdingSection = investorDocuments.shareholding ?? {
  years: [],
  documentsByYear: {},
};

function shareTitleLines(title) {
  const cleanedTitle = title.replace(/^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\s*[-–]\s*/, "");
  const asOn = cleanedTitle.match(/^(shareholding pattern as on)\s+(.+)$/i);

  if (asOn) {
    return ["Shareholding pattern as on", asOn[2].trim()];
  }

  return [cleanedTitle];
}

export const shareholdingYears = shareholdingSection.years;

export const shareholdingDocumentsByYear = Object.fromEntries(
  shareholdingYears.map((year) => [
    year,
    (shareholdingSection.documentsByYear[year] ?? []).map((document, index) => ({
      id: `${year}-${index}`,
      titleLines: shareTitleLines(document.title),
      dateLabel: document.date,
      fileMeta: document.meta,
      href: document.href,
      isNew: year === shareholdingYears[0] && index === 0,
    })),
  ]),
);
