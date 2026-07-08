import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export function Calendar({ className, classNames, ...props }: DayPickerProps) {
  return (
    <DayPicker
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col gap-2',
        month: 'flex flex-col gap-3',
        month_caption: 'flex items-center justify-center pt-1 pb-2 relative',
        caption_label: 'text-sm font-semibold',
        nav: 'flex items-center justify-between absolute inset-x-1 top-1',
        button_previous: cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors'
        ),
        button_next: cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors'
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'text-muted-foreground w-9 text-[0.7rem] font-semibold text-center',
        week: 'flex w-full mt-1',
        day: 'p-0 text-center text-sm relative',
        day_button:
          'h-9 w-9 rounded-md font-medium transition-colors hover:bg-accent aria-selected:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected: '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary',
        today: '[&>button]:border [&>button]:border-primary',
        outside: 'text-muted-foreground/40',
        disabled: 'text-muted-foreground/30 pointer-events-none',
        range_start: '[&>button]:bg-primary [&>button]:text-primary-foreground',
        range_end: '[&>button]:bg-primary [&>button]:text-primary-foreground',
        range_middle: '[&>button]:bg-primary/15 [&>button]:rounded-none',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...rest }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4" {...rest} />
          ) : (
            <ChevronRight className="h-4 w-4" {...rest} />
          ),
      }}
      {...props}
    />
  );
}

interface DatePickerFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: (date: Date) => boolean;
}

export function DatePickerField({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  disabled,
}: DatePickerFieldProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-10 w-full items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 opacity-60" />
          {value ? format(value, 'MMM d, yyyy') : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(date) => {
            onChange(date ?? null);
            setOpen(false);
          }}
          disabled={disabled}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateTimePickerFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
}

export function DateTimePickerField({
  value,
  onChange,
  placeholder = 'Pick a date & time',
  className,
}: DateTimePickerFieldProps) {
  const [open, setOpen] = React.useState(false);

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) return;
    const next = new Date(date);
    if (value) {
      next.setHours(value.getHours(), value.getMinutes());
    }
    onChange(next);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const base = value ? new Date(value) : new Date();
    base.setHours(hours || 0, minutes || 0, 0, 0);
    onChange(base);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-10 w-full items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 opacity-60" />
          {value ? format(value, "MMM d, yyyy 'at' h:mm a") : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value ?? undefined} onSelect={handleDaySelect} autoFocus />
        <div className="flex items-center gap-2 border-t border-border p-3">
          <span className="text-xs font-semibold text-muted-foreground">Time</span>
          <input
            type="time"
            value={value ? format(value, 'HH:mm') : ''}
            onChange={handleTimeChange}
            className="h-8 flex-1 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
