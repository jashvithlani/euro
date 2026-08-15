import { asset } from "./asset.js";
import OptimizedImage from "../../components/OptimizedImage.jsx";

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
      <OptimizedImage src={asset(item.image)} alt={item.alt} sizes="(max-width: 999px) 92vw, 460px" />
      <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}
