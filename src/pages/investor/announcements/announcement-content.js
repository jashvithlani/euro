/** Content from Figma 1117:6898 — Corporate Announcements @ 1920px */

export const fyYearTabs = [
  "2025-26",
  "2024-25",
  "2023-24",
  "2022-23",
  "2021-22",
  "2020-21",
  "2019-20",
];

export const calendarYearTabs = [
  "Year 2023",
  "Year 2022",
  "Year 2021",
  "Year 2020",
  "Year 2019",
  "Year 2018",
  "Year 2017",
];

const boardMeetingsCards = [
  [
    { title: "Annual Report 2021-22", meta: "PDF • 19.8 MB", icon: "report" },
    { title: "Annual Return 2021-22", meta: "PDF • 4.2 MB", icon: "return" },
    { title: "Annual Return 2021-22", meta: "PDF • 4.2 MB", icon: "return" },
  ],
  [
    { title: "Annual Report 2022-23", meta: "PDF • 22.1 MB", icon: "report" },
    { title: "Annual Report 2022-23", meta: "PDF • 22.1 MB", icon: "report" },
    { title: "Annual Return 2022-23", meta: "PDF • 5.4 MB", icon: "return" },
  ],
  [
    { title: "Annual Report 2023-24", meta: "PDF • 24.5 MB", icon: "report" },
    {
      title: "Notice of 14th Annual General Meeting",
      meta: "PDF • 0.9 MB • Sep 06, 2023",
      icon: "notice",
      tall: true,
    },
    {
      title: "Notice of 14th Annual General Meeting",
      meta: "PDF • 0.9 MB • Sep 06, 2023",
      icon: "notice",
      tall: true,
    },
  ],
];

const generalAnnouncementCards = [
  [
    { title: "Annual Report 2021-22", meta: "PDF • 19.8 MB", icon: "report" },
    { title: "Annual Return 2021-22", meta: "PDF • 4.2 MB", icon: "return" },
    { title: "Annual Return 2021-22", meta: "PDF • 4.2 MB", icon: "return" },
  ],
  [
    { title: "Annual Report 2022-23", meta: "PDF • 22.1 MB", icon: "report" },
    { title: "Annual Return 2022-23", meta: "PDF • 5.4 MB", icon: "return" },
    { title: "Annual Return 2022-23", meta: "PDF • 5.4 MB", icon: "return" },
  ],
  [
    { title: "Annual Report 2023-24", meta: "PDF • 24.5 MB", icon: "report" },
    {
      title: "Notice of 14th Annual General Meeting",
      meta: "PDF • 0.9 MB • Sep 06, 2023",
      icon: "notice",
      tall: true,
    },
    {
      title: "Notice of 14th Annual General Meeting",
      meta: "PDF • 0.9 MB • Sep 06, 2023",
      icon: "notice",
      tall: true,
    },
  ],
];

export const reportCards = [
  {
    title: "11.07.2025-Integrated Filing (Governance) as on 30.06.2025 ",
    date: "June 30, 2025",
    size: "PDF • 1.2 MB",
    isNew: true,
    href: "#",
  },
  {
    title: "07.10.2025-Integrated Filing (Governance) as on 30.09.2025",
    date: "March 31, 2025",
    size: "PDF • 840 KB",
    href: "#",
  },
  {
    title: "12.01.2026 - Integrated Filing (Governance) as on 31.12.2025",
    date: "December 31, 2024",
    size: "PDF • 920 KB",
    href: "#",
  },
];

export const announcementsPageCopy = {
  title: "Corporate Announcements",
  description:
    "Transparent communication and timely disclosures regarding our operational milestones, board decisions, and strategic shifts.",
  boardMeetingsLabel: "Board Meetings",
  generalLabel: "General Announcements",
  viewAllLabel: "View All",
};

export function getAnnouncementGroups() {
  return [
    { id: "board-meetings", label: announcementsPageCopy.boardMeetingsLabel, rows: boardMeetingsCards },
    { id: "general", label: announcementsPageCopy.generalLabel, rows: generalAnnouncementCards },
  ];
}
