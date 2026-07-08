import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

interface DataLoadingSkeletonProps {
  itemCount?: number;
  gridSize?: { xs: number; sm?: number; md?: number; lg?: number };
}

const colsByBreakpoint: Record<number, string> = {
  12: 'grid-cols-1',
  6: 'sm:grid-cols-2',
  4: 'md:grid-cols-3',
  3: 'lg:grid-cols-4',
};

export const DataLoadingSkeleton = ({
  itemCount = 6,
  gridSize = { xs: 12, sm: 6, md: 4 },
}: DataLoadingSkeletonProps) => {
  const gridClass = [
    'grid-cols-1',
    gridSize.sm && colsByBreakpoint[gridSize.sm],
    gridSize.md && colsByBreakpoint[gridSize.md],
    gridSize.lg && colsByBreakpoint[gridSize.lg],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="mx-auto max-w-7xl py-6">
      <div className={`grid gap-4 ${gridClass}`}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="mb-4 flex items-center gap-3">
              <Skeleton className="h-[60px] w-[60px] shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/5" />
                <Skeleton className="h-4 w-2/5" />
              </div>
            </div>
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </Card>
        ))}
      </div>
    </div>
  );
};
