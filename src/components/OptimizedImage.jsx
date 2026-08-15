/**
 * <OptimizedImage> — shared responsive <picture> component.
 *
 * Renders AVIF + WebP <source> elements (when the build-time pipeline produced
 * variants) plus the original raster as the <img> fallback. Handles:
 *   - responsive srcset/sizes,
 *   - explicit width/height to prevent layout shift,
 *   - lazy vs eager loading and fetchpriority for the LCP image,
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

const OptimizedImage = forwardRef(function OptimizedImage(
  {
    fileName,
    asset: assetProp,
    src: srcProp,
    mobileSrc,
    mobileMedia = "(max-width: 999px)",
    mobileSizes,
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
        loading={loading || (priority ? "eager" : "lazy")}
        decoding={decoding}
        {...(width ? { width } : {})}
        {...(height ? { height } : {})}
        {...(fetchPriority || fetchpriority || priority ? { fetchPriority: fetchPriority || fetchpriority || "high" } : {})}
        className={className}
        style={imgStyle}
        {...rest}
      />
    );
  }

  const isPriority = Boolean(priority);
  const resolvedLoading = loading || (isPriority ? "eager" : "lazy");
  const resolvedFetchpriority = fetchPriority || fetchpriority || (isPriority ? "high" : undefined);

  // Intrinsic dimensions from the manifest prevent CLS.
  const intrinsicW = width || descriptor.w;
  const intrinsicH = height || descriptor.h;

  const imgStyle = { ...style };
  if (objectFit) imgStyle.objectFit = objectFit;
  if (objectPosition) imgStyle.objectPosition = objectPosition;

  const imgProps = {
    ref,
    src: descriptor.src,
    alt,
    loading: resolvedLoading,
    decoding,
    ...(intrinsicW ? { width: intrinsicW } : {}),
    ...(intrinsicH ? { height: intrinsicH } : {}),
    ...(resolvedFetchpriority ? { fetchPriority: resolvedFetchpriority } : {}),
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
      {mobileDescriptor?.avif ? (
        <source
          media={mobileMedia}
          type="image/avif"
          srcSet={mobileDescriptor.avif}
          sizes={mobileSizes || sizes}
          {...sourceDimensions(mobileDescriptor)}
        />
      ) : null}
      {mobileDescriptor?.webp ? (
        <source
          media={mobileMedia}
          type="image/webp"
          srcSet={mobileDescriptor.webp}
          sizes={mobileSizes || sizes}
          {...sourceDimensions(mobileDescriptor)}
        />
      ) : null}
      {descriptor.avif ? (
        <source type="image/avif" srcSet={descriptor.avif} sizes={sizes} {...sourceDimensions(descriptor)} />
      ) : null}
      {descriptor.webp ? (
        <source type="image/webp" srcSet={descriptor.webp} sizes={sizes} {...sourceDimensions(descriptor)} />
      ) : null}
      <img {...imgProps} />
    </picture>
  );
});

export default OptimizedImage;
