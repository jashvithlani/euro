import { useState } from "react";
import { asset } from "../asset.js";
import {
  financialYearTabs,
  getFinancialDocuments,
} from "./financial-content.js";

export default function InvestorFinancialSection() {
  const [activeYear, setActiveYear] = useState(financialYearTabs[0]);
  const documents = getFinancialDocuments(activeYear);

  return (
    <section className="investor-financial" aria-labelledby="investor-financial-title">
      <h2 id="investor-financial-title" className="investor-financial__title">
        Financial Information
      </h2>

      <p className="investor-financial__lede">
        Access our comprehensive financial history, quarterly earnings, and annual audit reports
        <br />
        to understand the growth trajectory of The Gourmet.
      </p>

      <div className="investor-financial__years" role="tablist" aria-label="Financial year">
        {financialYearTabs.map((year) => {
          const isActive = year === activeYear;

          return (
            <button
              key={year}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`investor-financial__year${isActive ? " is-active" : ""}`}
              onClick={() => setActiveYear(year)}
            >
              {year}
            </button>
          );
        })}
      </div>

      <div className="investor-financial__grid" role="tabpanel">
        {documents.map((doc) => (
          <article key={doc.id} className="investor-financial-card">
            <div className="investor-financial-card__header">
              <div className="investor-financial-card__icon" aria-hidden="true">
                <img src={asset("investor-financial-doc-icon.svg")} alt="" />
              </div>
              {doc.isNew ? (
                <span className="investor-financial-card__badge">NEW</span>
              ) : null}
            </div>

            <h3 className="investor-financial-card__title">{doc.title}</h3>

            <p className="investor-financial-card__date">
              <img src={asset("investor-financial-calendar.svg")} alt="" aria-hidden="true" />
              <span>{doc.date}</span>
            </p>

            <footer className="investor-financial-card__footer">
              <span className="investor-financial-card__meta">{doc.fileSize}</span>
              <a className="investor-financial-card__link" href={doc.href}>
                View Report
                <img src={asset("investor-financial-arrow.svg")} alt="" aria-hidden="true" />
              </a>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
