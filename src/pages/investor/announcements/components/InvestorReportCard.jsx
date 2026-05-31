import { asset } from "../asset.js";

export default function InvestorReportCard({ title, date, size, isNew = false, href = "#" }) {
  return (
    <article className="investor-report-card">
      <div className="investor-report-card__head">
        <div className="investor-report-card__icon" aria-hidden="true">
          <img src={asset("investor-report-doc-icon.svg")} alt="" />
        </div>
        {isNew ? <span className="investor-report-card__new">NEW</span> : null}
      </div>
      <h3 className="investor-report-card__title">{title}</h3>
      <p className="investor-report-card__date">
        <img src={asset("investor-report-calendar.svg")} alt="" aria-hidden="true" />
        <span>{date}</span>
      </p>
      <div className="investor-report-card__footer">
        <span className="investor-report-card__size">{size}</span>
        <a className="investor-report-card__link" href={href}>
          <span>View Report</span>
          <img src={asset("investor-report-arrow.svg")} alt="" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
