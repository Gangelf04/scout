import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function WatchlistPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Watchlist</h1>
          <p className='text-muted-foreground'>Track players you're interested in</p>
        </div>
        <Button>Add Player</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Tracked Players</CardTitle>
          <CardDescription>
            Players you're currently monitoring for card investment opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <p className='text-muted-foreground mb-4'>No players in your watchlist yet.</p>
            <Button variant='outline'>Start Adding Players</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
