import { useState } from "react";
import "./InvestorPage.css";

/** Layout from Figma node 1103:4527 at 1920px — scaled to 1280px in CSS via --inv-scale */
const FIGMA_SCALE = 1280 / 1920;

const filterTabs = [
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

const sectionContent = {
  prospectus: {
    title: "Prospectus",
    cardTitle: "Prospectus Dated: March 14, 2017",
    cardCopy: (
      <>
        Official filing for Euro India Fresh Foods Limited.
        <br />
        Review our financial foundations and strategic growth vision.
      </>
    ),
    downloadHref: "#",
  },
};

function getSectionContent(activeTab) {
  return (
    sectionContent[activeTab] || {
      title: filterTabs.find((tab) => tab.id === activeTab)?.label || "Investor Relations",
      cardTitle: "Documents coming soon",
      cardCopy: "Selected investor resources will be published here.",
      downloadHref: "#",
    }
  );
}

export default function InvestorPage() {
  const [activeTab, setActiveTab] = useState("prospectus");
  const section = getSectionContent(activeTab);

  return (
    <main className="investor-main" aria-labelledby="investor-hero-title">
      <section className="investor-hero" aria-labelledby="investor-hero-title">
        <div className="investor-hero-copy">
          <h1 id="investor-hero-title">
            Investor <em>Relations</em>
          </h1>
          <p>
            Transparency is our most refined ingredient. Explore our financial journey, corporate governance, and the
            roadmap to becoming India&apos;s most trusted snack brand.
          </p>
        </div>

        <div className="investor-hero-media">
          <img
            className="investor-hero-photo"
            src="assets/investor-hero-photo.png"
            alt="Corporate team reviewing market performance"
          />
          <div className="investor-hero-media-texture" aria-hidden="true">
            <img src="assets/investor-hero-texture.png" alt="" />
          </div>
          <div className="investor-hero-gradient" aria-hidden="true" />
          <div className="investor-hero-ticker">
            <p className="investor-hero-ticker-label">Market Status</p>
            <p className="investor-hero-ticker-value">NSE: EUROINDIA</p>
          </div>
        </div>
      </section>

      <section className="investor-filters" aria-label="Investor document categories">
        <div className="investor-filters-inner">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={[
                "investor-filter-pill",
                tab.id === activeTab ? "is-active" : "",
                tab.borderTone === "muted" ? "investor-filter-pill--muted-border" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={pillStyle(tab)}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="investor-documents" aria-labelledby="investor-section-title">
        <h2 id="investor-section-title">{section.title}</h2>

        <article className="investor-document-card">
          <span className="investor-document-card-accent" aria-hidden="true" />
          <div className="investor-document-icon" aria-hidden="true">
            <img src="assets/investor-pdf-icon.svg" alt="" />
          </div>
          <div className="investor-document-copy">
            <h3>{section.cardTitle}</h3>
            <p>{section.cardCopy}</p>
          </div>
          <a className="investor-document-download" href={section.downloadHref}>
            <img src="assets/investor-download-icon.svg" alt="" aria-hidden="true" />
            <span>Download Document</span>
          </a>
        </article>
      </section>

      <section className="investor-transparency" aria-labelledby="investor-transparency-title">
        <div className="investor-transparency-layout">
          <div className="investor-transparency-visual">
            <img src="assets/investor-transparency.png" alt="Euro India Foods leadership" />
          </div>
          <div className="investor-transparency-aside">
            <div className="investor-transparency-copy">
              <h2 id="investor-transparency-title">
                <span>Transparency as a</span>
                <span>Foundation</span>
              </h2>
              <p>
                At Euro India Foods, we believe in radical transparency. Our prospectus outlines our commitment to
                excellence, sustainable sourcing, and long-term value for our shareholders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
