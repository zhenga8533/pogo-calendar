import * as SliderPrimitive from '@radix-ui/react-slider';
import React from 'react';
import { cn } from '../../lib/utils';

export interface SliderMark {
  value: number;
  label: string;
}

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  marks?: SliderMark[];
  formatLabel?: (value: number) => string;
}

export const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, marks, formatLabel, value, min = 0, max = 100, ...props }, ref) => {
    const values = value ?? [];
    return (
      <div className="w-full">
        <SliderPrimitive.Root
          ref={ref}
          value={value}
          min={min}
          max={max}
          className={cn(
            'relative flex w-full touch-none select-none items-center py-2',
            className
          )}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          {values.map((v, i) => (
            <SliderPrimitive.Thumb
              key={i}
              className="group block h-4.5 w-4.5 rounded-full border-2 border-primary bg-card shadow-soft-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {formatLabel && (
                <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-1.5 py-0.5 text-[0.65rem] font-semibold text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {formatLabel(v)}
                </span>
              )}
            </SliderPrimitive.Thumb>
          ))}
        </SliderPrimitive.Root>
        {marks && marks.length > 0 && (
          <div className="relative mt-1 h-4 text-[0.65rem] text-muted-foreground">
            {marks.map((mark) => (
              <span
                key={mark.value}
                className="absolute -translate-x-1/2"
                style={{ left: `${((mark.value - min) / (max - min)) * 100}%` }}
              >
                {mark.label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
);
Slider.displayName = SliderPrimitive.Root.displayName;
