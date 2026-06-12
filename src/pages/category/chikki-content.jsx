import "./chikki.css";
import { asset } from "./asset.js";
import { scaleCategoryPage } from "./category-scale.js";

/* Figma 1215:861 (Category Page / Chikki) authored @ 1920 → app canvas 1280 (× 2/3).
   Per project rules: section `top`, newsletter.top and page height are STRING px in
   1280 space (round(Figma1920_Y × 0.6667)); every other layout number stays in 1920
   space and is scaled by scaleCategoryPage. */

const chikkiPurpleCard = "radial-gradient(circle, #f6f6f6 0%, #f8ebff 100%)";
const chikkiBlueCard = "radial-gradient(circle, #f6f6f6 0%, #e3f7ff 100%)";
const chikkiPromoBlue = "#246593";

const chikkiAt1920 = {
  title: "Chikki",
  copy: "Crafted with the goodness of jaggery and premium nuts for an authentic treat",
  height: "2123px",
  hero: { mode: "chikki" },
  heroClassName: "category-hero--chikki-top-nav",
  subnavPlacement: "top",
  newsletter: {
    top: "1869px",
    left: 68,
    background: "#d8efcf",
    className: "category-newsletter--chikki-compact",
  },
  sections: [
    /* ── Row 1 — Crush Peanut Chikki / Peanut Chikki (Figma 1218:1032 @ y=967) ── */
    {
      type: "productCard",
      left: 68,
      top: "645px",
      width: 870,
      height: 448,
      background: chikkiPurpleCard,
      image: asset("category-chikki-crush-peanut.png"),
      decorations: [
        {
          image: asset("category-chikki-crush-ring.svg"),
          className: "chikki-crush-ring",
          style: { left: 274, top: -162, width: 636, height: 633 },
        },
      ],
      imageStyle: { left: 512, top: 42, width: 198, height: 423 },
      badge: { label: "BEST SELLER", tone: "pink", style: { left: 21, top: 25 } },
      title: "Crush\nPeanut Chikki",
      titleClass: "text-chikki-crush product-title-crush",
      titleStyle: { left: 21, top: 65, width: 280 },
    },
    {
      type: "productCard",
      left: 977,
      top: "645px",
      width: 870,
      height: 448,
      background: chikkiPurpleCard,
      image: asset("category-chikki-peanut.png"),
      decorations: [
        {
          image: asset("category-chikki-peanut-ring.svg"),
          className: "chikki-peanut-ring",
          style: { left: -178, top: 109, width: 661, height: 657 },
        },
      ],
      imageStyle: { left: 83, top: 41, width: 198, height: 423 },
      title: "Peanut\nChikki",
      titleClass: "text-chikki-peanut product-title-crush text-right",
      titleStyle: { right: 69, top: 68, width: 280 },
    },

    /* ── Row 2 — Rajgira Chikki card + promo (Figma 1218:1047 @ y=1460) ── */
    {
      type: "productCard",
      left: 69,
      top: "973px",
      width: 585,
      height: 410,
      background: "radial-gradient(circle, #f6f6f6 0%, #faf0ff 100%)",
      image: asset("category-chikki-rajgira.png"),
      imageStyle: { left: 247, top: 59, width: 116.708, height: 419.565 },
      title: "Rajgira Chikki",
      titleClass: "text-chikki-rajgira product-title-rajgira",
      titleStyle: { left: 171, top: 14, width: 280 },
    },
    {
      type: "promo",
      left: 694,
      top: "973px",
      width: 1157,
      height: 410,
      className: "category-promo--chikki-compact",
      background: chikkiPromoBlue,
      color: "#ffffff",
      buttonColor: chikkiPromoBlue,
      ghost: "Chikki",
      title: "Wholesome Crunch,\nNaturally Sweet",
      copy: "Made with nutrient-rich rajgira and pure sweetness for a\nlight, satisfying bite.",
    },

    /* ── Row 3 — Dry Fruit Chikki x3 (Figma 1218:1064, cards y=1923) ── */
    {
      type: "productCard",
      left: 69,
      top: "1282px",
      width: 550,
      height: 385,
      background: "radial-gradient(circle, #f6f6f6 0%, #e3f7ff 100%)",
      image: asset("category-chikki-dryfruit-mix.png"),
      imageStyle: { left: 67.5, top: 79, width: 479, height: 360 },
      title: "Dry Fruit\nChikki",
      titleClass: "text-chikki-blue product-title-dryfruit",
      titleStyle: { left: 33, top: 18.5, width: 320 },
      subtitle: "Mix",
      subtitleStyle: { left: 33, top: 128, width: 200 },
    },
    {
      type: "productCard",
      left: 684,
      top: "1282px",
      width: 550,
      height: 385,
      background: "radial-gradient(circle, #f6f6f6 0%, #e3f7ff 100%)",
      image: asset("category-chikki-cashew.png"),
      imageStyle: { left: 73, top: 86, width: 469, height: 351 },
      title: "Dry Fruit\nChikki",
      titleClass: "text-chikki-blue product-title-dryfruit",
      titleStyle: { left: 34, top: 17, width: 320 },
      subtitle: "Cashew Nuts",
      subtitleStyle: { left: 34, top: 125, width: 280 },
    },
    {
      type: "productCard",
      left: 1299,
      top: "1282px",
      width: 550,
      height: 385,
      background: "radial-gradient(circle, #f6f6f6 0%, #e3f7ff 100%)",
      image: asset("category-chikki-almond.png"),
      imageStyle: { left: 78, top: 93, width: 461, height: 345 },
      title: "Dry Fruit\nChikki",
      titleClass: "text-chikki-blue product-title-dryfruit",
      titleStyle: { left: 36, top: 17, width: 320 },
      subtitle: "Almond",
      subtitleStyle: { left: 36, top: 125, width: 200 },
    },

    /* ── Row 4 — promo + Murmura Chikki card (Figma 1218:1095 @ y=2363) ── */
    {
      type: "promo",
      left: 69,
      top: "1575px",
      width: 1139,
      height: 385,
      className: "category-promo--chikki-compact",
      background: chikkiPromoBlue,
      color: "#ffffff",
      buttonColor: chikkiPromoBlue,
      ghost: "Chikki",
      title: "Light Crunch, Guilt-Free\nSweetness",
      copy: "Made with puffed murmura and natural sweetness for a\nperfectly balanced bite.",
    },
    {
      type: "productCard",
      left: 1262,
      top: "1575px",
      width: 585,
      height: 385,
      background: "radial-gradient(circle, #f6f6f6 0%, #e3f7ff 100%)",
      image: asset("category-chikki-murmura.png"),
      imageStyle: { left: 213, top: 64, width: 160, height: 332, transform: "rotate(-20.49deg)" },
      title: "Murmura Chikki",
      titleClass: "text-chikki-blue product-title-rajgira text-center",
      titleStyle: { left: 144, top: 14, width: 297 },
    },
  ],
};

export const chikkiPage = scaleCategoryPage(chikkiAt1920);
