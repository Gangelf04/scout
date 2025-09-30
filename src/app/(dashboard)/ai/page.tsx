import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AIPlayerSearch } from '@/components/ai/ai-player-search';
import { AIRecommendations } from '@/components/ai/ai-recommendations';
import { Brain, TrendingUp, Target, BarChart3 } from 'lucide-react';

export default function AIDashboard() {
  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-2'>
          <Brain className='h-8 w-8 text-primary' />
          <h1 className='text-4xl font-bold'>AI Scouting Center</h1>
        </div>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          Leverage AI to discover undervalued players, predict card prices, and make smarter
          investment decisions.
        </p>
      </div>

      {/* AI Features Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <Target className='h-5 w-5 text-blue-500' />
              <CardTitle className='text-lg'>Player Search</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Find players using natural language queries with AI analysis
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5 text-green-500' />
              <CardTitle className='text-lg'>Price Predictions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>Get AI-powered price forecasts for cards and players</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <BarChart3 className='h-5 w-5 text-purple-500' />
              <CardTitle className='text-lg'>Market Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>Analyze market trends and identify opportunities</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2'>
              <Brain className='h-5 w-5 text-orange-500' />
              <CardTitle className='text-lg'>Scouting Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>Generate comprehensive player analysis reports</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Main AI Tools */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <AIPlayerSearch />
        <AIRecommendations />
      </div>

      {/* Additional AI Features */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Insights</CardTitle>
            <CardDescription>Latest AI-generated insights and market analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='p-4 border rounded-lg'>
                <h4 className='font-semibold text-green-600'>Rising Trend</h4>
                <p className='text-sm text-muted-foreground'>
                  SEC quarterbacks showing 15% increase in card values over the past month
                </p>
              </div>
              <div className='p-4 border rounded-lg'>
                <h4 className='font-semibold text-blue-600'>Market Opportunity</h4>
                <p className='text-sm text-muted-foreground'>
                  Undervalued wide receivers in the Big Ten conference identified
                </p>
              </div>
              <div className='p-4 border rounded-lg'>
                <h4 className='font-semibold text-orange-600'>Risk Alert</h4>
                <p className='text-sm text-muted-foreground'>
                  High injury risk detected for certain running back prospects
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Performance</CardTitle>
            <CardDescription>
              Track the accuracy of AI predictions and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>Price Prediction Accuracy</span>
                <span className='font-semibold text-green-600'>87%</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>Player Analysis Accuracy</span>
                <span className='font-semibold text-green-600'>92%</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>Market Trend Detection</span>
                <span className='font-semibold text-green-600'>85%</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm'>Recommendation Success Rate</span>
                <span className='font-semibold text-green-600'>78%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
