import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Profile</h1>
        <p className='text-muted-foreground'>Manage your account settings</p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Name</label>
              <p className='text-sm text-muted-foreground'>
                {session.user?.name || 'Not provided'}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium'>Email</label>
              <p className='text-sm text-muted-foreground'>{session.user?.email}</p>
            </div>
            <div>
              <label className='text-sm font-medium'>Account Type</label>
              <p className='text-sm text-muted-foreground'>Free Plan</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your scouting experience</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Default Sport</label>
              <p className='text-sm text-muted-foreground'>Football</p>
            </div>
            <div>
              <label className='text-sm font-medium'>Notifications</label>
              <p className='text-sm text-muted-foreground'>Email alerts enabled</p>
            </div>
            <Button variant='outline' size='sm'>
              Update Preferences
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>Manage your account security and data</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium'>Sign Out</p>
              <p className='text-sm text-muted-foreground'>Sign out of your account</p>
            </div>
            <Button variant='outline'>Sign Out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
