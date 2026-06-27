import { asset } from "./asset.js";

export function InfrastructureSectionHeading() {
  return (
    <div className="about-section-heading">
      <span>Our Foundation</span>
      <h2>
        Infrastructure <em>& Capacity</em>
      </h2>
    </div>
  );
}

export function InfrastructureCard({ item }) {
  return (
    <article className={`infra-card${item.large ? " infra-large" : ""}`}>
      <img src={asset(item.image)} alt={item.alt} />
      <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}
