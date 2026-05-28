import { Link } from "react-router-dom";
import "./CategoryPage.css";
import ProductSubNav from "../components/ProductSubNav.jsx";

const cardTexture = "assets/category-card-texture.png";
const namkeenTexture = "assets/category-namkeen-card-bg.png";
const namkeenCardBackground = "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #e3f7ff 100%)";
const chikkiCardBackground = "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #faf0ff 100%)";
const chikkiBlueBackground = "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #e3f7ff 100%)";
const khakhraCardBackground = "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffeee4 100%)";
const bakeryCardBackground = "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffeee4 100%)";
const fryumsCardBackground = "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #faf0ff 100%)";
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
    newsletter: { top: "1411.33px", left: 22, background: "#d8efcf", className: "category-newsletter--chips-compact" },
    sections: [
      {
        type: "imageCard",
        left: 65.33,
        top: "550.67px",
        width: 370,
        height: 259.33,
        background: "radial-gradient(circle at 50% 50%, #fed1bc 0%, #febf94 50%, #fdac6b 100%)",
        image: "assets/category-chips-wide-card-masti.png",
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
        image: "assets/category-chips-wide-card-onion.png",
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
        image: "assets/category-chips-wide-card-salted.png",
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
        image: "assets/category-chips-wide-card-tomato.png",
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
        image: "assets/category-chips-wide-card-chilli.png",
        imageStyle: { left: 215.91, top: 0, width: 241.5, height: 291.27 },
      },
    ],
  },
  beverages: {
    title: "Beverages",
    copy: (
      <>
        Crafted to refresh and energize every moment.
        <br />
        Bold flavors, smooth sips — pure satisfaction in every bottle.
      </>
    ),
    badge: "LOREAM IPSUM",
    height: 4218.779,
    hero: {
      mode: "image",
      image: "assets/category-beverages-hero-products.png",
      className: "category-hero-visual--beverages",
    },
    newsletter: { top: 3681.779, left: 44, background: "#e6d0c8" },
    sections: [
      {
        type: "productCard",
        left: 45.24,
        top: 835.37,
        width: 549.667,
        height: 549.667,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
        image: "assets/category-beverage-guava.png",
        imageStyle: { left: 262, top: 54, width: 204, height: 453 },
        badge: { label: "BESTSELLER", tone: "pink" },
        title: "Fresho\nGuava",
        titleClass: "text-guava product-title-xl",
        titleStyle: { left: 15, top: 410, width: 329 },
      },
      {
        type: "productCard",
        left: 658.91,
        top: 835.37,
        width: 575.854,
        height: 549.667,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
        image: "assets/category-beverage-mango.png",
        imageStyle: { left: -25, top: 16, width: 718, height: 718 },
        title: "Fresho\nMango",
        titleClass: "text-orange product-title-lg text-right",
        titleStyle: { right: 29, top: 47, width: 266 },
      },
      {
        type: "productCard",
        left: 45.24,
        top: 1433.04,
        width: 357,
        height: 527,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
        image: "assets/category-beverage-lemoni.png",
        imageStyle: { left: 43, top: -16, width: 312, height: 559 },
        title: "Lemoni\nNimbu",
        titleClass: "text-green product-title-lg",
        titleStyle: { left: 33, top: 35, width: 245 },
      },
      {
        type: "promo",
        left: 443.5,
        top: 1433.41,
        width: 792,
        height: 533,
        background: "#00bea8",
        color: "#ffffff",
        buttonColor: "#005676",
        ghost: "Beverages",
        title: "Where Flavor Meets Perfection",
        copy: "Handpicked ingredients and crafted processes, driven by quality. More than a sip - an experience.",
      },
      {
        type: "productCard",
        left: 47,
        top: 2014.87,
        width: 471.679,
        height: 471.679,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
        image: "assets/category-beverage-water.png",
        imageStyle: { left: -60, top: 65, width: 552, height: 438 },
        title: "Mineral Water",
        titleClass: "text-dark product-title-lg",
        titleStyle: { left: 66, top: 24, width: 340 },
      },
      {
        type: "feature",
        left: 559,
        top: 2014.41,
        width: 674,
        height: 472,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
        kicker: "LIMITED EDITION",
        kickerColor: "#be004b",
        title: "Fresho\nLitchi",
        titleColor: "#be004b",
        copy: "Extra thick, extra crunchy,\nextra flavor.",
        buttonColor: "#be004b",
        image: "assets/category-beverage-litchi.png",
        imageStyle: { left: 330, top: 12, width: 369, height: 507 },
      },
      {
        type: "productCard",
        left: 46,
        top: 2530.16,
        width: 356,
        height: 527,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
        image: "assets/category-beverage-orange.png",
        imageStyle: { left: 33, top: -22, width: 324, height: 580 },
        title: "Orange\nTango",
        titleClass: "text-orange product-title-lg",
        titleStyle: { left: 33, top: 35, width: 245 },
      },
      {
        type: "productCard",
        left: 462,
        top: 2530.16,
        width: 356,
        height: 527,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
        image: "assets/category-beverage-jeera.png",
        imageStyle: { left: 87, top: -25, width: 344, height: 621 },
        title: "Jeera\nMasti",
        titleClass: "text-brown product-title-lg",
        titleStyle: { left: 34, top: 35, width: 245 },
      },
      {
        type: "productCard",
        left: 878,
        top: 2530.16,
        width: 356,
        height: 527,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
        image: "assets/category-beverage-onceup.png",
        imageStyle: { left: 83, top: -31, width: 277, height: 558 },
        title: "Onceup\nLemon",
        titleClass: "text-lime product-title-lg",
        titleStyle: { left: 36, top: 35, width: 245 },
      },
      {
        type: "promo",
        left: 33,
        top: 3100.78,
        width: 792,
        height: 533,
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
        left: 867.5,
        top: 3103.78,
        width: 357,
        height: 527,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #ffece4 100%)",
        image: "assets/category-beverage-sparker.png",
        imageStyle: { left: 84, top: -42, width: 397, height: 595, transform: "rotate(15deg)" },
        title: "Sparker\nEnergy",
        titleClass: "text-red product-title-lg",
        titleStyle: { left: 33, top: 35, width: 245 },
      },
    ],
  },
  getmore: {
    title: "Getmore",
    copy: (
      <>
        Artisanal crunch meets bold Indian spices.
        <br />
        Discover our gallery of signature flavors.
      </>
    ),
    height: 1998.037,
    hero: { mode: "getmore" },
    newsletter: { top: 1461.037, left: 44, background: "#cfeeef" },
    sections: [
      {
        type: "productCard",
        left: 45.24,
        top: 835.37,
        width: 549.667,
        height: 549.667,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #f8ebff 100%)",
        image: "assets/category-getmore-tomato.png",
        imageStyle: { left: 164, top: 44, width: 317, height: 382, transform: "rotate(-7deg)" },
        badge: { label: "BEST SELLER", tone: "pink" },
        title: "Tingling\nTomato",
        titleClass: "text-tomato product-title-lg",
        titleStyle: { left: 15, top: 409, width: 329 },
      },
      {
        type: "productCard",
        left: 658.91,
        top: 835.37,
        width: 575.854,
        height: 549.667,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #f8ebff 100%)",
        image: "assets/category-getmore-chatpata.png",
        imageStyle: { left: 25, top: 110, width: 324, height: 388, transform: "rotate(7deg)" },
        title: "Chatpata\nMasala",
        titleClass: "text-indigo product-title-lg text-right",
        titleStyle: { right: 29, top: 47, width: 325 },
      },
    ],
  },
  namkeen: {
    title: "Namkeen",
    copy: "A rich blend of spices and textures crafted to satisfy every savory craving.",
    badge: "LOREAM IPSUM",
    height: 6526.168,
    hero: { mode: "namkeen" },
    newsletter: { top: 5989.168, left: 44, background: "#efcfcf" },
    sections: [
      {
        type: "productCard",
        left: 46.015,
        top: 839.5,
        width: 357,
        height: 527,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.06,
        image: "assets/category-namkeen-shahi-mixture.png",
        imageStyle: { left: 68.8, top: 133, width: 219.486, height: 355 },
        title: "Mixture",
        titleClass: "text-namkeen-plum product-title-sm",
        titleStyle: { left: 104, top: 44, width: 149 },
      },
      {
        type: "promo",
        left: 438,
        top: 836,
        width: 792,
        height: 533,
        background: "#cda0d2",
        color: "#ffffff",
        buttonColor: "#b05abe",
        ghost: "Namkeen",
        title: "The Secret Behind Every\nPerfect Bite",
        copy: "Carefully selected ingredients and expert craftsmanship\ncome together for unmatched crunch.",
      },
      {
        type: "productCard",
        left: 46,
        top: 1417,
        width: 356,
        height: 527,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-madras-mix.png",
        imageStyle: { left: 86.3, top: 193.8, width: 170, height: 276.272 },
        title: "Madras\nMix",
        titleClass: "text-namkeen-blue product-title-sm",
        titleStyle: { left: 33, top: 35, width: 274 },
      },
      {
        type: "productCard",
        left: 462,
        top: 1417,
        width: 356,
        height: 527,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-lemon-mint-bhel.png",
        imageStyle: { left: 93, top: 187.7, width: 170, height: 274.791 },
        title: "Lemon Mint\nBhel",
        titleClass: "text-namkeen-blue product-title-sm",
        titleStyle: { left: 34.25, top: 35, width: 321 },
      },
      {
        type: "productCard",
        left: 878,
        top: 1417,
        width: 356,
        height: 527,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-kenyan-chiwda-hot.png",
        imageStyle: { left: 95, top: 187.7, width: 170, height: 274.791 },
        title: "Kenyan\nChiwda Hot",
        titleClass: "text-namkeen-blue product-title-sm",
        titleStyle: { left: 35.5, top: 35, width: 320 },
      },
      {
        type: "arrow",
        left: 23.24,
        top: 1669,
        direction: "left",
      },
      {
        type: "arrow",
        left: 1257,
        top: 1669,
        direction: "right",
      },
      {
        type: "productCard",
        left: 45.24,
        top: 1992,
        width: 549.667,
        height: 549.667,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-shakkarpara.png",
        imageStyle: { left: 147.8, top: 118.6, width: 250, height: 404.032 },
        title: "Shakkarpara",
        titleClass: "text-namkeen-red product-title-lg text-center",
        titleStyle: { left: 127.8, top: 31.1, width: 294 },
      },
      {
        type: "productCard",
        left: 658.91,
        top: 1992,
        width: 575.854,
        height: 549.667,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-chana-jor-masala.png",
        imageStyle: { left: 162.9, top: 113.2, width: 250, height: 403.742 },
        title: "Chana Jor Masala",
        titleClass: "text-namkeen-blue product-title-lg text-center",
        titleStyle: { left: 48, top: 33, width: 480 },
      },
      {
        type: "productCard",
        left: 45.24,
        top: 2589.667,
        width: 549.667,
        height: 549.667,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-mini-samosa.png",
        imageStyle: { left: 149.8, top: 40.7, width: 250, height: 404.264 },
        title: "Mini Samosa",
        titleClass: "text-namkeen-plum product-title-lg text-center",
        titleStyle: { left: 82.3, top: 471.1, width: 385 },
      },
      {
        type: "productCard",
        left: 658.91,
        top: 2589.667,
        width: 575.854,
        height: 549.667,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-dry-kachori.png",
        imageStyle: { left: 162.9, top: 38, width: 250, height: 409.676 },
        title: "Dry Kachori",
        titleClass: "text-namkeen-blue product-title-lg text-right",
        titleStyle: { right: 92.4, top: 471.1, width: 360 },
      },
      {
        type: "promo",
        left: 46.015,
        top: 3189.834,
        width: 792,
        height: 533,
        background: "#d90000",
        color: "#ffffff",
        copyColor: "#ffffff",
        buttonColor: "#d90000",
        ghost: "Namkeen",
        title: "Crispy Perfection,\nEvery Time",
        copy: "Made with fine ingredients and perfectly spiced for that\nclassic crunchy experience.",
      },
      {
        type: "productCard",
        left: 873,
        top: 3192.834,
        width: 357,
        height: 527,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-tikhi-sev.png",
        imageStyle: { left: 68.8, top: 133, width: 219.486, height: 355 },
        title: "Sev / Gathiya",
        titleClass: "text-namkeen-plum product-title-sm text-center",
        titleStyle: { left: 59, top: 44, width: 239 },
      },
      {
        type: "productCard",
        left: 46,
        top: 3770.834,
        width: 356,
        height: 527,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-tomato-soya-sticks.png",
        imageStyle: { left: 93, top: 193.4, width: 170, height: 274.466 },
        title: "Tomato\nSoya Sticks",
        titleClass: "text-namkeen-blue product-title-sm",
        titleStyle: { left: 33, top: 35, width: 274 },
      },
      {
        type: "productCard",
        left: 462,
        top: 3770.834,
        width: 356,
        height: 527,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-masala-soya-sticks.png",
        imageStyle: { left: 93, top: 191.7, width: 170, height: 274.987 },
        title: "Masala Soya\nSticks",
        titleClass: "text-namkeen-blue product-title-sm",
        titleStyle: { left: 34.25, top: 35, width: 321 },
      },
      {
        type: "productCard",
        left: 878,
        top: 3770.834,
        width: 356,
        height: 527,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-spicy-potato-sticks.png",
        imageStyle: { left: 95, top: 191.9, width: 170, height: 274.791 },
        title: "Spicy Potato\nSticks",
        titleClass: "text-namkeen-blue product-title-sm",
        titleStyle: { left: 35.5, top: 35, width: 320 },
      },
      {
        type: "arrow",
        left: 26.2,
        top: 4012,
        direction: "left",
      },
      {
        type: "arrow",
        left: 1230,
        top: 4012,
        direction: "right",
      },
      {
        type: "productCard",
        left: 45.24,
        top: 4345.834,
        width: 549.667,
        height: 549.667,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-jeera-puri.png",
        imageStyle: { left: 150.2, top: 117.6, width: 250, height: 395.247 },
        title: "Jeera Puri",
        titleClass: "text-namkeen-red product-title-lg text-center",
        titleStyle: { left: 124.8, top: 31.1, width: 300 },
      },
      {
        type: "productCard",
        left: 658.91,
        top: 4345.834,
        width: 575.854,
        height: 549.667,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-methi-puri.png",
        imageStyle: { left: 162.9, top: 114.9, width: 250, height: 404.104 },
        title: "Methi Puri",
        titleClass: "text-namkeen-blue product-title-lg text-right",
        titleStyle: { right: 121.4, top: 33, width: 320 },
      },
      {
        type: "productCard",
        left: 45.24,
        top: 4943.501,
        width: 549.667,
        height: 549.667,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-plain-nylon-papdi.png",
        imageStyle: { left: 149.8, top: 48.8, width: 250, height: 404.104 },
        title: "Plain Nylon Papdi",
        titleClass: "text-namkeen-plum product-title-lg text-center",
        titleStyle: { left: 49.3, top: 471.1, width: 451 },
      },
      {
        type: "productCard",
        left: 658.91,
        top: 4943.501,
        width: 575.854,
        height: 549.667,
        background: namkeenCardBackground,
        texture: namkeenTexture,
        textureOpacity: 0.05,
        image: "assets/category-namkeen-papad-chavana.png",
        imageStyle: { left: 162.9, top: 44, width: 250, height: 404.591 },
        title: "Papad Chavana",
        titleClass: "text-namkeen-blue product-title-lg text-right",
        titleStyle: { right: 82.4, top: 471.1, width: 421 },
      },
      {
        type: "spotlight",
        top: 5541.168,
        title: "Royal\nCrunch...",
        items: [
          { image: "assets/category-namkeen-royal-moong.png" },
          { image: "assets/category-namkeen-royal-peanuts.png" },
          { image: "assets/category-namkeen-chana-jor-masala.png" },
        ],
      },
    ],
  },
  chikki: {
    title: "Chikki",
    copy: "Crafted with the goodness of jaggery and premium nuts for an authentic treat",
    height: 3753.753,
    hero: { mode: "chikki" },
    newsletter: { top: 3204.753, left: 44, background: "#d8efcf" },
    sections: [
      {
        type: "productCard",
        left: 45.24,
        top: 835.37,
        width: 549.667,
        height: 549.667,
        background: chikkiCardBackground,
        texture: "assets/category-chikki-card-texture.png",
        textureOpacity: 0.06,
        image: "assets/category-chikki-crush-peanut.png",
        imageStyle: { left: 263.65, top: 53.47, width: 196.35, height: 419.68 },
        badge: { label: "BEST SELLER", tone: "pink" },
        title: "Crush\nPeanut Chikki",
        titleClass: "text-chikki-red product-title-lg",
        titleStyle: { left: 15, top: 410, width: 382 },
      },
      {
        type: "productCard",
        left: 658.91,
        top: 835.37,
        width: 575.854,
        height: 549.667,
        background: chikkiCardBackground,
        texture: "assets/category-chikki-card-texture.png",
        textureOpacity: 0.06,
        image: "assets/category-chikki-peanut.png",
        imageStyle: { left: 70.93, top: 53.47, width: 197.59, height: 422.05 },
        title: "Peanut\nChikki",
        titleClass: "text-indigo product-title-lg text-right",
        titleStyle: { right: 29, top: 31, width: 266 },
      },
      {
        type: "productCard",
        left: 45.24,
        top: 1433.04,
        width: 357,
        height: 527,
        background: chikkiCardBackground,
        texture: "assets/category-chikki-card-texture.png",
        textureOpacity: 0.04,
        image: "assets/category-chikki-rajgira.png",
        imageStyle: { left: 115.28, top: 146.18, width: 124.25, height: 446.68 },
        title: "Rajgira Chikki",
        titleClass: "text-chikki-purple product-title-sm",
        titleStyle: { left: 33, top: 35, width: 291 },
      },
      {
        type: "promo",
        left: 443.5,
        top: 1433.41,
        width: 792,
        height: 533,
        background: "#2874a1",
        color: "#ffffff",
        buttonColor: "#286b95",
        ghost: "Chikki",
        title: "Wholesome Crunch,\nNaturally Sweet",
        copy: "Made with nutrient-rich rajgira and pure sweetness for a\nlight, satisfying bite.",
      },
      {
        type: "productCard",
        left: 46,
        top: 2025.9,
        width: 356,
        height: 527,
        background: chikkiBlueBackground,
        texture: null,
        image: "assets/category-chikki-dryfruit-mix.png",
        imageStyle: { left: -31.49, top: 226.08, width: 365.98, height: 230.2 },
        title: "Dry Fruit\nChikki",
        titleClass: "text-chikki-blue product-title-lg",
        titleStyle: { left: 33, top: 35, width: 260 },
        subtitle: "Mix",
        subtitleStyle: { left: 33, top: 129, width: 180 },
      },
      {
        type: "productCard",
        left: 462,
        top: 2025.9,
        width: 356,
        height: 527,
        background: chikkiBlueBackground,
        texture: null,
        image: "assets/category-chikki-cashew.png",
        imageStyle: { left: -46.14, top: 224.63, width: 382.53, height: 236.62 },
        title: "Dry Fruit\nChikki",
        titleClass: "text-chikki-blue product-title-lg",
        titleStyle: { left: 33, top: 35, width: 260 },
        subtitle: "Cashew Nuts",
        subtitleStyle: { left: 33, top: 129, width: 230 },
      },
      {
        type: "productCard",
        left: 878,
        top: 2025.9,
        width: 356,
        height: 527,
        background: chikkiBlueBackground,
        texture: null,
        image: "assets/category-chikki-almond.png",
        imageStyle: { left: -46.39, top: 221.18, width: 385.47, height: 243.23 },
        title: "Dry Fruit\nChikki",
        titleClass: "text-chikki-blue product-title-lg",
        titleStyle: { left: 33, top: 35, width: 260 },
        subtitle: "Almond",
        subtitleStyle: { left: 33, top: 129, width: 200 },
      },
      {
        type: "promo",
        left: 43.74,
        top: 2611.89,
        width: 792,
        height: 533,
        background: "#2874a1",
        color: "#ffffff",
        buttonColor: "#286b95",
        ghost: "Chikki",
        title: "Light Crunch, Guilt-Free\nSweetness",
        copy: "Made with puffed murmura and natural sweetness for a\nperfectly balanced bite.",
      },
      {
        type: "productCard",
        left: 877,
        top: 2611.89,
        width: 357,
        height: 527,
        background: chikkiBlueBackground,
        texture: null,
        image: "assets/category-chikki-murmura.png",
        imageStyle: { left: 67.66, top: 133.07, width: 222.87, height: 462.84 },
        title: "Murmura\nChikki",
        titleClass: "text-chikki-blue product-title-sm text-center",
        titleStyle: { left: 50, top: 35, width: 260 },
      },
    ],
  },
  khakhra: {
    title: "Khakhra",
    copy: "Thin, roasted to perfection with authentic Indian flavors in every bite.",
    height: 3742.179,
    hero: { mode: "khakhra" },
    newsletter: { top: 3205.179, left: 44, background: "#efd6cf" },
    sections: [
      {
        type: "productCard",
        left: 45.24,
        top: 835.37,
        width: 549.667,
        height: 549.667,
        background: khakhraCardBackground,
        texture: "assets/category-khakhra-card-texture.png",
        textureOpacity: 0.06,
        image: "assets/category-khakhra-masala.png",
        imageStyle: { left: 148.82, top: 54.96, width: 329.84, height: 360.15 },
        badge: { label: "BESTSELLER", tone: "muted" },
        title: "Masala\nKhakhra",
        titleClass: "text-khakhra-blue product-title-lg",
        titleStyle: { left: 15, top: 410, width: 329 },
      },
      {
        type: "productCard",
        left: 658.91,
        top: 835.37,
        width: 575.854,
        height: 549.667,
        background: khakhraCardBackground,
        texture: "assets/category-khakhra-card-texture.png",
        textureOpacity: 0.06,
        image: "assets/category-khakhra-7grain.png",
        imageStyle: { left: 82.5, top: 171.22, width: 320.13, height: 352.12 },
        title: "7 Grain\nKhakhra",
        titleClass: "text-khakhra-brown product-title-lg text-right",
        titleStyle: { right: 29, top: 47, width: 266 },
      },
      {
        type: "productCard",
        left: 45.24,
        top: 1433.04,
        width: 357,
        height: 527,
        background: khakhraCardBackground,
        texture: "assets/category-khakhra-card-texture.png",
        textureOpacity: 0.05,
        image: "assets/category-khakhra-fafda.png",
        imageStyle: { left: 60.5, top: 178.18, width: 243.99, height: 258.04 },
        title: "Fafda Khakhra",
        titleClass: "text-khakhra-red product-title-sm",
        titleStyle: { left: 33, top: 35, width: 300 },
      },
      {
        type: "promo",
        left: 443.5,
        top: 1433.41,
        width: 792,
        height: 533,
        background: "#be004b",
        color: "#ffffff",
        buttonColor: "#be004b",
        ghost: "Khakhra",
        title: "Bold Crunch, Gujarati\nStyle",
        copy: "Infused with the iconic taste of khakhra, crafted into a\nperfectly packed stuff.",
      },
      {
        type: "productCard",
        left: 46,
        top: 2025.9,
        width: 356,
        height: 527,
        background: khakhraCardBackground,
        texture: "assets/category-khakhra-card-texture.png",
        textureOpacity: 0.05,
        image: "assets/category-khakhra-jeera.png",
        imageStyle: { left: 44.9, top: 180.9, width: 250.09, height: 276.39 },
        title: "Jeera\nKhakhra",
        titleClass: "text-khakhra-red product-title-lg",
        titleStyle: { left: 33, top: 35, width: 274 },
      },
      {
        type: "productCard",
        left: 462,
        top: 2025.9,
        width: 356,
        height: 527,
        background: khakhraCardBackground,
        texture: "assets/category-khakhra-card-texture.png",
        textureOpacity: 0.05,
        image: "assets/category-khakhra-panipuri.png",
        imageStyle: { left: 53.8, top: 180.9, width: 248.41, height: 276.39 },
        title: "Pani Puri\nKhakhra",
        titleClass: "text-khakhra-red product-title-lg",
        titleStyle: { left: 34, top: 35, width: 321 },
      },
      {
        type: "productCard",
        left: 878,
        top: 2025.9,
        width: 356,
        height: 527,
        background: khakhraCardBackground,
        texture: "assets/category-khakhra-card-texture.png",
        textureOpacity: 0.05,
        image: "assets/category-khakhra-oats.png",
        imageStyle: { left: 52, top: 180.9, width: 250, height: 276.39 },
        title: "Oats\nKhakhra",
        titleClass: "text-khakhra-red product-title-lg",
        titleStyle: { left: 34, top: 35, width: 321 },
      },
      {
        type: "productCard",
        left: 46,
        top: 2606.9,
        width: 356,
        height: 527,
        background: khakhraCardBackground,
        texture: "assets/category-khakhra-card-texture.png",
        textureOpacity: 0.05,
        image: "assets/category-khakhra-chorafali.png",
        imageStyle: { left: 49.9, top: 182.31, width: 250.09, height: 277.44 },
        title: "Chorafali\nKhakhra",
        titleClass: "text-khakhra-red product-title-lg",
        titleStyle: { left: 33, top: 35, width: 274 },
      },
      {
        type: "productCard",
        left: 462,
        top: 2606.9,
        width: 356,
        height: 527,
        background: khakhraCardBackground,
        texture: "assets/category-khakhra-card-texture.png",
        textureOpacity: 0.05,
        image: "assets/category-khakhra-bajri.png",
        imageStyle: { left: 53, top: 182.48, width: 250, height: 277.28 },
        title: "Bajri\nKhakhra",
        titleClass: "text-khakhra-red product-title-lg",
        titleStyle: { left: 34, top: 35, width: 321 },
      },
      {
        type: "productCard",
        left: 878,
        top: 2606.9,
        width: 356,
        height: 527,
        background: khakhraCardBackground,
        texture: "assets/category-khakhra-card-texture.png",
        textureOpacity: 0.05,
        image: "assets/category-khakhra-garlic.png",
        imageStyle: { left: 56.73, top: 186.27, width: 242.55, height: 269.92 },
        title: "Garlic\nKhakhra",
        titleClass: "text-khakhra-red product-title-lg",
        titleStyle: { left: 34, top: 35, width: 321 },
      },
    ],
  },
  bakery: {
    title: "Bakery",
    copy: "Crafted with rich ingredients and perfected through traditional baking techniques.",
    height: 3140.099,
    hero: { mode: "bakery" },
    newsletter: { top: 2603.099, left: 44, background: "#cfeeef" },
    sections: [
      {
        type: "productCard",
        left: 45.24,
        top: 835.37,
        width: 549.667,
        height: 549.667,
        background: bakeryCardBackground,
        texture: "assets/category-bakery-card-texture.png",
        textureOpacity: 0.07,
        image: "assets/category-bakery-methi-khari.png",
        imageStyle: { left: 107.58, top: 54.55, width: 391.83, height: 334.03 },
        badge: { label: "BESTSELLER", tone: "muted" },
        title: "Surati\nMethi Khari",
        titleClass: "text-bakery-green product-title-lg",
        titleStyle: { left: 15, top: 410, width: 330 },
      },
      {
        type: "productCard",
        left: 658.91,
        top: 835.37,
        width: 575.854,
        height: 549.667,
        background: bakeryCardBackground,
        texture: "assets/category-bakery-card-texture.png",
        textureOpacity: 0.07,
        image: "assets/category-bakery-plain-khari.png",
        imageStyle: { left: 41.51, top: 170.18, width: 390, height: 332.55 },
        title: "Surati\nPlain Khari",
        titleClass: "text-bakery-brown product-title-lg text-right",
        titleStyle: { right: 29, top: 47, width: 300 },
      },
      {
        type: "productCard",
        left: 45.24,
        top: 1433.04,
        width: 357,
        height: 527,
        background: bakeryCardBackground,
        texture: "assets/category-bakery-card-texture.png",
        textureOpacity: 0.06,
        image: "assets/category-bakery-jeera-khari.png",
        imageStyle: { left: 23.6, top: 190.98, width: 307.61, height: 262.3 },
        title: "Surati\nJeera Khari",
        titleClass: "text-bakery-brown product-title-sm",
        titleStyle: { left: 33, top: 35, width: 285 },
      },
      {
        type: "promo",
        left: 443.5,
        top: 1433.41,
        width: 792,
        height: 533,
        background: "#00bea8",
        color: "#ffffff",
        buttonColor: "#00a591",
        ghost: "Bakery",
        title: "Flaky Layers, Classic\nFlavor",
        copy: "Infused with the aromatic touch of jeera for a rich, savory\nexperience.",
      },
      {
        type: "productCard",
        left: 46,
        top: 2025.9,
        width: 356,
        height: 527,
        background: bakeryCardBackground,
        texture: null,
        image: "assets/category-bakery-rusk.png",
        imageStyle: { left: -40.66, top: 178.96, width: 431.71, height: 348.04 },
        title: "Premium\nRusk",
        titleClass: "text-bakery-gold product-title-lg",
        titleStyle: { left: 33, top: 35, width: 274 },
      },
      {
        type: "productCard",
        left: 462,
        top: 2025.9,
        width: 356,
        height: 527,
        background: bakeryCardBackground,
        texture: null,
        image: "assets/category-bakery-coconut-card.png",
        imageStyle: { left: 0.75, top: 196.08, width: 355.81, height: 321.31 },
        title: "Coconut\nNankhatai",
        titleClass: "text-bakery-gold product-title-lg",
        titleStyle: { left: 34, top: 35, width: 321 },
      },
      {
        type: "productCard",
        left: 878,
        top: 2025.9,
        width: 356,
        height: 527,
        background: bakeryCardBackground,
        texture: null,
        image: "assets/category-bakery-surati-nankhatai.png",
        imageStyle: { left: 0, top: 194.46, width: 357.81, height: 323.93 },
        title: "Surati\nNankhatai",
        titleClass: "text-bakery-gold product-title-lg",
        titleStyle: { left: 34, top: 35, width: 321 },
      },
    ],
  },
  fryums: {
    title: "Fryums",
    copy: "Playful snacks packed with bold flavors and irresistible crunch.",
    badge: "LOREAM IPSUM",
    height: 3629.453,
    hero: { mode: "fryums" },
    newsletter: { top: 3092.453, left: 44, background: "#cbc6e8" },
    sections: [
      {
        type: "productCard",
        left: 45.24,
        top: 835.37,
        width: 549.667,
        height: 549.667,
        background: fryumsCardBackground,
        texture: "assets/category-fryums-card-texture.png",
        textureOpacity: 0.04,
        image: "assets/category-fryums-tasty-pasta.png",
        imageStyle: { left: 204.26, top: 55.52, width: 278.64, height: 374.8 },
        badge: { label: "BESTSELLER", tone: "muted" },
        title: "Tasty\nPasta",
        titleClass: "text-fryums-green product-title-lg",
        titleStyle: { left: 15, top: 410, width: 329 },
      },
      {
        type: "productCard",
        left: 658.91,
        top: 835.37,
        width: 575.854,
        height: 549.667,
        background: fryumsCardBackground,
        texture: "assets/category-fryums-card-texture.png",
        textureOpacity: 0.04,
        image: "assets/category-fryums-magic-abcde.png",
        imageStyle: { left: 82.15, top: 130.54, width: 280, height: 376.63 },
        title: "Magic\nABCDE",
        titleClass: "text-fryums-red product-title-lg text-right",
        titleStyle: { right: 29, top: 47, width: 266 },
      },
      {
        type: "productCard",
        left: 45.24,
        top: 1433.04,
        width: 357,
        height: 527,
        background: fryumsCardBackground,
        texture: "assets/category-fryums-card-texture.png",
        textureOpacity: 0.04,
        image: "assets/category-fryums-noodles-sticks.png",
        imageStyle: { left: 64.61, top: 175.03, width: 230.38, height: 286.86 },
        title: "Farali Kela\nChiwda Mitha",
        titleClass: "text-fryums-purple product-title-sm",
        titleStyle: { left: 33, top: 35, width: 333 },
      },
      {
        type: "promo",
        left: 443.5,
        top: 1433.41,
        width: 792,
        height: 533,
        background: "#0095be",
        color: "#ffffff",
        buttonColor: "#005676",
        ghost: "Fryums",
        title: "Light Crunch, Sweet\nDelight",
        copy: "A perfect mix of crispy textures and filled with flavours to\ndeepen your taste buds.",
      },
      {
        type: "productCard",
        left: 47,
        top: 2014.41,
        width: 471.679,
        height: 471.679,
        background: fryumsCardBackground,
        texture: "assets/category-fryums-card-texture.png",
        textureOpacity: 0.03,
        image: "assets/category-fryums-ringoli-tomato-rings.png",
        imageStyle: { left: 37.88, top: 67.5, width: 403.92, height: 403.92 },
        title: "Ringoli\nTomato Rings",
        titleClass: "text-fryums-ring product-title-sm text-center",
        titleStyle: { left: 78, top: 33, width: 316 },
      },
      {
        type: "feature",
        left: 559,
        top: 2014.41,
        width: 674,
        height: 472,
        background: fryumsCardBackground,
        kicker: "LIMITED EDITION",
        kickerColor: "#9d1f26",
        title: "Salted\nFinger Pipe",
        titleColor: "#d83913",
        copy: "Perfectly salted bites with a\ncrisp texture that keeps you\nmunching.",
        buttonColor: "#d83913",
        image: "assets/category-fryums-salted-finger-pipe.png",
        imageStyle: { left: 304, top: 32, width: 356, height: 393 },
      },
      {
        type: "productCard",
        left: 46,
        top: 2526,
        width: 356,
        height: 527,
        background: fryumsCardBackground,
        texture: "assets/category-fryums-card-texture.png",
        textureOpacity: 0.03,
        image: "assets/category-fryums-wheels-chaska.png",
        imageStyle: { left: 62.41, top: 179.07, width: 230, height: 286.39 },
        title: "Wheels\nChaska",
        titleClass: "text-fryums-darkgreen product-title-lg",
        titleStyle: { left: 33, top: 35, width: 245 },
      },
      {
        type: "productCard",
        left: 462,
        top: 2526,
        width: 356,
        height: 527,
        background: fryumsCardBackground,
        texture: "assets/category-fryums-card-texture.png",
        textureOpacity: 0.03,
        image: "assets/category-fryums-crunchy-cups.png",
        imageStyle: { left: 79.88, top: 167.58, width: 230, height: 309.38 },
        title: "Crunchy\nCups",
        titleClass: "text-fryums-magenta product-title-lg",
        titleStyle: { left: 34, top: 35, width: 321 },
      },
      {
        type: "productCard",
        left: 878,
        top: 2526,
        width: 356,
        height: 527,
        background: fryumsCardBackground,
        texture: "assets/category-fryums-card-texture.png",
        textureOpacity: 0.03,
        image: "assets/category-fryums-cone-cap.png",
        imageStyle: { left: 64.91, top: 167.58, width: 230, height: 309.37 },
        title: "Cone\nCap",
        titleClass: "text-fryums-deepgreen product-title-lg",
        titleStyle: { left: 34, top: 35, width: 321 },
      },
    ],
  },
  farali: {
    title: "Farali",
    copy: "A delightful crunch inspired by tradition, crafted with bold flavors for every fasting moment.",
    badge: "LOREAM IPSUM",
    height: 3629.453,
    hero: { mode: "farali" },
    newsletter: { top: 3092.453, left: 44, background: "#cbc6e8" },
    sections: [
      {
        type: "productCard",
        left: 45.24,
        top: 835.37,
        width: 549.667,
        height: 549.667,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #faf0ff 100%)",
        image: "assets/category-farali-chiwda-tikha.png",
        imageStyle: { left: 217, top: 40, width: 254, height: 411 },
        badge: { label: "BEST SELLER", tone: "brown" },
        title: "Farali\nChiwda Tikha",
        titleClass: "text-farali-brown product-title-lg",
        titleStyle: { left: 15, top: 409, width: 360 },
      },
      {
        type: "productCard",
        left: 658.91,
        top: 835.37,
        width: 575.854,
        height: 549.667,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #faf0ff 100%)",
        image: "assets/category-farali-chiwda-mitha.png",
        imageStyle: { left: 80, top: 108, width: 254, height: 411 },
        title: "Farali Chiwda\nMitha",
        titleClass: "text-indigo product-title-lg text-right",
        titleStyle: { right: 29, top: 47, width: 330 },
      },
      {
        type: "productCard",
        left: 45.24,
        top: 1433.04,
        width: 357,
        height: 527,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #faf0ff 100%)",
        image: "assets/category-farali-kela-chiwda-card.png",
        imageStyle: { left: -1, top: 118, width: 358, height: 402 },
        title: "Farali Kela\nChiwda Mitha",
        titleClass: "text-purple product-title-sm",
        titleStyle: { left: 33, top: 35, width: 333 },
      },
      {
        type: "promo",
        left: 443.5,
        top: 1433.41,
        width: 792,
        height: 533,
        background: "#0095be",
        color: "#ffffff",
        buttonColor: "#005676",
        ghost: "Farali",
        title: "Farali Feast, Perfected",
        copy: "Light, crispy chivda crafted for your fasting moments with a perfect touch of sweetness.\nA traditional taste reimagined with premium ingredients and irresistible crunch.",
      },
      {
        type: "productCard",
        left: 47,
        top: 2014.87,
        width: 471.679,
        height: 471.679,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #faf0ff 100%)",
        image: "assets/category-farali-sabudana.png",
        imageStyle: { left: 82, top: 112, width: 300, height: 350 },
        title: "Farali Sabudana\nChiwada",
        titleClass: "text-indigo product-title-sm text-center",
        titleStyle: { left: 88, top: 25, width: 295 },
      },
      {
        type: "feature",
        left: 559,
        top: 2014.41,
        width: 674,
        height: 472,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #faf0ff 100%)",
        kicker: "LIMITED EDITION",
        kickerColor: "#92322f",
        title: "Farali Kela\nChiwda\nTikha",
        titleColor: "#92322f",
        copy: "Packed with bold tikha\nFlavors.",
        buttonColor: "#9f3030",
        image: "assets/category-farali-kela-chiwda-tikha.png",
        imageStyle: { left: 360, top: 40, width: 245, height: 395 },
      },
      {
        type: "productCard",
        left: 46,
        top: 2526,
        width: 356,
        height: 527,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #faf0ff 100%)",
        image: "assets/category-farali-wafers-green-card.png",
        imageStyle: { left: 0, top: 120, width: 356, height: 388 },
        title: "Farali Kela\nWafers",
        titleClass: "text-deep-green product-title-lg",
        titleStyle: { left: 33, top: 35, width: 245 },
      },
      {
        type: "productCard",
        left: 462,
        top: 2526,
        width: 356,
        height: 527,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #faf0ff 100%)",
        image: "assets/category-farali-potato-wafers-card.png",
        imageStyle: { left: 0, top: 120, width: 357, height: 387 },
        title: "Farali Potato\nWafers",
        titleClass: "text-magenta product-title-lg",
        titleStyle: { left: 34, top: 35, width: 321 },
      },
      {
        type: "productCard",
        left: 878,
        top: 2526,
        width: 356,
        height: 527,
        background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #faf0ff 100%)",
        image: "assets/category-farali-wafers-white-card.png",
        imageStyle: { left: -1, top: 120, width: 357, height: 387 },
        title: "Farali Kela\nWafers",
        titleClass: "text-deep-green product-title-lg",
        titleStyle: { left: 33, top: 35, width: 245 },
      },
    ],
  },
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

function applyTopHeroLayout(page) {
  return {
    ...page,
    height: offsetFromHeroBottom(page.height),
    newsletter: page.newsletter ? { ...page.newsletter, top: offsetFromHeroBottom(page.newsletter.top) } : page.newsletter,
    sections: page.sections.map((section) => ({
      ...section,
      top: offsetFromHeroBottom(section.top),
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
  if (hero.mode === "getmore") {
    return (
      <div className="category-hero-custom category-hero-getmore" aria-hidden="true">
        <span className="getmore-blob" />
        <span className="getmore-line getmore-line-red" />
        <span className="getmore-line getmore-line-blue" />
        <img className="getmore-hero-pack getmore-hero-pack-red" src="assets/category-getmore-tomato.png" alt="" />
        <img className="getmore-hero-pack getmore-hero-pack-blue" src="assets/category-getmore-chatpata.png" alt="" />
      </div>
    );
  }

  if (hero.mode === "farali") {
    return (
      <div className="category-hero-custom category-hero-farali" aria-hidden="true">
        <img className="farali-hero-bg" src="assets/category-farali-hero-bg.png" alt="" />
        <img className="farali-hero-pack farali-pack-wafer" src="assets/category-farali-kela-wafers.png" alt="" />
        <img className="farali-hero-pack farali-pack-kela-tikha" src="assets/category-farali-kela-chiwda-tikha.png" alt="" />
        <img className="farali-hero-pack farali-pack-tikha" src="assets/category-farali-chiwda-tikha.png" alt="" />
        <img className="farali-hero-pack farali-pack-mitha" src="assets/category-farali-chiwda-mitha.png" alt="" />
        <img className="farali-hero-pack farali-pack-kela-mitha" src="assets/category-farali-kela-chiwda-mitha.png" alt="" />
      </div>
    );
  }

  if (hero.mode === "namkeen") {
    return (
      <div className="category-hero-custom category-hero-namkeen" aria-hidden="true">
        <img className="namkeen-hero-bg" src="assets/category-namkeen-hero-bg.png" alt="" />
        <img className="namkeen-hero-pack namkeen-pack-all-in-one" src="assets/category-namkeen-all-in-one.png" alt="" />
        <img className="namkeen-hero-pack namkeen-pack-chakhna" src="assets/category-namkeen-chakhna-mix.png" alt="" />
        <img className="namkeen-hero-pack namkeen-pack-papad" src="assets/category-namkeen-papad-chavana.png" alt="" />
        <img className="namkeen-hero-pack namkeen-pack-gathiya" src="assets/category-namkeen-bhavnagari-gathiya.png" alt="" />
        <img className="namkeen-hero-pack namkeen-pack-sev-mamra" src="assets/category-namkeen-masala-sev-mamra.png" alt="" />
      </div>
    );
  }

  if (hero.mode === "chikki") {
    return (
      <div className="category-hero-custom category-hero-chikki" aria-hidden="true">
        <img className="chikki-hero-bg" src="assets/category-chikki-hero-bg.svg" alt="" />
        <img className="chikki-hero-products" src="assets/category-chikki-hero-products.png" alt="" />
      </div>
    );
  }

  if (hero.mode === "khakhra") {
    return (
      <div className="category-hero-custom category-hero-khakhra" aria-hidden="true">
        <img className="khakhra-hero-bg" src="assets/category-khakhra-hero-bg.svg" alt="" />
        <img className="khakhra-hero-pack khakhra-pack-7grain" src="assets/category-khakhra-7grain.png" alt="" />
        <img className="khakhra-hero-pack khakhra-pack-panipuri" src="assets/category-khakhra-panipuri.png" alt="" />
        <img className="khakhra-hero-pack khakhra-pack-fafda" src="assets/category-khakhra-fafda.png" alt="" />
        <img className="khakhra-hero-pack khakhra-pack-jeera" src="assets/category-khakhra-jeera.png" alt="" />
        <img className="khakhra-hero-pack khakhra-pack-masala" src="assets/category-khakhra-masala.png" alt="" />
      </div>
    );
  }

  if (hero.mode === "bakery") {
    return (
      <div className="category-hero-custom category-hero-bakery" aria-hidden="true">
        <span className="bakery-hero-curve" />
        <img className="bakery-hero-pack bakery-pack-plain" src="assets/category-bakery-plain-khari.png" alt="" />
        <img className="bakery-hero-pack bakery-pack-coconut" src="assets/category-bakery-coconut-nankhatai.png" alt="" />
        <img className="bakery-hero-pack bakery-pack-methi" src="assets/category-bakery-methi-khari.png" alt="" />
      </div>
    );
  }

  if (hero.mode === "fryums") {
    return (
      <div className="category-hero-custom category-hero-fryums" aria-hidden="true">
        <img className="fryums-hero-bg" src="assets/category-fryums-hero-bg.png" alt="" />
        <img className="fryums-hero-pack fryums-pack-cone" src="assets/category-fryums-cone-cap.png" alt="" />
        <img className="fryums-hero-pack fryums-pack-magic" src="assets/category-fryums-magic-abcde.png" alt="" />
        <img className="fryums-hero-pack fryums-pack-noodles" src="assets/category-fryums-noodles-sticks.png" alt="" />
        <img className="fryums-hero-pack fryums-pack-pasta" src="assets/category-fryums-tasty-pasta.png" alt="" />
        <img className="fryums-hero-pack fryums-pack-cups" src="assets/category-fryums-crunchy-cups.png" alt="" />
      </div>
    );
  }

  if (hero.mode === "chipsWide") {
    return (
      <div className="category-hero-custom category-hero-chips-wide" aria-hidden="true">
        <img className="chips-wide-hero-bg" src="assets/category-chips-wide-hero-bg.png" alt="" />
        <img className="chips-wide-hero-pack chips-wide-pack-salted" src="assets/category-chips-wide-hero-salted.png" alt="" />
        <img className="chips-wide-hero-pack chips-wide-pack-tomato" src="assets/category-chips-wide-hero-tomato.png" alt="" />
        <img className="chips-wide-hero-pack chips-wide-pack-masti" src="assets/category-chips-wide-hero-masti.png" alt="" />
        <img className="chips-wide-hero-pack chips-wide-pack-onion" src="assets/category-chips-wide-hero-onion.png" alt="" />
        <img className="chips-wide-hero-pack chips-wide-pack-chilli" src="assets/category-chips-wide-hero-chilli.png" alt="" />
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
      {title.split("\n").map((line) => (
        <span key={line}>{line}</span>
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
    <article className="category-product-card category-product-card--product" style={{ ...boxStyle(item), background: item.background }}>
      {item.texture === null ? null : (
        <img
          className="category-product-texture"
          src={item.texture || cardTexture}
          alt=""
          aria-hidden="true"
          style={item.textureOpacity === undefined ? undefined : { opacity: item.textureOpacity }}
        />
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
        <a href="#" style={{ background: item.buttonColor }}>
          {item.buttonLabel || "BUY NOW"}
          <svg className="category-feature-arrow" aria-hidden="true" viewBox="0 0 16 16" focusable="false">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>
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
    <section className="category-spotlight" style={{ top: cssLength(item.top) }} aria-label="Royal Crunch products">
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
            <img className="category-spotlight-ring" src="assets/category-namkeen-royal-card-ring.svg" alt="" aria-hidden="true" />
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
  const page = applyTopHeroLayout(pages[pageKey] || pages.chips);

  return (
    <main className={`category-main category-main--${pageKey}`} aria-label={`${page.title} category page`} style={{ height: cssLength(page.height) }}>
      <CategoryHero page={page} />
      <ProductSubNav active={pageKey} placement="top" />
      {page.sections.map((section, index) => (
        <CategorySection key={`${section.type}-${section.left}-${section.top}-${index}`} item={section} />
      ))}
      <NewsletterPatch config={page.newsletter} />
    </main>
  );
}
