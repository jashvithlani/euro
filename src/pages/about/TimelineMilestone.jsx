import { asset } from "./asset.js";
import { sharedAsset } from "../../shared/asset.js";
import OptimizedImage from "../../components/OptimizedImage.jsx";

function TimelineCopy({ milestone }) {
  const copyClass = milestone.side === "left" ? "timeline-copy-left" : "timeline-copy-right";

  return (
    <div className={`timeline-copy ${copyClass}`}>
      <h3>{milestone.year}</h3>
      <h4>{milestone.title}</h4>
      {milestone.body.kind === "paragraph" ? <p>{milestone.body.text}</p> : null}
      {milestone.body.kind === "list" ? (
        <ul>
          {milestone.body.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {milestone.body.kind === "paragraphs"
        ? milestone.body.items.map((item) => <p key={item}>{item}</p>)
        : null}
    </div>
  );
}

function TimelineCard({ milestone }) {
  const { card } = milestone;

  if (card.kind === "award") {
    return (
      <div className={`timeline-card ${card.cardClass}`} aria-label={card.label}>
        <div className="timeline-award-crop">
          <OptimizedImage src={asset(card.image)} alt="" sizes="(max-width: 999px) 92vw, 420px" />
        </div>
      </div>
    );
  }

  if (card.kind === "gt") {
    return (
      <div className={`timeline-card ${card.cardClass}`} aria-label={card.label}>
        <OptimizedImage className="timeline-gt-logo" src={asset(card.gtImage)} alt="" sizes="80px" />
        <span>x</span>
        <OptimizedImage className="timeline-euro-logo" src={asset(card.euroImage)} alt="" sizes="80px" />
      </div>
    );
  }

  if (card.kind === "nse") {
    return (
      <div className={`timeline-card ${card.cardClass}`}>
        <OptimizedImage src={asset(card.image)} alt="NSE logo" sizes="160px" />
      </div>
    );
  }

  const imageSrc = card.kind === "shared-image" ? sharedAsset(card.image) : asset(card.image);

  return (
    <div className={`timeline-card ${card.cardClass}`} aria-label={card.label}>
      <OptimizedImage src={imageSrc} alt="" sizes="(max-width: 999px) 92vw, 420px" />
    </div>
  );
}

export function TimelineMilestone({ milestone, layout = "desktop" }) {
  const copy = <TimelineCopy milestone={milestone} />;
  const card = <TimelineCard milestone={milestone} />;
  const copyFirst = layout === "mobile" || milestone.side === "left";

  return (
    <article className={`timeline-milestone timeline-${milestone.id} timeline-${milestone.side}`}>
      {copyFirst ? (
        <>
          {copy}
          {card}
        </>
      ) : (
        <>
          {card}
          {copy}
        </>
      )}
    </article>
  );
}

export function TimelineSectionHeading() {
  return (
    <div className="about-section-heading">
      <span>The Evolution</span>
      <h2>
        Our <em>Milestones</em>
      </h2>
    </div>
  );
}
