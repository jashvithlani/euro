import { useState } from "react";
import InvestorDocumentGrid from "../components/InvestorDocumentGrid.jsx";
import InvestorYearTabs from "../components/InvestorYearTabs.jsx";
import { asset } from "./asset.js";
import { getGovernanceDocuments, governanceYears } from "./governance-content.js";
import "./GovernancePage.css";

/** Figma 1117:6280 — document icon on governance report cards */
const governanceCardIcons = {
  doc: asset("governance-doc-icon.svg"),
  calendar: asset("governance-calendar-icon.svg"),
  arrow: asset("governance-view-arrow.svg"),
};

/** /investor/governance — Figma frame 1117:5978 */
export default function GovernancePage() {
  const [activeYear, setActiveYear] = useState(governanceYears[0]);
  const documents = getGovernanceDocuments(activeYear);

  return (
    <section
      className="investor-governance"
      aria-labelledby="investor-governance-title"
      data-node-id="1117:5978"
    >
      <h2 id="investor-governance-title" data-node-id="1117:6262">
        Corporate Governance Reports
      </h2>

      <InvestorYearTabs
        years={governanceYears}
        activeYear={activeYear}
        onSelect={setActiveYear}
      />

      <div className="investor-governance__grid" role="tabpanel" data-node-id="1117:6279">
        {documents.length > 0 ? (
          <InvestorDocumentGrid
            documents={documents}
            columns={3}
            icons={governanceCardIcons}
            docIconNodeId="1117:6280"
          />
        ) : (
          <p className="investor-governance__empty">No reports published for this year yet.</p>
        )}
      </div>
    </section>
  );
}
