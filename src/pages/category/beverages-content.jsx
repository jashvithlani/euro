import "./beverages.css";
import { asset } from "./asset.js";
import { scaleCategoryPage } from "./category-scale.js";

/**
 * Beverages — Figma 1131:3231 @ 1920px → 1280px (× 2/3).
 * Layout authored in 1920 space (numeric sizes). Per-section `top`, `newsletter.top`
 * and page `height` are STRING px in 1280 space (Figma1920_Y × 2/3) so they bypass
 * offsetFromHeroBottom and sit relative to the page top, like the chips reference.
 */
const beveragesAt1920 = {
  title: "Beverages",
  copy: (
    <>
      Crafted to refresh and energize every moment.
      <br />
      Bold flavors, smooth sips — pure satisfaction in every bottle.
    </>
  ),
  height: "2505px",
  hero: {
    mode: "beveragesWide",
  },
  heroClassName: "category-hero--beverages-top-nav",
  subnavPlacement: "top",
  newsletter: {
    top: "2254.67px",
    left: 293,
    background: "#efd6cf",
    className: "category-newsletter--beverages-compact",
  },
  sections: [
    /* ---------- Row 1 (Figma y=906) ---------- */
    {
      type: "productCard",
      left: 65,
      top: "604px",
      width: 549.667,
      height: 549.667,
      background: "radial-gradient(circle, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-guava.png"),
      decorations: [
        {
          image: asset("category-beverage-guava-brush.svg"),
          className: "beverage-guava-brush",
          style: { left: 151.3, top: 205, width: 497.811, height: 248.252, transform: "rotate(-43.58deg)" },
        },
      ],
      imageStyle: { left: 338.96, top: 122.93, width: 122.067, height: 369.763, transform: "rotate(7.98deg)" },
      badge: { label: "BEST SELLER", tone: "pink", style: { left: 45, top: 37 } },
      title: "Fresho\nGuava",
      titleClass: "text-guava product-title-beverages-xl",
      titleStyle: { left: 45, top: 69, width: 329 },
    },
    {
      type: "productCard",
      left: 671,
      top: "604px",
      width: 595,
      height: 549.667,
      background: "radial-gradient(circle, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-mango.png"),
      imageStyle: { left: -53, top: 29, width: 736, height: 708 },
      title: "Fresho\nMango",
      titleClass: "text-orange product-title-beverages-lg text-right",
      titleStyle: { right: 47, top: 49, width: 378 },
    },
    {
      type: "productCard",
      left: 1303,
      top: "604px",
      width: 542,
      height: 540,
      background: "radial-gradient(circle, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-water.png"),
      imageStyle: { left: -70.5, top: 90, width: 622, height: 517.5, transform: "rotate(-5.14deg)" },
      title: "Mineral Water",
      titleClass: "text-dark product-title-beverages-water",
      titleStyle: { left: 60, top: 45, width: 340 },
    },
    /* ---------- Row 2 (Figma y=1491) ---------- */
    {
      type: "productCard",
      left: 67,
      top: "994px",
      width: 548,
      height: 389,
      background: "radial-gradient(circle, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-lemoni.png"),
      imageStyle: { left: 308.5, top: -94, width: 241.5, height: 559 },
      title: "Lemoni\nNimbu",
      titleClass: "text-green product-title-beverages-lg",
      titleStyle: { left: 47, top: 29, width: 245 },
    },
    {
      type: "promo",
      left: 669,
      top: "994px",
      width: 1176,
      height: 389,
      className: "category-promo--beverages-compact",
      background: "#00bea8",
      color: "#ffffff",
      buttonColor: "#005676",
      ghost: "Beverages",
      title: "Where Flavor Meets Perfection",
      copy: "Handpicked ingredients and crafted processes, driven by quality. More than a sip - an experience.",
    },
    /* ---------- Row 3 (Figma y=1929, three cards h=576) ---------- */
    {
      type: "productCard",
      left: 68,
      top: "1286px",
      width: 576,
      height: 576,
      background: "radial-gradient(circle, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-orange.png"),
      imageStyle: { left: 229.5, top: -28, width: 355.5, height: 623.5 },
      title: "Orange\nTango",
      titleClass: "text-orange product-title-beverages-lg",
      titleStyle: { left: 33, top: 35, width: 245 },
    },
    {
      type: "productCard",
      left: 694,
      top: "1286px",
      width: 534,
      height: 576,
      background: "radial-gradient(circle, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-jeera.png"),
      imageStyle: { left: 201, top: -37, width: 368, height: 639 },
      title: "Jeera\nMasti",
      titleClass: "text-brown product-title-beverages-lg",
      titleStyle: { left: 34, top: 35, width: 245 },
    },
    {
      type: "productCard",
      left: 1279,
      top: "1286px",
      width: 568,
      height: 576,
      background: "radial-gradient(circle, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-onceup.png"),
      imageStyle: { left: 230, top: -23.5, width: 359.5, height: 645 },
      title: "Onceup\nLemon",
      titleClass: "text-lime product-title-beverages-lg",
      titleStyle: { left: 36, top: 35, width: 245 },
    },
    /* ---------- Row 4 (Figma y=2554) ---------- */
    {
      type: "promo",
      left: 68,
      top: "1702.67px",
      width: 1068,
      height: 389,
      className: "category-promo--beverages-compact",
      background: "#ffc9c9",
      color: "#be004b",
      copyColor: "#071522",
      buttonColor: "#be004b",
      ghost: "Beverages",
      title: "Fuel Your Every\nMoment",
      copy: "Crafted to energize and refresh, keeping you going strong.\nEvery sip delivers bold taste with a burst of energy.",
    },
    {
      type: "productCard",
      left: 1191,
      top: "1704.67px",
      width: 656,
      height: 386,
      background: "radial-gradient(circle, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-sparker.png"),
      decorations: [
        {
          image: asset("category-beverage-sparker-bolt.svg"),
          className: "beverage-sparker-bolt",
          style: { left: 205.3, top: 8.8, width: 396, height: 417, transform: "rotate(12.08deg)" },
        },
        {
          image: asset("category-beverage-sparker-accent.svg"),
          className: "beverage-sparker-accent",
          style: { left: 532, top: 99.8, width: 59.493, height: 27.918, transform: "rotate(11.56deg)" },
        },
      ],
      imageStyle: { left: 232.5, top: -42.05, width: 346.082, height: 519.06, transform: "rotate(15.01deg)" },
      title: "Sparker\nEnergy",
      titleClass: "text-red product-title-beverages-lg",
      titleStyle: { left: 33, top: 35, width: 245 },
    },
    /* ---------- Feature (Figma y=2982) ---------- */
    {
      type: "feature",
      left: 535,
      top: "1988px",
      width: 836,
      height: 360,
      className: "category-feature--beverages-wide",
      background: "radial-gradient(circle, #f6f6f6 0%, #ffece4 100%)",
      kicker: "LIMITED EDITION",
      kickerColor: "#be004b",
      title: "Fresho\nLitchi",
      titleColor: "#be004b",
      copy: "Extra thick, extra crunchy,\nextra flavor.",
      buttonColor: "#be004b",
      buttonLabel: "Inquire",
      image: asset("category-beverage-litchi.png"),
      imageStyle: { left: 608, top: 0, width: 448, height: 441.5 },
    },
  ],
};

export const beveragesPage = scaleCategoryPage(beveragesAt1920);
