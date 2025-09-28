'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function SignInButton() {
  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <Button onClick={handleSignIn} className='w-full' size='lg'>
      Sign in with Google
    </Button>
  );
}
