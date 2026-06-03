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
  badge: "LOREAM IPSUM",
  height: "2470.67px",
  hero: {
    mode: "beveragesWide",
  },
  heroClassName: "category-hero--beverages-top-nav",
  subnavPlacement: "top",
  newsletter: {
    top: "2268.67px",
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
      background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-guava.png"),
      imageStyle: { left: 262, top: 54, width: 204, height: 453 },
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
      background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-mango.png"),
      imageStyle: { left: -2, top: 23, width: 697, height: 522 },
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
      background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-water.png"),
      imageStyle: { left: -15, top: 90, width: 622, height: 495, transform: "rotate(-5.14deg)" },
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
      background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-lemoni.png"),
      imageStyle: { left: 43, top: -16, width: 312, height: 559 },
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
      background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-orange.png"),
      imageStyle: { left: 33, top: -22, width: 324, height: 580 },
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
      background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-jeera.png"),
      imageStyle: { left: 87, top: -25, width: 344, height: 621 },
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
      background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-onceup.png"),
      imageStyle: { left: 83, top: -31, width: 277, height: 558 },
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
      background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
      image: asset("category-beverage-sparker.png"),
      imageStyle: { left: 239, top: -78, width: 469, height: 591, transform: "rotate(15deg)" },
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
      background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
      kicker: "LIMITED EDITION",
      kickerColor: "#be004b",
      title: "Fresho\nLitchi",
      titleColor: "#be004b",
      copy: "Extra thick, extra crunchy,\nextra flavor.",
      buttonColor: "#be004b",
      buttonLabel: "Inquire",
      image: asset("category-beverage-litchi.png"),
      imageStyle: { left: 608, top: 0, width: 259, height: 356 },
    },
  ],
};

export const beveragesPage = scaleCategoryPage(beveragesAt1920);
