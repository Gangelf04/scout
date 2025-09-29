import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SignInButton from './signin-button';

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>Welcome to Scout</CardTitle>
          <CardDescription>
            Sign in to start scouting the next big sports card investments
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <SignInButton />

          <div className='text-center text-sm text-muted-foreground'>
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
