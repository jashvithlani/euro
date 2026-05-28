import "./InvestorFilterNav.css";

/** Layout from Figma node 1103:4527 at 1920px — scaled to 1280px */
const FIGMA_SCALE = 1280 / 1920;

export const investorFilterTabs = [
  { id: "prospectus", label: "Prospectus", left: 0, top: 0, width: 192, height: 61 },
  { id: "grievance", label: "Investor Grievance", left: 211, top: 0, width: 269, height: 61 },
  { id: "shareholding", label: "Shareholding Pattern", left: 499, top: 0, width: 294, height: 61 },
  { id: "board", label: "Composition of Board and Committees", left: 812, top: 0, width: 489, height: 61 },
  { id: "policies", label: "Corporate Policies", left: 1321, top: 0, width: 267, height: 61 },
  { id: "governance", label: "Corporate Governance Reports", left: 0, top: 80, width: 407, height: 61 },
  { id: "annual", label: "Annual Reports", left: 426, top: 80, width: 230, height: 61 },
  { id: "secretarial", label: "Annual Secretarial Compliance Report", left: 675, top: 80, width: 476, height: 61 },
  {
    id: "announcements",
    label: "Corporate Announcements",
    left: 1170,
    top: 80,
    width: 362,
    height: 61,
    borderTone: "muted",
  },
  { id: "agm", label: "AGM/EGM", left: 1551, top: 80, width: 181, height: 61 },
  { id: "financial", label: "Financial Information", left: 0, top: 160, width: 292, height: 60 },
  { id: "dispute", label: "Online Dispute Resolution", left: 311, top: 160, width: 344, height: 60 },
  { id: "memorandum", label: "Memorandum of Association", left: 675, top: 160, width: 376, height: 60 },
  { id: "kmp", label: "Authorized KMP's", left: 1070, top: 160, width: 256, height: 60 },
  { id: "updates", label: "Updates", left: 1345, top: 160, width: 160, height: 60 },
  { id: "reconciliation", label: "Reconciliation of", left: 1532, top: 160, width: 250, height: 61 },
];

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

export default function InvestorFilterNav({ activeTab, onTabChange }) {
  return (
    <section className="investor-filter-nav" aria-label="Investor document categories">
      <div className="investor-filter-nav__inner">
        {investorFilterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={[
              "investor-filter-nav__pill",
              tab.id === activeTab ? "is-active" : "",
              tab.borderTone === "muted" ? "investor-filter-nav__pill--muted-border" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={pillStyle(tab)}
            onClick={() => onTabChange(tab.id)}
            aria-pressed={tab.id === activeTab}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
}
