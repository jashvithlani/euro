import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { isInvestorPath } from "../pages/investor/investor-routing.js";
import { getShellClassName, normalizePath } from "../site-routing.js";
import "../styles/MobileShell.css";

const DESIGN_WIDTH = 1280;
const DEFAULT_HOME_HERO_HEIGHT = 720;
const MIN_RESPONSIVE_WIDTH = 1000;
const MAX_RESPONSIVE_WIDTH = 2000;
const MOBILE_BREAKPOINT = 999;
const FLUID_MOBILE_PATHS = new Set(["/", "/about", "/exports", "/career", "/contact", "/dealers", "/achievements"]);

function getViewportWidth() {
  if (typeof window === "undefined") {
    return DESIGN_WIDTH;
  }

  return window.innerWidth || DESIGN_WIDTH;
}

function getViewportWidthScale(viewportWidth = getViewportWidth()) {
  const clampedWidth = Math.min(MAX_RESPONSIVE_WIDTH, Math.max(MIN_RESPONSIVE_WIDTH, viewportWidth));
  return clampedWidth / DESIGN_WIDTH;
}

function isFluidMobileLayout(pathname, viewportWidth = getViewportWidth()) {
  return viewportWidth <= MOBILE_BREAKPOINT && FLUID_MOBILE_PATHS.has(normalizePath(pathname));
}

export default function SiteLayout() {
  const location = useLocation();
  const shellRef = React.useRef(null);
  const [viewportWidth, setViewportWidth] = React.useState(() => getViewportWidth());
  const [scale, setScale] = React.useState(() => getViewportWidthScale());
  const useFluidMobile = isFluidMobileLayout(location.pathname, viewportWidth);
  const [shellHeight, setShellHeight] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(() =>
    typeof window === "undefined" ? DEFAULT_HOME_HERO_HEIGHT : window.innerHeight || DEFAULT_HOME_HERO_HEIGHT,
  );

  const shellClassName = getShellClassName(location.pathname);
  const prevPathnameRef = React.useRef(location.pathname);

  React.useEffect(() => {
    const previousPathname = prevPathnameRef.current;
    prevPathnameRef.current = location.pathname;

    if (isInvestorPath(previousPathname) && isInvestorPath(location.pathname)) {
      return;
    }

    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useLayoutEffect(() => {
    const updateLayout = () => {
      const nextViewportWidth = getViewportWidth();
      const nextScale = isFluidMobileLayout(location.pathname, nextViewportWidth)
        ? 1
        : getViewportWidthScale(nextViewportWidth);
      const nextHeight = shellRef.current?.offsetHeight || 0;
      const nextViewportHeight = window.innerHeight || DEFAULT_HOME_HERO_HEIGHT;

      setViewportWidth((currentWidth) =>
        Math.abs(currentWidth - nextViewportWidth) > 1 ? nextViewportWidth : currentWidth,
      );
      setScale((currentScale) => (Math.abs(currentScale - nextScale) > 0.001 ? nextScale : currentScale));
      setShellHeight((currentHeight) => (Math.abs(currentHeight - nextHeight) > 1 ? nextHeight : currentHeight));
      setViewportHeight((currentHeight) =>
        Math.abs(currentHeight - nextViewportHeight) > 1 ? nextViewportHeight : currentHeight,
      );
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateLayout);
    if (resizeObserver && shellRef.current) {
      resizeObserver.observe(shellRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateLayout);
      resizeObserver?.disconnect();
    };
  }, [location.pathname]);

  const homeHeroHeight = viewportHeight / scale;

  const viewportClassName = useFluidMobile ? "app-viewport app-viewport--fluid" : "app-viewport app-viewport--scaled";

  return (
    <div
      className={viewportClassName}
      style={{
        "--app-scale": scale,
        "--scaled-shell-height": `${shellHeight * scale}px`,
        "--home-hero-height": `${homeHeroHeight}px`,
      }}
    >
      <div ref={shellRef} className={shellClassName}>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
