/** Figma category frames are authored at 1920px; the app canvas is 1280px. */
export const FIGMA_SCALE = 1280 / 1920;

export function scalePx(value) {
  if (typeof value !== "number") return value;
  return Math.round(value * FIGMA_SCALE * 1000) / 1000;
}

const SKIP_KEYS = new Set([
  "type",
  "title",
  "copy",
  "image",
  "texture",
  "background",
  "className",
  "titleClass",
  "tone",
  "label",
  "ghost",
  "mode",
  "color",
  "copyColor",
  "buttonColor",
  "kicker",
  "kickerColor",
  "titleColor",
  "buttonLabel",
  "transform",
  "textureOpacity",
  "nodeId",
  "titleImportantStyle",
]);

export function scaleLayout(value) {
  if (typeof value === "number") return scalePx(value);
  if (Array.isArray(value)) return value.map(scaleLayout);
  if (!value || typeof value !== "object") return value;

  const scaled = {};
  for (const [key, nested] of Object.entries(value)) {
    scaled[key] = SKIP_KEYS.has(key) ? nested : scaleLayout(nested);
  }
  return scaled;
}

export function scaleCategoryPage(page, overrides = {}) {
  return {
    ...scaleLayout(page),
    ...overrides,
    hero: overrides.hero ?? page.hero,
    newsletter: overrides.newsletter
      ? { ...scaleLayout(page.newsletter), ...overrides.newsletter }
      : scaleLayout(page.newsletter),
  };
}
