/** Reconciliation — synced from euroindiafoods.com */
export const reconciliationYears = [
  "2025-26"
];

const reconciliationDocumentsByYear = {
  "2025-26": [
    {
      title: "Reconciliation of Share Capital Audit Report 30.06.2025",
      date: "June 30, 2025",
      fileSize: "123 KB",
      href: "/investor-pdfs/reconciliation/RECO-30.06.2025.pdf",
      isNew: true
    },
    {
      title: "Reconcilliation of Share Capital Audit 31.12.2025",
      date: "December 31, 2025",
      fileSize: "221 KB",
      href: "/investor-pdfs/reconciliation/Reconciliation-of-share-capital-audit.pdf"
    }
  ]
};

export function getReconciliationDocuments(year) {
  return reconciliationDocumentsByYear[year] ?? [];
}
