import { LoadingCard } from '@/components/ui/loading';

export default function WatchlistLoading() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='h-8 bg-muted rounded w-32 animate-pulse mb-2' />
          <div className='h-4 bg-muted rounded w-64 animate-pulse' />
        </div>
        <div className='h-9 bg-muted rounded w-24 animate-pulse' />
      </div>

      <LoadingCard>
        <div className='space-y-4'>
          <div className='h-6 bg-muted rounded w-48 animate-pulse' />
          <div className='h-4 bg-muted rounded w-96 animate-pulse' />
          <div className='h-32 bg-muted rounded animate-pulse' />
        </div>
      </LoadingCard>
    </div>
  );
}
