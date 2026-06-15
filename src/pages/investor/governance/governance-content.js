import { investorDocuments } from "../generated/investor-documents.generated.js";

const governanceSection = investorDocuments.governance ?? {
  years: [],
  documentsByYear: {},
};

export const governanceYears = governanceSection.years;

export function getGovernanceDocuments(year) {
  const documents = governanceSection.documentsByYear[year] ?? [];

  return documents.map((document, index) => ({
    title: document.title,
    date: document.date,
    fileSize: document.size,
    href: document.href,
    isNew: year === governanceYears[0] && index === 0,
  }));
}
