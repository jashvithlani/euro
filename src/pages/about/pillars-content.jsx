import { asset as categoryAsset } from "../category/asset.js";

export const pillars = [
  {
    id: "quality",
    title: "Quality",
    icon: "about-icon-quality.svg",
    iconClass: "pillar-icon-quality",
    product: categoryAsset("category-chips-wide-hero-masti.png"),
    copy: "Sourcing only the finest ingredients from local Indian farms to ensure every bite is a premium experience.",
  },
  {
    id: "innovation",
    title: "Innovation",
    icon: "about-icon-innovation.svg",
    iconClass: "pillar-icon-innovation",
    product: categoryAsset("category-beverage-fig-mango.png"),
    copy: "Reimagining traditional textures and shapes for a youthful, modern snacking aesthetic.",
  },
  {
    id: "community",
    title: "Community",
    icon: "about-icon-community.svg",
    iconClass: "pillar-icon-community",
    product: categoryAsset("category-getmore-tomato.png"),
    copy: "Building a sustainable ecosystem that supports our farmers and delights our consumers worldwide.",
  },
  {
    id: "taste",
    title: "Taste",
    icon: "about-icon-taste.svg",
    iconClass: "pillar-icon-taste",
    product: categoryAsset("category-khakhra-masala.png"),
    copy: "An uncompromising commitment to bold, authentic, and memorable flavor profiles.",
  },
];
