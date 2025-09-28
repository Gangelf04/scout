import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    jwt: ({ token, user, account }) => {
      console.log('JWT callback:', { token, user, account });
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      console.log('Session callback:', { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string
        }
      };
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt'
  },
  debug: process.env.NODE_ENV === 'development'
};
