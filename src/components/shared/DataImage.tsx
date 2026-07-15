import { cn } from '../../lib/utils';

interface DataImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function DataImage({ src, alt, className }: DataImageProps) {
  if (!src) {
    return (
      <span
        role="img"
        aria-label={`${alt} image unavailable`}
        className={cn(
          'flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground',
          className
        )}
      >
        {alt.charAt(0).toUpperCase()}
      </span>
    );
  }

  return <img src={src} alt={alt} className={className} />;
}
