import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getNavActive } from "../site-routing.js";
import { sharedAsset } from '../shared/asset.js';

const navItems = [
  { key: "home", label: "Home", href: "/" },
  { key: "products", label: "Products", href: "/chips" },
  { key: "about", label: "About", href: "/about" },
  { key: "investor", label: "Investor", href: "/investor" },
  { key: "exports", label: "Exports", href: "/exports" },
  { key: "career", label: "Career", href: "/career" },
  { key: "partner", label: "Dealership", href: "/dealers" },
  { key: "news", label: "News", href: "#" },
  { key: "achievements", label: "Achievements", href: "/achievements" },
  { key: "contact", label: "Contact", href: "/contact" },
];

function NavItem({ item, active, onNavigate }) {
  const className = item.key === active ? "is-active" : undefined;
  const ariaCurrent = item.key === active ? "page" : undefined;

  if (item.href.startsWith("/")) {
    return (
      <Link className={className} to={item.href} aria-current={ariaCurrent} onClick={onNavigate}>
        {item.label}
      </Link>
    );
  }

  return (
    <a className={className} href={item.href} aria-current={ariaCurrent} onClick={onNavigate}>
      {item.label}
    </a>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const active = getNavActive(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-nav${menuOpen ? " site-nav--menu-open" : ""}`}>
      <Link className="site-logo" to="/" aria-label="Euro India Foods" onClick={closeMenu}>
        <img src={sharedAsset('logo-main.png')} alt="Euro India Foods" />
      </Link>

      <div className="site-nav-actions">
        <button className="nav-search nav-search--mobile" type="button" aria-label="Search">
          <svg aria-hidden="true" viewBox="0 0 18 18" focusable="false">
            <path
              d="M8.25 14.25A6 6 0 1 1 8.25 2.25a6 6 0 0 1 0 12Zm4.24-1.76 3.26 3.26"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
        <button
          className="nav-icon nav-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className="nav-list" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavItem key={item.key} item={item} active={active} />
        ))}
        <button className="nav-search nav-search--desktop" type="button" aria-label="Search">
          <svg aria-hidden="true" viewBox="0 0 18 18" focusable="false">
            <path
              d="M8.25 14.25A6 6 0 1 1 8.25 2.25a6 6 0 0 1 0 12Zm4.24-1.76 3.26 3.26"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </nav>

      <nav
        className="mobile-nav-drawer"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        data-open={menuOpen ? "true" : "false"}
      >
        {navItems.map((item) => (
          <NavItem key={item.key} item={item} active={active} onNavigate={closeMenu} />
        ))}
      </nav>
    </header>
  );
}
