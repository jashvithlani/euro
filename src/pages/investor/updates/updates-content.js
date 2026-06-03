export const updatesPageCopy = {
  title: "Corporate Updates",
  description:
    "Real-time disclosures and regulatory filings for Euro India Fresh Foods Limited. Precision in every announcement.",
  ctaTitle: ["Want to receive these", "updates automatically?"],
  ctaBody:
    "Subscribe to our investor newsletter to get real-time regulatory filings and corporate announcements delivered to your inbox.",
  ctaButton: "Subscribe to News",
};

export const fyYearTabs = [
  "2025-26",
  "2024-25",
  "2023-24",
  "2022-23",
  "2021-22",
  "2020-21",
  "2019-20",
];

/** Badge tone keys map to CSS modifiers on `.investor-updates-item__badge`. */
export const updatesByYear = {
  "2025-26": [
    {
      month: "JULY",
      day: "26",
      year: "2023",
      badge: "REGULATION 30",
      badgeTone: "regulation",
      title: "26.07.2025 - Credit Rating",
      href: "#",
    },
    {
      month: "JULY",
      day: "26",
      year: "2023",
      badge: "DISCLOSURE",
      badgeTone: "disclosure",
      title: "Disclosure as per Regulation 30",
      href: "#",
    },
    {
      month: "JULY",
      day: "14",
      year: "2023",
      badge: "COMPLIANCE",
      badgeTone: "compliance",
      title:
        "Special Window for Re-lodgement of Transfer Requests of Physical Shares and Updation of KYC.",
      href: "#",
    },
    {
      month: "JUNE",
      day: "28",
      year: "2023",
      badge: "NSE FILING",
      badgeTone: "regulation",
      title: "Clarification to NSE for increase in Volume in listed securities of the Company.",
      href: "#",
    },
  ],
};

export function getUpdatesForYear(year) {
  return updatesByYear[year] ?? updatesByYear["2025-26"];
}
