import { asset } from "./asset.js";
import OptimizedImage from "../../components/OptimizedImage.jsx";

export function PillarsSectionHeading() {
  return (
    <div className="about-section-heading">
      <span>Our Compass</span>
      <h2>Pillars of Excellence</h2>
    </div>
  );
}

export function PillarCard({ pillar }) {
  return (
    <article className={`pillar-card pillar-card--${pillar.id}`}>
      <div className="pillar-card__art" aria-hidden="true">
        <span className="pillar-card__aura" />
        <span className="pillar-card__ring pillar-card__ring--outer" />
        <span className="pillar-card__ring pillar-card__ring--inner" />
        <span className="pillar-card__spark pillar-card__spark--one" />
        <span className="pillar-card__spark pillar-card__spark--two" />
        <span className="pillar-card__spark pillar-card__spark--three" />
        <span className="pillar-card__spark pillar-card__spark--four" />
        <OptimizedImage
          className={`pillar-card__product pillar-card__product--${pillar.id}`}
          src={pillar.product}
          alt=""
          sizes="(max-width: 999px) 54vw, 190px"
        />
      </div>
      <div className="pillar-icon">
        <OptimizedImage className={pillar.iconClass} src={asset(pillar.icon)} alt="" sizes="96px" />
      </div>
      <div className="pillar-card__copy">
        <h3>{pillar.title}</h3>
        <p>{pillar.copy}</p>
      </div>
    </article>
  );
}
