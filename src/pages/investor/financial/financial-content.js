/** Financial Information outlet — Figma 1130:37 (scaled to 1280px canvas) */

export const financialYearTabs = [
  "2025-26",
  "2024-25",
  "2023-24",
  "2022-23",
  "2021-22",
  "2020-21",
  "2019-20",
];

export const financialDocumentsByYear = {
  "2025-26": [
    {
      id: "q-mar-2025",
      title: "For the Quarter ended on March 31, 2025",
      date: "June 30, 2025",
      fileSize: "PDF • 1.2 MB",
      href: "#",
      isNew: true,
    },
    {
      id: "q-jun-2025",
      title: "For the Quarter ended on June 30, 2025",
      date: "March 31, 2025",
      fileSize: "PDF • 840 KB",
      href: "#",
    },
    {
      id: "q-sep-2025-a",
      title: "For the Quarter Ended on september 2025",
      date: "December 31, 2024",
      fileSize: "PDF • 920 KB",
      href: "#",
    },
    {
      id: "q-sep-2025-b",
      title: "For the Quarter Ended on september 2025",
      date: "June 30, 2025",
      fileSize: "PDF • 1.2 MB",
      href: "#",
      isNew: true,
    },
    {
      id: "q-sep-2025-c",
      title: "For the Quarter Ended on september 2025",
      date: "March 31, 2025",
      fileSize: "PDF • 840 KB",
      href: "#",
    },
    {
      id: "q-sep-2025-d",
      title: "For the Quarter Ended on september 2025",
      date: "December 31, 2024",
      fileSize: "PDF • 920 KB",
      href: "#",
    },
  ],
};

export function getFinancialDocuments(year) {
  return financialDocumentsByYear[year] ?? financialDocumentsByYear["2025-26"];
}
