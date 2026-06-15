import { investorDocuments } from "../generated/investor-documents.generated.js";

const policiesSection = investorDocuments.policies ?? [];

function chunk(items, size) {
  const rows = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

export const policiesPageCopy = {
  title: "Corporate Policies",
  subtitle: [
    "A commitment to transparency, ethical conduct, and the highest standards of",
    "culinary integrity across all global operations.",
  ],
};

export const policiesDocumentGroups = policiesSection.map((group) => ({
  id: group.id,
  label: group.label,
  variant: group.variant,
  rows: chunk(
    group.documents.map((document) => ({
      title: document.title,
      meta: document.meta,
      icon: document.icon,
      href: document.href,
      tall: document.tall,
    })),
    3,
  ),
}));
