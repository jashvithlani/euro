import { asset } from "../asset.js";

export default function InvestorUpdateItem({ month, day, year, badge, badgeTone, title, href }) {
  return (
    <article className="investor-updates-item">
      <div className="investor-updates-item__inner">
        <div className="investor-updates-item__main">
          <div
            className="investor-updates-item__date"
            data-node-id="1131:2737"
            aria-label={`${month} ${day}, ${year}`}
          >
            <span className="investor-updates-item__month" data-node-id="1131:2739">
              {month}
            </span>
            <span className="investor-updates-item__day" data-node-id="1131:2741">
              {day}
            </span>
            <span className="investor-updates-item__year" data-node-id="1131:2743">
              {year}
            </span>
          </div>

          <div className="investor-updates-item__copy">
            <span className={`investor-updates-item__badge investor-updates-item__badge--${badgeTone}`}>
              {badge}
            </span>
            <h3 className="investor-updates-item__title">{title}</h3>
          </div>
        </div>

        <a className="investor-updates-item__link" href={href} aria-label={`Open ${title}`}>
          <img src={asset("updates-external-icon.svg")} alt="" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
