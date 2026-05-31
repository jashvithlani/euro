import { asset } from "../asset.js";

const ICONS = {
  accent: {
    report: "investor-policy-icon-report-accent.svg",
    notice: "investor-policy-icon-notice-accent.svg",
    external: "investor-policy-external-accent.svg",
  },
  soft: {
    report: "investor-policy-icon-report-soft.svg",
    return: "investor-policy-icon-return-soft.svg",
    notice: "investor-policy-icon-notice-soft.svg",
    external: "investor-policy-external-soft.svg",
  },
};

function titleLines(title) {
  return Array.isArray(title) ? title : [title];
}

export default function InvestorPolicyCard({ card, variant }) {
  const icons = ICONS[variant];
  const lines = titleLines(card.title);
  const tall = Boolean(card.tall);

  return (
    <a
      className={`investor-policy-card${tall ? " investor-policy-card--tall" : ""}`}
      href={card.href}
    >
      <span className="investor-policy-card-body">
        <span className={`investor-policy-card-icon investor-policy-card-icon--${variant}`}>
          <img src={asset(icons[card.icon])} alt="" aria-hidden="true" />
        </span>
        <span className="investor-policy-card-copy">
          <span className="investor-policy-card-title">
            {lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
          <span className="investor-policy-card-meta">{card.meta}</span>
        </span>
      </span>
      <img
        className="investor-policy-card-external"
        src={asset(icons.external)}
        alt=""
        aria-hidden="true"
      />
    </a>
  );
}
