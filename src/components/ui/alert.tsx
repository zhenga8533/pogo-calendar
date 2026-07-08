import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import React from 'react';
import { cn } from '../../lib/utils';

const alertVariants = cva(
  'relative flex w-full items-start gap-2.5 rounded-lg border px-4 py-3 text-sm',
  {
    variants: {
      variant: {
        info: 'border-secondary/25 bg-secondary/10 text-foreground [&_svg]:text-secondary',
        success: 'border-success/25 bg-success/10 text-foreground [&_svg]:text-success',
        warning: 'border-warning/30 bg-warning/10 text-foreground [&_svg]:text-warning',
        destructive: 'border-destructive/25 bg-destructive/10 text-foreground [&_svg]:text-destructive',
      },
    },
    defaultVariants: { variant: 'info' },
  }
);

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  destructive: AlertCircle,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant = 'info', children, ...props }: AlertProps) {
  const Icon = icons[variant ?? 'info'];
  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
