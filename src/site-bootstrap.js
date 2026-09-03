import imageManifest from "./shared/image-manifest.json";
import { SEO_METADATA_BY_PATH } from "./seo-metadata.js";
import heroExploreIconUrl from "./pages/home/assets/hero-explore-icon.svg";
import flavorArrowNextUrl from "./pages/home/assets/arrow-next.svg";
import flavorArrowPrevUrl from "./pages/home/assets/arrow-prev.svg";
import chikkiAccentUrl from "./pages/category/assets/category-chikki-figma-accent.svg";
import chikkiWaveUrl from "./pages/category/assets/category-chikki-figma-wave.svg";
import khakhraWaveUrl from "./pages/category/assets/category-khakhra-figma-wave.svg";
import worldMapReferenceUrl from "../world-map.jpg";

export const SITE_BOOTSTRAP_STORAGE_KEY = "euro-site-bootstrap-v1";

const image = (route, name, mobileWidth, desktopWidth = mobileWidth) => ({
  route,
  name,
  mobileWidth,
  desktopWidth,
});

// These are the images required for the first meaningful view on every route,
// plus every product used by the Home flavor animation. The selected AVIF is
// sized for the current layout instead of downloading the original PNG/JPEG.
const SHARED_AND_PAGE_HERO_IMAGES = [
  image("*", "logo-main.png", 160),
  image("/", "hero-products.png", 768, 1200),
  image("/", "category-chips-wide-hero-onion.png", 640),
  image("/", "category-getmore-tomato.png", 480, 768),
  image("/", "category-namkeen-royal-peanuts.png", 480, 768),
  image("/", "category-beverage-fig-mango.png", 320, 480),
  image("/", "category-khakhra-masala.png", 640),
  image("/about", "about-hero-left-source.png", 768),
  image("/about", "about-hero-right-source.png", 768),
  image("/career", "career-hero-team.png", 480),
  image("/contact", "contact-hero.jpeg", 1024, 960),
  image("/achievements", "achievements-hero-texture.png", 512),
  image("/investor", "investor-hero-photo.jpeg", 960, 1200),
  image("/exports", "category-chips-wide-hero-masti.png", 480),
  image("/exports", "category-beverage-fig-mango.png", 320),
  image("/exports", "category-getmore-tomato.png", 480),
  image("/exports", "category-namkeen-shahi-mixture.png", 480),
  image("/exports", "category-chikki-peanut.png", 480),
  image("/exports", "category-khakhra-masala.png", 480),
  image("/exports", "category-bakery-jeera-khari.png", 480),
  image("/exports", "category-fryums-magic-abcde.png", 480),
];

// On mobile the decorative category carousels are intentionally hidden. The
// first product grid is the visual hero, so its first products are the useful
// bootstrap requests for that layout.
const MOBILE_CATEGORY_HERO_IMAGES = [
  ...["category-chips-wide-card-masti.png", "category-chips-wide-card-onion.png", "category-chips-wide-card-salted.png", "category-chips-wide-card-tomato.png"].map((name) => image("/chips", name, 480)),
  ...["category-beverage-guava.png", "category-beverage-fig-mango.png", "LITCHI-mobile.png", "Nimbu-mobile.png"].map((name) => image("/beverages", name, 480)),
  ...["category-getmore-tomato.png", "category-getmore-chatpata.png"].map((name) => image("/getmore", name, 480)),
  ...["category-namkeen-shahi-mixture.png", "category-namkeen-madras-mix.png", "category-namkeen-lemon-mint-bhel.png", "category-namkeen-kenyan-chiwda-hot.png"].map((name) => image("/namkeen", name, 480)),
  ...["category-chikki-crush-peanut.png", "category-chikki-peanut.png", "category-chikki-rajgira.png", "category-chikki-dryfruit-mix.png"].map((name) => image("/chikki", name, 480)),
  ...["category-khakhra-masala.png", "category-khakhra-7grain.png", "category-khakhra-fafda.png", "category-khakhra-jeera.png"].map((name) => image("/khakhra", name, 480)),
  ...["category-bakery-methi-khari.png", "category-bakery-plain-khari.png", "category-bakery-jeera-khari.png", "category-bakery-rusk.png"].map((name) => image("/bakery", name, 480)),
  ...["category-fryums-tasty-pasta.png", "category-fryums-magic-abcde.png", "category-fryums-noodles-sticks.png", "category-fryums-ringoli-tomato-rings.png"].map((name) => image("/fryums", name, 480)),
  ...["category-farali-chiwda-tikha.png", "category-farali-chiwda-mitha.png", "category-farali-sabudana.png", "category-farali-kela-chiwda-card.png"].map((name) => image("/farali", name, 480)),
];

const DESKTOP_CATEGORY_HERO_IMAGES = [
  image("/chips", "category-chips-wide-hero-bg.png", 1440),
  ...["category-chips-wide-hero-salted.png", "category-chips-wide-hero-tomato.png", "category-chips-wide-hero-masti.png", "category-chips-wide-hero-onion.png", "category-chips-wide-hero-chilli.png"].map((name) => image("/chips", name, 640)),
  image("/beverages", "category-beverages-hero-shape.png", 1440),
  ...["category-beverage-fig-guava.png", "category-beverage-fig-sparker.png", "category-beverage-fig-lemoni.png", "category-beverage-fig-orange.png", "category-beverage-fig-mango.png"].map((name) => image("/beverages", name, 640)),
  image("/getmore", "category-getmore-hero-bg.png", 1440),
  image("/getmore", "category-getmore-line-red.png", 320),
  image("/getmore", "category-getmore-line-blue.png", 320),
  image("/getmore", "category-getmore-tomato.png", 640),
  image("/getmore", "category-getmore-chatpata.png", 640),
  image("/namkeen", "category-namkeen-hero-bg.png", 1440),
  ...["category-namkeen-all-in-one.png", "category-namkeen-chakhna-mix.png", "category-namkeen-papad-chavana.png", "category-namkeen-bhavnagari-gathiya.png", "category-namkeen-masala-sev-mamra.png"].map((name) => image("/namkeen", name, 640)),
  image("/chikki", "category-chikki-figma-products.png", 960),
  ...["category-khakhra-7grain.png", "category-khakhra-panipuri.png", "category-khakhra-fafda.png", "category-khakhra-jeera.png", "category-khakhra-masala.png"].map((name) => image("/khakhra", name, 640)),
  ...["category-bakery-plain-khari.png", "category-bakery-coconut-nankhatai.png", "category-bakery-methi-khari.png"].map((name) => image("/bakery", name, 640)),
  image("/fryums", "category-fryums-figma-wave.png", 1440),
  ...["category-fryums-cone-cap.png", "category-fryums-magic-abcde.png", "category-fryums-noodles-sticks.png", "category-fryums-tasty-pasta.png", "category-fryums-crunchy-cups.png"].map((name) => image("/fryums", name, 640)),
  image("/farali", "category-farali-hero-bg.png", 1440),
  ...["category-farali-kela-wafers.png", "category-farali-kela-chiwda-tikha.png", "category-farali-chiwda-tikha.png", "category-farali-chiwda-mitha.png", "category-farali-kela-chiwda-mitha.png"].map((name) => image("/farali", name, 640)),
];

const RAW_HERO_ASSETS = [
  { route: "/", url: heroExploreIconUrl },
  { route: "/", url: flavorArrowPrevUrl },
  { route: "/", url: flavorArrowNextUrl },
  { route: "/exports", url: "/data/world-countries.geojson" },
  { route: "/exports", url: worldMapReferenceUrl },
];

const DESKTOP_RAW_CATEGORY_ASSETS = [
  { route: "/chikki", url: chikkiWaveUrl },
  { route: "/chikki", url: chikkiAccentUrl },
  { route: "/khakhra", url: khakhraWaveUrl },
];

const ROUTE_MODULES = [
  { route: "/about", load: () => import("./pages/about/AboutPage.jsx") },
  { route: "/exports", load: () => import("./pages/exports/ExportsPage.jsx") },
  { route: "/career", load: () => import("./pages/career/CareerPage.jsx") },
  { route: "/contact", load: () => import("./pages/contact/ContactPage.jsx") },
  { route: "/dealers", load: () => import("./pages/dealers/DealersPage.jsx") },
  { route: "/achievements", load: () => import("./pages/achievements/AchievementsPage.jsx") },
  { route: "/products", load: () => import("./pages/category/CategoryPage.jsx") },
  { route: "/investor", load: () => import("./pages/investor/InvestorLayout.jsx") },
  { route: "/investor", load: () => import("./pages/investor/investor-pages.js") },
];

export const SITE_BOOTSTRAP_METADATA = Object.freeze({
  seo: SEO_METADATA_BY_PATH,
  routeCount: Object.keys(SEO_METADATA_BY_PATH).length,
  routeModules: ROUTE_MODULES.map(({ route }) => route),
});

let bootstrapPromise;
let bootstrapSnapshot = {
  completed: 0,
  total: 1,
  progress: 0,
  label: "Reading the menu...",
};
const bootstrapListeners = new Set();

function publishBootstrapSnapshot(next) {
  bootstrapSnapshot = { ...bootstrapSnapshot, ...next };
  bootstrapListeners.forEach((listener) => listener(bootstrapSnapshot));
}

export function subscribeToSiteBootstrap(listener) {
  bootstrapListeners.add(listener);
  listener(bootstrapSnapshot);
  return () => bootstrapListeners.delete(listener);
}

function normalizedCurrentPath() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path.startsWith("/investor/")) return "/investor";
  if (path === "/dealer") return "/dealers";
  if (path === "/bevereges") return "/beverages";
  return path;
}

function selectResponsiveUrl({ name, mobileWidth, desktopWidth }, isMobile) {
  const entry = imageManifest[name];
  const variants = entry?.avif?.length ? entry.avif : entry?.webp || [];
  const targetWidth = isMobile ? mobileWidth : desktopWidth;
  return variants.find(({ w }) => w >= targetWidth)?.src || variants.at(-1)?.src;
}

function createAssetTasks() {
  const isMobile = window.matchMedia("(max-width: 999px)").matches;
  const currentPath = normalizedCurrentPath();
  const responsiveImages = [
    ...SHARED_AND_PAGE_HERO_IMAGES,
    ...(isMobile ? MOBILE_CATEGORY_HERO_IMAGES : DESKTOP_CATEGORY_HERO_IMAGES),
  ];
  const rawAssets = [
    ...RAW_HERO_ASSETS,
    ...(!isMobile ? DESKTOP_RAW_CATEGORY_ASSETS : []),
  ];
  const rank = ({ route }) => route === currentPath ? 0 : route === "*" ? 1 : route === "/" ? 2 : 3;
  const bestEntryByUrl = new Map();
  const candidates = [
    ...responsiveImages.map((entry) => ({
      route: entry.route,
      url: selectResponsiveUrl(entry, isMobile),
    })),
    ...rawAssets,
  ].filter(({ url }) => url);

  candidates.forEach((entry) => {
    const existing = bestEntryByUrl.get(entry.url);
    if (!existing || rank(entry) < rank(existing)) bestEntryByUrl.set(entry.url, entry);
  });

  return [...bestEntryByUrl.values()]
    .sort((left, right) => rank(left) - rank(right))
    .map(({ url }) => async () => {
      const response = await fetch(url, {
        cache: "force-cache",
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error(`Bootstrap asset failed (${response.status}): ${url}`);
      await response.blob();
    });
}

async function runWithConcurrency(tasks, concurrency, onSettled) {
  let nextIndex = 0;
  const worker = async () => {
    while (nextIndex < tasks.length) {
      const task = tasks[nextIndex];
      nextIndex += 1;
      try {
        await task();
      } catch {
        // A missing optional asset must never strand the visitor on the loader.
      } finally {
        onSettled();
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker()),
  );
}

async function runSiteBootstrap() {
  const assetTasks = createAssetTasks();
  const routeTasks = ROUTE_MODULES.map(({ load }) => load);
  const total = assetTasks.length + routeTasks.length;
  let completed = 0;

  publishBootstrapSnapshot({
    completed,
    total,
    progress: 0.03,
    label: `Preparing ${SITE_BOOTSTRAP_METADATA.routeCount} routes...`,
  });

  const onSettled = () => {
    completed += 1;
    const ratio = total ? completed / total : 1;
    publishBootstrapSnapshot({
      completed,
      total,
      progress: 0.03 + ratio * 0.92,
      label: ratio < 0.55 ? "Stocking every hero..." : "Warming every flavour...",
    });
  };

  const connection = navigator.connection;
  const assetConcurrency = connection?.effectiveType === "2g" ? 3 : 6;
  await Promise.all([
    runWithConcurrency(assetTasks, assetConcurrency, onSettled),
    runWithConcurrency(routeTasks, 3, onSettled),
  ]);

  publishBootstrapSnapshot({ completed: total, total, progress: 0.96, label: "Finishing the crunch..." });
  return { assetCount: assetTasks.length, routeModuleCount: routeTasks.length };
}

export function startSiteBootstrap() {
  if (!bootstrapPromise) bootstrapPromise = runSiteBootstrap();
  return bootstrapPromise;
}
