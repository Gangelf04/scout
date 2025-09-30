'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PlayerSearchResult {
  id: string;
  name: string;
  position: string;
  team: string;
  rating: number;
  aiScore: number;
  recommendation: 'Buy' | 'Hold' | 'Sell' | 'Watch';
  confidence: number;
}

export function AIPlayerSearch() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PlayerSearchResult[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // This would call your AI search API
      const response = await fetch('/api/ai/search-players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'Buy':
        return <TrendingUp className='h-4 w-4 text-green-500' />;
      case 'Sell':
        return <TrendingDown className='h-4 w-4 text-red-500' />;
      default:
        return <Minus className='h-4 w-4 text-yellow-500' />;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Buy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Sell':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Watch':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Search className='h-5 w-5' />
          AI-Powered Player Search
        </CardTitle>
        <CardDescription>
          Find players with AI analysis of their investment potential
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-2'>
          <Input
            placeholder="Search for players (e.g., 'Caleb Williams', 'QB prospects', 'SEC receivers')"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearch()}
            className='flex-1'
          />
          <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Search className='h-4 w-4' />
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className='space-y-3'>
            <h3 className='text-lg font-semibold'>Search Results</h3>
            {results.map(player => (
              <Card key={player.id} className='p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <h4 className='font-semibold'>{player.name}</h4>
                      <Badge variant='outline'>{player.position}</Badge>
                      <Badge variant='outline'>{player.team}</Badge>
                    </div>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                      <span>Rating: {player.rating}/100</span>
                      <span>AI Score: {player.aiScore}/100</span>
                      <span>Confidence: {player.confidence}%</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    {getRecommendationIcon(player.recommendation)}
                    <Badge className={getRecommendationColor(player.recommendation)}>
                      {player.recommendation}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {results.length === 0 && !isLoading && query && (
          <div className='text-center text-muted-foreground py-8'>
            No players found. Try a different search term.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
