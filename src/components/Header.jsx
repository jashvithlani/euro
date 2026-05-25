import React from "react";

const navItems = [
  { key: "home", label: "Home", href: "/" },
  { key: "products", label: "Products", href: "/chips" },
  { key: "about", label: "About", href: "/about" },
  { key: "investor", label: "Investor", href: "/achievements" },
  { key: "exports", label: "Exports", href: "/exports" },
  { key: "career", label: "Career", href: "/career" },
  { key: "partner", label: "Dealership", href: "/dealers" },
  { key: "news", label: "News", href: "#" },
  { key: "achievements", label: "Achievements", href: "/achievements" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export default function Header({ active = "home" }) {
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
            href={item.href}
            aria-current={item.key === active ? "page" : undefined}
          >
            {item.label}
          </a>
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
