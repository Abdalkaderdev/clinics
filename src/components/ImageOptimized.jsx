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

  // Generate optimized srcset if not provided
  const generateSrcSet = (originalSrc) => {
    if (srcSet) return srcSet;

    // Check if WebP version exists
    const isWebp = /\.webp$/i.test(originalSrc);
    const baseName = originalSrc.replace(/\.(webp|png|jpg|jpeg)$/i, '');
    
    if (isWebp) {
      return [
        `${baseName}-thumbnail.webp 150w`,
        `${baseName}-small.webp 300w`,
        `${baseName}-medium.webp 600w`,
        `${baseName}-large.webp 1200w`,
        `${baseName}.webp 800w`
      ].join(', ');
    }
    
    return undefined;
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
    if (img && img.src !== window.location.origin + "/images/logo.webp") {
      img.src = "/images/logo.webp";
    }
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


