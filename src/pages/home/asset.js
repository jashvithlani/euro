/** Resolve a file in this page's ./assets/ folder.
 * Prefers a sibling .webp when one exists (smaller, same quality),
 * else falls back to the requested file (e.g., .png). */
export function asset(fileName) {
  return new URL(`./assets/${fileName}`, import.meta.url).href;
}
