import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl text-red-600'>Authentication Error</CardTitle>
          <CardDescription>There was a problem signing you in</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-center text-sm text-muted-foreground'>
            <p>We encountered an error while trying to sign you in. This could be due to:</p>
            <ul className='mt-2 text-left space-y-1'>
              <li>• Network connectivity issues</li>
              <li>• Google OAuth configuration problems</li>
              <li>• Account access restrictions</li>
            </ul>
          </div>

          <div className='flex flex-col space-y-2'>
            <Button asChild>
              <Link href='/auth/signin'>Try Again</Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/'>Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
