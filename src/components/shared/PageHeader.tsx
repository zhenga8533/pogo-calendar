import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({ title, description, actions, className }: PageHeaderProps) => (
  <div
    className={cn(
      'mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end',
      className
    )}
  >
    <div className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
    {actions && <div className="shrink-0">{actions}</div>}
  </div>
);
