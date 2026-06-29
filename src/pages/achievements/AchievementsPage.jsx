import { Link } from "react-router-dom";
import "./AchievementsPage.css";
import { asset } from "./asset.js";

const stats = [
  { value: "4+", label: "National Awards" },
  { value: "2", label: "Decade of Trust" },
  { value: "4", label: "Quality Recognition" },
];

const recognitions = [
  {
    id: "vibrant-gujarat",
    ghost: "2017",
    kicker: "Featured Recognition",
    title: "Vibrant Gujarat Summit",
    label: "Best Entrepreneur Award",
    heading: "Vibrant Gujarat Summit 2017",
    description:
      "Recognised by the Government of Gujarat for outstanding entrepreneurial contribution to the food processing industry, setting a benchmark for quality, innovation, and regional economic growth.",
    presented: "Presented by · Government of Gujarat, India",
    image: asset("achievements-vibrant-gujarat.png"),
    imageAlt: "Vibrant Gujarat Summit 2017 Best Entrepreneur Award",
  },
  {
    id: "excellence-2011",
    ghost: "2011",
    kicker: "Industry Recognition",
    title: "EXCELLENCE Awards",
    label: "VCCI Leaders Summit",
    heading: "EXCELLENCE AWARDS - 2011",
    description:
      "Honoured at the VCCI Leaders Summit for business excellence and sustained leadership in Gujarat's food manufacturing sector.",
    presented: "Presented by · VCCI Leaders Summit",
    image: asset("achievements-award-excellence.png"),
    imageAlt: "VCCI Leaders Summit excellence award",
  },
  {
    id: "quality-2014",
    ghost: "2014",
    kicker: "Quality Recognition",
    title: "Best Quality Choice",
    label: "ESQR Quality Choice Prize",
    heading: "BEST QUALITY CHOICE - 2014",
    description:
      "Awarded the ESQR Quality Choice Prize for consistent product quality, process discipline, and international manufacturing standards.",
    presented: "Presented by · ESQR",
    image: asset("achievements-award-quality.png"),
    imageAlt: "ESQR Quality Choice Prize trophy",
  },
  {
    id: "national-star",
    ghost: "STAR",
    kicker: "Global Recognition",
    title: "National Star for Quality",
    label: "International Star for Quality",
    heading: "NATIONAL STAR FOR QUALITY",
    description:
      "Recognised with the International Star for Quality for maintaining excellence across production, packaging, and consumer trust.",
    presented: "Presented by · International Star for Quality",
    image: asset("achievements-award-star.png"),
    imageAlt: "International Star for Quality trophy",
  },
];

function RecognitionMedia({ recognition }) {
  return (
    <div className="achievements-featured-media">
      <div className="achievements-featured-shadow" aria-hidden="true"></div>
      <img src={recognition.image} alt={recognition.imageAlt} />
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <main className="achievements-main" aria-labelledby="achievements-title">
      <section className="achievements-hero" aria-labelledby="achievements-title">
        <div className="achievements-hero-texture" aria-hidden="true">
          <img src={asset("achievements-hero-texture.png")} alt="" />
        </div>
        <p className="achievements-hero-kicker">Recognition &amp; Honours</p>
        <h1 id="achievements-title">A Legacy of Excellence</h1>
      </section>

      <section className="achievements-stats" aria-label="Achievement statistics">
        <img className="achievements-stats-texture" src={asset("achievements-stats-texture.png")} alt="" aria-hidden="true" />
        <div className="achievements-stats-list">
          {stats.map((stat) => (
            <div className="achievements-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="achievements-recognitions">
        {recognitions.map((recognition) => (
          <section
            className={`achievements-recognition achievements-recognition--${recognition.id}`}
            key={recognition.id}
            aria-labelledby={`recognition-${recognition.id}`}
          >
            <div className="achievements-section-heading achievements-recognition-heading">
              <span className="achievements-ghost">{recognition.ghost}</span>
              <p>{recognition.kicker}</p>
              <h2 id={`recognition-${recognition.id}`}>{recognition.title}</h2>
            </div>

            <article className="achievements-featured-card">
              <RecognitionMedia recognition={recognition} />
              <div className="achievements-featured-copy">
                <div className="achievements-award-label">
                  <span aria-hidden="true"></span>
                  {recognition.label}
                </div>
                <h3>{recognition.heading}</h3>
                <p>{recognition.description}</p>
                <div className="achievements-presented">{recognition.presented}</div>
              </div>
            </article>
          </section>
        ))}
      </div>

      <section className="achievements-cta" aria-labelledby="achievements-cta-title">
        <div className="achievements-cta-bg" aria-hidden="true"></div>
        <div className="achievements-cta-copy">
          <h2 id="achievements-cta-title">
            Bring <span>Award-Winning</span>
            <br />
            Quality to Your Shelf
          </h2>
          <p>
            Join our growing network of partners and distributors. Backed by decades of recognition, Euro Foods
            delivers a product your customers will trust.
          </p>
        </div>
        <Link className="achievements-cta-button" to="/dealers">
          Explore Dealership
        </Link>
      </section>
    </main>
  );
}
