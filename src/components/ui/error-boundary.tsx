'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            reset={() => this.setState({ hasError: false, error: undefined })}
          />
        );
      }

      return (
        <Card className='border-destructive'>
          <CardHeader>
            <CardTitle className='text-destructive'>Something went wrong</CardTitle>
            <CardDescription>An unexpected error occurred. Please try again.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className='text-sm'>
                  <summary className='cursor-pointer text-muted-foreground'>
                    Error details (development only)
                  </summary>
                  <pre className='mt-2 p-2 bg-muted rounded text-xs overflow-auto'>
                    {this.state.error.message}
                    {this.state.error.stack && `\n\n${this.state.error.stack}`}
                  </pre>
                </details>
              )}
              <Button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                variant='outline'
              >
                Try again
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    // You could integrate with error reporting services here
  };
}
