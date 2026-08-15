import { asset } from "./asset.js";
import OptimizedImage from "../../components/OptimizedImage.jsx";

export const moodCategoryVariants = ["chips", "juice", "namkeen", "basket"];

export function MoodSectionHeading() {
  return (
    <div className="section-heading mood-heading">
      <span className="kicker">Categories</span>
      <h2>Pick Your Mood.</h2>
    </div>
  );
}

export function MoodDealershipCta() {
  return (
    <a className="button button-blue mood-cta" href="#franchise">
      Make Dealership Inquiry
    </a>
  );
}

export function MoodCategoryCard({ variant }) {
  if (variant === "chips") {
    return (
      <article className="category-card card-chips">
        <div>
          <span>Classic Chips</span>
          <small>
            The crunch that started it all.
            <br />
            Simple,
            <br />
            salty, iconic.
          </small>
        </div>
        <OptimizedImage src={asset("hero-products.png")} alt="Classic chips flavors" sizes="(max-width: 480px) 46vw, (max-width: 900px) 30vw, 260px" />
      </article>
    );
  }

  if (variant === "juice") {
    return (
      <article className="category-card card-juice">
        <span>Juices</span>
        <OptimizedImage src={asset("category-juices.png")} alt="Euro juices" sizes="(max-width: 480px) 46vw, (max-width: 900px) 30vw, 260px" />
      </article>
    );
  }

  if (variant === "namkeen") {
    return (
      <article className="category-card card-namkeen">
        <span>Namkeen</span>
        <OptimizedImage src={asset("category-namkeen.png")} alt="Euro namkeen pack" sizes="(max-width: 480px) 46vw, (max-width: 900px) 30vw, 260px" />
      </article>
    );
  }

  return (
    <article className="category-card card-basket">
      <OptimizedImage src={asset("category-bundle.png")} alt="Euro sweet memories box" sizes="(max-width: 480px) 46vw, (max-width: 900px) 30vw, 260px" />
      <div>
        <h3>
          Can&apos;t decide?
          <br />
          Try our Mix-It-Up Boxes.
        </h3>
      </div>
    </article>
  );
}
