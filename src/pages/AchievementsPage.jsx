import "./AchievementsPage.css";

const stats = [
  { value: "4+", label: "National Awards" },
  { value: "2", label: "Decade of Trust" },
  { value: "4", label: "Quality Recognition" },
];

const awards = [
  {
    className: "achievements-award-excellence",
    title: "Excellence Awards - 2011",
    label: "VCCI Leaders Summit excellence award",
  },
  {
    className: "achievements-award-quality",
    title: "Best Quality Choice - 2014",
    label: "ESQR Quality Choice Prize trophy",
  },
  {
    className: "achievements-award-star",
    title: "National Star for Quality",
    label: "International Star for Quality trophy",
  },
];

export default function AchievementsPage() {
  return (
    <main className="achievements-main" aria-labelledby="achievements-title">
      <section className="achievements-hero" aria-labelledby="achievements-title">
        <div className="achievements-hero-texture" aria-hidden="true">
          <img src="assets/achievements-hero-texture.png" alt="" />
        </div>
        <p className="achievements-hero-kicker">Recognition &amp; Honours</p>
        <h1 id="achievements-title">A Legacy of Excellence</h1>
      </section>

      <section className="achievements-stats" aria-label="Achievement statistics">
        <img className="achievements-stats-texture" src="assets/achievements-stats-texture.png" alt="" aria-hidden="true" />
        <div className="achievements-stats-list">
          {stats.map((stat) => (
            <div className="achievements-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="achievements-featured" aria-labelledby="achievements-featured-title">
        <div className="achievements-section-heading achievements-featured-heading">
          <span className="achievements-ghost">2017</span>
          <p>Featured Recognition</p>
          <h2 id="achievements-featured-title">Vibrant Gujarat Summit</h2>
        </div>

        <article className="achievements-featured-card">
          <div className="achievements-featured-media">
            <div className="achievements-featured-shadow" aria-hidden="true"></div>
            <img src="assets/achievements-vibrant-gujarat.png" alt="Vibrant Gujarat Summit 2017 Best Entrepreneur Award" />
          </div>
          <div className="achievements-featured-copy">
            <div className="achievements-award-label">
              <span aria-hidden="true"></span>
              Best Entrepreneur Award
            </div>
            <h3>Vibrant Gujarat Summit 2017</h3>
            <p>
              Recognised by the Government of Gujarat for outstanding entrepreneurial contribution to the food
              processing industry, setting a benchmark for quality, innovation, and regional economic growth.
            </p>
            <div className="achievements-presented">Presented by <span>&middot;</span> Government of Gujarat, India</div>
          </div>
        </article>
      </section>

      <section className="achievements-awards" aria-labelledby="achievements-awards-title">
        <div className="achievements-section-heading achievements-awards-heading">
          <span className="achievements-ghost">ALL</span>
          <p>Other</p>
          <h2 id="achievements-awards-title">Awards &amp; Recognitions</h2>
        </div>

        <div className="achievements-awards-grid">
          {awards.map((award) => (
            <article className="achievements-award" key={award.title}>
              <div className="achievements-award-card">
                <img className="achievements-award-ellipse" src="assets/achievements-award-ellipse.svg" alt="" aria-hidden="true" />
                <div className={`achievements-award-crop ${award.className}`}>
                  <img src="assets/achievements-awards-sheet.png" alt={award.label} />
                </div>
              </div>
              <h3>{award.title}</h3>
            </article>
          ))}
        </div>
      </section>

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
        <a className="achievements-cta-button" href="/dealers">Explore Dealership</a>
      </section>
    </main>
  );
}
