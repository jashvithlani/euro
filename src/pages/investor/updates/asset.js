/** Resolve a file in this page's ./assets/ folder. */
export function asset(fileName) {
  return new URL(`./assets/${fileName}`, import.meta.url).href;
}
