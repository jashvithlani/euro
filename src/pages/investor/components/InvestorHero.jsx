import { asset } from "../asset.js";
import OptimizedImage from "../../../components/OptimizedImage.jsx";

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
        <OptimizedImage
          className="investor-hero-photo"
          src={asset("investor-hero-photo.jpeg")}
          alt="Corporate team reviewing market performance"
          sizes="(max-width: 999px) 92vw, 560px"
          priority
        />

        <div className="investor-hero-ticker">
          <p className="investor-hero-ticker-label">Market Status</p>
          <p className="investor-hero-ticker-value">NSE: EUROINDIA</p>
        </div>
      </div>
    </section>
  );
}
