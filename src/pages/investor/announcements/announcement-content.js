import { investorDocuments } from "../generated/investor-documents.generated.js";

const announcementsSection = investorDocuments.announcements ?? {
  fiscalYears: [],
  calendarYears: [],
  calendarDocumentsByYear: {},
};

function chunk(items, size) {
  const rows = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

function compactCard(document) {
  return {
    title: document.title,
    meta: document.meta,
    icon: document.icon,
    href: document.href,
    tall: document.tall,
  };
}

export const fyYearTabs = announcementsSection.fiscalYears.map((item) => item.year);

export const calendarYearTabs = announcementsSection.calendarYears;

export const announcementsPageCopy = {
  title: "Corporate Announcements",
  description:
    "Transparent communication and timely disclosures regarding our operational milestones, board decisions, and strategic shifts.",
  boardMeetingsLabel: "Board Meetings",
  generalLabel: "General Announcements",
};

export function getAnnouncementGroups(fyYear) {
  const data = announcementsSection.fiscalYears.find((item) => item.year === fyYear);

  return (data?.groups ?? []).map((group) => ({
    id: group.id,
    label: group.label,
    rows: chunk(group.documents.map(compactCard), 3),
  }));
}

export function getCalendarAnnouncementCards(calendarYear) {
  const documents = announcementsSection.calendarDocumentsByYear[calendarYear] ?? [];

  return documents.map((document, index) => ({
    title: document.title,
    date: document.date,
    size: document.meta,
    isNew: calendarYear === calendarYearTabs[0] && index === 0,
    href: document.href,
  }));
}
