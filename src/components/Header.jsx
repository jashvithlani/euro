import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CATEGORY_PATHS, getNavActive, normalizePath } from "../site-routing.js";
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

const categoryTabs = [
  { key: "chips", label: "Chips", href: "/chips" },
  { key: "getmore", label: "Getmore", href: "/getmore" },
  { key: "beverages", label: "Beverages", href: "/beverages" },
  { key: "namkeen", label: "Namkeen", href: "/namkeen" },
  { key: "farali", label: "Farali", href: "/farali" },
  { key: "chikki", label: "Chikki", href: "/chikki" },
  { key: "khakhra", label: "Khakhra", href: "/khakhra" },
  { key: "bakery", label: "Bakery", href: "/bakery" },
  { key: "fryums", label: "Fryums", href: "/fryums" },
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
  const onCategoryPage = CATEGORY_PATHS.has(normalizePath(pathname));
  const activeCategoryKey = onCategoryPage ? normalizePath(pathname).slice(1) : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(onCategoryPage);

  // Expand Products when the user navigates to a category page with the drawer closed.
  useEffect(() => {
    if (onCategoryPage) {
      setProductsOpen(true);
    }
  }, [onCategoryPage, pathname]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
        {navItems.map((item) => {
          if (item.key === "products") {
            return (
              <div
                key={item.key}
                className={`mobile-nav-group${productsOpen ? " is-open" : ""}${active === "products" ? " is-active" : ""}`}
              >
                <button
                  type="button"
                  className="mobile-nav-group-toggle"
                  aria-expanded={productsOpen}
                  aria-controls="mobile-nav-products"
                  onClick={() => setProductsOpen((open) => !open)}
                >
                  <span>{item.label}</span>
                  <svg aria-hidden="true" viewBox="0 0 12 8" focusable="false">
                    <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div id="mobile-nav-products" className="mobile-nav-sub" hidden={!productsOpen}>
                  {categoryTabs.map((cat) => {
                    const isActive = cat.key === activeCategoryKey;
                    const className = isActive ? "is-active" : undefined;
                    if (cat.href.startsWith("/")) {
                      return (
                        <Link
                          key={cat.key}
                          className={className}
                          to={cat.href}
                          aria-current={isActive ? "page" : undefined}
                          onClick={closeMenu}
                        >
                          {cat.label}
                        </Link>
                      );
                    }
                    return (
                      <a key={cat.key} className={className} href={cat.href} onClick={closeMenu}>
                        {cat.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          }
          return <NavItem key={item.key} item={item} active={active} onNavigate={closeMenu} />;
        })}
      </nav>
    </header>
  );
}
