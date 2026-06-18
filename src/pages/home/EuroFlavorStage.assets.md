# Euro Flavor Stage Assets

Used existing local assets only. No animation dependency was added; the section uses a scoped React scroll-progress hook with CSS transform/opacity transitions.

- Intro: `src/pages/home/assets/hero-products.png`
- Chips: `src/pages/home/assets/bestseller-tomato.png`
- Getmore: `src/pages/category/assets/category-getmore-tomato.png`
- Namkeen: `src/pages/category/assets/category-namkeen-royal-peanuts.png`
- Beverages: `src/pages/category/assets/category-beverage-sparker.png`
- Product wall: existing chips, Getmore, Namkeen, beverage, and Chikki pack assets from `src/pages/home/assets` and `src/pages/category/assets`.

For final polish, replace any older tournament-branded chips packs with clean current transparent pack cutouts when those are available. Khakhra, Bakery, and Fryums can be added to the wall later if smaller transparent cutouts are exported; the current source files for some of those packs are multi-megabyte images. The component scene config is centralized in `EuroFlavorStage.jsx` so swaps only require changing the asset path and alt text.

## Motion polish notes

The enhanced Flavor Stage keeps scroll progress on the outer product/particle layers, then uses nested pointer and ambient layers for product tilt, slow float, shine sweeps, particle drift, and breathing stage light. Tune intensity in `EuroFlavorStage.css` by adjusting the `--pointer-nx` / `--pointer-ny` multipliers on `__product-pointer-layer`, `__particles-parallax`, `__background-aura`, and the `euro-stage-*` keyframes.

The product tilt and section glow are driven by `useFlavorStagePointer` in `EuroFlavorStage.jsx`. The custom cursor itself is global in `src/components/GlobalPointerCursor.jsx` and `src/components/GlobalPointerCursor.css`; elements opt into cursor states with `data-cursor="product"`, `data-cursor="cta"`, or `data-cursor="flavor"`, CTA labels use `data-cursor-label`, and special surfaces can override color sampling with `data-cursor-color`. Pointer CSS variables are written directly with `requestAnimationFrame`, so React state is not updated during pointer movement.

Global cursor color is adaptive: it samples the visible surface under the pointer, derives a restrained complementary accent, and writes the palette to CSS variables. Tune the color feel in `deriveCursorPalette` / `getReadableAccent` and tune transition softness in `GlobalPointerCursor.css`.

Reduced motion, mobile, and coarse-pointer users keep native cursor behavior and the static/mobile Flavor Stage: pointer hooks disable themselves, the global cursor is hidden, and infinite ambient animations are gated behind `prefers-reduced-motion: no-preference`.
