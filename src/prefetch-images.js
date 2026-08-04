/**
 * Prefetch every image asset across the app a short delay after the
 * home page lands, so that when the user navigates to any other page the
 * images are already in the browser cache and those pages feel instant.
 *
 * Uses lazy import.meta.glob (eager: false, query: "?url") so the
 * home page JS chunk stays small — the image modules are fetched on demand
 * after the delay, which warms the HTTP cache. requestIdleCallback
 * keeps the prefetch off the main thread so the home page stays snappy.
 */
const imageLoaders = import.meta.glob("../**/assets/*.{png,jpeg,jpg,webp}", {
  eager: false,
  query: "?url",
});

let scheduled = false;

export function prefetchImagesAfterDelay(delayMs = 10000) {
  if (scheduled || typeof window === "undefined") return;
  scheduled = true;

  const run = () => {
    for (const loader of Object.values(imageLoaders)) {
      // Calling the lazy loader triggers a dynamic import which
      // resolves the asset URL and fetches the image — warming the cache.
      loader().catch(() => {
        /* network failures are fine — the cache will just be cold for that image */
      });
    }
  };

  // Defer so the home page renders first. The dynamic imports below
  // are async, so they fetch images off the main thread without blocking.
  window.setTimeout(run, delayMs);
}

export default prefetchImagesAfterDelay;
