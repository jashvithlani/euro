/** Resolve a file under src/shared/assets/ (logos, footer, global icons). */
export function sharedAsset(fileName) {
  return new URL(`./assets/${fileName}`, import.meta.url).href;
}
