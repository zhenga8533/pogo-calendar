import React from 'react';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

interface CalendarSkeletonProps {
  isMobile: boolean;
}

const DesktopSkeletonHeader = () => (
  <Card className="mb-4 p-4">
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Skeleton className="h-14 flex-[3]" />
        <Skeleton className="h-14 flex-1" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
      <div className="px-1">
        <Skeleton className="mb-2 h-4 w-[15%]" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="h-px w-full bg-border" />
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-9 w-36" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  </Card>
);

const DesktopSkeletonGrid = () => {
  const SKELETON_ROWS = 5;
  const SKELETON_COLS = 7;

  return (
    <Card className="p-4">
      <Skeleton className="mb-2 h-[50px] w-full" />
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${SKELETON_COLS}, 1fr)` }}
      >
        {Array.from({ length: SKELETON_ROWS * SKELETON_COLS }).map((_, index) => (
          <Skeleton key={index} className="h-[100px] w-full" />
        ))}
      </div>
    </Card>
  );
};

function CalendarSkeletonComponent({ isMobile }: CalendarSkeletonProps) {
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-[75vh] w-full" />
      </div>
    );
  }

  return (
    <div>
      <DesktopSkeletonHeader />
      <DesktopSkeletonGrid />
    </div>
  );
}

export const CalendarSkeleton = React.memo(CalendarSkeletonComponent);
CalendarSkeleton.displayName = 'CalendarSkeleton';
