import { useState } from "react";
import InvestorFilterNav, { investorFilterTabs } from "../components/InvestorFilterNav.jsx";
import "./InvestorPage.css";

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
      title: investorFilterTabs.find((tab) => tab.id === activeTab)?.label || "Investor Relations",
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

      <InvestorFilterNav activeTab={activeTab} onTabChange={setActiveTab} />

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
