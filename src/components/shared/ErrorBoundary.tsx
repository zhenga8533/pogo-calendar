import { CircleAlert } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="mx-auto mt-16 max-w-2xl px-4">
          <Card className="flex flex-col items-center p-8 text-center shadow-soft-lg">
            <CircleAlert className="mb-4 h-20 w-20 text-destructive" />
            <h1 className="mb-2 text-2xl font-bold">Oops! Something went wrong</h1>
            <p className="mb-6 text-muted-foreground">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            {this.state.error && (
              <div className="mb-6 w-full max-w-xl rounded-md bg-muted p-4 text-left">
                <pre className="whitespace-pre-wrap break-words font-mono text-sm text-muted-foreground">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}
            <div className="flex gap-3">
              <Button size="lg" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
