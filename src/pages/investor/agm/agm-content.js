export const agmYears = [
  "2025-26",
  "2024-25",
  "2023-24",
  "2022-23",
  "2021-22",
  "2020-21",
  "2019-20",
];

const card = (title, date, fileSize, options = {}) => ({
  title,
  date,
  fileSize,
  href: "#",
  ...options,
});

const agmDocumentsByYear = {
  "2025-26": {
    grids: [
      [
        card("02.09.2025-Newspaper Advertisement for 16th AGM Dt.: 26.09.2025", "June 30, 2025", "1.2 MB", {
          isNew: true,
        }),
        card(
          "04.09.2025-Addendum to the Notice of AGM to be held on Dt. 26.09.2025",
          "March 31, 2025",
          "840 KB",
        ),
        card(
          "04.09.2025-Addendum to the Notice of AGM to be held on Dt. 26.09.2025",
          "December 31, 2024",
          "920 KB",
        ),
      ],
      [
        card(
          "04.09.2025-Addendum to the Notice of AGM to be held on Dt. 26.09.2025",
          "June 30, 2025",
          "1.2 MB",
          { isNew: true },
        ),
        card(
          "04.09.2025-Addendum to the Notice of AGM to be held on Dt. 26.09.2025",
          "March 31, 2025",
          "840 KB",
        ),
        card(
          "04.09.2025-Addendum to the Notice of AGM to be held on Dt. 26.09.2025",
          "December 31, 2024",
          "920 KB",
        ),
      ],
    ],
    postalBallot: {
      title: "Postal Ballot",
      documents: [
        card("11.07.2025-Integrated Filing (Governance) as on 30.06.2025", "June 30, 2025", "1.2 MB", {
          isNew: true,
        }),
      ],
    },
  },
};

export function getAgmContent(year) {
  return (
    agmDocumentsByYear[year] || {
      grids: [],
      postalBallot: null,
    }
  );
}
