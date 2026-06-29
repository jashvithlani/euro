import "./fryums.css";
import { asset } from "./asset.js";
import { scaleCategoryPage } from "./category-scale.js";

const fryumsCardBackground =
  "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #faf0ff 100%)";

/**
 * Fryums — Figma 1246:2241 @ 1920px → 1280px (× 2/3).
 * Layout values are authored in 1920 space and scaled by scaleCategoryPage,
 * EXCEPT section `top`, `newsletter.top`, and page `height`, which are STRING
 * px values in 1280 space (to bypass offsetFromHeroBottom for the top-nav hero).
 */
const fryumsAt1920 = {
  title: "Fryums",
  copy: "Playful snacks packed with bold flavours and irresistible crunch.",
  // Footer sits at Figma y=3283 → 3283 × 2/3 ≈ 2189px in 1280 space.
  height: "2045px",
  hero: { mode: "fryums" },
  heroClassName: "category-hero--fryums-top-nav",
  subnavPlacement: "top",
  // Newsletter patch top in 1280 space: Figma y=2667 × 2/3 ≈ 1778px.
  newsletter: {
    top: "1778px",
    left: 94,
    background: "#d5cfef",
    className: "category-newsletter--fryums-compact",
  },
  sections: [
    /* ----- Row 1 (Figma top 917) ----- */
    {
      type: "productCard",
      left: 68,
      top: "611px",
      width: 870,
      height: 385,
      background: fryumsCardBackground,
      image: asset("category-fryums-tasty-pasta.png"),
      imageStyle: {
        left: 455,
        top: 30,
        width: 239,
        height: 321,
        transform: "rotate(10.52deg)",
      },
      badge: { label: "BEST SELLER", tone: "brown", style: { left: 51, top: 47 } },
      title: "Tasty\nPasta",
      titleClass: "text-fryums-green product-title-lg",
      titleStyle: { left: 51, top: 95, width: 329 },
    },
    {
      type: "productCard",
      left: 977,
      top: "611px",
      width: 870,
      height: 385,
      background: fryumsCardBackground,
      image: asset("category-fryums-magic-abcde.png"),
      imageStyle: {
        left: 60,
        top: 35,
        width: 237,
        height: 319,
        transform: "rotate(-7.89deg)",
      },
      title: "Magic\nABCDE",
      titleClass: "text-fryums-red product-title-lg text-right",
      titleStyle: { right: 77, top: 56, width: 325 },
    },

    /* ----- Row 2 (Figma top 1354) ----- */
    {
      type: "productCard",
      left: 68,
      top: "903px",
      width: 520,
      height: 385,
      background: fryumsCardBackground,
      image: asset("category-fryums-noodles-sticks.png"),
      imageStyle: {
        left: 244,
        top: 90,
        width: 223,
        height: 277,
        transform: "rotate(5.65deg)",
      },
      title: "Masala Noodles\nStix",
      titleClass: "text-fryums-purple product-title-fryums-40",
      titleStyle: { left: 33, top: 35, width: 420 },
    },
    {
      type: "promo",
      left: 648,
      top: "903px",
      width: 1199,
      height: 385,
      background: "#0095be",
      color: "#ffffff",
      copyColor: "#ffffff",
      buttonColor: "#005676",
      ghost: "Fryums",
      title: "Light Crunch, Sweet\nDelight",
      copy: "A perfect mix of crispy textures and filled with flavours to deepen your taste buds.",
    },

    /* ----- Row 3 (Figma top 1781) ----- */
    {
      type: "productCard",
      left: 67,
      top: "1187px",
      width: 522,
      height: 385,
      background: fryumsCardBackground,
      image: asset("category-fryums-ringoli-tomato-rings.png"),
      imageStyle: { left: 59, top: 26, width: 404, height: 434, maxHeight: 420 },
      imageImportantStyle: { width: 404, height: 434 },
      title: "Ringoli Tomato Rings",
      titleClass: "text-fryums-ring product-title-fryums-ringoli text-center",
      titleStyle: { left: 0, top: 22, width: 522 },
    },
    {
      type: "feature",
      left: 651,
      top: "1187px",
      width: 1196,
      height: 385,
      background: fryumsCardBackground,
      kicker: "LIMITED EDITION",
      kickerColor: "#8d2b2f",
      title: "Salted\nFinger Pipe",
      titleColor: "#c83511",
      copy: "Perfectly salted bites with a crisp texture that keeps you munching.",
      buttonColor: "#c83511",
      buttonLabel: "BUY NOW",
      image: asset("category-fryums-salted-finger-pipe.png"),
      imageStyle: {
        left: 660,
        top: 0,
        width: 400,
        height: 400,
        maxWidth: 396,
        maxHeight: 405,
        transform: "rotate(8.2deg)",
      },
      imageImportantStyle: { width: 400, height: 400 },
    },

    /* ----- Row 4 (Figma top 2216) ----- */
    {
      type: "productCard",
      left: 67,
      top: "1477px",
      width: 560,
      height: 385,
      background: fryumsCardBackground,
      image: asset("category-fryums-wheels-chaska.png"),
      imageStyle: { left: 189, top: 125, width: 183, height: 227 },
      title: "Wheels Chaska",
      titleClass: "text-fryums-darkgreen product-title-fryums-40",
      titleStyle: { left: 39, top: 23, width: 360 },
    },
    {
      type: "productCard",
      left: 680,
      top: "1477px",
      width: 560,
      height: 385,
      background: fryumsCardBackground,
      image: asset("category-fryums-crunchy-cups.png"),
      imageStyle: { left: 189, top: 117, width: 183, height: 246 },
      title: "Crunchy Cups",
      titleClass: "text-fryums-magenta product-title-fryums-40",
      titleStyle: { left: 42, top: 13, width: 360 },
    },
    {
      type: "productCard",
      left: 1287,
      top: "1477px",
      width: 560,
      height: 385,
      background: fryumsCardBackground,
      image: asset("category-fryums-cone-cap.png"),
      imageStyle: { left: 189, top: 105, width: 183, height: 246 },
      title: "Cone Cap",
      titleClass: "text-fryums-deepgreen product-title-fryums-40",
      titleStyle: { left: 39, top: 23, width: 360 },
    },
  ],
};

export const fryumsPage = scaleCategoryPage(fryumsAt1920);
