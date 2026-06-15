import { investorDocuments } from "../generated/investor-documents.generated.js";

const reconciliationSection = investorDocuments.reconciliation ?? {
  years: [],
  documentsByYear: {},
};

export const reconciliationYears = reconciliationSection.years;

export function getReconciliationDocuments(year) {
  const documents = reconciliationSection.documentsByYear[year] ?? [];

  return documents.map((document, index) => ({
    title: document.title,
    date: document.date,
    fileSize: document.size,
    href: document.href,
    isNew: year === reconciliationYears[0] && index === 0,
  }));
}
