import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import InvestorYearTabs from "../components/InvestorYearTabs.jsx";
import { useInvestorDynamicHeight } from "../components/useInvestorDynamicHeight.js";
import { asset } from "./asset.js";
import {
  getReconciliationDocuments,
  reconciliationYears,
} from "./reconciliation-content.js";
import "./ReconciliationPage.css";

function ReconciliationDocumentCard({ title, date, fileSize, href, isNew = false }) {
  return (
    <article className="investor-reconciliation-card">
      <div className="investor-reconciliation-card__header">
        <div className="investor-reconciliation-card__icon" aria-hidden="true">
          <img src={asset("reconciliation-doc-icon.svg")} alt="" />
        </div>
        {isNew ? <span className="investor-reconciliation-card__badge">NEW</span> : null}
      </div>

      <h3 className="investor-reconciliation-card__title">{title}</h3>

      <div className="investor-reconciliation-card__date">
        <img src={asset("reconciliation-calendar-icon.svg")} alt="" aria-hidden="true" />
        <span>{date}</span>
      </div>

      <footer className="investor-reconciliation-card__footer">
        <span className="investor-reconciliation-card__meta">PDF • {fileSize}</span>
        <a className="investor-reconciliation-card__link" href={href}>
          <span>View Report</span>
          <img src={asset("reconciliation-view-arrow.svg")} alt="" aria-hidden="true" />
        </a>
      </footer>
    </article>
  );
}

/** /investor/reconciliation — Figma frame 1131:1615 */
export default function ReconciliationPage() {
  const [activeYear, setActiveYear] = useState(reconciliationYears[0]);
  const sectionRef = useRef(null);
  const documents = getReconciliationDocuments(activeYear);
  const documentRows = useMemo(() => {
    const rows = [];

    for (let index = 0; index < documents.length; index += 3) {
      rows.push(documents.slice(index, index + 3));
    }

    return rows;
  }, [documents]);

  useInvestorDynamicHeight(sectionRef, [activeYear]);

  return (
    <section
      ref={sectionRef}
      className="investor-reconciliation"
      aria-labelledby="investor-reconciliation-title"
      data-node-id="1131:1615"
    >
      <header className="investor-reconciliation__intro">
        <h2 id="investor-reconciliation-title">
          <span>Reconciliation of Share Capital</span>
          <span>Audit Report</span>
        </h2>
        <p className="investor-reconciliation__lede">
          Access detailed audit certifications ensuring the reconciliation of the total admitted capital with
          the total issued and listed capital for Euro India Foods.
        </p>
      </header>

      <InvestorYearTabs
        years={reconciliationYears}
        activeYear={activeYear}
        onSelect={setActiveYear}
      />

      <div className="investor-reconciliation__grids" role="tabpanel">
        {documentRows.length > 0 ? (
          documentRows.map((row, rowIndex) => (
            <div
              key={`reconciliation-row-${rowIndex}`}
              className="investor-reconciliation__grid"
              data-node-id={rowIndex === 0 ? "1131:1872" : "1131:1926"}
            >
              {row.map((doc, cardIndex) => (
                <ReconciliationDocumentCard
                  key={`${activeYear}-${rowIndex}-${cardIndex}`}
                  {...doc}
                />
              ))}
            </div>
          ))
        ) : (
          <p className="investor-reconciliation__empty">No audit reports published for this year yet.</p>
        )}
      </div>

      <section className="investor-reconciliation-cta" aria-labelledby="investor-reconciliation-cta-title">
        <div className="investor-reconciliation-cta__copy">
          <h2 id="investor-reconciliation-cta-title">
            <span>Need specific compliance</span>
            <span>data?</span>
          </h2>
          <p>
            Our investor relations team provides direct access to historical share capital audit data and
            regulatory filing history upon verified request.
          </p>
          <Link className="investor-reconciliation-cta__button" to="/contact">
            Contact Investor Relations
          </Link>
        </div>
        <div className="investor-reconciliation-cta__visual" aria-hidden="true">
          <div className="investor-reconciliation-cta__ring">
            <img src={asset("reconciliation-cta-icon.svg")} alt="" />
          </div>
        </div>
      </section>
    </section>
  );
}
