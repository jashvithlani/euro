import manifest from "./image-manifest.json";

const sourceNames = Object.keys(manifest);
const sourceCandidates = sourceNames
  .map((source) => ({
    source,
    extension: source.slice(source.lastIndexOf(".")).toLowerCase(),
    base: source.slice(0, source.lastIndexOf(".")),
  }))
  .sort((a, b) => b.base.length - a.base.length);

function descriptor(sourceName, fallbackSrc) {
  const entry = manifest[sourceName];
  if (!entry || !fallbackSrc) return null;
  const toSrcSet = (variants = []) => variants.map(({ src, w }) => `${src} ${w}w`).join(", ");

  return {
    src: fallbackSrc,
    avif: toSrcSet(entry.avif),
    webp: toSrcSet(entry.webp),
    avifVariants: entry.avif || [],
    webpVariants: entry.webp || [],
    widths: (entry.avif || []).map(({ w }) => w),
    w: entry.w,
    h: entry.h,
    alpha: entry.alpha,
    sourceName,
  };
}

function basenameFromUrl(url) {
  try {
    return decodeURIComponent(url.split("/").pop().split("?")[0]);
  } catch {
    return url.split("/").pop().split("?")[0];
  }
}

function sourceNameFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  const basename = basenameFromUrl(url);
  if (manifest[basename]) return basename;

  const extension = basename.slice(basename.lastIndexOf(".")).toLowerCase();
  for (const candidate of sourceCandidates) {
    if (candidate.extension !== extension) continue;
    // Vite emits <original-base>-<content-hash>.<ext>. Matching against the
    // known source basename avoids guessing where a hyphenated name ends.
    if (basename.startsWith(`${candidate.base}-`)) return candidate.source;
  }
  return null;
}

export function responsiveAsset(fileName, fallbackSrc) {
  return descriptor(fileName, fallbackSrc);
}

export function responsiveAssetFromUrl(url) {
  const sourceName = sourceNameFromUrl(url);
  return sourceName ? descriptor(sourceName, url) : null;
}

export function resolveAsset() {
  return null;
}
