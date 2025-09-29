# Deployment Guide

This guide will help you deploy the Scout app to Vercel with a production database.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: Set up a PostgreSQL database (recommended: Neon, Supabase, or Railway)
3. **Google OAuth**: Set up Google OAuth credentials

## Step 1: Database Setup

### Option A: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string (it will look like: `postgresql://username:password@host/database?sslmode=require`)

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > Database and copy the connection string

### Option C: Railway

1. Go to [railway.app](https://railway.app) and create an account
2. Create a new PostgreSQL database
3. Copy the connection string from the database service

## Step 2: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-app.vercel.app/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret

## Step 3: Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="your-database-connection-string"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

For production, you'll set these in Vercel's environment variables section.

## Step 4: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

1. Install Vercel CLI:

   ```bash
   bun add -g vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   bun run deploy:preview  # For preview deployment
   bun run deploy:vercel   # For production deployment
   ```

### Method 2: GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy on every push

## Step 5: Configure Production Environment

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:
   - `DATABASE_URL`: Your production database connection string
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET`: A secure random string
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

## Step 6: Run Database Migrations

After deployment, run the database migrations:

```bash
# Set the production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Run migrations
bun run db:migrate
```

## Step 7: Verify Deployment

1. Visit your deployed app
2. Test the authentication flow
3. Verify that protected routes work correctly
4. Check that the database connection is working

## Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Verify your DATABASE_URL is correct
   - Ensure your database allows connections from Vercel's IP ranges
   - Check if SSL is required

2. **Authentication Issues**

   - Verify Google OAuth redirect URIs are correct
   - Check that NEXTAUTH_SECRET is set
   - Ensure NEXTAUTH_URL matches your domain

3. **Build Issues**
   - Check that all environment variables are set
   - Verify that the build command works locally
   - Check Vercel's build logs for specific errors

### Getting Help

- Check Vercel's [deployment documentation](https://vercel.com/docs)
- Review Next.js [deployment guide](https://nextjs.org/docs/deployment)
- Check the [NextAuth.js documentation](https://next-auth.js.org)

## Next Steps

After successful deployment:

1. Set up monitoring and error tracking (Sentry)
2. Configure custom domain (optional)
3. Set up CI/CD pipeline for automatic deployments
4. Begin Phase 2 development (data integration)
