import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Welcome back, {session.user?.name || session.user?.email}!
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Watchlist</CardTitle>
            <CardDescription>Players you're tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>0</p>
            <p className='text-xs text-muted-foreground'>+0 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
            <CardDescription>Total card investments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>$0.00</p>
            <p className='text-xs text-muted-foreground'>+0% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI</CardTitle>
            <CardDescription>Return on investment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>0%</p>
            <p className='text-xs text-muted-foreground'>+0% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest scouting activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              No recent activity. Start by adding players to your watchlist!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Trends</CardTitle>
            <CardDescription>Latest card market insights</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Market data will appear here once we integrate price tracking.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
