import React, { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import RouteFallback from "../components/RouteFallback.jsx";
import { getShellClassName } from "../site-routing.js";

const DESIGN_WIDTH = 1280;
const DEFAULT_HOME_HERO_HEIGHT = 720;
const MIN_RESPONSIVE_WIDTH = 1000;
const MAX_RESPONSIVE_WIDTH = 2000;

function getViewportWidthScale() {
  if (typeof window === "undefined") {
    return 1;
  }

  const viewportWidth = window.innerWidth || DESIGN_WIDTH;
  const clampedWidth = Math.min(MAX_RESPONSIVE_WIDTH, Math.max(MIN_RESPONSIVE_WIDTH, viewportWidth));
  return clampedWidth / DESIGN_WIDTH;
}

export default function SiteLayout() {
  const location = useLocation();
  const shellRef = React.useRef(null);
  const [scale, setScale] = React.useState(() => getViewportWidthScale());
  const [shellHeight, setShellHeight] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(() =>
    typeof window === "undefined" ? DEFAULT_HOME_HERO_HEIGHT : window.innerHeight || DEFAULT_HOME_HERO_HEIGHT,
  );

  const shellClassName = getShellClassName(location.pathname);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useLayoutEffect(() => {
    const updateLayout = () => {
      const nextScale = getViewportWidthScale();
      const nextHeight = shellRef.current?.offsetHeight || 0;
      const nextViewportHeight = window.innerHeight || DEFAULT_HOME_HERO_HEIGHT;

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

  return (
    <div
      className="app-viewport app-viewport--scaled"
      style={{
        "--app-scale": scale,
        "--scaled-shell-height": `${shellHeight * scale}px`,
        "--home-hero-height": `${homeHeroHeight}px`,
      }}
    >
      <div ref={shellRef} className={shellClassName}>
        <Header />
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}
