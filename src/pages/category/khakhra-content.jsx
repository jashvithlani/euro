import "./khakhra.css";
import { asset } from "./asset.js";
import { scaleCategoryPage } from "./category-scale.js";

/* Two big banner cards use #f6f6f6 -> #ffe7e2; portrait cards use #f6f6f6 -> #ffeee4 (Figma 1218:1112). */
const khakhraBannerBg = "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffe7e2 100%)";
const khakhraCardBg = "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffeee4 100%)";

function khakhraDecor(prefix, width, layers = ["a", "b"]) {
  return layers.map((layer) => ({
    image: asset(`category-khakhra-${prefix}-vector-${layer}.png`),
    className: "khakhra-card-vector",
    style: { left: 0, top: 0, width, height: 385 },
  }));
}

/**
 * Khakhra — Figma node 1218:1112 (frame 1920×3557).
 * Authored in 1920 space; scaleCategoryPage scales numeric values ×2/3 into the 1280 shell.
 * Section `top`, `newsletter.top` and page `height` are STRING px in 1280 space so they
 * bypass offsetFromHeroBottom (this page uses the compact top-nav hero).
 */
const khakhraAt1920 = {
  title: "Khakhra",
  copy: "Thin, roasted to perfection with authentic Indian flavors in every bite.",
  height: "2059px",
  hero: { mode: "khakhra" },
  heroClassName: "category-hero--khakhra-top-nav",
  subnavPlacement: "top",
  newsletter: { top: "1840px", left: 45, background: "#efd6cf", className: "category-newsletter--khakhra-compact" },
  sections: [
    /* Row 1 — Masala + 7 Grain banner cards (Figma Frame 10 @ y=1024 -> 683px) */
    {
      type: "productCard",
      left: 68,
      top: "683px",
      width: 870,
      height: 385,
      background: khakhraBannerBg,
      image: asset("category-khakhra-masala.png"),
      decorations: khakhraDecor("masala", 870),
      imageStyle: { left: 264.84, top: 51.19, width: 261.48, height: 285.5, transform: "rotate(2deg)" },
      badge: { label: "BEST SELLER", tone: "muted", style: { left: 35.16, top: 59.99 } },
      title: "Masala\nKhakhra",
      titleClass: "text-khakhra-blue product-title-lg",
      titleStyle: { left: 35.16, top: 100, width: 329 },
    },
    {
      type: "productCard",
      left: 977,
      top: "683px",
      width: 870,
      height: 385,
      background: khakhraBannerBg,
      image: asset("category-khakhra-7grain.png"),
      decorations: khakhraDecor("7grain", 870),
      imageStyle: { left: 113, top: 61.7, width: 258, height: 283.9, transform: "rotate(-2deg)" },
      title: "7 Grain\nKhakhra",
      titleClass: "text-khakhra-brown product-title-lg text-right",
      titleStyle: { left: 411.37, top: 41, width: 206 },
    },
    /* Row 2 — Fafda card + Bold Crunch promo (Figma Frame 11 row 1 @ y=1462 -> 975px) */
    {
      type: "productCard",
      left: 68,
      top: "975px",
      width: 357,
      height: 386,
      background: khakhraCardBg,
      image: asset("category-khakhra-fafda.png"),
      imageStyle: { left: 56.5, top: 109.3, width: 244, height: 258 },
      title: "Fafda Khakhra",
      titleClass: "text-khakhra-red product-title-sm khakhra-title-fafda",
      titleStyle: { left: 38, top: 48, width: 320 },
    },
    {
      type: "promo",
      left: 466,
      top: "975px",
      width: 1381,
      height: 385,
      className: "category-promo--khakhra",
      background: "#be004b",
      color: "#ffffff",
      copyColor: "#ffffff",
      buttonColor: "#be004b",
      ghost: "Khakhra",
      title: "Bold Crunch, Gujarati\nStyle",
      copy: "Infused with the iconic taste of khakhra, crafted into a\nperfectly packed stuff.",
    },
    /* Row 3 — Jeera, Pani Puri, Oats (Figma Frame 11 row 2 @ abs y=1895 -> 1263px) */
    {
      type: "productCard",
      left: 67,
      top: "1263px",
      width: 555,
      height: 385,
      background: khakhraCardBg,
      image: asset("category-khakhra-jeera.png"),
      decorations: khakhraDecor("jeera", 555, ["a"]),
      imageStyle: { left: 254, top: 57, width: 246, height: 271 },
      title: "Jeera\nKhakhra",
      titleClass: "text-khakhra-red product-title-lg",
      titleStyle: { left: 33, top: 35, width: 274 },
    },
    {
      type: "productCard",
      left: 670,
      top: "1263px",
      width: 555,
      height: 385,
      background: khakhraCardBg,
      image: asset("category-khakhra-panipuri.png"),
      decorations: khakhraDecor("panipuri", 555, ["a"]),
      imageStyle: { left: 278, top: 55, width: 246, height: 264 },
      title: "Pani Puri\nKhakhra",
      titleClass: "text-khakhra-red product-title-lg",
      titleStyle: { left: 34.25, top: 34.78, width: 321 },
    },
    {
      type: "productCard",
      left: 1273,
      top: "1263px",
      width: 555,
      height: 385,
      background: khakhraCardBg,
      image: asset("category-khakhra-oats.png"),
      decorations: khakhraDecor("oats", 555),
      imageStyle: { left: 278, top: 61, width: 246, height: 264 },
      title: "Oats\nKhakhra",
      titleClass: "text-khakhra-red product-title-lg",
      titleStyle: { left: 34.25, top: 34.78, width: 321 },
    },
    /* Row 4 — Chorafali, Bajri, Garlic (Figma bottom grid @ y=2322 -> 1548px) */
    {
      type: "productCard",
      left: 68,
      top: "1548px",
      width: 560,
      height: 385,
      background: khakhraCardBg,
      image: asset("category-khakhra-chorafali.png"),
      decorations: khakhraDecor("chorafali", 560),
      imageStyle: { left: 273, top: 61, width: 246, height: 264 },
      title: "Chorafali\nKhakhra",
      titleClass: "text-khakhra-red product-title-lg",
      titleStyle: { left: 33, top: 35, width: 274 },
    },
    {
      type: "productCard",
      left: 670,
      top: "1548px",
      width: 555,
      height: 385,
      background: khakhraCardBg,
      image: asset("category-khakhra-bajri.png"),
      decorations: khakhraDecor("bajri", 555),
      imageStyle: { left: 263, top: 61, width: 246, height: 264 },
      title: "Bajri\nKhakhra",
      titleClass: "text-khakhra-red product-title-lg",
      titleStyle: { left: 34.25, top: 34.78, width: 321 },
    },
    {
      type: "productCard",
      left: 1273,
      top: "1548px",
      width: 555,
      height: 385,
      background: khakhraCardBg,
      image: asset("category-khakhra-garlic.png"),
      decorations: khakhraDecor("garlic", 555),
      imageStyle: { left: 278, top: 61, width: 246, height: 264 },
      title: "Garlic\nKhakhra",
      titleClass: "text-khakhra-red product-title-lg",
      titleStyle: { left: 34.25, top: 34.78, width: 321 },
    },
  ],
};

export const khakhraPage = scaleCategoryPage(khakhraAt1920);
