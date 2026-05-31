import { useState } from "react";
import InvestorYearTabs from "../components/InvestorYearTabs.jsx";
import InvestorUpdateItem from "./components/InvestorUpdateItem.jsx";
import { asset } from "./asset.js";
import {
  fyYearTabs,
  getUpdatesForYear,
  updatesPageCopy,
} from "./updates-content.js";
import "./UpdatesPage.css";

export default function UpdatesPage() {
  const [activeYear, setActiveYear] = useState(fyYearTabs[0]);
  const items = getUpdatesForYear(activeYear);

  return (
    <>
      <section className="investor-updates" aria-labelledby="investor-updates-title">
        <header className="investor-updates__header">
          <h2 id="investor-updates-title">{updatesPageCopy.title}</h2>
          <p>{updatesPageCopy.description}</p>
        </header>

        <InvestorYearTabs years={fyYearTabs} activeYear={activeYear} onSelect={setActiveYear} />

        <div className="investor-updates__list">
          {items.map((item) => (
            <InvestorUpdateItem key={`${item.month}-${item.day}-${item.title}`} {...item} />
          ))}
        </div>
      </section>

      <section className="investor-updates-cta" aria-labelledby="investor-updates-cta-title">
        <div className="investor-updates-cta__backdrop" aria-hidden="true">
          <img src={asset("updates-cta-texture.png")} alt="" />
          <span className="investor-updates-cta__backdrop-fade" />
        </div>
        <div className="investor-updates-cta__inner">
          <div className="investor-updates-cta__copy">
            <h2 id="investor-updates-cta-title">
              {updatesPageCopy.ctaTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p>{updatesPageCopy.ctaBody}</p>
          </div>
          <button type="button" className="investor-updates-cta__button">
            {updatesPageCopy.ctaButton}
          </button>
        </div>
      </section>
    </>
  );
}
