import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ExportsPage from "./pages/ExportsPage.jsx";
import CareerPage from "./pages/CareerPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import DealersPage from "./pages/DealersPage.jsx";
import AchievementsPage from "./pages/AchievementsPage.jsx";
import InvestorPage from "./pages/InvestorPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";

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

const pageConfig = {
  home: {
    Page: HomePage,
    shellClassName: "page-shell",
    header: { active: "home" },
    footer: {},
  },
  about: {
    Page: AboutPage,
    shellClassName: "page-shell about-page",
    header: { active: "about" },
    footer: { variant: "about" },
  },
  exports: {
    Page: ExportsPage,
    shellClassName: "page-shell exports-page",
    header: { active: "exports" },
    footer: { variant: "exports" },
  },
  career: {
    Page: CareerPage,
    shellClassName: "page-shell career-page",
    header: { active: "career" },
    footer: { variant: "exports" },
  },
  contact: {
    Page: ContactPage,
    shellClassName: "page-shell contact-page",
    header: { active: "contact" },
    footer: { variant: "minimal" },
  },
  dealers: {
    Page: DealersPage,
    shellClassName: "page-shell dealers-page",
    header: { active: "partner" },
    footer: { variant: "minimal", extraBottomSpace: true },
  },
  achievements: {
    Page: AchievementsPage,
    shellClassName: "page-shell achievements-page",
    header: { active: "achievements" },
    footer: { variant: "exports" },
  },
  investor: {
    Page: InvestorPage,
    shellClassName: "page-shell investor-page",
    header: { active: "investor" },
    footer: { variant: "exports" },
  },
  chips: {
    Page: () => <CategoryPage pageKey="chips" />,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  beverages: {
    Page: () => <CategoryPage pageKey="beverages" />,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  getmore: {
    Page: () => <CategoryPage pageKey="getmore" />,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  namkeen: {
    Page: () => <CategoryPage pageKey="namkeen" />,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  chikki: {
    Page: () => <CategoryPage pageKey="chikki" />,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  khakhra: {
    Page: () => <CategoryPage pageKey="khakhra" />,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  bakery: {
    Page: () => <CategoryPage pageKey="bakery" />,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  fryums: {
    Page: () => <CategoryPage pageKey="fryums" />,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  farali: {
    Page: () => <CategoryPage pageKey="farali" />,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
};

function PageShell({ pageKey }) {
  const location = useLocation();
  const config = pageConfig[pageKey];
  const { Page } = config;
  const shellRef = React.useRef(null);
  const [scale, setScale] = React.useState(() => getViewportWidthScale());
  const [shellHeight, setShellHeight] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(() =>
    typeof window === "undefined" ? DEFAULT_HOME_HERO_HEIGHT : window.innerHeight || DEFAULT_HOME_HERO_HEIGHT,
  );

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
  }, [pageKey]);

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
      <div ref={shellRef} className={config.shellClassName}>
        <Header {...config.header} />
        <Page />
        <Footer {...config.footer} />
      </div>
    </div>
  );
}

function PageRoute({ pageKey }) {
  return <PageShell pageKey={pageKey} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PageRoute pageKey="home" />} />
      <Route path="/about" element={<PageRoute pageKey="about" />} />
      <Route path="/exports" element={<PageRoute pageKey="exports" />} />
      <Route path="/career" element={<PageRoute pageKey="career" />} />
      <Route path="/contact" element={<PageRoute pageKey="contact" />} />
      <Route path="/dealers" element={<PageRoute pageKey="dealers" />} />
      <Route path="/achievements" element={<PageRoute pageKey="achievements" />} />
      <Route path="/investor" element={<PageRoute pageKey="investor" />} />
      <Route path="/chips" element={<PageRoute pageKey="chips" />} />
      <Route path="/beverages" element={<PageRoute pageKey="beverages" />} />
      <Route path="/getmore" element={<PageRoute pageKey="getmore" />} />
      <Route path="/namkeen" element={<PageRoute pageKey="namkeen" />} />
      <Route path="/chikki" element={<PageRoute pageKey="chikki" />} />
      <Route path="/khakhra" element={<PageRoute pageKey="khakhra" />} />
      <Route path="/bakery" element={<PageRoute pageKey="bakery" />} />
      <Route path="/fryums" element={<PageRoute pageKey="fryums" />} />
      <Route path="/farali" element={<PageRoute pageKey="farali" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
