import { useRef, useState } from "react";
import InvestorDocumentGrid from "../components/InvestorDocumentGrid.jsx";
import InvestorYearTabs from "../components/InvestorYearTabs.jsx";
import { useInvestorDynamicHeight } from "../components/useInvestorDynamicHeight.js";
import { asset as governanceAsset } from "../governance/asset.js";
import {
  creditRatingsYears,
  getCreditRatingsDocuments,
} from "./credit-ratings-content.js";
import "./CreditRatingsPage.css";

const creditRatingsCardIcons = {
  doc: governanceAsset("governance-doc-icon.svg"),
  calendar: governanceAsset("governance-calendar-icon.svg"),
  arrow: governanceAsset("governance-view-arrow.svg"),
};

export default function CreditRatingsPage() {
  const [activeYear, setActiveYear] = useState(creditRatingsYears[0]);
  const sectionRef = useRef(null);
  const documents = getCreditRatingsDocuments(activeYear);

  useInvestorDynamicHeight(sectionRef, [activeYear]);

  return (
    <section
      ref={sectionRef}
      className="investor-credit-ratings"
      aria-labelledby="investor-credit-ratings-title"
    >
      <h2 id="investor-credit-ratings-title">Credit Ratings</h2>

      <InvestorYearTabs
        years={creditRatingsYears}
        activeYear={activeYear}
        onSelect={setActiveYear}
      />

      <div className="investor-credit-ratings__grid" role="tabpanel">
        {documents.length > 0 ? (
          <InvestorDocumentGrid
            documents={documents}
            columns={3}
            icons={creditRatingsCardIcons}
          />
        ) : (
          <p className="investor-credit-ratings__empty">
            No credit ratings published for this year yet.
          </p>
        )}
      </div>
    </section>
  );
}
