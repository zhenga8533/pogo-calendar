import { SearchX } from 'lucide-react';
import React from 'react';
import { Card } from '../ui/card';

interface NoResultsProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function NoResults({
  title = 'No Results Found',
  message = 'Try adjusting your filters to see more results.',
  icon = <SearchX className="mb-3 h-10 w-10 text-muted-foreground" />,
  action,
}: NoResultsProps) {
  return (
    <Card className="flex min-h-48 flex-col items-center justify-center p-8 text-center">
      {icon}
      <h2 className="mb-1 text-lg font-bold">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}
