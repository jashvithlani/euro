import { asset } from "../asset.js";

const iconSrc = {
  report: asset("investor-announcement-pdf.svg"),
  return: asset("investor-announcement-return.svg"),
  notice: asset("investor-announcement-notice.svg"),
};

export default function InvestorCompactDocCard({ title, meta, icon = "report", tall = false, href = "#" }) {
  return (
    <a
      className={`investor-compact-doc-card${tall ? " investor-compact-doc-card--tall" : ""}`}
      href={href}
    >
      <span className="investor-compact-doc-card__body">
        <span
          className={`investor-compact-doc-card__icon investor-compact-doc-card__icon--${icon}`}
          aria-hidden="true"
        >
          <img src={iconSrc[icon] ?? iconSrc.report} alt="" />
        </span>
        <span className="investor-compact-doc-card__copy">
          <span className="investor-compact-doc-card__title">{title}</span>
          <span className="investor-compact-doc-card__meta">{meta}</span>
        </span>
      </span>
      <img
        className="investor-compact-doc-card__external"
        src={asset("investor-announcement-external.svg")}
        alt=""
        aria-hidden="true"
      />
    </a>
  );
}
