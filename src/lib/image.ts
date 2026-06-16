export type ImageFormat = 'avif' | 'webp';

const IMAGE_EXTENSION_PATTERN = /\.(png|jpe?g)$/i;

export function getOptimizedImageSource(source: string, format: ImageFormat) {
  if (!IMAGE_EXTENSION_PATTERN.test(source)) {
    return source;
  }

  return source.replace(IMAGE_EXTENSION_PATTERN, `.${format}`);
}

export function getOptimizedImageSources(source: string) {
  const hasConvertibleExtension = IMAGE_EXTENSION_PATTERN.test(source);

  return {
    avif: getOptimizedImageSource(source, 'avif'),
    hasConvertibleExtension,
    source,
    webp: getOptimizedImageSource(source, 'webp')
  };
}

export function getImageLoadState(priority = false) {
  return {
    decoding: 'async' as const,
    fetchPriority: priority ? ('high' as const) : ('low' as const),
    loading: priority ? ('eager' as const) : ('lazy' as const)
  };
}
