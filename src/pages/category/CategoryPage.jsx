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

const originalCategoryHeroBottom = 695.37;

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
    newsletter: { top: 1411.33, left: 22, background: "#d8efcf", className: "category-newsletter--chips-compact" },
    sections: [
      {
        type: "imageCard",
        left: 65.33,
        top: "550.67px",
        width: 370,
        height: 259.33,
        background: "radial-gradient(circle at 50% 50%, #fed1bc 0%, #febf94 50%, #fdac6b 100%)",
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
  if (pageKey !== "namkeen") {
    return {
      ...page,
      height: offsetFromHeroBottom(page.height),
      newsletter: page.newsletter
        ? { ...page.newsletter, top: offsetFromHeroBottom(page.newsletter.top) }
        : page.newsletter,
      sections: page.sections.map((section) => ({
        ...section,
        top: offsetFromHeroBottom(section.top),
      })),
    };
  }

  const shiftUp = page.compactContentShift ?? 0;

  return {
    ...page,
    height: offsetFromHeroBottomNamkeen(page.height, shiftUp),
    newsletter: page.newsletter
      ? { ...page.newsletter, top: offsetFromHeroBottomNamkeen(page.newsletter.top, shiftUp) }
      : page.newsletter,
    sections: page.sections.map((section) => ({
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
        <div className="farali-hero-products">
          <img className="farali-hero-pack farali-pack-wafer" src={asset("category-farali-kela-wafers.png")} alt="" />
          <img className="farali-hero-pack farali-pack-kela-tikha" src={asset("category-farali-kela-chiwda-tikha.png")} alt="" />
          <img className="farali-hero-pack farali-pack-tikha" src={asset("category-farali-chiwda-tikha.png")} alt="" />
          <img className="farali-hero-pack farali-pack-mitha" src={asset("category-farali-chiwda-mitha.png")} alt="" />
          <img className="farali-hero-pack farali-pack-kela-mitha" src={asset("category-farali-kela-chiwda-mitha.png")} alt="" />
        </div>
      </div>
    );
  }

  if (hero.mode === "namkeen") {
    return (
      <div className="category-hero-custom category-hero-namkeen" aria-hidden="true" data-node-id="1206:104">
        <img className="namkeen-hero-bg" src={asset("category-namkeen-hero-bg.png")} alt="" />
        <div className="namkeen-hero-products">
          <img className="namkeen-hero-pack namkeen-pack-all-in-one" src={asset("category-namkeen-all-in-one.png")} alt="" />
          <img className="namkeen-hero-pack namkeen-pack-chakhna" src={asset("category-namkeen-chakhna-mix.png")} alt="" />
          <img className="namkeen-hero-pack namkeen-pack-papad" src={asset("category-namkeen-papad-chavana.png")} alt="" />
          <img className="namkeen-hero-pack namkeen-pack-gathiya" src={asset("category-namkeen-bhavnagari-gathiya.png")} alt="" />
          <img className="namkeen-hero-pack namkeen-pack-sev-mamra" src={asset("category-namkeen-masala-sev-mamra.png")} alt="" />
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
        <img className="khakhra-hero-pack khakhra-pack-7grain" src={asset('category-khakhra-7grain.png')} alt="" />
        <img className="khakhra-hero-pack khakhra-pack-panipuri" src={asset('category-khakhra-panipuri.png')} alt="" />
        <img className="khakhra-hero-pack khakhra-pack-fafda" src={asset('category-khakhra-fafda.png')} alt="" />
        <img className="khakhra-hero-pack khakhra-pack-jeera" src={asset('category-khakhra-jeera.png')} alt="" />
        <img className="khakhra-hero-pack khakhra-pack-masala" src={asset('category-khakhra-masala.png')} alt="" />
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
        <img className="fryums-hero-pack fryums-pack-cone" src={asset('category-fryums-cone-cap.png')} alt="" />
        <img className="fryums-hero-pack fryums-pack-magic" src={asset('category-fryums-magic-abcde.png')} alt="" />
        <img className="fryums-hero-pack fryums-pack-noodles" src={asset('category-fryums-noodles-sticks.png')} alt="" />
        <img className="fryums-hero-pack fryums-pack-pasta" src={asset('category-fryums-tasty-pasta.png')} alt="" />
        <img className="fryums-hero-pack fryums-pack-cups" src={asset('category-fryums-crunchy-cups.png')} alt="" />
      </div>
    );
  }

  if (hero.mode === "chipsWide") {
    return (
      <div className="category-hero-custom category-hero-chips-wide" aria-hidden="true">
        <img className="chips-wide-hero-bg" src={asset('category-chips-wide-hero-bg.png')} alt="" />
        <div className="chips-wide-hero-ring">
          <img className="chips-wide-hero-pack chips-wide-pack-salted" src={asset('category-chips-wide-hero-salted.png')} alt="" />
          <img className="chips-wide-hero-pack chips-wide-pack-tomato" src={asset('category-chips-wide-hero-tomato.png')} alt="" />
          <img className="chips-wide-hero-pack chips-wide-pack-masti" src={asset('category-chips-wide-hero-masti.png')} alt="" />
          <img className="chips-wide-hero-pack chips-wide-pack-onion" src={asset('category-chips-wide-hero-onion.png')} alt="" />
          <img className="chips-wide-hero-pack chips-wide-pack-chilli" src={asset('category-chips-wide-hero-chilli.png')} alt="" />
        </div>
      </div>
    );
  }

  if (hero.mode === "beveragesWide") {
    return (
      <div className="category-hero-custom category-hero-beverages-wide" aria-hidden="true">
        <img className="beverages-wide-hero-bg" src={asset('category-beverages-hero-shape.png')} alt="" />
        <img
          className="beverages-wide-hero-products"
          src={asset('category-beverages-hero-products.png')}
          alt=""
        />
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
  return (
    <article className="category-product-card category-product-card--image" style={{ ...boxStyle(item), background: item.background }}>
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
  return (
    <article
      className={`category-product-card category-product-card--product${item.ring ? " category-product-card--ring" : ""}`}
      style={{ ...boxStyle(item), background: item.background }}
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
  return (
    <article className={`category-feature ${item.className || ""}`} style={{ ...boxStyle(item), background: item.background }}>
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
      <button className="category-spotlight-arrow category-spotlight-arrow--left" type="button" aria-label="Previous Royal Crunch product">
        <span aria-hidden="true">{"<"}</span>
      </button>
      <div className="category-spotlight-cards">
        {item.items.map((product) => (
          <article className="category-spotlight-card" key={product.image}>
            <img className="category-spotlight-ring" src={asset('category-namkeen-royal-card-ring.svg')} alt="" aria-hidden="true" />
            <img src={product.image} alt="" />
          </article>
        ))}
      </div>
      <button className="category-spotlight-arrow category-spotlight-arrow--right" type="button" aria-label="Next Royal Crunch product">
        <span aria-hidden="true">{">"}</span>
      </button>
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
