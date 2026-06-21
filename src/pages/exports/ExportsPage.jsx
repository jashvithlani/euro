import { asset } from './asset.js';
import { sharedAsset } from '../../shared/asset.js';
import "./ExportsPage.css";

export default function ExportsPage() {
  const inquiryStatus =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("exportInquiry")
      : null;

  return (
    <>
            <main className="exports-main">
              <section className="export-hero">
                <div className="export-hero-grid">
                  <div className="export-hero-copy">
                    <span className="export-pill">Global Reach</span>
                    <h1>Expanding <em>Globally</em></h1>
                    <p className="export-hero-lede">As of the financial year ending March 2025, we have actively exported to 20 countries worldwide, showcasing our expanding global footprint and product acceptance across diverse markets.</p>

                    <div className="export-stats-row">
                      <div className="export-stat">
                        <strong>2012</strong>
                        <span>Commercial Start</span>
                      </div>
                      <div className="export-stat-divider"></div>
                      <div className="export-stat">
                        <strong>20+</strong>
                        <span>Export Destinations</span>
                      </div>
                    </div>
                  </div>

                  <div className="export-hero-media">
                    <img src={asset('exports-hero.png')} alt="Shipping containers at sunset" />
                    <div className="export-hero-gradient"></div>
                    <aside className="export-presence-card">
                      <h2>International Presence</h2>
                      <ul>
                        <li>United Kingdom</li>
                        <li>Australia</li>
                        <li>United States of America</li>
                        <li>New Zealand</li>
                        <li>Asia</li>
                        <li>Multiple countries across Europe</li>
                      </ul>
                    </aside>
                  </div>
                </div>
              </section>

              <section className="export-story">
                <div className="export-story-grid">
                  <div className="export-story-copy">
                    <h2>The Exports Division <span>Our Quality Commitment</span></h2>
                    <div className="export-story-text">
                      <p>Euro India Fresh Foods Ltd. specializes in the <strong>manufacturing of high-quality snacks</strong> including Chips, Get-Together, Namkeens, Farali snacks, and fruit juices. Based in Gujarat, India, we have built a reputation for excellence since our inception.</p>
                      <p>Our Exports Division is dedicated to bringing these authentic Indian flavours to the global market. We use state-of-the-art machinery and rigorous quality control protocols to ensure that our products meet the stringent requirements of international food safety standards. Covers thousands of <strong>outlets, cash and carry stores, corner shops</strong>, enabling deep market penetration and high visibility for every product category.</p>
                    </div>

                    <article className="export-contact-card">
                      <img src={asset('exports-avatar.png')} alt="Shailesh Sardhara" />
                      <div>
                        <h3>Shailesh Sardhara</h3>
                        <p>Export In-Charge</p>
                        <a href="mailto:export@euroindiafreshfoods.com">
                          <img src={sharedAsset('exports-icon-mail.svg')} alt="" />
                          export@euroindiafreshfoods.com
                        </a>
                        <a href="tel:+919727715505">
                          <img src={sharedAsset('exports-icon-phone.svg')} alt="" />
                          +91 97277 15505
                        </a>
                      </div>
                    </article>
                  </div>

                  <div className="export-story-media">
                    <figure className="export-wafers-card">
                      <img src={asset('exports-wafers.png')} alt="Crispy banana wafers in a glass bowl" />
                      <figcaption>Premium Quality</figcaption>
                    </figure>
                    <img className="export-factory-image" src={asset('exports-factory.png')} alt="Food manufacturing machinery" />
                  </div>
                </div>
              </section>

              <section className="export-inquiry" aria-labelledby="export-inquiry-title">
                <div className="export-inquiry-inner">
                  <header className="export-inquiry-heading">
                    <h2 id="export-inquiry-title">Partner With Us</h2>
                    <p>Fill out the form below to initiate an export partnership. Our dedicated division will review your details and get in touch within 48 hours.</p>
                  </header>

                  <form className="export-form" action="/api/export-inquiry.php" method="post">
                    {inquiryStatus === "sent" && (
                      <p className="export-form-status export-form-status--success" role="status">
                        Your export inquiry has been sent. Our team will get back to you shortly.
                      </p>
                    )}
                    {inquiryStatus === "error" && (
                      <p className="export-form-status export-form-status--error" role="alert">
                        We could not send your inquiry right now. Please try again or email us directly.
                      </p>
                    )}
                    <label className="export-form-trap" aria-hidden="true">
                      <span>Website</span>
                      <input type="text" name="website" tabIndex="-1" autoComplete="off" />
                    </label>
                    <fieldset>
                      <legend><span>01</span> Primary Contact Details</legend>
                      <div className="export-field-grid">
                        <label>
                          <span>Your name *</span>
                          <input type="text" name="name" required />
                        </label>
                        <label>
                          <span>Your email *</span>
                          <input type="email" name="email" required />
                        </label>
                        <label>
                          <span>Mobile No. *</span>
                          <input type="tel" name="mobile" required />
                        </label>
                        <label>
                          <span>Country *</span>
                          <input type="text" name="country" required />
                        </label>
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend><span>02</span> Business Profile</legend>
                      <div className="export-field-grid">
                        <label className="export-field-full">
                          <span>Address *</span>
                          <input type="text" name="address" required />
                        </label>
                        <label>
                          <span>State *</span>
                          <input type="text" name="state" required />
                        </label>
                        <label>
                          <span>Proprietary/Partnership Firm *</span>
                          <select name="firm-type" aria-label="Proprietary or Partnership Firm" required>
                            <option value=""></option>
                            <option>Proprietary</option>
                            <option>Partnership Firm</option>
                          </select>
                        </label>
                        <label>
                          <span>Name Of Proprietor *</span>
                          <input type="text" name="proprietor" required />
                        </label>
                        <label>
                          <span>Operating since Years</span>
                          <input type="text" name="operating-since" />
                        </label>
                        <label className="export-field-full">
                          <span>Type Of Business</span>
                          <input type="text" name="business-type" />
                        </label>
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend><span>03</span> Your Inquiry</legend>
                      <label className="export-message-field">
                        <span>Your message (optional)</span>
                        <textarea name="message"></textarea>
                      </label>
                    </fieldset>

                    <div className="export-form-actions">
                      <button type="submit">
                        Submit Inquiry
                        <img src={sharedAsset('exports-icon-arrow.svg')} alt="" aria-hidden="true" />
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </main>

            <section className="export-footprint">
              <div className="export-footprint-copy">
                <span>Domestic</span>
                <h2>Our Footprint: <em>10+States</em></h2>
                <p>Experience the taste of quality in 10+ States. With a heavy density in Gujarat and Maharashtra, we are rapidly expanding our distribution network.</p>
                <strong>10+</strong>
                <small>Active States</small>
              </div>
              <img src={asset('exports-map.png')} alt="India map showing Euro India Foods domestic footprint" />
            </section>
    </>
  );
}
