import { Link } from "react-router-dom";
import { asset } from "./asset.js";
import "./SecretarialPage.css";

const complianceReports = [
  {
    id: "2024-25",
    title: "Compliance Report 2024-25",
    status: "Final",
    size: "4.2 MB",
    featured: true,
    href: "#",
  },
  {
    id: "2023-24",
    title: "Compliance Report 2023-24",
    status: "Archived",
    size: "3.8 MB",
    href: "#",
  },
  {
    id: "2022-23",
    title: "Compliance Report 2022-23",
    status: "Archived",
    size: "5.1 MB",
    href: "#",
  },
  {
    id: "2021-22",
    title: "Compliance Report 2021-22",
    status: "Archived",
    size: "3.9 MB",
    href: "#",
  },
];

export default function SecretarialPage() {
  return (
    <div className="secretarial-page">
      <header className="secretarial-page__intro">
        <h2 className="secretarial-page__title">Annual Secretarial Compliance Report</h2>
        <p className="secretarial-page__lede">
          Access comprehensive archival data of Euro India Foods regulatory filings and governance standards from
          2021 through 2025.
        </p>
      </header>

      <section className="secretarial-archive" aria-labelledby="secretarial-archive-title">
        <div className="secretarial-archive__grid">
          <aside className="secretarial-archive__aside">
            <h3 id="secretarial-archive-title">Archive Explorer</h3>
            <p className="secretarial-archive__copy">
              Our commitment to transparency is reflected in our rigorous reporting cycles. Select a fiscal year to
              download the official documentation.
            </p>
            <div className="secretarial-archive__update" role="status">
              <p className="secretarial-archive__update-label">Latest update</p>
              <div className="secretarial-archive__update-row">
                <span>FY 2024-25 Published</span>
                <img src={asset("secretarial-check-icon.svg")} alt="" aria-hidden="true" />
              </div>
            </div>
          </aside>

          <div className="secretarial-archive__cards">
            {complianceReports.map((report) => (
              <article
                key={report.id}
                className={[
                  "secretarial-report-card",
                  report.featured ? "secretarial-report-card--featured" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="secretarial-report-card__main">
                  <div
                    className={[
                      "secretarial-report-card__icon",
                      report.featured ? "secretarial-report-card__icon--featured" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-hidden="true"
                  >
                    <img
                      src={
                        report.featured
                          ? asset("secretarial-pdf-icon-active.svg")
                          : asset("secretarial-pdf-icon.svg")
                      }
                      alt=""
                    />
                  </div>
                  <div className="secretarial-report-card__copy">
                    <h4>{report.title}</h4>
                    <p>
                      Status: {report.status} | Size: {report.size}
                    </p>
                  </div>
                </div>
                <a className="secretarial-report-card__download" href={report.href}>
                  <span>Download</span>
                  <img src={asset("secretarial-download-icon.svg")} alt="" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="secretarial-contact" aria-labelledby="secretarial-contact-title">
        <div className="secretarial-contact__panel">
          <h2 id="secretarial-contact-title">Need specific governance data?</h2>
          <p>
            Our investor relations team is ready to provide additional documentation or clarify specific regulatory
            compliance queries.
          </p>
          <Link className="secretarial-contact__cta" to="/contact">
            Contact Investor Relations
          </Link>
        </div>
      </section>
    </div>
  );
}
