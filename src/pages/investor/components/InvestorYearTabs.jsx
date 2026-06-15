import { useScrollActiveTabIntoView } from "./useScrollActiveTabIntoView.js";
import "./InvestorYearTabs.css";

export default function InvestorYearTabs({ years, activeYear, onSelect }) {
  const activeRef = useScrollActiveTabIntoView(activeYear);

  return (
    <div className="investor-year-tabs" role="tablist" aria-label="Financial year">
      {years.map((year) => {
        const isActive = year === activeYear;

        return (
          <button
            key={year}
            ref={isActive ? activeRef : undefined}
            type="button"
            role="tab"
            className={`investor-year-tabs__pill${isActive ? " is-active" : ""}`}
            aria-selected={isActive}
            onClick={() => onSelect(year)}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}
