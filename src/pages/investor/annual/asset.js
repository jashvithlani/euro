/** Resolve a file in this page's ./assets/ folder. */
export function annualAsset(fileName) {
  return new URL(`./assets/${fileName}`, import.meta.url).href;
}
