import React from "react";

/**
 * Reusable image component that provides sensible defaults and simple priority control.
 * Now optimized for responsive loading with multiple image sizes.
 */
const ImageOptimized = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes,
  srcSet,
  onError,
  ...rest
}) => {
  if (!src) throw new Error("ImageOptimized requires a `src`.");
  if (!alt) throw new Error("ImageOptimized requires an `alt` description.");

  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : "auto";

  // Only use provided srcSet; do not generate non-existent variants
  const generateSrcSet = () => {
    return srcSet;
  };

  // Generate responsive sizes if not provided
  const generateSizes = (originalSizes) => {
    if (originalSizes) return originalSizes;

    // Default responsive sizes
    return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
  };

  const handleError = (e) => {
    if (onError) {
      onError(e);
      return;
    }
    const img = e?.currentTarget;
    if (!img) return;
    const currentSrc = img.getAttribute("src") || "";
    const isWebp = /\.webp$/i.test(currentSrc);
    if (isWebp) {
      const fallbackPng = currentSrc.replace(/\.webp$/i, ".png");
      if (fallbackPng !== currentSrc) {
        img.src = fallbackPng;
        return;
      }
    }
    img.src = "/placeholder.svg";
  };

  const imgProps = {
    src,
    alt,
    className,
    loading,
    decoding: "async",
    fetchpriority: fetchPriority,
    sizes: generateSizes(sizes),
    srcSet: generateSrcSet(src),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    onError: handleError,
    ...rest,
  };

  return <img {...imgProps} />;
};

export default ImageOptimized;
