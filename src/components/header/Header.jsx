import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CATEGORY_PATHS, getNavActive, normalizePath } from "../../site-routing.js";
import { sharedAsset } from "../../shared/asset.js";
import HeaderSearchButton from "./HeaderSearchButton.jsx";
import MobileHeaderActions from "./MobileHeaderActions.jsx";
import MobileNavDrawer from "./MobileNavDrawer.jsx";
import NavItem from "./NavItem.jsx";
import { categoryTabs, navItems } from "./nav-config.js";

export default function Header() {
  const { pathname } = useLocation();
  const active = getNavActive(pathname);
  const onCategoryPage = CATEGORY_PATHS.has(normalizePath(pathname));
  const activeCategoryKey = onCategoryPage ? normalizePath(pathname).slice(1) : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(onCategoryPage);

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
        <img src={sharedAsset("logo-main.png")} alt="Euro India Foods" />
      </Link>

      <MobileHeaderActions
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
      />

      <nav className="nav-list" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavItem key={item.key} item={item} active={active} />
        ))}
        <HeaderSearchButton className="nav-search nav-search--desktop" />
      </nav>

      <MobileNavDrawer
        isOpen={menuOpen}
        navItems={navItems}
        categoryTabs={categoryTabs}
        active={active}
        activeCategoryKey={activeCategoryKey}
        productsOpen={productsOpen}
        onProductsToggle={() => setProductsOpen((open) => !open)}
        onClose={closeMenu}
      />
    </header>
  );
}
