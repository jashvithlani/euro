import { Link } from "react-router-dom";
import { sharedAsset } from '../shared/asset.js';
import OptimizedImage from '../components/OptimizedImage.jsx';
import { CATEGORY_PRODUCT_SHOP_URL } from '../pages/category/CategoryProductShopButton.jsx';

const footerLinks = [
  { key: "home", label: "Home", href: "/" },
  { key: "products", label: "Products", href: "/chips" },
  { key: "story", label: "Our Story", href: "/about" },
  { key: "dealers", label: "Dealership", href: "/dealers" },
];

const supportItems = [
  {
    icon: sharedAsset('exports-icon-location.svg'),
    label: "Corp Address : 4408 Central Tower, Kohinoor Square, N.C.Kelkar Marg, R.G. Gadkari Chowk Opp Shivsena Bhavan Chhatrapati Shivaji Maharaj Park, Dadar(West), Mumbai - 400028.",
    href: "https://maps.google.com/?q=4408+Central+Tower,+Kohinoor+Square,+N.C.Kelkar+Marg,+Dadar+West,+Mumbai+400028",
    external: true,
    exportsLabel: (
      <>
        <strong>Corp Address</strong>
        {" : 4408 Central Tower, Kohinoor Square, N.C.Kelkar Marg, R.G. Gadkari Chowk Opp Shivsena Bhavan Chhatrapati Shivaji Maharaj Park, Dadar(West), Mumbai - 400028."}
      </>
    ),
  },
  {
    icon: sharedAsset('exports-icon-location.svg'),
    label: "Factory : Plot No. 15, CITY SURVEY NO NA 1862/15,At. Degam,Ta. Chikhli Dist. Navsari.",
    href: "https://maps.google.com/?q=Plot+No.+15,+City+Survey+No.+1862%2F15,+Degam,+Chikhli,+Navsari,+Gujarat",
    external: true,
    exportsLabel: (
      <>
        <strong>Factory</strong>
        {" : Plot No. 15, CITY SURVEY NO NA 1862/15,At. Degam,Ta. Chikhli Dist. Navsari."}
      </>
    ),
  },
  {
    icon: sharedAsset('exports-icon-location.svg'),
    label: "Registered Office Address: PLOT NO. A 22/1 G.I.D.C. ICHHAPORE, SURAT, GUJARAT, INDIA, 394510",
    href: "https://maps.google.com/?q=Plot+No.+A+22%2F1+G.I.D.C.+Ichhapore,+Surat,+Gujarat,+India+394510",
    external: true,
    exportsLabel: (
      <>
        <strong>Registered Office Address</strong>
        {": PLOT NO. A 22/1 G.I.D.C. ICHHAPORE, SURAT, GUJARAT, INDIA, 394510"}
      </>
    ),
  },
  {
    icon: sharedAsset('exports-icon-phone.svg'),
    label: "Tel No.: 022-48256981",
    href: "tel:+912248256981",
  },
  {
    icon: sharedAsset('exports-icon-mail.svg'),
    label: "info@euroindiafoods.com",
    href: "mailto:info@euroindiafoods.com",
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
            <OptimizedImage src={sharedAsset("logo-footer.png")} alt="Euro India Foods" sizes="200px" />
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
                <span className="footer-support-copy">{item.exportsLabel || item.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-secondary">
          <div className="footer-certificates">
            <h2>Certificates</h2>
            <div className="footer-certificate-strip">
              {certificateLogos.map((logo) => (
                <OptimizedImage key={logo.src} src={logo.src} alt={logo.alt} sizes="120px" />
              ))}
            </div>
          </div>

          <div className="footer-availability">
            <span>Also available on</span>
            <a
              className="footer-availability-link"
              href={CATEGORY_PRODUCT_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shop Euro India Foods on Amazon"
            >
              <OptimizedImage src={sharedAsset("footer-amazon.png")} alt="Amazon" sizes="140px" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-subfooter">
        <p className="footer-subfooter-copy">© 2026, Euro India Foods.</p>
        <p className="footer-subfooter-designed">
          Designed by{" "}
          <a href="https://incusedigital.com/" target="_blank" rel="noopener noreferrer">
            Incuse Digital
            <OptimizedImage src={sharedAsset("incuse-favicon.png")} alt="" sizes="24px" />
          </a>
        </p>
      </div>
    </footer>
  );
}
