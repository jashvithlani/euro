import "./ContactPage.css";
import { Link } from "react-router-dom";
import EuroMoments from "../../components/EuroMoments.jsx";
import OptimizedImage from "../../components/OptimizedImage.jsx";
import ContactLocationsMap from "./ContactLocationsMap.jsx";
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

const locations = [
  {
    title: "Euro India Foods HQ",
    address: "4408, Kohinoor Square,N.C.Kelkar Marg, Dadar West, Mumbai-400028",
    coordinates: [19.0249099, 72.8417497],
    directionsUrl: "https://maps.google.com/?q=Kohinoor%20Square%20Dadar%20West%20Mumbai",
  },
  {
    title: "EURO Manufacturing plant",
    address:
      "J.R. Foods & Beverages, Euro Food Park, Block No.-1862 B/H Gujarat Hotel, Nh-48, Taluka- Chikhli, District- Navsari, Gujarat- 396530.",
    coordinates: [20.8192168, 73.07284],
    directionsUrl: "https://maps.google.com/?q=Euro%20Food%20Park%20Chikhli%20Navsari%20Gujarat",
  },
  {
    title: "Manufacturing Plant - 1",
    address:
      "Plot No. A-22/1, Ichchhapore G.I.D.C. Hazira Magdalla Road, Tal –Choryasi, Surat, Gujarat 394510",
    coordinates: [21.187042, 72.734031],
    directionsUrl:
      "https://maps.google.com/?q=Plot%20No.%20A-22/1%2C%20Ichchhapore%20GIDC%20Hazira%20Magdalla%20Road%2C%20Choryasi%2C%20Surat%2C%20Gujarat%20394510",
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

function scrollToContactInquiry(event) {
  const contactForm = document.getElementById("contact-inquiry");

  if (!contactForm) return;

  event.preventDefault();
  contactForm.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", "#contact-inquiry");
}

export default function ContactPage() {
  const contactStatus =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("contactInquiry")
      : null;

  return (
    <main className="contact-main">
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="contact-hero-gradient" aria-hidden="true"></div>
        <div className="contact-hero-texture" aria-hidden="true"></div>
        <div className="contact-hero-inner">
          <div className="contact-hero-copy">
            <h1 id="contact-title">
              Let&apos;s <em>Connect</em>
              <span>
                &amp; grow
                <br />
                business
              </span>
            </h1>
            <p>
              Whether it&apos;s business, distribution, or queries - our team of snack
              connoisseurs is here to help you taste excellence.
            </p>
          </div>
          <div className="contact-hero-card" aria-hidden="true">
            <OptimizedImage src={asset('contact-hero.jpeg')} alt="" sizes="(max-width: 999px) 92vw, 460px" priority />
          </div>
        </div>
      </section>

      <section className="contact-cards" aria-label="Contact information">
        {contactCards.map((card) => (
          <ContactCard key={card.title} {...card} />
        ))}
      </section>

      <section className="contact-form-band" id="contact-inquiry" aria-labelledby="contact-form-title">
        <div className="contact-form-panel">
          <form className="contact-form" action="/api/contact-inquiry.php" method="post">
            <h2 id="contact-form-title">Send Us a Message</h2>
            {contactStatus === "sent" && (
              <p className="contact-form-status contact-form-status--success" role="status">
                Your message has been sent. Our team will get back to you shortly.
              </p>
            )}
            {contactStatus === "error" && (
              <p className="contact-form-status contact-form-status--error" role="alert">
                We could not send your message right now. Please try again or email us directly.
              </p>
            )}
            <label className="contact-form-trap" aria-hidden="true">
              <span>Website</span>
              <input type="text" name="website" tabIndex="-1" autoComplete="off" />
            </label>
            <div className="contact-form-grid">
              <ContactField label="Full Name">
                <input type="text" name="name" placeholder="John Doe" required />
              </ContactField>
              <ContactField label="Email Address">
                <input type="email" name="email" placeholder="john@example.com" required />
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
                <textarea name="message" placeholder="How can we help you?" required></textarea>
              </ContactField>
            </div>
            <button className="contact-submit" type="submit">
              Submit Inquiry
            </button>
          </form>
        </div>
      </section>

      <section className="contact-map-section" aria-labelledby="contact-map-title">
        <div className="contact-map-header">
          <div>
            <span>Our footprint</span>
            <h2 id="contact-map-title">Find us on the map</h2>
          </div>
          <div className="contact-map-actions" aria-label="Location shortcuts">
            <Link className="contact-map-action contact-map-action--ghost" to="/dealers">
              Become a Distributor
            </Link>
            <a
              className="contact-map-action contact-map-action--solid"
              href="#contact-inquiry"
              onClick={scrollToContactInquiry}
            >
              Business Inquiry
            </a>
          </div>
        </div>
        <div className="contact-map-layout">
          <ContactLocationsMap locations={locations} />
          <div className="contact-location-list" aria-label="Euro India Foods locations">
            {locations.map((location, index) => (
              <article className="contact-location-card" key={location.title}>
                <span className="contact-location-marker" aria-hidden="true">
                  {String.fromCharCode(65 + index)}
                </span>
                <div className="contact-location-content">
                  <h3>{location.title}</h3>
                  <p>{location.address}</p>
                  <a href={location.directionsUrl} target="_blank" rel="noreferrer">
                    Get Directions →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-partner" id="distributor">
        <div>
          <h2>Looking to Partner With Us?</h2>
          <p>Join our global network of successful snack distributors.</p>
        </div>
      </section>

      <EuroMoments className="euro-moments--contact" />
    </main>
  );
}
