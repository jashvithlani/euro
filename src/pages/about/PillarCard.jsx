import { asset } from "./asset.js";
import { pillarBackgroundVideo } from "./pillars-content.jsx";
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
        <OptimizedImage className={pillar.iconClass} src={asset(pillar.icon)} alt="" sizes="96px" />
      </div>
      <h3>{pillar.title}</h3>
      <p>{pillar.copy}</p>
    </article>
  );
}
