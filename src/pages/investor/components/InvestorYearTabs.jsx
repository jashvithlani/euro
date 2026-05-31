import "./InvestorYearTabs.css";

export default function InvestorYearTabs({ years, activeYear, onSelect }) {
  return (
    <div className="investor-year-tabs" role="tablist" aria-label="Financial year">
      {years.map((year) => {
        const isActive = year === activeYear;

        return (
          <button
            key={year}
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
