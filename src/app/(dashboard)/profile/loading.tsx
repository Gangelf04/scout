import { LoadingCard, LoadingSkeleton } from '@/components/ui/loading';

export default function ProfileLoading() {
  return (
    <div className='space-y-6'>
      <div>
        <div className='h-8 bg-muted rounded w-24 animate-pulse mb-2' />
        <div className='h-4 bg-muted rounded w-64 animate-pulse' />
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <LoadingCard>
          <div className='space-y-4'>
            <div className='h-6 bg-muted rounded w-40 animate-pulse' />
            <div className='h-4 bg-muted rounded w-32 animate-pulse' />
            <div className='space-y-3'>
              <LoadingSkeleton lines={3} />
            </div>
          </div>
        </LoadingCard>

        <LoadingCard>
          <div className='space-y-4'>
            <div className='h-6 bg-muted rounded w-32 animate-pulse' />
            <div className='h-4 bg-muted rounded w-48 animate-pulse' />
            <div className='space-y-3'>
              <LoadingSkeleton lines={3} />
            </div>
          </div>
        </LoadingCard>
      </div>

      <LoadingCard>
        <div className='space-y-4'>
          <div className='h-6 bg-muted rounded w-36 animate-pulse' />
          <div className='h-4 bg-muted rounded w-56 animate-pulse' />
          <div className='h-16 bg-muted rounded animate-pulse' />
        </div>
      </LoadingCard>
    </div>
  );
}
