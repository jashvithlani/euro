import { Link } from "react-router-dom";
import { sharedAsset } from '../shared/asset.js';

const footerLinks = [
  { key: "home", label: "Home", href: "/" },
  { key: "products", label: "Products", href: "/chips" },
  { key: "story", label: "Our Story", href: "/about" },
  { key: "dealers", label: "Dealership", href: "/dealers" },
];

const supportItems = [
  {
    icon: sharedAsset('exports-icon-location.svg'),
    label: "Plot 12, GIDC, Surat, Gujarat",
    href: "https://maps.google.com/?q=Plot+12,+GIDC,+Surat,+Gujarat",
    external: true,
    exportsLabel: (
      <>
        Plot 12, GIDC, Surat,
        <br />
        Gujarat
      </>
    ),
  },
  {
    icon: sharedAsset('exports-icon-phone.svg'),
    label: "+91 261 2400000",
    href: "tel:+912612400000",
  },
  {
    icon: sharedAsset('exports-icon-mail.svg'),
    label: "hello@euroindia.com",
    href: "mailto:hello@euroindia.com",
  },
];

const certificateLogos = [
  { src: sharedAsset('footer-cert-fssai.png'), alt: "FSSAI" },
  { src: sharedAsset('footer-cert-apeda.png'), alt: "APEDA" },
  { src: sharedAsset('footer-cert-ghp.png'), alt: "GMP" },
  { src: sharedAsset('footer-cert-gmp.png'), alt: "GHP" },
  { src: sharedAsset('footer-cert-haccp.png'), alt: "HACCP" },
  { src: sharedAsset('footer-cert-iso-22000.png'), alt: "ISO 22000" },
  { src: sharedAsset('footer-cert-member.png'), alt: "Member certification" },
];

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">
        <div className="footer-primary">
          <div className="footer-about">
            <img src={sharedAsset("logo-footer.png")} alt="Euro India Foods" />
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
              <a
                key={item.href}
                className="footer-support-item"
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <img src={item.icon} alt="" />
                {item.exportsLabel || item.label}
              </a>
            ))}
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
            <img src={sharedAsset("footer-amazon.png")} alt="Amazon" />
          </div>
        </div>
      </div>
    </footer>
  );
}
