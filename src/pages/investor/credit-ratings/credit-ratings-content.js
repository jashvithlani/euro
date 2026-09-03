import { investorDocuments } from "../generated/investor-documents.generated.js";

const creditRatingsSection = investorDocuments["credit-ratings"] ?? {
  years: [],
  documentsByYear: {},
};

export const creditRatingsYears = creditRatingsSection.years;

export function getCreditRatingsDocuments(year) {
  const documents = creditRatingsSection.documentsByYear[year] ?? [];

  return documents.map((document, index) => ({
    title: document.title,
    date: document.date,
    fileSize: document.size,
    href: document.href,
    isNew: year === creditRatingsYears[0] && index === 0,
  }));
}
