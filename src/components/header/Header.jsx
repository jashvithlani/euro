import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CATEGORY_PATHS, getNavActive, normalizePath } from "../../site-routing.js";
import { sharedAsset } from "../../shared/asset.js";
import OptimizedImage from "../OptimizedImage.jsx";
import HeaderSearchButton from "./HeaderSearchButton.jsx";
import MobileHeaderActions from "./MobileHeaderActions.jsx";
import MobileNavDrawer from "./MobileNavDrawer.jsx";
import NavItem from "./NavItem.jsx";
import { categoryTabs, navItems } from "./nav-config.js";

export default function Header() {
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const active = getNavActive(pathname);
  const isExportsPage = normalizePath(pathname) === "/exports";
  const onCategoryPage = CATEGORY_PATHS.has(normalizePath(pathname));
  const activeCategoryKey = onCategoryPage ? normalizePath(pathname).slice(1) : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(onCategoryPage);

  useEffect(() => {
    if (onCategoryPage) {
      setProductsOpen(true);
    }
  }, [onCategoryPage, pathname]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header || !isExportsPage || typeof window === "undefined") return undefined;

    const desktopQuery = window.matchMedia("(min-width: 1000px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;

    const resetHeader = () => {
      header.style.removeProperty("--exports-header-offset");
      header.style.removeProperty("--exports-header-opacity");
    };

    const updateHeader = () => {
      frameId = 0;

      if (!desktopQuery.matches || reducedMotionQuery.matches) {
        resetHeader();
        return;
      }

      const journey = document.querySelector(".export-map-journey");
      if (!journey) {
        resetHeader();
        return;
      }

      const hideDistance = Math.max(360, (window.innerHeight || 720) * 0.72);
      const rawProgress = Math.min(
        1,
        Math.max(0, -journey.getBoundingClientRect().top / hideDistance),
      );
      const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);

      header.style.setProperty(
        "--exports-header-offset",
        `${-(header.offsetHeight + 2) * progress}px`,
      );
      header.style.setProperty(
        "--exports-header-opacity",
        (1 - progress).toFixed(4),
      );
    };

    const requestUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateHeader);
    };

    const handleMediaChange = () => requestUpdate();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    desktopQuery.addEventListener("change", handleMediaChange);
    reducedMotionQuery.addEventListener("change", handleMediaChange);
    requestUpdate();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      desktopQuery.removeEventListener("change", handleMediaChange);
      reducedMotionQuery.removeEventListener("change", handleMediaChange);
      resetHeader();
    };
  }, [isExportsPage]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header ref={headerRef} className={`site-nav${menuOpen ? " site-nav--menu-open" : ""}`}>
      <Link className="site-logo" to="/" aria-label="Euro India Foods" onClick={closeMenu}>
        <OptimizedImage src={sharedAsset("logo-main.png")} alt="Euro India Foods" sizes="160px" loading="eager" />
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
