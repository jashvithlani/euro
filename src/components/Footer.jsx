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

function Newsletter() {
  return (
    <form className="newsletter" action="#">
      <input type="email" placeholder="Email Address" aria-label="Email Address" />
      <button type="submit" aria-label="Subscribe">
        <img src="assets/exports-icon-arrow.svg" alt="" />
      </button>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">
        <div className="footer-primary">
          <div className="footer-about">
            <img src="assets/logo-footer.png" alt="Euro India Foods" />
            <p>Elevating India&apos;s snack culture through quality, innovation, and authentic flavor stories.</p>
          </div>

          <div className="footer-links">
            <h2>Links</h2>
            {footerLinks.map((link) => (
              <Link key={link.key} to={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="footer-support">
            <h2>Support</h2>
            {supportItems.map((item) => (
              <p key={item.icon}>
                <img src={item.icon} alt="" />
                {item.exportsLabel || item.label}
              </p>
            ))}
          </div>

          <div className="footer-newsletter">
            <h2>Newsletter</h2>
            <p>Get the latest snack drops!</p>
            <Newsletter />
          </div>
        </div>

        <div className="footer-secondary">
          <div className="footer-certificates">
            <h2>Certificates</h2>
            <div className="footer-certificate-strip">
              {certificateLogos.map((logo) => (
                <img key={logo.src} src={logo.src} alt={logo.alt} />
              ))}
            </div>
          </div>

          <div className="footer-availability">
            <span>Also available on</span>
            <img src="assets/footer-amazon.png" alt="Amazon" />
          </div>
        </div>
      </div>
    </footer>
  );
}
