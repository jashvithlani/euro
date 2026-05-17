import React from "react";

const navItems = [
  { key: "home", label: "Home", href: "/" },
  { key: "products", label: "Products", href: "/chips" },
  { key: "about", label: "About", href: "/about" },
  { key: "investor", label: "Investor", href: "/achievements" },
  { key: "exports", label: "Exports", href: "/exports" },
  { key: "career", label: "Career", href: "/career" },
  { key: "partner", label: "Franchise", href: "/dealers" },
  { key: "contact", label: "Contact", href: "/contact" },
];

const localLinksByPage = {
  home: {
    products: "#products",
  },
};

export default function Header({ active = "home" }) {
  const localLinks = localLinksByPage[active] || {};

  return (
    <header className="site-nav">
      <a className="site-logo" href="/" aria-label="Euro India Foods">
        <img src="assets/logo-main.png" alt="Euro India Foods" />
      </a>
      <nav className="nav-list" aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            key={item.key}
            className={item.key === active ? "is-active" : undefined}
            href={localLinks[item.key] || item.href}
            aria-current={item.key === active ? "page" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
