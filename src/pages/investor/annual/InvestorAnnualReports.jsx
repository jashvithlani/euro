import { annualAsset } from "./asset.js";
import { sharedAsset } from "../../../shared/asset.js";
import OptimizedImage from "../../../components/OptimizedImage.jsx";
import {
  annualArchiveYears,
  annualFeaturedYears,
  annualReportsIntro,
  annualRequestCard,
} from "./annual-reports-data.js";
import "./AnnualPage.css";

function YearDivider({ label, align }) {
  return (
    <div className={`investor-annual__year-head investor-annual__year-head--${align}`}>
      <h3 className="investor-annual__year-label">{label}</h3>
      <span className="investor-annual__year-rule" aria-hidden="true" />
    </div>
  );
}

function ArchiveLink({ label, href }) {
  return (
    <a className="investor-annual__archive-link" href={href}>
      <span>{label}</span>
      <img src={annualAsset("annual-chevron.svg")} alt="" aria-hidden="true" />
    </a>
  );
}

function AnnualReturnCard({ card }) {
  if (!card) return null;

  return (
    <a className="investor-annual__return-card" href={card.href}>
      <span className="investor-annual__return-card-icon" aria-hidden="true">
        <img src={annualAsset("annual-pdf-small.svg")} alt="" />
      </span>
      <span className="investor-annual__return-card-copy">
        <span className="investor-annual__return-card-eyebrow">Annual return</span>
        <strong>{card.title}</strong>
        <span className="investor-annual__return-card-meta">{card.meta}</span>
      </span>
      <span className="investor-annual__return-card-cta">
        <span>Download return</span>
        <img src={annualAsset("annual-external-link.svg")} alt="" aria-hidden="true" />
      </span>
    </a>
  );
}

export default function InvestorAnnualReports() {
  const [year2024, year2023] = annualFeaturedYears;

  return (
    <section className="investor-annual" aria-labelledby="investor-annual-title">
      <header className="investor-annual__header">
        <h2 id="investor-annual-title">{annualReportsIntro.title}</h2>
        <p>
          {annualReportsIntro.subtitle[0]}
          <br />
          {annualReportsIntro.subtitle[1]}
        </p>
      </header>

      <div className="investor-annual__list">
        <article className="investor-annual__block" aria-labelledby="annual-year-2024-25">
          <YearDivider label={year2024.yearLabel} align={year2024.yearAlign} />
          <div className="investor-annual__grid-2024">
            <div className="investor-annual__integrated">
              <OptimizedImage
                className="investor-annual__integrated-watermark"
                src={sharedAsset("investor-integrated-watermark.png")}
                alt=""
                aria-hidden="true"
                sizes="160px"
              />
              <div className="investor-annual__integrated-copy">
                <p className="investor-annual__eyebrow investor-annual__eyebrow--brand">
                  {year2024.integrated.eyebrow}
                </p>
                <h4 id="annual-year-2024-25">{year2024.integrated.title}</h4>
              </div>
              <a className="investor-annual__text-cta investor-annual__text-cta--brand" href={year2024.integrated.href}>
                <span>{year2024.integrated.cta}</span>
                <img src={annualAsset("annual-download-arrow.svg")} alt="" aria-hidden="true" />
              </a>
            </div>

            <AnnualReturnCard card={year2024.returnCard} />
          </div>
        </article>

        <article className="investor-annual__block" aria-labelledby="annual-year-2023-24">
          <YearDivider label={year2023.yearLabel} align={year2023.yearAlign} />
          <div className="investor-annual__grid-2023">
            <div className="investor-annual__report-card">
              <div>
                <p className="investor-annual__eyebrow investor-annual__eyebrow--muted">
                  {year2023.reportCard.eyebrow}
                </p>
                <h4 id="annual-year-2023-24">{year2023.reportCard.title}</h4>
                <a className="investor-annual__pill-cta" href={year2023.reportCard.href}>
                  {year2023.reportCard.cta}
                </a>
              </div>
              <div className="investor-annual__doc-preview" aria-hidden="true">
                <span />
                <span />
              </div>
            </div>

            <AnnualReturnCard card={year2023.returnCard} />
          </div>
        </article>

        <section className="investor-annual__archives" aria-labelledby="annual-prior-archives">
          <div className="investor-annual__archives-head">
            <h3 id="annual-prior-archives">Prior Archives</h3>
            <span className="investor-annual__archives-accent" aria-hidden="true" />
          </div>

          <div className="investor-annual__archive-grid">
            {annualArchiveYears.map((item) => (
              <article
                key={item.year}
                className={`investor-annual__archive-card${item.compact ? " investor-annual__archive-card--compact" : ""}`}
              >
                <div className="investor-annual__archive-card-head">
                  <h4>{item.year}</h4>
                  <img src={annualAsset("annual-chevron.svg")} alt="" aria-hidden="true" />
                </div>
                <div className="investor-annual__archive-links">
                  {item.links.map((link) => (
                    <ArchiveLink key={link.label} label={link.label} href={link.href} />
                  ))}
                </div>
              </article>
            ))}

            <div className="investor-annual__request-card">
              <img src={annualAsset("annual-folder.svg")} alt="" aria-hidden="true" />
              <h4>{annualRequestCard.title}</h4>
              <p>{annualRequestCard.copy}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
