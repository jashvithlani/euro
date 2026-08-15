/**
 * Previously this module eagerly fetched EVERY image asset across the site a
 * few seconds after the home page landed, in an attempt to warm the cache for
 * other pages. With ~76 MB of source imagery (now ~66 MB of AVIF/WebP
 * variants), that behavior was actively harmful: it flooded mobile data plans,
 * competed with the LCP image for bandwidth, and burned battery on devices
 * that might never navigate to those pages.
 *
 * It is intentionally a no-op now. Modern browsers, combined with the
 * responsive <picture> pipeline (AVIF/WebP srcset + sizes + native lazy
 * loading), fetch the right image for each viewport only when it is needed.
 * Keep this stub so existing imports don't break; remove the call sites when
 * convenient.
 */
export function prefetchImagesAfterDelay() {
  /* intentionally disabled — see module doc */
}

export default prefetchImagesAfterDelay;
