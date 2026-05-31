import { Link, useLocation } from "react-router-dom";
import { getInvestorActiveTab, getInvestorHref } from "../investor-routing.js";
import { investorFilterTabs } from "../investor-tabs.js";
import "./InvestorFilterNav.css";

const FIGMA_SCALE = 1280 / 1920;

function scale(value) {
  return value * FIGMA_SCALE;
}

function pillStyle(tab) {
  return {
    left: `${scale(tab.left)}px`,
    top: `${scale(tab.top)}px`,
    width: `${scale(tab.width)}px`,
    height: `${scale(tab.height)}px`,
  };
}

export default function InvestorFilterNav() {
  const { pathname } = useLocation();
  const activeTab = getInvestorActiveTab(pathname);

  return (
    <section className="investor-filter-nav" aria-label="Investor document categories">
      <div className="investor-filter-nav__inner">
        {investorFilterTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const className = [
            "investor-filter-nav__pill",
            isActive ? "is-active" : "",
            tab.borderTone === "muted" ? "investor-filter-nav__pill--muted-border" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <Link
              key={tab.id}
              to={getInvestorHref(tab.id)}
              preventScrollReset
              className={className}
              style={pillStyle(tab)}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
