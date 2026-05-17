import React from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ExportsPage from "./pages/ExportsPage.jsx";
import CareerPage from "./pages/CareerPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import DealersPage from "./pages/DealersPage.jsx";
import AchievementsPage from "./pages/AchievementsPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";

const DESIGN_WIDTH = 1280;
const HOME_FIRST_FOLD_HEIGHT = 1000;
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

function getHomeScale() {
  if (typeof window === "undefined") {
    return 1;
  }

  const viewportHeight = window.innerHeight || HOME_FIRST_FOLD_HEIGHT;
  const heightScale = viewportHeight / HOME_FIRST_FOLD_HEIGHT;

  return Math.min(getViewportWidthScale(), heightScale);
}

function getResponsivePageScale(isResponsivePage) {
  return isResponsivePage ? getHomeScale() : 1;
}

function ChipsPage() {
  return <CategoryPage pageKey="chips" />;
}

function BeveragesPage() {
  return <CategoryPage pageKey="beverages" />;
}

function GetmorePage() {
  return <CategoryPage pageKey="getmore" />;
}

function NamkeenPage() {
  return <CategoryPage pageKey="namkeen" />;
}

function ChikkiPage() {
  return <CategoryPage pageKey="chikki" />;
}

function KhakhraPage() {
  return <CategoryPage pageKey="khakhra" />;
}

function BakeryPage() {
  return <CategoryPage pageKey="bakery" />;
}

function FryumsPage() {
  return <CategoryPage pageKey="fryums" />;
}

function FaraliPage() {
  return <CategoryPage pageKey="farali" />;
}

const pageConfig = {
  home: {
    Page: HomePage,
    shellClassName: "page-shell",
    header: { active: "home" },
    footer: { useLocalLinks: true },
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
    header: { active: "investor" },
    footer: { variant: "exports" },
  },
  chips: {
    Page: ChipsPage,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  beverages: {
    Page: BeveragesPage,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  getmore: {
    Page: GetmorePage,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  namkeen: {
    Page: NamkeenPage,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  chikki: {
    Page: ChikkiPage,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  khakhra: {
    Page: KhakhraPage,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  bakery: {
    Page: BakeryPage,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  fryums: {
    Page: FryumsPage,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
  farali: {
    Page: FaraliPage,
    shellClassName: "page-shell category-page",
    header: { active: "products" },
    footer: { variant: "category" },
  },
};

const routeToPage = {
  "/": "home",
  "/about": "about",
  "/exports": "exports",
  "/career": "career",
  "/contact": "contact",
  "/dealers": "dealers",
  "/achievements": "achievements",
  "/chips": "chips",
  "/beverages": "beverages",
  "/getmore": "getmore",
  "/namkeen": "namkeen",
  "/chikki": "chikki",
  "/khakhra": "khakhra",
  "/bakery": "bakery",
  "/fryums": "fryums",
  "/farali": "farali",
};

function normalizePath(pathname) {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function getPageKey() {
  return routeToPage[normalizePath(window.location.pathname)] || "home";
}

export default function App() {
  const pageKey = getPageKey();
  const config = pageConfig[pageKey];
  const { Page } = config;
  const isResponsivePage = pageKey === "home";
  const shellRef = React.useRef(null);
  const [scale, setScale] = React.useState(() => getResponsivePageScale(isResponsivePage));
  const [shellHeight, setShellHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    const updateLayout = () => {
      const nextScale = getResponsivePageScale(isResponsivePage);
      const nextHeight = shellRef.current?.offsetHeight || 0;

      setScale((currentScale) => (Math.abs(currentScale - nextScale) > 0.001 ? nextScale : currentScale));
      setShellHeight((currentHeight) => (Math.abs(currentHeight - nextHeight) > 1 ? nextHeight : currentHeight));
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
  }, [isResponsivePage]);

  return (
    <div
      className={`app-viewport ${isResponsivePage ? "app-viewport--scaled" : "app-viewport--fixed"}`}
      style={{
        "--app-scale": scale,
        "--scaled-shell-height": `${shellHeight * scale}px`,
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
