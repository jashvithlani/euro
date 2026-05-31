import { asset as agmAsset } from "../agm/asset.js";

const defaultCardIcons = {
  doc: agmAsset("agm-doc-icon.svg"),
  calendar: agmAsset("agm-calendar-icon.svg"),
  arrow: agmAsset("agm-view-arrow.svg"),
};

export default function InvestorDocumentGridCard({
  title,
  date,
  fileSize,
  href,
  isNew = false,
  icons,
  docIconNodeId,
}) {
  const cardIcons = { ...defaultCardIcons, ...icons };

  return (
    <article className="investor-grid-card">
      <div className="investor-grid-card__header">
        <div
          className="investor-grid-card__icon"
          aria-hidden="true"
          {...(docIconNodeId ? { "data-node-id": docIconNodeId } : {})}
        >
          <img src={cardIcons.doc} alt="" />
        </div>
        {isNew ? <span className="investor-grid-card__badge">NEW</span> : null}
      </div>

      <h3 className="investor-grid-card__title">{title}</h3>

      <div className="investor-grid-card__date">
        <img src={cardIcons.calendar} alt="" aria-hidden="true" />
        <span>{date}</span>
      </div>

      <footer className="investor-grid-card__footer">
        <span className="investor-grid-card__meta">PDF • {fileSize}</span>
        <a className="investor-grid-card__link" href={href}>
          <span>View Report</span>
          <img src={cardIcons.arrow} alt="" aria-hidden="true" />
        </a>
      </footer>
    </article>
  );
}
