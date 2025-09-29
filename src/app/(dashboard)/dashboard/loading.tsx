import { LoadingCard } from '@/components/ui/loading';

export default function DashboardLoading() {
  return (
    <div className='space-y-6'>
      <div>
        <div className='h-8 bg-muted rounded w-48 animate-pulse mb-2' />
        <div className='h-4 bg-muted rounded w-64 animate-pulse' />
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <LoadingCard />
        <LoadingCard />
      </div>
    </div>
  );
}
