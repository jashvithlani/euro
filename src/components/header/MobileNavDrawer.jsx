import { Link } from "react-router-dom";
import NavItem from "./NavItem.jsx";

export default function MobileNavDrawer({
  isOpen,
  navItems,
  categoryTabs,
  active,
  activeCategoryKey,
  productsOpen,
  onProductsToggle,
  onClose,
}) {
  return (
    <nav
      className="mobile-nav-drawer"
      aria-label="Mobile navigation"
      aria-hidden={!isOpen}
      data-open={isOpen ? "true" : "false"}
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
                onClick={onProductsToggle}
              >
                <span>{item.label}</span>
                <svg aria-hidden="true" viewBox="0 0 12 8" focusable="false">
                  <path
                    d="M1 1l5 5 5-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
                        onClick={onClose}
                      >
                        {cat.label}
                      </Link>
                    );
                  }
                  return (
                    <a key={cat.key} className={className} href={cat.href} onClick={onClose}>
                      {cat.label}
                    </a>
                  );
                })}
              </div>
            </div>
          );
        }
        return <NavItem key={item.key} item={item} active={active} onNavigate={onClose} />;
      })}
    </nav>
  );
}
