import { asset } from "./asset.js";

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
        <img src={asset("category-chips.png")} alt="Classic chips flavors" />
      </article>
    );
  }

  if (variant === "juice") {
    return (
      <article className="category-card card-juice">
        <span>Juices</span>
        <img src={asset("category-juices.png")} alt="Euro juices" />
      </article>
    );
  }

  if (variant === "namkeen") {
    return (
      <article className="category-card card-namkeen">
        <span>Namkeen</span>
        <img src={asset("category-namkeen.png")} alt="Euro namkeen pack" />
      </article>
    );
  }

  return (
    <article className="category-card card-basket">
      <img src={asset("category-bundle.png")} alt="Euro sweet memories box" />
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
