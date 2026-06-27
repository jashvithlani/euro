import { asset } from "./asset.js";
import { pillarBackgroundVideo } from "./pillars-content.jsx";

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
    <article className="pillar-card">
      <video
        className="pillar-card__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={pillarBackgroundVideo} type="video/mp4" />
      </video>
      <div className="pillar-icon">
        <img className={pillar.iconClass} src={asset(pillar.icon)} alt="" />
      </div>
      <h3>{pillar.title}</h3>
      <p>{pillar.copy}</p>
    </article>
  );
}
