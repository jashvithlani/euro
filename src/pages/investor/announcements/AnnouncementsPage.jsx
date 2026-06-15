import { useRef, useState } from "react";
import { useInvestorDynamicHeight } from "../components/useInvestorDynamicHeight.js";
import {
  announcementsPageCopy,
  calendarYearTabs,
  fyYearTabs,
  getAnnouncementGroups,
  getCalendarAnnouncementCards,
} from "./announcement-content.js";
import InvestorCompactDocCard from "./components/InvestorCompactDocCard.jsx";
import InvestorReportCard from "./components/InvestorReportCard.jsx";
import InvestorYearTabs from "./components/InvestorYearTabs.jsx";
import "./AnnouncementsPage.css";

export default function AnnouncementsPage() {
  const [activeFyIndex, setActiveFyIndex] = useState(0);
  const [activeCalendarIndex, setActiveCalendarIndex] = useState(0);
  const sectionRef = useRef(null);
  const activeFyYear = fyYearTabs[activeFyIndex];
  const activeCalendarYear = calendarYearTabs[activeCalendarIndex];
  const groups = getAnnouncementGroups(activeFyYear).filter((group) =>
    group.rows.some((row) => row.length > 0)
  );
  const calendarCards = getCalendarAnnouncementCards(activeCalendarYear);

  useInvestorDynamicHeight(sectionRef, [activeFyIndex, activeCalendarIndex], { bottomGap: 0 });

  return (
    <section
      ref={sectionRef}
      className="investor-announcements"
      aria-labelledby="investor-announcements-title"
    >
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
        </div>
      ))}

      <InvestorYearTabs
        tabs={calendarYearTabs}
        activeIndex={activeCalendarIndex}
        onChange={setActiveCalendarIndex}
        className="investor-announcements__calendar-tabs"
      />

      {calendarCards.length > 0 ? (
        <div className="investor-announcements__report-grid">
          {calendarCards.map((card) => (
            <InvestorReportCard key={`${activeCalendarYear}-${card.title}`} {...card} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
