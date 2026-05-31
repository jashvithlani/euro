/** Figma 1131:1615 — Reconciliation @ 1920 → 1280 */
export const reconciliationYears = [
  "2025-26",
  "2024-25",
  "2023-24",
  "2022-23",
  "2021-22",
  "2020-21",
  "2019-20",
];

const reconciliationDocumentsByYear = {
  "2025-26": [
    {
      title: "Reconciliation of Share Capital Audit Report 30.06.2025",
      date: "June 30, 2025",
      fileSize: "1.2 MB",
      href: "#",
      isNew: true,
    },
    {
      title: "Reconciliation of Share Capital Audit Report 30.06.2025",
      date: "March 31, 2025",
      fileSize: "840 KB",
      href: "#",
    },
    {
      title: "Reconciliation of Share Capital Audit Report 30.06.2025",
      date: "December 31, 2024",
      fileSize: "920 KB",
      href: "#",
    },
    {
      title: "Reconciliation of Share Capital Audit Report 30.06.2025",
      date: "June 30, 2025",
      fileSize: "1.2 MB",
      href: "#",
      isNew: true,
    },
    {
      title: "Reconciliation of Share Capital Audit Report 30.06.2025",
      date: "March 31, 2025",
      fileSize: "840 KB",
      href: "#",
    },
    {
      title: "Reconciliation of Share Capital Audit Report 30.06.2025",
      date: "December 31, 2024",
      fileSize: "920 KB",
      href: "#",
    },
  ],
};

export function getReconciliationDocuments(year) {
  return reconciliationDocumentsByYear[year] ?? [];
}
