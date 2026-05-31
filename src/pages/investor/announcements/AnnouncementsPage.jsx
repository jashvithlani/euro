import { useState } from "react";
import {
  announcementsPageCopy,
  calendarYearTabs,
  fyYearTabs,
  getAnnouncementGroups,
  reportCards,
} from "./announcement-content.js";
import InvestorCompactDocCard from "./components/InvestorCompactDocCard.jsx";
import InvestorReportCard from "./components/InvestorReportCard.jsx";
import InvestorYearTabs from "./components/InvestorYearTabs.jsx";
import "./AnnouncementsPage.css";

export default function AnnouncementsPage() {
  const [activeFyIndex, setActiveFyIndex] = useState(0);
  const [activeCalendarIndex, setActiveCalendarIndex] = useState(0);
  const groups = getAnnouncementGroups();

  return (
    <section className="investor-announcements" aria-labelledby="investor-announcements-title">
      <header className="investor-announcements__header">
        <h2 id="investor-announcements-title">{announcementsPageCopy.title}</h2>
        <p>{announcementsPageCopy.description}</p>
      </header>

      <InvestorYearTabs
        tabs={fyYearTabs}
        activeIndex={activeFyIndex}
        onChange={setActiveFyIndex}
        className="investor-announcements__fy-tabs"
      />

      {groups.map((group) => (
        <div key={group.id} className="investor-announcements__group">
          <h3 className="investor-announcements__group-label">{group.label}</h3>
          {group.rows.map((row, rowIndex) => (
            <div key={`${group.id}-${rowIndex}`} className="investor-announcements__compact-grid">
              {row.map((card, cardIndex) => (
                <InvestorCompactDocCard key={`${group.id}-${rowIndex}-${cardIndex}`} {...card} />
              ))}
            </div>
          ))}
          <button type="button" className="investor-announcements__view-all">
            {announcementsPageCopy.viewAllLabel}
          </button>
        </div>
      ))}

      <InvestorYearTabs
        tabs={calendarYearTabs}
        activeIndex={activeCalendarIndex}
        onChange={setActiveCalendarIndex}
        className="investor-announcements__calendar-tabs"
      />

      <div className="investor-announcements__report-grid">
        {reportCards.map((card) => (
          <InvestorReportCard key={card.title} {...card} />
        ))}
      </div>

      <div className="investor-announcements__report-grid investor-announcements__report-grid--secondary">
        {reportCards.map((card) => (
          <InvestorReportCard key={`secondary-${card.title}`} {...card} />
        ))}
      </div>
    </section>
  );
}
