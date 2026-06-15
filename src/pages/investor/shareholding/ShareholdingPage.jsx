import { useRef, useState } from "react";
import { useInvestorDynamicHeight } from "../components/useInvestorDynamicHeight.js";
import { useScrollActiveTabIntoView } from "../components/useScrollActiveTabIntoView.js";
import { asset } from "./asset.js";
import { shareholdingDocumentsByYear, shareholdingYears } from "./shareholding-data.js";
import "./ShareholdingPage.css";

function ShareholdingDocumentCard({ doc, className = "" }) {
  return (
    <article className={`shareholding-doc-card ${className}`.trim()}>
      <div className="shareholding-doc-card__header">
        <div className="shareholding-doc-card__icon" aria-hidden="true">
          <img src={asset("shareholding-doc-icon.svg")} alt="" />
        </div>
        {doc.isNew ? (
          <span className="shareholding-doc-card__badge">NEW</span>
        ) : null}
      </div>
      <h3 className="shareholding-doc-card__title">
        {doc.titleLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h3>
      <p className="shareholding-doc-card__date">
        <img src={asset("shareholding-calendar-icon.svg")} alt="" aria-hidden="true" />
        <span>{doc.dateLabel}</span>
      </p>
      <footer className="shareholding-doc-card__footer">
        <span className="shareholding-doc-card__meta">{doc.fileMeta}</span>
        <a className="shareholding-doc-card__link" href={doc.href}>
          <span>View Report</span>
          <img src={asset("shareholding-arrow-icon.svg")} alt="" aria-hidden="true" />
        </a>
      </footer>
    </article>
  );
}

export default function ShareholdingPage() {
  const [activeYear, setActiveYear] = useState(shareholdingYears[0]);
  const sectionRef = useRef(null);
  const activeRef = useScrollActiveTabIntoView(activeYear);
  const documents = shareholdingDocumentsByYear[activeYear] ?? [];

  useInvestorDynamicHeight(sectionRef, [activeYear]);

  return (
    <section ref={sectionRef} className="investor-shareholding" aria-labelledby="shareholding-title">
      <h2 id="shareholding-title" className="investor-shareholding__title">
        Shareholding Pattern
      </h2>
      <p className="investor-shareholding__intro">
        Explore our transparent ownership structure and historical distribution data, updated quarterly to
        maintain investor trust and regulatory compliance.
      </p>

      <div className="investor-shareholding__years" role="tablist" aria-label="Financial year">
        {shareholdingYears.map((year) => {
          const isActive = year === activeYear;
          return (
            <button
              key={year}
              ref={isActive ? activeRef : undefined}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`investor-shareholding__year${isActive ? " is-active" : ""}`}
              onClick={() => setActiveYear(year)}
            >
              {year}
            </button>
          );
        })}
      </div>

      <div className="investor-shareholding__grid">
        {documents.map((doc, index) => (
          <ShareholdingDocumentCard key={doc.id} doc={doc} className={`shareholding-doc-card--${index + 1}`} />
        ))}
        {documents.length === 0 ? (
          <p className="investor-shareholding__empty">Documents for this period will be published soon.</p>
        ) : null}
        {documents.length >= 4 ? (
          <aside className="investor-shareholding__promo" aria-labelledby="shareholding-promo-title">
            <div className="investor-shareholding__promo-copy">
              <p className="investor-shareholding__promo-eyebrow">INVESTOR RELATIONS</p>
              <h3 id="shareholding-promo-title" className="investor-shareholding__promo-title">
                <span>Need specific ownership</span>
                <span>insights?</span>
              </h3>
              <p className="investor-shareholding__promo-text">
                Our grievance cell and compliance team are available to assist with detailed queries regarding
                shareholding structures.
              </p>
              <a className="investor-shareholding__promo-cta" href="/investor/grievance">
                Reach Out to Compliance
              </a>
            </div>
            <div className="investor-shareholding__promo-visual" aria-hidden="true">
              <div className="investor-shareholding__promo-photo">
                <img src={asset("shareholding-promo-photo.png")} alt="" />
              </div>
            </div>
            <span className="investor-shareholding__promo-glow" aria-hidden="true" />
          </aside>
        ) : null}
      </div>
    </section>
  );
}
