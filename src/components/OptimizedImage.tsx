import { memo, type ImgHTMLAttributes } from 'react';
import { getImageLoadState, getOptimizedImageSources } from '../lib/image';

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'className'> & {
  alt: string;
  className?: string;
  pictureClassName?: string;
  priority?: boolean;
  src: string;
};

export const OptimizedImage = memo(function OptimizedImage({
  alt,
  className,
  decoding,
  fetchPriority,
  loading,
  pictureClassName,
  priority = false,
  src,
  ...rest
}: OptimizedImageProps) {
  const sources = getOptimizedImageSources(src);
  const loadState = getImageLoadState(priority);
  const resolvedLoading = loading ?? loadState.loading;
  const resolvedDecoding = decoding ?? loadState.decoding;
  const resolvedFetchPriority = fetchPriority ?? loadState.fetchPriority;

  if (!sources.hasConvertibleExtension) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={resolvedLoading}
        decoding={resolvedDecoding}
        fetchPriority={resolvedFetchPriority}
        {...rest}
      />
    );
  }

  return (
    <picture className={pictureClassName}>
      <source srcSet={sources.avif} type="image/avif" />
      <source srcSet={sources.webp} type="image/webp" />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={resolvedLoading}
        decoding={resolvedDecoding}
        fetchPriority={resolvedFetchPriority}
        {...rest}
      />
    </picture>
  );
});
