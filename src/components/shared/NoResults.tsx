import { SearchX } from 'lucide-react';
import { Card } from '../ui/card';

interface NoResultsProps {
  title?: string;
  message?: string;
}

export function NoResults({
  title = 'No Results Found',
  message = 'Try adjusting your filters to see more results.',
}: NoResultsProps) {
  return (
    <Card className="flex min-h-48 flex-col items-center justify-center p-8 text-center">
      <SearchX className="mb-3 h-10 w-10 text-muted-foreground" />
      <h2 className="mb-1 text-lg font-bold">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
    </Card>
  );
}
