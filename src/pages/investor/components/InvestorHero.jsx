import { asset } from "../asset.js";

export default function InvestorHero() {
  return (
    <section className="investor-hero" aria-labelledby="investor-hero-title">
      <div className="investor-hero-copy">
        <h1 id="investor-hero-title">
          Investor <em>Relations</em>
        </h1>
        <p>
          Transparency is our most refined ingredient. Explore our financial journey, corporate governance, and the
          roadmap to becoming India&apos;s most trusted snack brand.
        </p>
      </div>

      <div className="investor-hero-media">
        <img
          className="investor-hero-photo"
          src={asset("investor-hero-photo.jpeg")}
          alt="Corporate team reviewing market performance"
        />
        <div className="investor-hero-media-texture" aria-hidden="true">
          <img src={asset("investor-hero-texture.png")} alt="" />
        </div>
        <div className="investor-hero-gradient" aria-hidden="true" />
        <div className="investor-hero-ticker">
          <p className="investor-hero-ticker-label">Market Status</p>
          <p className="investor-hero-ticker-value">NSE: EUROINDIA</p>
        </div>
      </div>
    </section>
  );
}
