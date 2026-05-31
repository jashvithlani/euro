import { asset } from "./asset.js";
import { scaleCategoryPage } from "./category-scale.js";

/** Getmore — Figma 1159:192 @ 1920px → 1280px (× 2/3). */
const getmoreAt1920 = {
  title: "Getmore",
  copy: (
    <>
      Artisanal crunch meets bold Indian spices.
      <br />
      Discover our gallery of signature flavors.
    </>
  ),
  height: 1712,
  hero: {
    mode: "getmoreWide",
  },
  heroClassName: "category-hero--getmore-top-nav",
  subnavPlacement: "top",
  newsletter: {
    top: 1383,
    left: 70,
    background: "#cfeeef",
    className: "category-newsletter--getmore-compact",
  },
  sections: [
    {
      type: "productCard",
      left: 68,
      top: 885,
      width: 870,
      height: 448,
      background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #f8ebff 100%)",
      image: asset("category-getmore-tomato.png"),
      imageStyle: { left: 27.18, top: 37.93, width: 350.4, height: 405.36, transform: "rotate(-6.84deg)" },
      badge: { label: "BEST SELLER", tone: "pink", style: { left: 575.58, top: 345.56 } },
      title: "Tingling\nTomato",
      titleClass: "text-tomato product-title-getmore text-right",
      titleStyle: { left: 443, top: 28, width: 329 },
    },
    {
      type: "productCard",
      left: 977,
      top: 885,
      width: 870,
      height: 448,
      background: "radial-gradient(circle at 50% 50%, #f6f6f6 0%, #f8ebff 100%)",
      image: asset("category-getmore-chatpata.png"),
      imageStyle: { left: 24, top: 34, width: 352.48, height: 405.92, transform: "rotate(6.84deg)" },
      title: "Chatpata\nMasala",
      titleClass: "text-indigo product-title-getmore",
      titleStyle: { left: 510, top: 48, width: 266.45 },
    },
  ],
};

export const getmorePage = scaleCategoryPage(getmoreAt1920);
