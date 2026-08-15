import { asset } from "../asset.js";
import OptimizedImage from "../../../components/OptimizedImage.jsx";

export default function InvestorTransparency() {
  return (
    <section className="investor-transparency" aria-labelledby="investor-transparency-title">
      <div className="investor-transparency-layout">
        <div className="investor-transparency-visual">
          <OptimizedImage src={asset("investor-transparency.png")} alt="Euro India Foods leadership" sizes="(max-width: 999px) 92vw, 480px" />
        </div>
        <div className="investor-transparency-aside">
          <div className="investor-transparency-copy">
            <h2 id="investor-transparency-title">
              <span>Transparency as a</span>
              <span>Foundation</span>
            </h2>
            <p>
              At Euro India Foods, we believe in radical transparency. Our prospectus outlines our commitment to
              excellence, sustainable sourcing, and long-term value for our shareholders.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
