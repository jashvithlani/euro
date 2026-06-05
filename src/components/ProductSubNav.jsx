import React from "react";
import { Link } from "react-router-dom";
import "./ProductSubNav.css";

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

export default function ProductSubNav({ active, placement = "default" }) {
  return (
    <nav className={`product-subnav product-subnav--${placement}`} aria-label="Product categories">
      <div>
        {categoryTabs.map((tab) => {
          const className = tab.key === active ? "is-active" : undefined;

          if (tab.href.startsWith("/")) {
            return (
              <Link key={tab.key} className={className} to={tab.href}>
                {tab.label}
              </Link>
            );
          }

          return (
            <a key={tab.key} className={className} href={tab.href}>
              {tab.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
