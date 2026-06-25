export const asset = (fileName) => new URL(`./assets/${fileName}`, import.meta.url).href;
