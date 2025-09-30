'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, TrendingUp, TrendingDown, Eye, DollarSign } from 'lucide-react';

interface AIRecommendation {
  id: string;
  type: 'Player' | 'Card' | 'Portfolio' | 'Market';
  priority: 'High' | 'Medium' | 'Low';
  action: 'Buy' | 'Sell' | 'Hold' | 'Watch';
  target: string;
  reasoning: string;
  confidence: number;
  timeframe: string;
  expectedReturn?: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  createdAt: string;
}

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/recommendations');
      const data = await response.json();

      if (data.success) {
        setRecommendations(data.data);
      } else {
        setError(data.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      setError('Failed to fetch recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Buy':
        return <TrendingUp className='h-4 w-4 text-green-500' />;
      case 'Sell':
        return <TrendingDown className='h-4 w-4 text-red-500' />;
      case 'Watch':
        return <Eye className='h-4 w-4 text-yellow-500' />;
      default:
        return <DollarSign className='h-4 w-4 text-blue-500' />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (isLoading) {
    return (
      <Card className='w-full'>
        <CardContent className='flex items-center justify-center py-8'>
          <Loader2 className='h-6 w-6 animate-spin mr-2' />
          <span>Loading AI recommendations...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='w-full'>
        <CardContent className='text-center py-8'>
          <p className='text-red-500 mb-4'>{error}</p>
          <Button onClick={fetchRecommendations} variant='outline'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>AI Investment Recommendations</CardTitle>
            <CardDescription>
              Personalized recommendations based on your portfolio and market trends
            </CardDescription>
          </div>
          <Button onClick={fetchRecommendations} variant='outline' size='sm'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className='text-center text-muted-foreground py-8'>
            No recommendations available. Add some players to your watchlist to get started.
          </div>
        ) : (
          <div className='space-y-4'>
            {recommendations.map(rec => (
              <Card key={rec.id} className='p-4'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-center gap-2'>
                    {getActionIcon(rec.action)}
                    <h4 className='font-semibold'>{rec.target}</h4>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority} Priority
                    </Badge>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline'>{rec.type}</Badge>
                    <Badge className={getRiskColor(rec.riskLevel)}>{rec.riskLevel} Risk</Badge>
                  </div>
                </div>

                <p className='text-sm text-muted-foreground mb-3'>{rec.reasoning}</p>

                <div className='flex items-center justify-between text-sm'>
                  <div className='flex items-center gap-4'>
                    <span>Confidence: {rec.confidence}%</span>
                    <span>Timeframe: {rec.timeframe}</span>
                    {rec.expectedReturn && (
                      <span className='text-green-600 font-medium'>
                        Expected Return: {rec.expectedReturn}%
                      </span>
                    )}
                  </div>
                  <span className='text-xs text-muted-foreground'>
                    {new Date(rec.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
