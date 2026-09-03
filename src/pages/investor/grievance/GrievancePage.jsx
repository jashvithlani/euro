import { asset } from "../asset.js";
import "./GrievancePage.css";

function GrievanceRow({ icon, iconClass, rowClass, label, children }) {
  return (
    <div className={`investor-grievance__row${rowClass ? ` ${rowClass}` : ""}`}>
      <div className={`investor-grievance__icon-wrap${iconClass ? ` ${iconClass}` : ""}`}>
        <img src={icon} alt="" aria-hidden="true" />
      </div>
      <div className="investor-grievance__row-body">
        <p className="investor-grievance__label">{label}</p>
        {children}
      </div>
    </div>
  );
}

export default function GrievancePage() {
  return (
    <section className="investor-grievance" aria-labelledby="investor-grievance-title">
      <h2 id="investor-grievance-title" className="investor-grievance__title">
        Investor Grievance
      </h2>
      <p className="investor-grievance__lead">
        Ensuring transparency and swift resolution for our shareholders. Euro India Fresh Foods Ltd is committed to
        maintaining the highest standards of corporate governance and investor communication.
      </p>

      <div className="investor-grievance__cards">
        <article className="investor-grievance__card investor-grievance__card--secretary">
          <span className="investor-grievance__card-accent" aria-hidden="true" />
          <h3 className="investor-grievance__card-heading">Company Secretary Details</h3>
          <div className="investor-grievance__rows">
            <GrievanceRow
              icon={asset("grievance-icon-person.svg")}
              label="Company Secretary & Compliance Officer"
            >
              <p className="investor-grievance__value">Mr.Aniket Ranpara</p>
            </GrievanceRow>

            <GrievanceRow icon={asset("grievance-icon-location.svg")} label="Registered Address">
              <p className="investor-grievance__value investor-grievance__value--address">
                Plot No. A-22/1, G.I.D.C., Ichhapore,
                <br />
                Surat - 394 510, Gujarat, India.
              </p>
            </GrievanceRow>

            <GrievanceRow
              icon={asset("grievance-icon-email.svg")}
              iconClass="investor-grievance__icon-wrap--email"
              label="Email"
            >
              <p className="investor-grievance__value">
                <a href="mailto:cs@euroindiafoods.com">cs@euroindiafoods.com</a>
              </p>
            </GrievanceRow>

            <GrievanceRow
              icon={asset("grievance-icon-phone.svg")}
              iconClass="investor-grievance__icon-wrap--phone"
              rowClass="investor-grievance__row--grievance-contact"
              label="Contact"
            >
              <p className="investor-grievance__value">+91 261 2913021 / 41</p>
            </GrievanceRow>
          </div>
        </article>

        <article className="investor-grievance__card investor-grievance__card--rta">
          <h3 className="investor-grievance__card-heading">
            Registrar &amp; Share Transfer Agent
            <br />
            (RTA)
          </h3>

          <div className="investor-grievance__rta-block">
            <p className="investor-grievance__label">Agency Name</p>
            <p className="investor-grievance__value investor-grievance__value--rta-name">KFin Technologies Private Ltd.</p>
          </div>

          <div className="investor-grievance__rta-block investor-grievance__rta-address">
            <img src={asset("grievance-icon-pin.svg")} alt="" aria-hidden="true" />
            <p>
              Selenium Building, Tower-B, Plot No. 31 &amp; 32,
              <br />
              Financial District, Nanakramguda, Serilingampally,
              <br />
              Hyderabad, Rangareddi, Telangana - 500 032.
            </p>
          </div>

          <div className="investor-grievance__rta-links">
            <div className="investor-grievance__rta-link-row">
              <img src={asset("grievance-icon-email.svg")} alt="" aria-hidden="true" />
              <a href="mailto:einward.ris@kfintech.com">einward.ris@kfintech.com</a>
            </div>
            <div className="investor-grievance__rta-link-row">
              <img src={asset("grievance-icon-phone.svg")} alt="" aria-hidden="true" />
              <span>1800 309 4001</span>
            </div>
            <div className="investor-grievance__rta-link-row">
              <img src={asset("grievance-icon-globe.svg")} alt="" className="investor-grievance__rta-globe" aria-hidden="true" />
              <a href="https://www.kfintech.com" target="_blank" rel="noopener noreferrer">
                https://www.kfintech.com
              </a>
            </div>
            <div className="investor-grievance__rta-link-row">
              <img src={asset("grievance-icon-globe.svg")} alt="" className="investor-grievance__rta-globe" aria-hidden="true" />
              <a href="https://ris.kfintech.com" target="_blank" rel="noopener noreferrer">
                https://ris.kfintech.com
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
