import "./ContactPage.css";
import { asset } from './asset.js';

const contactCards = [
  {
    title: "Corporate Office",
    text: "4408, Kohinoor Square,N.C.Kelkar Marg, Dadar West, Mumbai-400028",
    icon: asset('contact-icon-location.svg'),
    tone: "rose",
  },
  {
    title: "Call Us Directly",
    lines: ["+91 261 400 5000", "+91 98765 43210"],
    icon: asset('contact-icon-phone.svg'),
    tone: "gold",
  },
  {
    title: "Email Support",
    lines: ["info@euroindiafoods.com", "sales@euroindiafoods.com"],
    icon: asset('contact-icon-mail.svg'),
    tone: "green",
  },
];

function ContactCard({ title, text, lines, icon, tone }) {
  return (
    <article className={`contact-card contact-card--${tone}`}>
      <div className={`contact-card-icon contact-card-icon--${tone}`}>
        <img src={icon} alt="" />
      </div>
      <h3>{title}</h3>
      {text ? <p>{text}</p> : null}
      {lines?.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </article>
  );
}

function ContactField({ label, children, wide = false }) {
  return (
    <label className={wide ? "contact-field contact-field--wide" : "contact-field"}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function ContactPage() {
  return (
    <main className="contact-main">
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="contact-hero-gradient" aria-hidden="true"></div>
        <div className="contact-hero-texture" aria-hidden="true"></div>
        <div className="contact-hero-inner">
          <div className="contact-hero-copy">
            <h1 id="contact-title">
              Let&apos;s <em>Connect</em>
              <span>&amp; grow business</span>
            </h1>
            <p>
              Whether it&apos;s business, distribution, or queries - our team of snack
              connoisseurs is here to help you taste excellence.
            </p>
          </div>
          <div className="contact-hero-card" aria-hidden="true">
            <img src={asset('contact-hero.png')} alt="" />
          </div>
        </div>
      </section>

      <section className="contact-cards" aria-label="Contact information">
        {contactCards.map((card) => (
          <ContactCard key={card.title} {...card} />
        ))}
      </section>

      <section className="contact-form-band" aria-labelledby="contact-form-title">
        <div className="contact-form-panel">
          <form className="contact-form" action="#">
            <h2 id="contact-form-title">Send Us a Message</h2>
            <div className="contact-form-grid">
              <ContactField label="Full Name">
                <input type="text" name="name" placeholder="John Doe" />
              </ContactField>
              <ContactField label="Email Address">
                <input type="email" name="email" placeholder="john@example.com" />
              </ContactField>
              <ContactField label="Phone Number">
                <input type="tel" name="phone" placeholder="+91 00000 00000" />
              </ContactField>
              <ContactField label="Subject">
                <select name="subject" defaultValue="Business Inquiry" aria-label="Subject">
                  <option>Business Inquiry</option>
                  <option>Distribution Inquiry</option>
                  <option>Product Query</option>
                  <option>Support</option>
                </select>
              </ContactField>
              <ContactField label="Your Message" wide>
                <textarea name="message" placeholder="How can we help you?"></textarea>
              </ContactField>
            </div>
            <button className="contact-submit" type="submit">
              Submit Inquiry
            </button>
          </form>
        </div>
      </section>

      <section className="contact-map-section" aria-labelledby="contact-map-title">
        <h2 id="contact-map-title" className="contact-visually-hidden">
          Our locations
        </h2>
        <img className="contact-map-image" src={asset('contact-map.png')} alt="" />
        <div className="contact-map-actions" aria-label="Location shortcuts">
          <a className="contact-map-action contact-map-action--ghost" href="#distributor">Become a Distributor</a>
          <a className="contact-map-action contact-map-action--solid" href="#contact-form-title">Business Inquiry</a>
        </div>
        <article className="contact-map-card contact-map-card--office">
          <h3>Euro India Foods HQ</h3>
          <p>4408, Kohinoor Square,N.C.Kelkar Marg, Dadar West, Mumbai-400028</p>
          <a href="https://maps.google.com/?q=Kohinoor%20Square%20Dadar%20West%20Mumbai" target="_blank" rel="noreferrer">
            Get Directions →
          </a>
        </article>
        <article className="contact-map-card contact-map-card--plant">
          <h3>EURO Manufacturing plant</h3>
          <p>
            J.R. Foods &amp; Beverages, Euro Food Park, Block No.-1862 B/H Gujarat
            Hotel, Nh-48, Taluka- Chikhli, District- Navsari, Gujarat- 396530.
          </p>
          <a href="https://maps.google.com/?q=Euro%20Food%20Park%20Chikhli%20Navsari%20Gujarat" target="_blank" rel="noreferrer">
            Get Directions →
          </a>
        </article>
        <span className="contact-map-pin" aria-hidden="true"></span>
      </section>

      <section className="contact-partner" id="distributor">
        <div>
          <h2>Looking to Partner With Us?</h2>
          <p>Join our global network of successful snack distributors.</p>
        </div>
      </section>

      <section className="contact-social" aria-label="Euro India social feed">
        <img className="contact-social-strip" src={asset('contact-social-strip.png')} alt="Euro India social feed" />
        <img className="contact-social-vector" src={asset('contact-social-vector.png')} alt="" aria-hidden="true" />
      </section>
    </main>
  );
}
