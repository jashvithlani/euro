import { investorDocuments } from "../generated/investor-documents.generated.js";

const financialSection = investorDocuments.financial ?? {
  years: [],
  documentsByYear: {},
};

export const financialYearTabs = financialSection.years;

export function getFinancialDocuments(year) {
  const documents = financialSection.documentsByYear[year] ?? [];

  return documents.map((document, index) => ({
    title: document.title,
    date: document.date,
    fileSize: document.meta,
    href: document.href,
    isNew: year === financialYearTabs[0] && index === 0,
  }));
}
