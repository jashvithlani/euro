import { forwardRef, useLayoutEffect, useRef } from "react";
import "./CategoryPage.css";
import ProductSubNav from "../../components/ProductSubNav.jsx";
import CategoryProductShopButton from "./CategoryProductShopButton.jsx";
import { useCategoryTileHeight } from "./useCategoryTileHeight.js";
import { useCategoryProductShopReveal } from "./useCategoryProductShopReveal.js";
import { beveragesPage } from "./beverages-content.jsx";
import { faraliPage } from "./farali-content.js";
import { getmorePage } from "./getmore-content.jsx";
import { namkeenPage } from "./namkeen-content.jsx";
import { chikkiPage } from "./chikki-content.jsx";
import { khakhraPage } from "./khakhra-content.jsx";
import { bakeryPage } from "./bakery-content.jsx";
import { fryumsPage } from "./fryums-content.jsx";
import { asset } from './asset.js';
import { productColors } from './product-colors.js';
import BaseOptimizedImage from '../../components/OptimizedImage.jsx';

const CATEGORY_IMAGE_TIERS = {
  card: { mobileWidth: 480, tabletWidth: 640, desktopWidth: 768 },
  feature: { mobileWidth: 480, tabletWidth: 640, desktopWidth: 960 },
  spotlight: { mobileWidth: 320, tabletWidth: 480, desktopWidth: 480 },
  decor: { mobileWidth: 240, tabletWidth: 320, desktopWidth: 480 },
  heroProduct: { mobileWidth: 320, tabletWidth: 480, desktopWidth: 640 },
  heroComposite: { mobileWidth: 768, tabletWidth: 960, desktopWidth: 960 },
  heroBackground: { mobileWidth: 768, tabletWidth: 1200, desktopWidth: 1440 },
};

const OptimizedImage = forwardRef(function CategoryOptimizedImage(
  { tier = "card", loading = "eager", ...props },
  ref,
) {
  return (
    <BaseOptimizedImage
      ref={ref}
      {...CATEGORY_IMAGE_TIERS[tier]}
      loading={loading}
      {...props}
    />
  );
});

/* Look up a card's dominant product colour from the precomputed map.
   item.image is a fully-resolved URL (asset() uses new URL(...).href),
   so we extract just the filename to key into productColors.

   In dev the URL is the raw source filename (e.g. "name.png"); in the
   production build Vite injects an 8-char content hash before the
   extension (e.g. "name-Bxy123Zw.png"). Try the raw filename first,
   then strip a trailing "-XXXXXXXX" hash and retry — so prod and dev
   both hit the unhashed keys in product-colors.js. */
function getProductColor(imageUrl) {
  if (!imageUrl) return undefined;
  const filename = imageUrl.split('/').pop().split('?')[0];
  const direct = productColors[filename];
  if (direct) return direct;
  const unhashed = filename.replace(/-[A-Za-z0-9_-]{8}(\.[a-z]+)$/i, '$1');
  return productColors[unhashed];
}

const originalCategoryHeroBottom = 695.37;
/* Chips top-nav hero: top 152px + height 372.67px → 524.67px bottom, 26px gap to row 1. */
const categoryHeroBottom = 524.67;
const categoryFirstSectionTop = 550.67;

function parseAuthoredTop(top) {
  if (typeof top === "number") return top;
  if (typeof top === "string" && top.endsWith("px") && !top.includes("calc")) {
    return parseFloat(top);
  }
  return null;
}

function resolveAuthoredTop(top, shiftUp = 0) {
  const parsed = parseAuthoredTop(top);
  if (parsed === null) return null;
  if (typeof top === "number") {
    return categoryHeroBottom + (parsed - originalCategoryHeroBottom - shiftUp);
  }
  return parsed;
}

function shiftAuthoredTop(top, delta) {
  const parsed = parseAuthoredTop(top);
  if (parsed === null) return top;
  const shifted = parsed + delta;
  if (typeof top === "number") return shifted;
  return `${Number(shifted.toFixed(3))}px`;
}

function normalizeToChipsSpacing(page, pageKey, shiftUp = 0) {
  /* Taller hero bands keep their authored section spacing from content files. */
  if (pageKey === "chikki" || pageKey === "bakery" || pageKey === "khakhra") return page;

  const sectionTops = page.sections
    .map((section) => resolveAuthoredTop(section.top, shiftUp))
    .filter((top) => top !== null);

  if (sectionTops.length === 0) return page;

  const delta = Number((categoryFirstSectionTop - Math.min(...sectionTops)).toFixed(3));
  if (Math.abs(delta) < 0.5) return page;

  return {
    ...page,
    height: shiftAuthoredTop(page.height, delta),
    newsletter: page.newsletter
      ? { ...page.newsletter, top: shiftAuthoredTop(page.newsletter.top, delta) }
      : page.newsletter,
    sections: page.sections.map((section) => ({
      ...section,
      top: shiftAuthoredTop(section.top, delta),
    })),
  };
}

const pages = {
  chips: {
    title: "Chips",
    copy: (
      <>
        Not just a snack — a crafted crunch of bold Indian spices.
        <br />
        Every bite delivers rich flavor and pure indulgence.
      </>
    ),
    badge: "FRESHLY PACKED",
    height: "1663px",
    hero: {
      mode: "chipsWide",
    },
    heroClassName: "category-hero--chips-top-nav",
    subnavPlacement: "top",
    newsletter: { top: "1411.33px", left: 22, background: "#d8efcf", className: "category-newsletter--chips-compact" },
    sections: [
      {
        type: "imageCard",
        left: 65.33,
        top: "550.67px",
        width: 370,
        height: 259.33,
        background: "radial-gradient(circle, #fed1bc 0%, #febf94 50%, #fdac6b 100%)",
        image: asset('category-chips-wide-card-masti.png'),
        imageStyle: { left: 96.17, top: -5.83, width: 281.99, height: 278.99 },
        badge: { label: "BEST SELLER", tone: "gold", style: { left: 21.33, top: 222 } },
        title: "Masti Masala",
        titleClass: "text-white product-title-shadow product-title-chips-card",
        titleStyle: { left: 21.33, top: 14.67, width: 219.33 },
      },
      {
        type: "imageCard",
        left: 453.99,
        top: "550.67px",
        width: 370,
        height: 259.33,
        background: "radial-gradient(circle at 50% 50%, #fed1bc 0%, #febf94 50%, #fdac6b 100%)",
        image: asset('category-chips-wide-card-onion.png'),
        imageStyle: { left: 90.66, top: -8.18, width: 289.01, height: 287.01 },
        title: "Cream’n Onion",
        titleClass: "text-white product-title-shadow product-title-chips-card",
        titleStyle: { left: 21.33, top: 14.67, width: 219.33 },
      },
      {
        type: "imageCard",
        left: 65.33,
        top: "836px",
        width: 370,
        height: 242,
        background: "radial-gradient(circle, #fed1bc 0%, #febf94 50%, #fdac6b 100%)",
        image: asset('category-chips-wide-card-salted.png'),
        imageStyle: { left: 136.15, top: 11, width: 199.67, height: 230.67 },
        title: "Classic Salted",
        titleClass: "text-red product-title-chips-salted",
        titleStyle: { left: 21.33, top: 14.67, width: 162 },
      },
      {
        type: "promo",
        left: 454,
        top: "829.33px",
        width: 760.67,
        height: 248.67,
        className: "category-promo--chips-compact",
        background: "#be004b",
        color: "#fff7f7",
        buttonColor: "#be004b",
        ghost: "Chips",
        title: "The Secret Behind Every Perfect Crunch",
        copy: "Handpicked potatoes, precision fried with signature seasoning — delivering that perfect crisp and bold flavor in every bite.",
      },
      {
        type: "imageCard",
        left: 844.67,
        top: "547.33px",
        width: 370,
        height: 259.33,
        background: "radial-gradient(circle at 50% 50%, #fed1bc 0%, #febf94 50%, #fdac6b 100%)",
        image: asset('category-chips-wide-card-tomato.png'),
        imageStyle: { left: 97.4, top: -13.6, width: 286.53, height: 286.53 },
        title: "Tingling Tomato",
        titleClass: "text-white product-title-shadow product-title-chips-card",
        titleStyle: { left: 21.33, top: 14.67, width: 219.33, letterSpacing: "-1.2px" },
      },
      {
        type: "feature",
        left: 371.56,
        top: "1094px",
        width: 554,
        height: 292,
        className: "category-feature--chips-wide",
        background: "radial-gradient(circle at 50% 50%, #ffece8 0%, #ffcda6 100%)",
        kicker: "LIMITED EDITION",
        kickerColor: "#ce0603",
        title: "Euro’s\nChilli\nMadness",
        titleColor: "#ce0603",
        copy: "Extra thick, extra crunchy,\nextra flavor.",
        buttonColor: "#ce0603",
        buttonLabel: "Know more",
        image: asset('category-chips-wide-card-chilli.png'),
        imageStyle: { left: 215.91, top: 22, width: 241.5, height: 291.27 },
      },
    ],
  },
  beverages: beveragesPage,
  getmore: getmorePage,
  namkeen: namkeenPage,
  chikki: chikkiPage,
  khakhra: khakhraPage,
  bakery: bakeryPage,
  fryums: fryumsPage,
  farali: faraliPage,
};

function cssLength(value) {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function offsetFromHeroBottom(value) {
  if (typeof value !== "number") return value;

  const offset = Number((value - originalCategoryHeroBottom).toFixed(3));
  return `calc(var(--home-hero-height, 720px) + ${offset}px)`;
}

function offsetFromHeroBottomNamkeen(value, shiftUp) {
  if (typeof value !== "number") return value;

  const offset = Number((value - originalCategoryHeroBottom - shiftUp).toFixed(3));
  return `calc(var(--home-hero-height, 720px) + ${offset}px)`;
}

function applyTopHeroLayout(page, pageKey) {
  const shiftUp = page.compactContentShift ?? 0;
  const normalized = normalizeToChipsSpacing(page, pageKey, pageKey === "namkeen" ? shiftUp : 0);

  if (pageKey !== "namkeen") {
    return {
      ...normalized,
      height: offsetFromHeroBottom(normalized.height),
      newsletter: normalized.newsletter
        ? { ...normalized.newsletter, top: offsetFromHeroBottom(normalized.newsletter.top) }
        : normalized.newsletter,
      sections: normalized.sections.map((section) => ({
        ...section,
        top: offsetFromHeroBottom(section.top),
      })),
    };
  }

  return {
    ...normalized,
    height: offsetFromHeroBottomNamkeen(normalized.height, shiftUp),
    newsletter: normalized.newsletter
      ? { ...normalized.newsletter, top: offsetFromHeroBottomNamkeen(normalized.newsletter.top, shiftUp) }
      : normalized.newsletter,
    sections: normalized.sections.map((section) => ({
      ...section,
      top: offsetFromHeroBottomNamkeen(section.top, shiftUp),
    })),
  };
}

function boxStyle({ left, top, width, height }) {
  return {
    left: cssLength(left),
    top: cssLength(top),
    width: cssLength(width),
    height: cssLength(height),
  };
}

function layerStyle({ left, top, width, height, ...rest }) {
  return {
    ...boxStyle({ left, top, width, height }),
    ...rest,
  };
}

function CategoryHero({ page }) {
  return (
    <section className={`category-hero ${page.heroClassName || ""}`} aria-labelledby={`${page.title.toLowerCase()}-title`}>
      <HeroVisual hero={page.hero} />
      {page.badge ? <span className="category-hero-badge">{page.badge}</span> : null}
      <h1 id={`${page.title.toLowerCase()}-title`}>{page.title}</h1>
      <p>{page.copy}</p>
    </section>
  );
}

function HeroVisual({ hero }) {
  if (hero.mode === "getmoreWide") {
    return (
      <div className="category-hero-custom category-hero-getmore-wide" aria-hidden="true">
        <OptimizedImage tier="heroBackground" desktopOnly fileName="category-getmore-hero-bg.png" className="getmore-wide-hero-bg" src={asset("category-getmore-hero-bg.png")} alt="" sizes="1284px" priority />
        <OptimizedImage tier="decor" desktopOnly fileName="category-getmore-line-red.png" className="getmore-wide-line getmore-wide-line-red" src={asset("category-getmore-line-red.png")} alt="" sizes="200px" />
        <OptimizedImage tier="decor" desktopOnly fileName="category-getmore-line-blue.png" className="getmore-wide-line getmore-wide-line-blue" src={asset("category-getmore-line-blue.png")} alt="" sizes="200px" />
        <OptimizedImage tier="heroProduct" desktopOnly className="getmore-wide-pack getmore-wide-pack-tomato" src={asset("category-getmore-tomato.png")} alt="" sizes="240px" />
        <OptimizedImage tier="heroProduct" desktopOnly className="getmore-wide-pack getmore-wide-pack-chatpata" src={asset("category-getmore-chatpata.png")} alt="" sizes="240px" />
      </div>
    );
  }

  if (hero.mode === "farali") {
    return (
      <div className="category-hero-custom category-hero-farali" aria-hidden="true" data-node-id="1159:473">
        <OptimizedImage tier="heroBackground" desktopOnly className="farali-hero-bg" src={asset("category-farali-hero-bg.png")} alt="" sizes="1284px" priority />
        <div className="farali-hero-products category-orbit-ring">
          {[0, 1, 2, 3].flatMap((copy) => [
            { cls: 'farali-pack-wafer',       img: 'category-farali-kela-wafers.png' },
            { cls: 'farali-pack-kela-tikha',  img: 'category-farali-kela-chiwda-tikha.png' },
            { cls: 'farali-pack-tikha',       img: 'category-farali-chiwda-tikha.png' },
            { cls: 'farali-pack-mitha',       img: 'category-farali-chiwda-mitha.png' },
            { cls: 'farali-pack-kela-mitha',  img: 'category-farali-kela-chiwda-mitha.png' },
          ].map((p, i) => {
            const slot = copy * 5 + i;
            return (
              <OptimizedImage
                tier="heroProduct"
                desktopOnly
                key={`${p.cls}-${copy}`}
                className={`farali-hero-pack category-orbit-pack ${p.cls}`}
                src={asset(p.img)}
                alt=""
                sizes="(max-width: 999px) 30vw, 200px"
                style={{ '--slot': slot }}
              />
            );
          }))}
        </div>
      </div>
    );
  }

  if (hero.mode === "namkeen") {
    return (
      <div className="category-hero-custom category-hero-namkeen" aria-hidden="true" data-node-id="1206:104">
        <OptimizedImage tier="heroBackground" desktopOnly className="namkeen-hero-bg" src={asset("category-namkeen-hero-bg.png")} alt="" sizes="1284px" priority />
        <div className="namkeen-hero-products category-orbit-ring">
          {[0, 1, 2, 3].flatMap((copy) => [
            { cls: 'namkeen-pack-all-in-one', img: 'category-namkeen-all-in-one.png' },
            { cls: 'namkeen-pack-chakhna',    img: 'category-namkeen-chakhna-mix.png' },
            { cls: 'namkeen-pack-papad',      img: 'category-namkeen-papad-chavana.png' },
            { cls: 'namkeen-pack-gathiya',    img: 'category-namkeen-bhavnagari-gathiya.png' },
            { cls: 'namkeen-pack-sev-mamra',  img: 'category-namkeen-masala-sev-mamra.png' },
          ].map((p, i) => {
            const slot = copy * 5 + i;
            return (
              <OptimizedImage
                tier="heroProduct"
                desktopOnly
                key={`${p.cls}-${copy}`}
                className={`namkeen-hero-pack category-orbit-pack ${p.cls}`}
                src={asset(p.img)}
                alt=""
                sizes="(max-width: 999px) 30vw, 200px"
                style={{ '--slot': slot }}
              />
            );
          }))}
        </div>
      </div>
    );
  }

  if (hero.mode === "chikki") {
    return (
      <div className="category-hero-custom category-hero-chikki" aria-hidden="true" data-node-id="1217:1021">
        <div className="chikki-hero-wave-frame">
          <img className="chikki-hero-wave" src={asset("category-chikki-figma-wave.svg")} alt="" />
        </div>
        <img className="chikki-hero-accent" src={asset("category-chikki-figma-accent.svg")} alt="" />
        <div className="chikki-hero-products">
          <OptimizedImage tier="heroComposite" desktopOnly className="chikki-hero-products-img" src={asset("category-chikki-figma-products.png")} alt="" sizes="600px" priority />
        </div>
      </div>
    );
  }

  if (hero.mode === "khakhra") {
    const packs = [
      { key: "7grain", img: "category-khakhra-7grain.png" },
      { key: "panipuri", img: "category-khakhra-panipuri.png" },
      { key: "fafda", img: "category-khakhra-fafda.png" },
      { key: "jeera", img: "category-khakhra-jeera.png" },
      { key: "masala", img: "category-khakhra-masala.png" },
    ];

    return (
      <div className="category-hero-custom category-hero-khakhra" aria-hidden="true" data-node-id="1218:1233">
        <div className="khakhra-hero-wave-frame">
          <img className="khakhra-hero-wave" src={asset("category-khakhra-figma-wave.svg")} alt="" />
        </div>
        <div className="khakhra-hero-ring">
          {[0, 1, 2, 3, 4, 5].flatMap((copy) =>
            packs.map((pack, i) => {
              const slot = copy * packs.length + i;
              return (
                <span
                  key={`${pack.key}-${copy}`}
                  className={`khakhra-hero-pack khakhra-orbit-pack khakhra-pack-${pack.key} khakhra-art-${pack.key}`}
                  style={{ "--slot": slot }}
                >
                  <OptimizedImage tier="heroProduct" desktopOnly src={asset(pack.img)} alt="" sizes="200px" priority={copy === 0 && i === 0} />
                </span>
              );
            })
          )}
        </div>
      </div>
    );
  }

  if (hero.mode === "bakery") {
    return (
      <div className="category-hero-custom category-hero-bakery" aria-hidden="true">
        <span className="bakery-hero-curve" />
        <OptimizedImage tier="heroProduct" desktopOnly className="bakery-hero-pack bakery-pack-plain" src={asset('category-bakery-plain-khari.png')} alt="" sizes="280px" priority />
        <OptimizedImage tier="heroProduct" desktopOnly className="bakery-hero-pack bakery-pack-coconut" src={asset('category-bakery-coconut-nankhatai.png')} alt="" sizes="280px" />
        <OptimizedImage tier="heroProduct" desktopOnly className="bakery-hero-pack bakery-pack-methi" src={asset('category-bakery-methi-khari.png')} alt="" sizes="280px" />
      </div>
    );
  }

  if (hero.mode === "fryums") {
    const packs = [
      { key: "cone", img: "category-fryums-cone-cap.png" },
      { key: "magic", img: "category-fryums-magic-abcde.png" },
      { key: "noodles", img: "category-fryums-noodles-sticks.png" },
      { key: "pasta", img: "category-fryums-tasty-pasta.png" },
      { key: "cups", img: "category-fryums-crunchy-cups.png" },
    ];

    return (
      <div className="category-hero-custom category-hero-fryums" aria-hidden="true" data-node-id="1246:2362">
        <OptimizedImage tier="heroBackground" desktopOnly className="fryums-hero-bg" src={asset("category-fryums-figma-wave.png")} alt="" sizes="1284px" priority />
        <div className="fryums-hero-ring">
          {[0, 1, 2, 3, 4].flatMap((copy) =>
            packs.map((pack, i) => {
              const slot = copy * packs.length + i;
              return (
                <OptimizedImage
                  tier="heroProduct"
                  desktopOnly
                  key={`${pack.key}-${copy}`}
                  className={`fryums-hero-pack fryums-orbit-pack fryums-pack-${pack.key}`}
                  src={asset(pack.img)}
                  alt=""
                  sizes="(max-width: 999px) 30vw, 200px"
                  style={{ "--slot": slot }}
                />
              );
            })
          )}
        </div>
      </div>
    );
  }

  if (hero.mode === "chipsWide") {
    return (
      <div className="category-hero-custom category-hero-chips-wide" aria-hidden="true">
        <OptimizedImage tier="heroBackground" desktopOnly className="chips-wide-hero-bg" src={asset('category-chips-wide-hero-bg.png')} alt="" sizes="1284px" priority />
        <div className="chips-wide-hero-ring">
          {/* 10 slots = the 5 packs duplicated in the same order. The
              ring rotates as a unit; the duplicates fill the loop so
              when a pack exits visibility on one side, its twin enters
              from the other side seamlessly. */}
          {[0, 1, 2, 3].flatMap((copy) => [
            { key: 'salted', img: 'category-chips-wide-hero-salted.png' },
            { key: 'tomato', img: 'category-chips-wide-hero-tomato.png' },
            { key: 'masti',  img: 'category-chips-wide-hero-masti.png' },
            { key: 'onion',  img: 'category-chips-wide-hero-onion.png' },
            { key: 'chilli', img: 'category-chips-wide-hero-chilli.png' },
          ].map((p, i) => {
            const slot = copy * 5 + i;
            return (
              <OptimizedImage
                tier="heroProduct"
                desktopOnly
                key={`${p.key}-${copy}`}
                className={`chips-wide-hero-pack chips-wide-pack-${p.key} chips-wide-slot-${slot}`}
                src={asset(p.img)}
                alt=""
                sizes="(max-width: 999px) 30vw, 200px"
                style={{ '--slot': slot }}
              />
            );
          }))}
        </div>
      </div>
    );
  }

  if (hero.mode === "beveragesWide") {
    return (
      <div className="category-hero-custom category-hero-beverages-wide" aria-hidden="true">
        <OptimizedImage tier="heroBackground" desktopOnly className="beverages-wide-hero-bg" src={asset('category-beverages-hero-shape.png')} alt="" sizes="1284px" priority />
        <div className="beverages-orbit-ring">
          {[0, 1, 2, 3].flatMap((copy) => [
            /* Bottles + order from Figma frame 1131:3426 — left to right:
               Guava, Sparker, Lemoni, Orange Tango, Mango. Assets
               downloaded fresh from that Figma frame.
               NOTE: beverages uses its OWN orbit classes
               (beverages-orbit-ring / beverages-orbit-pack), separate
               from the shared .category-orbit-* used by the other
               carousel pages, so tweaks to bottle size, radius, or
               centre stay isolated. */
            { cls: 'beverages-pack-guava',   img: 'category-beverage-fig-guava.png' },
            { cls: 'beverages-pack-sparker', img: 'category-beverage-fig-sparker.png' },
            { cls: 'beverages-pack-lemoni',  img: 'category-beverage-fig-lemoni.png' },
            { cls: 'beverages-pack-orange',  img: 'category-beverage-fig-orange.png' },
            { cls: 'beverages-pack-mango',   img: 'category-beverage-fig-mango.png' },
          ].map((p, i) => {
            const slot = copy * 5 + i;
            return (
              <OptimizedImage
                tier="heroProduct"
                desktopOnly
                key={`${p.cls}-${copy}`}
                className={`beverages-orbit-pack beverages-hero-pack ${p.cls}`}
                src={asset(p.img)}
                alt=""
                sizes="(max-width: 999px) 30vw, 200px"
                style={{ '--slot': slot }}
              />
            );
          }))}
        </div>
      </div>
    );
  }

  return <OptimizedImage tier="heroBackground" desktopOnly className={`category-hero-visual ${hero.className || ""}`} src={hero.image} alt="" aria-hidden="true" sizes="1284px" priority />;
}

function Badge({ badge }) {
  if (!badge) return null;
  return (
    <span className={`category-product-badge category-product-badge--${badge.tone || "pink"}`} style={layerStyle(badge.style || {})}>
      {badge.label}
    </span>
  );
}

function applyImportantStyle(el, importantStyle) {
  if (!el || !importantStyle) return;

  for (const [key, value] of Object.entries(importantStyle)) {
    if (value == null) {
      el.style.removeProperty(key);
      continue;
    }

    el.style.setProperty(key, cssLength(value), "important");
  }
}

function ProductTitle({ title, className, style, importantStyle }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    applyImportantStyle(ref.current, importantStyle);
  }, [importantStyle, style]);

  return (
    <h2
      ref={ref}
      className={`category-product-title ${className || ""}`}
      style={layerStyle(style || {})}
    >
      {title.split("\n").map((line, index) => (
        <span key={`${line}-${index}`}>{line}</span>
      ))}
    </h2>
  );
}

function ProductSubtitle({ subtitle, style }) {
  return (
    <p className="category-product-subtitle" style={layerStyle(style || {})}>
      {subtitle}
    </p>
  );
}

function DecorativeLayers({ decorations }) {
  if (!decorations?.length) return null;

  return decorations.map((decor, index) => (
    <span
      key={`${decor.className || "decor"}-${index}`}
      className={`category-card-decor ${decor.className || ""}`}
      style={layerStyle(decor.style || {})}
      aria-hidden="true"
    >
      <OptimizedImage tier="decor" src={decor.image} alt="" sizes="(max-width: 999px) 30vw, 200px" />
    </span>
  ));
}

function ProductImage({ item, priority = false }) {
  const desktopImgRef = useRef(null);

  useLayoutEffect(() => {
    applyImportantStyle(desktopImgRef.current, item.imageImportantStyle);
  }, [item.imageImportantStyle, item.imageStyle]);

  if (item.imageInnerStyle) {
    return (
      <span className="category-product-img category-product-img-frame" style={layerStyle(item.imageStyle)}>
        <OptimizedImage
          src={item.image}
          alt=""
          priority={priority}
          style={layerStyle(item.imageInnerStyle)}
          sizes="(max-width: 768px) 92vw, 370px"
        />
      </span>
    );
  }

  return (
    <>
      <OptimizedImage
        ref={desktopImgRef}
        className={`category-product-img ${item.mobileImage ? "category-product-img--responsive" : "category-product-img--desktop"}`}
        src={item.image}
        mobileSrc={item.mobileImage}
        alt=""
        priority={priority}
        style={layerStyle(item.imageStyle)}
        sizes="(max-width: 768px) 92vw, 370px"
        mobileSizes="(max-width: 768px) 92vw, 280px"
      />
    </>
  );
}

function ImageCard({ item, priority = false }) {
  const tileRef = useRef(null);
  const productColor = getProductColor(item.image);
  useCategoryTileHeight(tileRef);
  useCategoryProductShopReveal(tileRef);

  return (
    <article
      ref={tileRef}
      className="category-product-card category-product-card--image"
      style={{ ...boxStyle(item), background: item.background, ...(productColor ? { "--product-color": productColor } : {}) }}
    >
      <OptimizedImage
        className={`category-product-cover ${item.imageStyle ? "category-product-cover--positioned" : ""}`}
        src={item.image}
        alt=""
        priority={priority}
        style={item.imageStyle ? layerStyle(item.imageStyle) : undefined}
        sizes="(max-width: 768px) 92vw, 370px"
      />
      <Badge badge={item.badge} />
      {item.title ? (
        <ProductTitle
          title={item.title}
          className={item.titleClass}
          style={item.titleStyle}
          importantStyle={item.titleImportantStyle}
        />
      ) : null}
      <CategoryProductShopButton />
    </article>
  );
}

function ProductCard({ item, priority = false }) {
  const tileRef = useRef(null);
  const productColor = getProductColor(item.image);
  useCategoryTileHeight(tileRef);
  useCategoryProductShopReveal(tileRef);

  return (
    <article
      ref={tileRef}
      className={`category-product-card category-product-card--product${item.ring ? " category-product-card--ring" : ""}`}
      style={{ ...boxStyle(item), background: item.background, ...(productColor ? { "--product-color": productColor } : {}) }}
      {...(item.nodeId ? { "data-node-id": item.nodeId } : {})}
    >
      {item.ring && (
        <img className="category-product-ring" src={asset('category-namkeen-royal-card-ring.svg')} alt="" aria-hidden="true" />
      )}
      <DecorativeLayers decorations={item.decorations} />
      <ProductImage item={item} priority={priority} />
      <Badge badge={item.badge} />
      {item.title ? (
        <ProductTitle
          title={item.title}
          className={item.titleClass}
          style={item.titleStyle}
          importantStyle={item.titleImportantStyle}
        />
      ) : null}
      {item.subtitle ? <ProductSubtitle subtitle={item.subtitle} style={item.subtitleStyle} /> : null}
      <CategoryProductShopButton />
    </article>
  );
}

function PromoPanel({ item }) {
  return (
    <section
      className={`category-promo ${item.className || ""}`}
      style={{ ...boxStyle(item), background: item.background, color: item.color }}
      aria-label={item.title}
      {...(item.nodeId ? { "data-node-id": item.nodeId } : {})}
    >
      <span className="category-promo-ghost">{item.ghost}</span>
      <div className="category-promo-copy">
        <h2>
          {item.title.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p style={{ color: item.copyColor || item.color, marginBottom: 0 }}>{item.copy}</p>
      </div>
    </section>
  );
}

function FeatureImage({ item, priority = false }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    applyImportantStyle(ref.current, item.imageImportantStyle);
  }, [item.imageImportantStyle, item.imageStyle]);

  return (
    <OptimizedImage
      tier="feature"
      ref={ref}
      className={`category-feature-img ${item.mobileImage ? "category-feature-img--responsive" : "category-feature-img--desktop"}`}
      src={item.image}
      mobileSrc={item.mobileImage}
      alt=""
      priority={priority}
      style={layerStyle(item.imageStyle)}
      sizes="(max-width: 768px) 92vw, 560px"
      mobileSizes="(max-width: 768px) 92vw, 280px"
    />
  );
}

function FeatureCard({ item, priority = false }) {
  const tileRef = useRef(null);
  const productColor = getProductColor(item.image);
  useCategoryTileHeight(tileRef);
  useCategoryProductShopReveal(tileRef);

  return (
    <article
      ref={tileRef}
      className={`category-feature ${item.className || ""}`}
      style={{ ...boxStyle(item), background: item.background, ...(productColor ? { "--product-color": productColor } : {}) }}
    >
      <DecorativeLayers decorations={item.decorations} />
      <div className="category-feature-copy">
        <span style={{ color: item.kickerColor }}>{item.kicker}</span>
        <h2 style={{ color: item.titleColor }}>
          {item.title.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        {item.copy ? <p>{item.copy}</p> : null}
      </div>
      <FeatureImage item={item} priority={priority} />
      {item.image ? <CategoryProductShopButton /> : null}
    </article>
  );
}

function ArrowControl({ item }) {
  return (
    <button
      className={`category-side-arrow category-side-arrow--${item.direction}`}
      type="button"
      aria-label={`${item.direction === "left" ? "Previous" : "Next"} products`}
      style={boxStyle({ left: item.left, top: item.top, width: 64, height: 64 })}
    >
      <span aria-hidden="true">{item.direction === "left" ? "<" : ">"}</span>
    </button>
  );
}

function SpotlightStrip({ item }) {
  return (
    <section
      className={`category-spotlight${item.hideOnMobile ? " category-spotlight--hide-mobile" : ""}`}
      style={{ top: cssLength(item.top) }}
      aria-label="Royal Crunch products"
      {...(item.nodeId ? { "data-node-id": item.nodeId } : {})}
    >
      <div className="category-spotlight-bg" />
      <h2>
        {item.title.split("\n").map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h2>
      <div className="category-spotlight-cards">
        {item.items.map((product) => (
          <article className="category-spotlight-card" key={product.image}>
            <img className="category-spotlight-ring" src={asset('category-namkeen-royal-card-ring.svg')} alt="" aria-hidden="true" />
            <OptimizedImage tier="spotlight" src={product.image} alt="" sizes="(max-width: 768px) 45vw, 260px" />
          </article>
        ))}
      </div>
    </section>
  );
}

function NewsletterPatch({ config }) {
  return (
    <section className={`category-newsletter ${config.className || ""}`} style={{ left: cssLength(config.left), top: cssLength(config.top), background: config.background }}>
      <h2>CRUNCH INBOX</h2>
      <p>
        Get notified about new flavors and exclusive
        <br />
        factory-fresh offers.
      </p>
      <form action="#">
        <input type="email" placeholder="Your crispy email here..." aria-label="Email address" />
        <button type="submit">SUBSCRIBE</button>
      </form>
    </section>
  );
}

function CategorySection({ item, priority = false }) {
  if (item.type === "arrow") return <ArrowControl item={item} />;
  if (item.type === "spotlight") return <SpotlightStrip item={item} />;
  if (item.type === "promo") return <PromoPanel item={item} />;
  if (item.type === "feature") return <FeatureCard item={item} priority={priority} />;
  if (item.type === "productCard") return <ProductCard item={item} priority={priority} />;
  return <ImageCard item={item} priority={priority} />;
}

function prioritizeLeadProductImages(sections, count = 4) {
  let remaining = count;

  return sections.map((section) => {
    const hasLeadImage = Boolean(
      section.image && ["imageCard", "productCard", "feature"].includes(section.type),
    );
    const priority = hasLeadImage && remaining > 0;
    if (priority) remaining -= 1;
    return { section, priority };
  });
}

export default function CategoryPage({ pageKey }) {
  const page = applyTopHeroLayout(pages[pageKey] || pages.chips, pageKey);
  const prioritizedSections = prioritizeLeadProductImages(page.sections);

  return (
    <main className={`category-main category-main--${pageKey}`} aria-label={`${page.title} category page`} style={{ height: cssLength(page.height) }}>
      <CategoryHero page={page} />
      <ProductSubNav active={pageKey} placement={page.subnavPlacement === "top" ? "top" : "default"} />
      {prioritizedSections.map(({ section, priority }, index) => (
        <CategorySection
          key={`${section.type}-${section.left}-${section.top}-${index}`}
          item={section}
          priority={priority}
        />
      ))}
      <NewsletterPatch config={page.newsletter} />
    </main>
  );
}
