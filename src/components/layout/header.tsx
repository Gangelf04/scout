'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession, signIn, signOut } from 'next-auth/react';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-14 items-center'>
        <div className='mr-4 flex'>
          <Link href='/' className='mr-6 flex items-center space-x-2'>
            <span className='font-bold text-xl'>Scout</span>
          </Link>
        </div>
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <nav className='flex items-center space-x-6 text-sm font-medium'>
            {session && (
              <>
                <Link
                  href='/dashboard'
                  className='transition-colors hover:text-primary text-muted-foreground hover:bg-secondary/50 px-3 py-2 rounded-md'
                >
                  Dashboard
                </Link>
                <Link
                  href='/watchlist'
                  className='transition-colors hover:text-primary text-muted-foreground hover:bg-secondary/50 px-3 py-2 rounded-md'
                >
                  Watchlist
                </Link>
                <Link
                  href='/profile'
                  className='transition-colors hover:text-primary text-muted-foreground hover:bg-secondary/50 px-3 py-2 rounded-md'
                >
                  Profile
                </Link>
              </>
            )}
          </nav>
          <div className='flex items-center space-x-2'>
            {status === 'loading' ? (
              <div className='h-8 w-20 animate-pulse rounded bg-muted' />
            ) : session ? (
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-muted-foreground'>{session.user?.name}</span>
                <Button variant='outline' size='sm' onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button size='sm' onClick={() => signIn('google')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
