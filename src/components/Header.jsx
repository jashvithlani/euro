import React from "react";
import { Link } from "react-router-dom";

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

function NavItem({ item, active }) {
  const className = item.key === active ? "is-active" : undefined;
  const ariaCurrent = item.key === active ? "page" : undefined;

  if (item.href.startsWith("/")) {
    return (
      <Link className={className} to={item.href} aria-current={ariaCurrent}>
        {item.label}
      </Link>
    );
  }

  return (
    <a className={className} href={item.href} aria-current={ariaCurrent}>
      {item.label}
    </a>
  );
}

export default function Header({ active = "home" }) {
  return (
    <header className="site-nav">
      <Link className="site-logo" to="/" aria-label="Euro India Foods">
        <img src="assets/logo-main.png" alt="Euro India Foods" />
      </Link>
      <nav className="nav-list" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavItem key={item.key} item={item} active={active} />
        ))}
        <button className="nav-search" type="button" aria-label="Search">
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
    </header>
  );
}
