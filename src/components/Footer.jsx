import React from "react";
import { Link } from "react-router-dom";

const footerLinks = [
  { key: "home", label: "Home", href: "/" },
  { key: "products", label: "Products", href: "/chips" },
  { key: "story", label: "Our Story", href: "/about" },
  { key: "dealers", label: "Dealership", href: "/dealers" },
];

const supportItems = [
  {
    icon: "assets/exports-icon-location.svg",
    label: "Plot 12, GIDC, Surat, Gujarat",
    exportsLabel: (
      <>
        Plot 12, GIDC, Surat,
        <br />
        Gujarat
      </>
    ),
  },
  { icon: "assets/exports-icon-phone.svg", label: "+91 261 2400000" },
  { icon: "assets/exports-icon-mail.svg", label: "hello@euroindia.com" },
];

const certificateLogos = [
  { src: "assets/footer-cert-fssai.png", alt: "FSSAI" },
  { src: "assets/footer-cert-apeda.png", alt: "APEDA" },
  { src: "assets/footer-cert-ghp.png", alt: "GMP" },
  { src: "assets/footer-cert-gmp.png", alt: "GHP" },
  { src: "assets/footer-cert-haccp.png", alt: "HACCP" },
  { src: "assets/footer-cert-iso-22000.png", alt: "ISO 22000" },
  { src: "assets/footer-cert-member.png", alt: "Member certification" },
];

function getFooterLinks(useLocalLinks) {
  return footerLinks.map((link) => {
    if (!useLocalLinks) {
      return link;
    }

    if (link.key === "products") {
      return { ...link, href: "#products" };
    }

    return link;
  });
}

function Newsletter({ className, action }) {
  return (
    <form className={className} action={action}>
      <input type="email" placeholder="Email Address" aria-label="Email Address" />
      <button type="submit" aria-label="Subscribe">
        <img src="assets/exports-icon-arrow.svg" alt="" />
      </button>
    </form>
  );
}

function LinkColumn({ className, useLocalLinks }) {
  return (
    <div className={className}>
      <h2>Links</h2>
      {getFooterLinks(useLocalLinks).map((link) =>
        link.href.startsWith("/") ? (
          <Link key={link.key} to={link.href}>
            {link.label}
          </Link>
        ) : (
          <a key={link.key} href={link.href}>
            {link.label}
          </a>
        ),
      )}
    </div>
  );
}

function SupportColumn() {
  return (
    <div className="footer-support">
      <h2>Support</h2>
      {supportItems.map((item) => (
        <p key={item.icon}>
          <img src={item.icon} alt="" />
          {item.exportsLabel || item.label}
        </p>
      ))}
    </div>
  );
}

function NewsletterColumn() {
  return (
    <div className="footer-newsletter">
      <h2>Newsletter</h2>
      <p>Get the latest snack drops!</p>
      <Newsletter className="newsletter" action="#" />
    </div>
  );
}

function Certificates() {
  return (
    <div className="footer-certificates">
      <h2>Certificates</h2>
      <div className="footer-certificate-strip">
        {certificateLogos.map((logo) => (
          <img key={logo.src} src={logo.src} alt={logo.alt} />
        ))}
      </div>
    </div>
  );
}

function Availability() {
  return (
    <div className="footer-availability">
      <span>Also available on</span>
      <img src="assets/footer-amazon.png" alt="Amazon" />
    </div>
  );
}

function DesignFooter({ useLocalLinks = false, extraBottomSpace = false }) {
  const className = ["footer", extraBottomSpace ? "footer--extra" : ""].filter(Boolean).join(" ");

  return (
    <footer className={className} id="contact">
      <div className="footer-inner">
        <div className="footer-primary">
          <div className="footer-about">
            <img src="assets/logo-footer.png" alt="Euro India Foods" />
            <p>Elevating India's snack culture through quality, innovation, and authentic flavor stories.</p>
          </div>
          <LinkColumn className="footer-links" useLocalLinks={useLocalLinks} />
          <SupportColumn />
          <NewsletterColumn />
        </div>
        <div className="footer-secondary">
          <Certificates />
          <Availability />
        </div>
      </div>
    </footer>
  );
}

export default function Footer({ useLocalLinks = false, extraBottomSpace = false }) {
  return <DesignFooter useLocalLinks={useLocalLinks} extraBottomSpace={extraBottomSpace} />;
}
