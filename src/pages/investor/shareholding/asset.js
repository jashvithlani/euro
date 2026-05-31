/** Resolve a file in this route's ./assets/ folder. */
export function asset(fileName) {
  return new URL(`./assets/${fileName}`, import.meta.url).href;
}
