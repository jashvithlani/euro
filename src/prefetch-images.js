/**
 * Previously this module eagerly fetched every image asset across the entire
 * site after the home page landed. That cross-route prefetch remains disabled:
 * it wastes bandwidth on pages the visitor may never open.
 *
 * Mounted pages now render their own responsive images eagerly. This lets the
 * browser begin downloading the correct AVIF/WebP candidate for everything on
 * the current page while keeping future routes out of the request queue. Keep
 * this stub so existing imports do not break.
 */
export function prefetchImagesAfterDelay() {
  /* intentionally disabled — see module doc */
}

export default prefetchImagesAfterDelay;
