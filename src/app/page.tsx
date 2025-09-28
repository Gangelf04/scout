import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }
  return (
    <div className='space-y-8'>
      {/* Hero Section */}
      <section className='text-center space-y-4'>
        <h1 className='text-4xl font-bold tracking-tight sm:text-6xl'>
          Find the Next Big Sports Card Investment
        </h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          Scout High School and NCAA players before everyone else. Use AI-powered analysis to
          discover undervalued sports cards and maximize your profits.
        </p>
        <div className='flex gap-4 justify-center'>
          <Button asChild size='lg'>
            <Link href='/players'>Start Scouting</Link>
          </Button>
          <Button variant='outline' size='lg' asChild>
            <Link href='/portfolio'>View Portfolio</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Player Analysis</CardTitle>
            <CardDescription>
              Comprehensive analysis of High School and NCAA players using 247Sports rankings and
              ESPN statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm'>
              <li>• 247Sports prospect rankings</li>
              <li>• ESPN college statistics</li>
              <li>• Team chemistry analysis</li>
              <li>• Real-time news updates</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price Tracking</CardTitle>
            <CardDescription>
              Monitor card prices across eBay and COMC with AI-powered price predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm'>
              <li>• eBay price history</li>
              <li>• COMC market data</li>
              <li>• Price alerts</li>
              <li>• Market trend analysis</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>
              Get AI-powered recommendations and predictions to make informed investment decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm'>
              <li>• Player recommendations</li>
              <li>• Price predictions</li>
              <li>• Market sentiment analysis</li>
              <li>• Portfolio optimization</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className='text-center space-y-4 py-12'>
        <h2 className='text-3xl font-bold'>Ready to Start Scouting?</h2>
        <p className='text-lg text-muted-foreground'>
          Join the community of smart sports card investors
        </p>
        <Button size='lg' asChild>
          <Link href='/auth/signin'>Get Started Free</Link>
        </Button>
      </section>
    </div>
  );
}
