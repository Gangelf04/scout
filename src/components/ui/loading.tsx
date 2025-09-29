import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-muted border-t-primary',
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingCardProps {
  className?: string;
  children?: React.ReactNode;
}

export function LoadingCard({ className, children }: LoadingCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-6 animate-pulse', className)}>
      {children || (
        <div className='space-y-3'>
          <div className='h-4 bg-muted rounded w-3/4' />
          <div className='h-3 bg-muted rounded w-1/2' />
          <div className='h-8 bg-muted rounded w-1/4' />
        </div>
      )}
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn('h-4 bg-muted rounded animate-pulse', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  );
}
