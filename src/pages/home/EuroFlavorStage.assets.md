# Euro Flavor Stage Assets

Used existing local assets only. No animation dependency was added; the section uses a scoped React scroll-progress hook with CSS transform/opacity transitions.

- Intro: `src/pages/home/assets/hero-products.png`
- Chips: `src/pages/home/assets/bestseller-tomato.png`
- Getmore: `src/pages/category/assets/category-getmore-tomato.png`
- Namkeen: `src/pages/category/assets/category-namkeen-royal-peanuts.png`
- Beverages: `src/pages/category/assets/category-beverage-sparker.png`
- Product wall: existing chips, Getmore, Namkeen, beverage, and Chikki pack assets from `src/pages/home/assets` and `src/pages/category/assets`.

For final polish, replace any older tournament-branded chips packs with clean current transparent pack cutouts when those are available. Khakhra, Bakery, and Fryums can be added to the wall later if smaller transparent cutouts are exported; the current source files for some of those packs are multi-megabyte images. The component scene config is centralized in `EuroFlavorStage.jsx` so swaps only require changing the asset path and alt text.
