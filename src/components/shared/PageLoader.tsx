import { memo } from 'react';
import { Spinner } from '../ui/spinner';

interface PageLoaderProps {
  message?: string;
}

/**
 * PageLoader component displays a centered loading spinner with an optional message.
 * Used as a Suspense fallback for lazy-loaded routes.
 */
function PageLoaderComponent({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={40} />
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export const PageLoader = memo(PageLoaderComponent);
PageLoader.displayName = 'PageLoader';
