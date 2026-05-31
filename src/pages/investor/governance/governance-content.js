/** Figma 1117:5978 — Corporate Governance Reports */
export const governanceYears = [
  "2025-26",
  "2024-25",
  "2023-24",
  "2022-23",
  "2021-22",
  "2020-21",
  "2019-20",
];

const governanceDocumentsByYear = {
  "2025-26": [
    {
      title: "11.07.2025-Integrated Filing (Governance) as on 30.06.2025 ",
      date: "June 30, 2025",
      fileSize: "1.2 MB",
      href: "#",
      isNew: true,
    },
    {
      title: "07.10.2025-Integrated Filing (Governance) as on 30.09.2025",
      date: "March 31, 2025",
      fileSize: "840 KB",
      href: "#",
    },
    {
      title: "12.01.2026 - Integrated Filing (Governance) as on 31.12.2025",
      date: "December 31, 2024",
      fileSize: "920 KB",
      href: "#",
    },
  ],
};

export function getGovernanceDocuments(year) {
  return governanceDocumentsByYear[year] ?? [];
}
