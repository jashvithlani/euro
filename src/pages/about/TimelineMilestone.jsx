import { asset } from "./asset.js";
import { sharedAsset } from "../../shared/asset.js";

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
          <img src={asset(card.image)} alt="" />
        </div>
      </div>
    );
  }

  if (card.kind === "gt") {
    return (
      <div className={`timeline-card ${card.cardClass}`} aria-label={card.label}>
        <img className="timeline-gt-logo" src={asset(card.gtImage)} alt="" />
        <span>x</span>
        <img className="timeline-euro-logo" src={asset(card.euroImage)} alt="" />
      </div>
    );
  }

  if (card.kind === "nse") {
    return (
      <div className={`timeline-card ${card.cardClass}`}>
        <img src={asset(card.image)} alt="NSE logo" />
      </div>
    );
  }

  const imageSrc = card.kind === "shared-image" ? sharedAsset(card.image) : asset(card.image);

  return (
    <div className={`timeline-card ${card.cardClass}`} aria-label={card.label}>
      <img src={imageSrc} alt="" />
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
