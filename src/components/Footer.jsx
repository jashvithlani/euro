import React from "react";

const footerLinks = [
  { key: "home", label: "Home", href: "/" },
  { key: "products", label: "Products", href: "/chips" },
  { key: "story", label: "Our Story", href: "/about" },
  { key: "dealers", label: "Dealers", href: "/dealers" },
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

const legalLinks = ["Privacy", "Terms", "Sitemap"];

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
      {getFooterLinks(useLocalLinks).map((link) => (
        <a key={link.key} href={link.href}>
          {link.label}
        </a>
      ))}
    </div>
  );
}

function StandardSupportColumn() {
  return (
    <div>
      <h2>Support</h2>
      {supportItems.map((item) => (
        <p key={item.icon} className="footer-contact-line">
          <img src={item.icon} alt="" />
          {item.label}
        </p>
      ))}
    </div>
  );
}

function ExportsSupportColumn() {
  return (
    <div className="exports-footer-support">
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

function MinimalSupportColumn() {
  return (
    <div className="minimal-footer-support">
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

function NewsletterColumn({ exportsLayout = false }) {
  return (
    <div>
      <h2>Newsletter</h2>
      <p>Get the latest snack drops!</p>
      <Newsletter
        className={exportsLayout ? "exports-newsletter" : "newsletter"}
        action={exportsLayout ? "#" : undefined}
      />
    </div>
  );
}

function MinimalNewsletterColumn() {
  return (
    <div>
      <h2>Newsletter</h2>
      <p>Get the latest snack drops!</p>
      <Newsletter className="minimal-newsletter" action="#" />
    </div>
  );
}

function StandardFooter({ variant, useLocalLinks }) {
  const className = ["footer", variant === "about" ? "about-footer" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <footer className={className} id="contact">
      <div className="footer-grid">
        <div className="footer-about">
          <p>Elevating India's snack culture through quality, innovation, and authentic flavor stories.</p>
          <img src="assets/logo-footer.png" alt="Euro India Foods" />
        </div>
        <LinkColumn useLocalLinks={useLocalLinks} />
        <StandardSupportColumn />
        <NewsletterColumn />
      </div>
    </footer>
  );
}

function MinimalFooter({ extraBottomSpace = false }) {
  const className = ["minimal-footer", extraBottomSpace ? "minimal-footer--extra" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <footer className={className} id="contact">
      <div className="minimal-footer-content">
        <div className="minimal-footer-grid">
          <div className="minimal-footer-about">
            <p>Elevating India's snack culture through quality, innovation, and authentic flavor stories.</p>
          </div>
          <LinkColumn className="minimal-footer-links" />
          <MinimalSupportColumn />
          <MinimalNewsletterColumn />
        </div>
        <div className="minimal-footer-bottom">
          <img src="assets/logo-footer.png" alt="Euro India Foods" />
        </div>
      </div>
    </footer>
  );
}

function ExportsFooter() {
  return (
    <footer className="exports-footer" id="contact">
      <div className="exports-footer-grid">
        <div className="exports-footer-about">
          <p>Elevating India's snack culture through quality, innovation, and authentic flavor stories.</p>
          <div className="exports-socials" aria-label="Social links">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="Instagram">
              <img src="assets/exports-icon-social-1.svg" alt="" />
            </a>
            <a href="#" aria-label="Social">
              <img src="assets/exports-icon-social-2.svg" alt="" />
            </a>
          </div>
        </div>
        <LinkColumn className="exports-footer-links" />
        <ExportsSupportColumn />
        <NewsletterColumn exportsLayout />
      </div>
      <div className="exports-footer-bottom">
        <nav aria-label="Legal links">
          {legalLinks.map((label) => (
            <a key={label} href="#">
              {label}
            </a>
          ))}
        </nav>
        <img src="assets/logo-footer.png" alt="Euro India Foods" />
      </div>
    </footer>
  );
}

function CategoryFooter() {
  return (
    <footer className="category-footer" id="contact">
      <div className="category-footer-grid">
        <div className="category-footer-about">
          <p>Elevating India's snack culture through quality, innovation, and authentic flavor stories.</p>
          <div className="exports-socials" aria-label="Social links">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="Instagram">
              <img src="assets/exports-icon-social-1.svg" alt="" />
            </a>
            <a href="#" aria-label="Social">
              <img src="assets/exports-icon-social-2.svg" alt="" />
            </a>
          </div>
        </div>
        <LinkColumn className="category-footer-links" />
        <ExportsSupportColumn />
        <NewsletterColumn exportsLayout />
      </div>
      <div className="category-footer-bottom">
        <nav aria-label="Legal links">
          {legalLinks.map((label) => (
            <a key={label} href="#">
              {label}
            </a>
          ))}
        </nav>
        <img src="assets/logo-footer.png" alt="Euro India Foods" />
      </div>
    </footer>
  );
}

export default function Footer({ variant = "default", useLocalLinks = false, extraBottomSpace = false }) {
  if (variant === "minimal") {
    return <MinimalFooter extraBottomSpace={extraBottomSpace} />;
  }

  if (variant === "exports") {
    return <ExportsFooter />;
  }

  if (variant === "category") {
    return <CategoryFooter />;
  }

  return <StandardFooter variant={variant} useLocalLinks={useLocalLinks} />;
}
