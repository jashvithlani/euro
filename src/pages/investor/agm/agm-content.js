import { investorDocuments } from "../generated/investor-documents.generated.js";

const agmSection = investorDocuments.agm ?? {
  years: [],
  documentsByYear: {},
};

function chunk(items, size) {
  const rows = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

function toCard(document, year, index) {
  return {
    title: document.title,
    date: document.date,
    fileSize: document.size,
    href: document.href,
    isNew: year === agmYears[0] && index === 0,
  };
}

export const agmYears = agmSection.years;

export function getAgmContent(year) {
  const documents = agmSection.documentsByYear[year] ?? [];
  const cards = documents.map((document, index) => toCard(document, year, index));
  const postalBallotDocuments = cards.filter((document) => /postal ballot/i.test(document.title));

  return {
    grids: chunk(cards, 3),
    postalBallot: postalBallotDocuments.length
      ? {
          title: "Postal Ballot",
          documents: postalBallotDocuments,
        }
      : null,
  };
}
