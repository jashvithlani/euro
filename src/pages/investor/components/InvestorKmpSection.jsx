import { asset } from "../asset.js";
import { kmpContactEmail, kmpContactEmailHref, kmpPersonnel } from "../kmp/kmp-data.js";

function KmpProfileCard({ person }) {
  return (
    <article className="investor-kmp-card">
      <div className="investor-kmp-card__identity">
        <div className="investor-kmp-card__avatar" aria-hidden="true">
          <img src={asset("investor-kmp-person-icon.svg")} alt="" />
        </div>
        <h3 className="investor-kmp-card__name">{person.name}</h3>
        <p className="investor-kmp-card__role">{person.role}</p>
      </div>
      <div className="investor-kmp-card__contact">
        <div className="investor-kmp-card__contact-row">
          <img className="investor-kmp-card__icon" src={asset("investor-kmp-email-icon.svg")} alt="" aria-hidden="true" />
          <a className="investor-kmp-card__email" href={kmpContactEmailHref}>
            {kmpContactEmail}
          </a>
        </div>
      </div>
    </article>
  );
}

export default function InvestorKmpSection() {
  return (
    <section className="investor-kmp" aria-labelledby="investor-kmp-title">
      <header className="investor-kmp-header">
        <h2 id="investor-kmp-title" className="investor-kmp-title">
          <span>Authorized KMP’s for Determining</span>
          <span>Materiality of an Event or Information</span>
        </h2>
        <p className="investor-kmp-subtitle">
          Official contact information for authorized personnel
          <br />
          regarding materiality disclosures and investor inquiries.
        </p>
      </header>

      <div className="investor-kmp-grid-section" data-node-id="1130:1516">
        <div className="investor-kmp-grid-section__inner" data-node-id="1130:1517">
          <div className="investor-kmp-grid-header">
            <div className="investor-kmp-grid-header__title">
              <h3>Key Managerial Personnel</h3>
              <span className="investor-kmp-grid-header__accent" aria-hidden="true" />
            </div>
            <p className="investor-kmp-grid-header__note">
              Contact information provided for official communication regarding
              <br />
              materiality disclosures and investor inquiries.
            </p>
          </div>

          <div className="investor-kmp-grid" data-node-id="1130:1524">
            {kmpPersonnel.map((person) => (
              <KmpProfileCard key={person.name} person={person} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
