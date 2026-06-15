import { useRef, useState } from "react";
import InvestorDocumentGrid from "../components/InvestorDocumentGrid.jsx";
import InvestorYearTabs from "../components/InvestorYearTabs.jsx";
import { useInvestorDynamicHeight } from "../components/useInvestorDynamicHeight.js";
import { asset } from "./asset.js";
import { agmYears, getAgmContent } from "./agm-content.js";
import "./AgmPage.css";

/** Figma 1119:8032 — document icon on AGM report cards */
const agmCardIcons = {
  doc: asset("agm-doc-icon.svg"),
  calendar: asset("agm-calendar-icon.svg"),
  arrow: asset("agm-view-arrow.svg"),
};

export default function AgmPage() {
  const [activeYear, setActiveYear] = useState(agmYears[0]);
  const sectionRef = useRef(null);
  const content = getAgmContent(activeYear);

  useInvestorDynamicHeight(sectionRef, [activeYear]);

  return (
    <section ref={sectionRef} className="investor-agm" aria-labelledby="investor-agm-title">
      <h2 id="investor-agm-title">AGM/EGM</h2>
      <p className="investor-agm__lead">
        Transparent governance through timely disclosures and
        <br />
        shareholder engagements.
      </p>

      <InvestorYearTabs years={agmYears} activeYear={activeYear} onSelect={setActiveYear} />

      <div className="investor-agm__grids">
        {content.grids.map((row, index) => (
          <InvestorDocumentGrid
            key={`grid-${index}`}
            documents={row}
            columns={3}
            icons={agmCardIcons}
            docIconNodeId="1119:8032"
          />
        ))}
      </div>

      {content.postalBallot ? (
        <div className="investor-agm__postal">
          <div className="investor-agm__postal-heading">
            <h3>{content.postalBallot.title}</h3>
            <span className="investor-agm__postal-divider" aria-hidden="true" />
          </div>
          <InvestorDocumentGrid
            documents={content.postalBallot.documents}
            columns={1}
            icons={agmCardIcons}
            docIconNodeId="1119:8032"
          />
        </div>
      ) : null}
    </section>
  );
}
