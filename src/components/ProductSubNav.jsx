import React from "react";
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
  { key: "celebrations", label: "Celebrations", href: "#" },
];

export default function ProductSubNav({ active }) {
  return (
    <nav className="product-subnav" aria-label="Product categories">
      <div>
        {categoryTabs.map((tab) => (
          <a key={tab.key} className={tab.key === active ? "is-active" : undefined} href={tab.href}>
            {tab.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
