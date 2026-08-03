export function asset(fileName) {
  return new URL(`./assets/${fileName}`, import.meta.url).href;
}
