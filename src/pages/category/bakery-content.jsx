import "./bakery.css";
import { asset } from "./asset.js";
import { scaleCategoryPage } from "./category-scale.js";

/* Radial card backgrounds matching the Figma euro-x texture cards. */
const bakeryCardBg = "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffe7d9 100%)";
const bakeryCardBgWarm = "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffeee4 100%)";

/**
 * Bakery — Figma node 1218:1606 (frame 1920×3557).
 * Authored in 1920 space; numeric layout values are scaled ×2/3 by scaleCategoryPage.
 * Section `top`, `newsletter.top` and page `height` are STRING px values in 1280 space
 * (= round(Figma1920_Y × 0.6667)) so they bypass offsetFromHeroBottom.
 */
const bakeryAt1920 = {
  title: "Bakery",
  copy: "Crafted with rich ingredients and perfected through traditional baking techniques.",
  height: "2095px",
  hero: { mode: "bakery" },
  heroClassName: "category-hero--bakery-top-nav",
  subnavPlacement: "top",
  newsletter: {
    top: "1560px",
    left: 68,
    background: "#cfeeef",
    className: "category-newsletter--bakery-compact",
  },
  sections: [
    /* Row 1 — wide paired cards (Figma 1218:1739, top 1024). */
    {
      type: "productCard",
      left: 68,
      top: "683px",
      width: 870,
      height: 385,
      background: bakeryCardBgWarm,
      image: asset("category-bakery-methi-khari.png"),
      imageStyle: { left: 435, top: 44, width: 349.95, height: 298.34 },
      badge: { label: "BEST SELLER", tone: "muted", style: { left: 50, top: 37 } },
      title: "Surati\nMethi Khari",
      titleClass: "text-bakery-green product-title-lg",
      titleStyle: { left: 50, top: 77, width: 300 },
    },
    {
      type: "productCard",
      left: 977,
      top: "683px",
      width: 870,
      height: 385,
      background: bakeryCardBgWarm,
      image: asset("category-bakery-plain-khari.png"),
      imageStyle: { left: 42, top: 48, width: 340, height: 290 },
      title: "Surati\nPlain Khari",
      titleClass: "text-bakery-brown product-title-lg text-right",
      titleStyle: { right: 68, top: 77, width: 320 },
    },

    /* Row 2 — Jeera Khari card + teal promo (Figma 1246:2002, top 1467). */
    {
      type: "productCard",
      left: 68,
      top: "978px",
      width: 431,
      height: 385,
      background: bakeryCardBg,
      image: asset("category-bakery-jeera-khari.png"),
      imageStyle: { left: 23.6, top: 112.71, width: 307.61, height: 262.3 },
      title: "Surati\nJeera Khari",
      titleClass: "product-title-sm",
      titleStyle: { left: 49, top: 22, width: 350, color: "#884431" },
    },
    {
      type: "promo",
      left: 545,
      top: "978px",
      width: 1302,
      height: 385,
      background: "#00bea8",
      color: "#ffffff",
      copyColor: "#ffffff",
      buttonColor: "#00bea8",
      ghost: "Bakery",
      title: "Flaky Layers, Classic\nFlavor",
      copy: "Infused with the aromatic touch of jeera for a rich, savory experience.",
    },

    /* Row 3 — three nankhatai/rusk cards (Figma 1246:2019, top 1900). */
    {
      type: "productCard",
      left: 66,
      top: "1267px",
      width: 560,
      height: 385,
      background: bakeryCardBg,
      image: asset("category-bakery-rusk.png"),
      imageStyle: { left: 2, top: 87, width: 558, height: 439 },
      title: "Premium\nRusk",
      titleClass: "text-bakery-gold product-title-lg",
      titleStyle: { left: 33, top: 35, width: 320 },
    },
    {
      type: "productCard",
      left: 676,
      top: "1267px",
      width: 560,
      height: 385,
      background: bakeryCardBg,
      image: asset("category-bakery-coconut-card.png"),
      imageStyle: { left: 0, top: 98, width: 414.31, height: 374.13 },
      title: "Coconut\nNankhatai",
      titleClass: "text-bakery-gold product-title-lg",
      titleStyle: { left: 12, top: 29, width: 360 },
    },
    {
      type: "productCard",
      left: 1287,
      top: "1267px",
      width: 560,
      height: 385,
      background: bakeryCardBg,
      image: asset("category-bakery-surati-nankhatai.png"),
      imageStyle: { left: 1, top: 116, width: 559, height: 393 },
      title: "Surati\nNankhatai",
      titleClass: "text-bakery-gold product-title-lg",
      titleStyle: { left: 35.5, top: 35, width: 360 },
    },
  ],
};

export const bakeryPage = scaleCategoryPage(bakeryAt1920);
