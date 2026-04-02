interface StaticResponsiveImageProps {
  alt: string;
  src: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

function buildVariantPath(src: string, suffix: string) {
  return src.replace(/\.webp$/i, `-${suffix}.webp`);
}

export function StaticResponsiveImage({
  alt,
  src,
  sizes,
  className = '',
  priority = false,
}: StaticResponsiveImageProps) {
  const srcSet = [
    `${buildVariantPath(src, '640')} 640w`,
    `${buildVariantPath(src, '960')} 960w`,
    `${src} 1600w`,
  ].join(', ');

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
