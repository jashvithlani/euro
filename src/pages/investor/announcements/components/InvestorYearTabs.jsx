import { useScrollActiveTabIntoView } from "../../components/useScrollActiveTabIntoView.js";
import "../../components/InvestorYearTabs.css";

export default function InvestorYearTabs({ tabs, activeIndex, onChange, className = "" }) {
  const activeRef = useScrollActiveTabIntoView(activeIndex);

  return (
    <div className={`investor-year-tabs ${className}`.trim()} role="tablist" aria-label="Filter by period">
      {tabs.map((label, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={label}
            ref={isActive ? activeRef : undefined}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`investor-year-tabs__pill${isActive ? " is-active" : ""}`}
            onClick={() => onChange(index)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
