import { investorDocuments } from "../generated/investor-documents.generated.js";

const updatesSection = investorDocuments.updates ?? {
  years: [],
  documentsByYear: {},
};

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

function dateParts(document) {
  if (document.timestamp) {
    const date = new Date(document.timestamp);
    return {
      month: MONTHS[date.getUTCMonth()] ?? "UPDATE",
      day: String(date.getUTCDate()).padStart(2, "0"),
      year: String(date.getUTCFullYear()),
    };
  }

  const year = String(document.calendarYear || "").match(/\d{4}/)?.[0] ?? "2025";
  return {
    month: "UPDATE",
    day: "01",
    year,
  };
}

export const updatesPageCopy = {
  title: "Corporate Updates",
  description:
    "Real-time disclosures and regulatory filings for Euro India Fresh Foods Limited. Precision in every announcement.",
  ctaTitle: ["Want to receive these", "updates automatically?"],
  ctaBody:
    "Subscribe to our investor newsletter to get real-time regulatory filings and corporate announcements delivered to your inbox.",
  ctaButton: "Subscribe to News",
};

export const fyYearTabs = updatesSection.years;

export const updatesByYear = Object.fromEntries(
  fyYearTabs.map((year) => [
    year,
    (updatesSection.documentsByYear[year] ?? []).map((document) => ({
      ...dateParts(document),
      badge: document.badge,
      badgeTone: document.badgeTone,
      title: document.title,
      href: document.href,
    })),
  ]),
);

export function getUpdatesForYear(year) {
  return updatesByYear[year] ?? [];
}
