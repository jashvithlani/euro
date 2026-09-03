/**
 * <OptimizedImage> — shared responsive <picture> component.
 *
 * Renders AVIF + WebP <source> elements (when the build-time pipeline produced
 * variants) plus the original raster as the <img> fallback. Handles:
 *   - responsive srcset/sizes,
 *   - explicit width/height to prevent layout shift,
 *   - eager page-level loading with fetchpriority for the LCP image,
 *   - object-fit / object-position,
 *   - decorative vs content alt text.
 *
 * Pass either:
 *   <OptimizedImage fileName="hero-products.png" alt="…" sizes="…" />
 * or a pre-resolved descriptor:
 *   <OptimizedImage asset={responsiveAsset("hero-products.png")} alt="…" />
 *
 * The forwarded ref points at the inner <img> element so callers that need to
 * mutate inline styles post-mount (e.g. category page important-style overrides)
 * still receive the real DOM node.
 *
 * SVGs and files not present in the manifest render as a plain <img> using the
 * resolved URL (so SVGs stay vector and remote URLs still work).
 */
import { forwardRef } from "react";
import { responsiveAsset, responsiveAssetFromUrl } from "../shared/responsive-image.js";

const DEFAULT_DECODING = "async";
const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

function fixedSource(sourceDescriptor, format, targetWidth, media) {
  if (!targetWidth || !sourceDescriptor) return null;
  const variants = sourceDescriptor[`${format}Variants`] || [];
  const variant = variants.find(({ w }) => w >= targetWidth) || variants.at(-1);
  if (!variant) return null;

  return {
    key: `${media}-${format}`,
    media,
    type: `image/${format}`,
    srcSet: variant.src,
    w: variant.w,
    h: Math.round((sourceDescriptor.h / sourceDescriptor.w) * variant.w),
  };
}

const OptimizedImage = forwardRef(function OptimizedImage(
  {
    fileName,
    asset: assetProp,
    src: srcProp,
    mobileSrc,
    mobileMedia = "(max-width: 999px)",
    mobileSizes,
    mobileWidth,
    tabletWidth,
    desktopWidth,
    phoneMedia = "(max-width: 767px)",
    tabletMedia = "(min-width: 768px) and (max-width: 999px)",
    desktopMedia = "(min-width: 1000px)",
    desktopOnly = false,
    alt = "",
    sizes,
    width,
    height,
    loading,
    priority = false,
    fetchpriority,
    fetchPriority,
    decoding = DEFAULT_DECODING,
    objectFit,
    objectPosition,
    className,
    style,
    ...rest
  },
  ref,
) {
  const descriptor =
    assetProp ||
    (fileName ? responsiveAsset(fileName, srcProp) : null) ||
    (srcProp ? responsiveAssetFromUrl(srcProp) : null);
  const mobileDescriptor = mobileSrc ? responsiveAssetFromUrl(mobileSrc) : null;
  const mobileSourceDescriptor = mobileDescriptor || descriptor;
  const usesThreeTiers = Boolean(tabletWidth || desktopWidth);
  const fixedMobileMedia = usesThreeTiers ? phoneMedia : mobileMedia;
  const fixedSources = [
    ...(!desktopOnly
      ? [
          fixedSource(mobileSourceDescriptor, "avif", mobileWidth, fixedMobileMedia),
          fixedSource(mobileSourceDescriptor, "webp", mobileWidth, fixedMobileMedia),
          fixedSource(mobileSourceDescriptor, "avif", tabletWidth, tabletMedia),
          fixedSource(mobileSourceDescriptor, "webp", tabletWidth, tabletMedia),
        ]
      : []),
    fixedSource(descriptor, "avif", desktopWidth, desktopMedia),
    fixedSource(descriptor, "webp", desktopWidth, desktopMedia),
  ].filter(Boolean);

  // SVG, remote URL, or unknown file — fall back to a plain <img>.
  if (!descriptor) {
    const resolvedSrc = srcProp;
    if (!resolvedSrc) return null;
    const imgStyle = { ...style };
    if (objectFit) imgStyle.objectFit = objectFit;
    if (objectPosition) imgStyle.objectPosition = objectPosition;
    return (
      <img
        ref={ref}
        src={resolvedSrc}
        alt={alt}
        loading={loading || "eager"}
        decoding={decoding}
        {...(width ? { width } : {})}
        {...(height ? { height } : {})}
        {...(fetchPriority || fetchpriority || priority ? { fetchPriority: fetchPriority || fetchpriority || "high" } : {})}
        {...(priority ? { "data-loader-critical": "true" } : {})}
        className={className}
        style={imgStyle}
        {...rest}
      />
    );
  }

  const isPriority = Boolean(priority);
  // Once a route is mounted, begin warming that page's image cache. The LCP
  // image is still the only high-priority request; everything else retains
  // the browser's normal priority so it does not outrank the first view.
  const resolvedLoading = loading || "eager";
  const resolvedFetchpriority = fetchPriority || fetchpriority || (isPriority ? "high" : undefined);

  // Intrinsic dimensions from the manifest prevent CLS.
  const intrinsicW = width || descriptor.w;
  const intrinsicH = height || descriptor.h;

  const imgStyle = { ...style };
  if (objectFit) imgStyle.objectFit = objectFit;
  if (objectPosition) imgStyle.objectPosition = objectPosition;

  const imgProps = {
    ref,
    src: desktopOnly ? TRANSPARENT_PIXEL : descriptor.src,
    alt,
    loading: resolvedLoading,
    decoding,
    ...(intrinsicW ? { width: intrinsicW } : {}),
    ...(intrinsicH ? { height: intrinsicH } : {}),
    ...(resolvedFetchpriority ? { fetchPriority: resolvedFetchpriority } : {}),
    ...(isPriority ? { "data-loader-critical": "true" } : {}),
    className,
    style: imgStyle,
    ...rest,
  };

  if (!descriptor.avif && !descriptor.webp) {
    return <img {...imgProps} />;
  }

  const sourceDimensions = (sourceDescriptor) => ({
    width: sourceDescriptor.w,
    height: sourceDescriptor.h,
  });

  return (
    <picture>
      {fixedSources.map((source) => (
        <source
          key={source.key}
          media={source.media}
          type={source.type}
          srcSet={source.srcSet}
          width={source.w}
          height={source.h}
        />
      ))}
      {!desktopOnly && mobileDescriptor?.avif && !mobileWidth ? (
        <source
          media={mobileMedia}
          type="image/avif"
          srcSet={mobileDescriptor.avif}
          sizes={mobileSizes || sizes}
          {...sourceDimensions(mobileDescriptor)}
        />
      ) : null}
      {!desktopOnly && mobileDescriptor?.webp && !mobileWidth ? (
        <source
          media={mobileMedia}
          type="image/webp"
          srcSet={mobileDescriptor.webp}
          sizes={mobileSizes || sizes}
          {...sourceDimensions(mobileDescriptor)}
        />
      ) : null}
      {descriptor.avif && !desktopWidth ? (
        <source
          type="image/avif"
          srcSet={descriptor.avif}
          sizes={sizes}
          {...(desktopOnly ? { media: desktopMedia } : {})}
          {...sourceDimensions(descriptor)}
        />
      ) : null}
      {descriptor.webp && !desktopWidth ? (
        <source
          type="image/webp"
          srcSet={descriptor.webp}
          sizes={sizes}
          {...(desktopOnly ? { media: desktopMedia } : {})}
          {...sourceDimensions(descriptor)}
        />
      ) : null}
      {desktopOnly ? <source media={desktopMedia} srcSet={descriptor.src} /> : null}
      <img {...imgProps} />
    </picture>
  );
});

export default OptimizedImage;
