import { Link } from "react-router-dom";
import "./CategoryPage.css";
import ProductSubNav from "../../components/ProductSubNav.jsx";
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
/** Compact top-nav hero bottom @ 1280 — matches CategoryPage.css (152 + 372.67). */
const COMPACT_TOP_NAV_HERO_BOTTOM = 524.67;

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
    height: "1628px",
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
        imageStyle: { left: 94.17, top: -16.83, width: 292.99, height: 292.99 },
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
        imageStyle: { left: 90.66, top: -30.18, width: 300.01, height: 300.01 },
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
        background: "radial-gradient(circle at 50% 50%, #fed1bc 0%, #febf94 50%, #fdac6b 100%)",
        image: asset('category-chips-wide-card-salted.png'),
        imageStyle: { left: 136.15, top: 0, width: 248.67, height: 248.67 },
        title: "Classic Salted",
        titleClass: "text-red product-title-chips-salted",
        titleStyle: { left: 21.33, top: 14.67, width: 120 },
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
        imageStyle: { left: 215.91, top: 0, width: 241.5, height: 291.27 },
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

/** Bake absolute tops at 1280 so layout does not drift with viewport --home-hero-height. */
function fixedTopFromHeroLayout(value, shiftUp = 0) {
  if (typeof value !== "number") return value;

  const offset = Number((value - originalCategoryHeroBottom - shiftUp).toFixed(3));
  return `${Number((COMPACT_TOP_NAV_HERO_BOTTOM + offset).toFixed(3))}px`;
}

function applyTopHeroLayout(page, pageKey) {
  const shiftUp = pageKey === "namkeen" ? (page.compactContentShift ?? 0) : 0;

  return {
    ...page,
    height: fixedTopFromHeroLayout(page.height, shiftUp),
    newsletter: page.newsletter
      ? { ...page.newsletter, top: fixedTopFromHeroLayout(page.newsletter.top, shiftUp) }
      : page.newsletter,
    sections: page.sections.map((section) => ({
      ...section,
      top: fixedTopFromHeroLayout(section.top, shiftUp),
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
        <img className="getmore-wide-hero-bg" src={asset("category-getmore-hero-bg.png")} alt="" />
        <img className="getmore-wide-line getmore-wide-line-red" src={asset("category-getmore-line-red.png")} alt="" />
        <img className="getmore-wide-line getmore-wide-line-blue" src={asset("category-getmore-line-blue.png")} alt="" />
        <img className="getmore-wide-pack getmore-wide-pack-tomato" src={asset("category-getmore-tomato.png")} alt="" />
        <img className="getmore-wide-pack getmore-wide-pack-chatpata" src={asset("category-getmore-chatpata.png")} alt="" />
      </div>
    );
  }

  if (hero.mode === "farali") {
    return (
      <div className="category-hero-custom category-hero-farali" aria-hidden="true" data-node-id="1159:473">
        <img className="farali-hero-bg" src={asset("category-farali-hero-bg.png")} alt="" />
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
              <img
                key={`${p.cls}-${copy}`}
                className={`farali-hero-pack category-orbit-pack ${p.cls}`}
                src={asset(p.img)}
                alt=""
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
        <img className="namkeen-hero-bg" src={asset("category-namkeen-hero-bg.png")} alt="" />
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
              <img
                key={`${p.cls}-${copy}`}
                className={`namkeen-hero-pack category-orbit-pack ${p.cls}`}
                src={asset(p.img)}
                alt=""
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
      <div className="category-hero-custom category-hero-chikki" aria-hidden="true">
        <img className="chikki-hero-bg" src={asset('category-chikki-hero-bg.svg')} alt="" />
        <img className="chikki-hero-products" src={asset('category-chikki-hero-products.png')} alt="" />
      </div>
    );
  }

  if (hero.mode === "khakhra") {
    return (
      <div className="category-hero-custom category-hero-khakhra" aria-hidden="true">
        <img className="khakhra-hero-bg" src={asset('category-khakhra-hero-bg.svg')} alt="" />
        <div className="category-orbit-ring khakhra-orbit-ring">
          {[0, 1, 2, 3].flatMap((copy) => [
            { cls: 'khakhra-pack-7grain',   img: 'category-khakhra-7grain.png' },
            { cls: 'khakhra-pack-panipuri', img: 'category-khakhra-panipuri.png' },
            { cls: 'khakhra-pack-fafda',    img: 'category-khakhra-fafda.png' },
            { cls: 'khakhra-pack-jeera',    img: 'category-khakhra-jeera.png' },
            { cls: 'khakhra-pack-masala',   img: 'category-khakhra-masala.png' },
          ].map((p, i) => {
            const slot = copy * 5 + i;
            return (
              <img
                key={`${p.cls}-${copy}`}
                className={`khakhra-hero-pack category-orbit-pack ${p.cls}`}
                src={asset(p.img)}
                alt=""
                style={{ '--slot': slot }}
              />
            );
          }))}
        </div>
      </div>
    );
  }

  if (hero.mode === "bakery") {
    return (
      <div className="category-hero-custom category-hero-bakery" aria-hidden="true">
        <span className="bakery-hero-curve" />
        <img className="bakery-hero-pack bakery-pack-plain" src={asset('category-bakery-plain-khari.png')} alt="" />
        <img className="bakery-hero-pack bakery-pack-coconut" src={asset('category-bakery-coconut-nankhatai.png')} alt="" />
        <img className="bakery-hero-pack bakery-pack-methi" src={asset('category-bakery-methi-khari.png')} alt="" />
      </div>
    );
  }

  if (hero.mode === "fryums") {
    return (
      <div className="category-hero-custom category-hero-fryums" aria-hidden="true">
        <img className="fryums-hero-bg" src={asset('category-fryums-hero-bg.png')} alt="" />
        <div className="category-orbit-ring fryums-orbit-ring">
          {[0, 1, 2, 3].flatMap((copy) => [
            { cls: 'fryums-pack-cone',    img: 'category-fryums-cone-cap.png' },
            { cls: 'fryums-pack-magic',   img: 'category-fryums-magic-abcde.png' },
            { cls: 'fryums-pack-noodles', img: 'category-fryums-noodles-sticks.png' },
            { cls: 'fryums-pack-pasta',   img: 'category-fryums-tasty-pasta.png' },
            { cls: 'fryums-pack-cups',    img: 'category-fryums-crunchy-cups.png' },
          ].map((p, i) => {
            const slot = copy * 5 + i;
            return (
              <img
                key={`${p.cls}-${copy}`}
                className={`fryums-hero-pack category-orbit-pack ${p.cls}`}
                src={asset(p.img)}
                alt=""
                style={{ '--slot': slot }}
              />
            );
          }))}
        </div>
      </div>
    );
  }

  if (hero.mode === "chipsWide") {
    return (
      <div className="category-hero-custom category-hero-chips-wide" aria-hidden="true">
        <img className="chips-wide-hero-bg" src={asset('category-chips-wide-hero-bg.png')} alt="" />
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
              <img
                key={`${p.key}-${copy}`}
                className={`chips-wide-hero-pack chips-wide-pack-${p.key} chips-wide-slot-${slot}`}
                src={asset(p.img)}
                alt=""
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
        <img className="beverages-wide-hero-bg" src={asset('category-beverages-hero-shape.png')} alt="" />
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
              <img
                key={`${p.cls}-${copy}`}
                className={`beverages-orbit-pack beverages-hero-pack ${p.cls}`}
                src={asset(p.img)}
                alt=""
                style={{ '--slot': slot }}
              />
            );
          }))}
        </div>
      </div>
    );
  }

  return <img className={`category-hero-visual ${hero.className || ""}`} src={hero.image} alt="" aria-hidden="true" />;
}

function Badge({ badge }) {
  if (!badge) return null;
  return (
    <span className={`category-product-badge category-product-badge--${badge.tone || "pink"}`} style={layerStyle(badge.style || {})}>
      {badge.label}
    </span>
  );
}

function ProductTitle({ title, className, style }) {
  return (
    <h2 className={`category-product-title ${className || ""}`} style={layerStyle(style || {})}>
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

function ImageCard({ item }) {
  const productColor = getProductColor(item.image);
  return (
    <article
      className="category-product-card category-product-card--image"
      style={{ ...boxStyle(item), background: item.background, ...(productColor ? { "--product-color": productColor } : {}) }}
    >
      <img
        className={`category-product-cover ${item.imageStyle ? "category-product-cover--positioned" : ""}`}
        src={item.image}
        alt=""
        style={item.imageStyle ? layerStyle(item.imageStyle) : undefined}
      />
      <Badge badge={item.badge} />
      {item.title ? <ProductTitle title={item.title} className={item.titleClass} style={item.titleStyle} /> : null}
    </article>
  );
}

function ProductCard({ item }) {
  const productColor = getProductColor(item.image);
  return (
    <article
      className={`category-product-card category-product-card--product${item.ring ? " category-product-card--ring" : ""}`}
      style={{ ...boxStyle(item), background: item.background, ...(productColor ? { "--product-color": productColor } : {}) }}
      {...(item.nodeId ? { "data-node-id": item.nodeId } : {})}
    >
      {item.ring && (
        <img className="category-product-ring" src={asset('category-namkeen-royal-card-ring.svg')} alt="" aria-hidden="true" />
      )}
      <img className="category-product-img" src={item.image} alt="" style={layerStyle(item.imageStyle)} />
      <Badge badge={item.badge} />
      {item.title ? <ProductTitle title={item.title} className={item.titleClass} style={item.titleStyle} /> : null}
      {item.subtitle ? <ProductSubtitle subtitle={item.subtitle} style={item.subtitleStyle} /> : null}
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
        <p style={{ color: item.copyColor || item.color }}>{item.copy}</p>
        <Link to="/about" style={{ color: item.buttonColor }}>
          LEARN OUR STORY
        </Link>
      </div>
    </section>
  );
}

function FeatureCard({ item }) {
  const productColor = getProductColor(item.image);
  return (
    <article
      className={`category-feature ${item.className || ""}`}
      style={{ ...boxStyle(item), background: item.background, ...(productColor ? { "--product-color": productColor } : {}) }}
    >
      <div className="category-feature-copy">
        <span style={{ color: item.kickerColor }}>{item.kicker}</span>
        <h2 style={{ color: item.titleColor }}>
          {item.title.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p>{item.copy}</p>
      </div>
      <img src={item.image} alt="" style={layerStyle(item.imageStyle)} />
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
      className="category-spotlight"
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
            <img src={product.image} alt="" />
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

function CategorySection({ item }) {
  if (item.type === "arrow") return <ArrowControl item={item} />;
  if (item.type === "spotlight") return <SpotlightStrip item={item} />;
  if (item.type === "promo") return <PromoPanel item={item} />;
  if (item.type === "feature") return <FeatureCard item={item} />;
  if (item.type === "productCard") return <ProductCard item={item} />;
  return <ImageCard item={item} />;
}

export default function CategoryPage({ pageKey }) {
  const page = applyTopHeroLayout(pages[pageKey] || pages.chips, pageKey);

  return (
    <main className={`category-main category-main--${pageKey}`} aria-label={`${page.title} category page`} style={{ height: cssLength(page.height) }}>
      <CategoryHero page={page} />
      <ProductSubNav active={pageKey} placement={page.subnavPlacement === "top" ? "top" : "default"} />
      {page.sections.map((section, index) => (
        <CategorySection key={`${section.type}-${section.left}-${section.top}-${index}`} item={section} />
      ))}
      <NewsletterPatch config={page.newsletter} />
    </main>
  );
}
