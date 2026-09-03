import { normalizePath } from "./site-routing.js";

export const DEFAULT_DOCUMENT_TITLE = "Euro India Foods";

export const SEO_METADATA_BY_PATH = Object.freeze({
  "/": Object.freeze({
    title: "Best Indian Snack Brand & Food Manufacturer | EURO India Foods",
    description:
      "Discover EURO India Foods, a popular snack brand and food manufacturer in India. Browse authentic Made in India snacks and beverages crafted with quality ingredients and hygienic processing.",
  }),
  "/about": Object.freeze({
    title: "Leading Food Manufacturer in India | About EURO India Foods",
    description:
      "Meet EURO India Foods, a trusted Indian food manufacturer creating tasty, authentic and value-for-money treats with quality ingredients, modern manufacturing and hygienic processing.",
  }),
  "/chips": Object.freeze({
    title: "Premium Potato Chips Manufacturer & Exporter | EURO India Foods",
    description:
      "Shop and browse EURO premium potato chips in tasty flavours. Made in India with quality ingredients and hygienic processing by a popular Indian snack manufacturer and exporter.",
  }),
  "/getmore": Object.freeze({
    title: "Extruded Snacks Manufacturer & Exporter India | EURO Getmore",
    description:
      "Browse EURO Getmore extruded snacks, tasty and value-for-money treats loved by families. Made with quality ingredients and hygienic processing by an Indian food manufacturer and exporter.",
  }),
  "/namkeen": Object.freeze({
    title: "Namkeen Manufacturer & Exporter in India | EURO India Foods",
    description:
      "Explore authentic Indian namkeen, sev, mixtures, dal and savoury snacks from EURO. Tasty, hygienically processed and value-for-money products from a trusted Indian snack manufacturer and exporter.",
  }),
  "/beverages": Object.freeze({
    title: "Fruit Beverage Manufacturer & Exporter India | EURO India Foods",
    description:
      "Browse refreshing EURO fruit beverages in mango, litchi, guava, lemon and more. Quality Made in India drinks produced with hygienic processing by a trusted food manufacturer and exporter.",
  }),
  "/chikki": Object.freeze({
    title: "Chikki Manufacturer & Exporter in India | EURO India Foods",
    description:
      "Shop authentic EURO Indian chikki, tasty value-for-money treats made with quality ingredients and hygienic processing. A delicious snack loved by families for everyday moments.",
  }),
  "/khakhra": Object.freeze({
    title: "Khakhra Manufacturer & Exporter in India | EURO India Foods",
    description:
      "Browse premium EURO khakhra in authentic Indian flavours. Made in India with quality ingredients and hygienic processing, these tasty snacks complement tea, meals and everyday cravings.",
  }),
  "/bakery": Object.freeze({
    title: "Bakery Products Manufacturer & Exporter | EURO India Foods",
    description:
      "Explore premium EURO bakery products and tasty packaged treats made with quality ingredients and hygienic processing. Browse value-for-money snacks for tea-time, sharing and family moments.",
  }),
  "/dealers": Object.freeze({
    title: "Indian Snacks Dealership & Distributorship | EURO India Foods",
    description:
      "Partner with EURO India Foods, a popular Indian snack brand, food manufacturer and exporter. Explore dealership and distributorship opportunities for quality snacks, namkeen and beverages.",
  }),
  "/contact": Object.freeze({
    title: "Contact Indian Food Manufacturer & Exporter | EURO India Foods",
    description:
      "Contact EURO India Foods for products, exports, dealership and distribution enquiries. Connect with a trusted Indian food manufacturer offering premium snacks, beverages and family favourites.",
  }),
  "/investor": Object.freeze({
    title: "Investor Relations | EURO India Fresh Foods Limited",
    description:
      "Explore investor information, financial updates, corporate disclosures and shareholder resources for EURO India Fresh Foods Limited, an Indian packaged food manufacturing company.",
  }),
  "/exports": Object.freeze({
    title: "Indian Snacks & Food Exporter to 20 Countries | EURO India Foods",
    description:
      "EURO India Foods is a leading Indian snacks manufacturer and exporter reaching 20 countries worldwide. Explore authentic Made in India snacks and premium packaged foods crafted with quality ingredients.",
  }),
  "/achievements": Object.freeze({
    title: "Achievements of a Popular Indian Snack Brand | EURO India Foods",
    description:
      "Discover EURO India Foods' awards, milestones and achievements as a popular Indian snack brand and food manufacturer focused on quality ingredients, hygienic processing and consistent growth.",
  }),
  "/career": Object.freeze({
    title: "Careers at a Leading Food Manufacturer in India | EURO India Foods",
    description:
      "Explore careers at EURO India Foods, a growing Indian food manufacturer and popular snack brand. Browse opportunities in food manufacturing, quality, sales, operations and more.",
  }),
});

const SEO_PATH_ALIASES = Object.freeze({
  "/bevereges": "/beverages",
  "/dealer": "/dealers",
});

export function getSeoMetadata(pathname) {
  const path = normalizePath(pathname);
  const resolvedPath = SEO_PATH_ALIASES[path] ?? path;

  if (resolvedPath.startsWith("/investor/")) {
    return SEO_METADATA_BY_PATH["/investor"];
  }

  return SEO_METADATA_BY_PATH[resolvedPath];
}
