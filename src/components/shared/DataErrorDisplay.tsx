import { CircleAlert, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface DataErrorDisplayProps {
  title: string;
  message?: string;
  onRetry?: () => void;
}

export const DataErrorDisplay = ({ title, message, onRetry }: DataErrorDisplayProps) => {
  const defaultMessage = message || 'An unexpected error occurred. Please try again later.';

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-sm p-8 text-center">
        <CircleAlert className="mx-auto mb-4 h-16 w-16 text-destructive" />
        <h2 className="mb-2 text-xl font-bold">{title}</h2>
        <p className="mb-6 text-sm text-muted-foreground">{defaultMessage}</p>
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        )}
      </Card>
    </div>
  );
};
