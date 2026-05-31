import { asset } from "../asset.js";
import { getInvestorSectionContent } from "../investor-content.jsx";

export default function InvestorDocumentSection({ tabId }) {
  const section = getInvestorSectionContent(tabId);

  return (
    <section className="investor-documents" aria-labelledby="investor-section-title">
      <h2 id="investor-section-title">{section.title}</h2>

      <article className="investor-document-card">
        <span className="investor-document-card-accent" aria-hidden="true" />
        <div className="investor-document-icon" aria-hidden="true">
          <img src={asset("investor-pdf-icon.svg")} alt="" />
        </div>
        <div className="investor-document-copy">
          <h3>{section.cardTitle}</h3>
          <p>{section.cardCopy}</p>
        </div>
        <a className="investor-document-download" href={section.downloadHref}>
          <img src={asset("investor-download-icon.svg")} alt="" aria-hidden="true" />
          <span>Download Document</span>
        </a>
      </article>
    </section>
  );
}
