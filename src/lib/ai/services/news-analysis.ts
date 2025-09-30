import { generateObject } from 'ai';
import { z } from 'zod';
import { aiConfig } from '../config';
import { NewsAnalysis } from '../types';
import { db } from '../../db';
import { playerNews, players } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

// Zod schema for news analysis validation
const NewsAnalysisSchema = z.object({
  sentiment: z.enum(['Positive', 'Negative', 'Neutral']),
  confidence: z.number().min(0).max(100),
  keyTopics: z.array(z.string()),
  impactScore: z.number().min(0).max(100),
  summary: z.string(),
  articles: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      sentiment: z.enum(['Positive', 'Negative', 'Neutral']),
      publishedAt: z.date()
    })
  )
});

export async function analyzePlayerNews(playerId: string): Promise<NewsAnalysis> {
  try {
    // Fetch player and recent news
    const player = await db.query.players.findFirst({
      where: eq(players.id, playerId)
    });

    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    // Get recent news (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentNews = await db.query.playerNews.findMany({
      where: eq(playerNews.playerId, playerId),
      orderBy: [desc(playerNews.publishedAt)]
    });

    // Filter to last 30 days
    const filteredNews = recentNews.filter(
      (news: { publishedAt: Date }) => news.publishedAt >= thirtyDaysAgo
    );

    if (filteredNews.length === 0) {
      return {
        playerId,
        sentiment: 'Neutral',
        confidence: 50,
        keyTopics: [],
        impactScore: 0,
        summary: 'No recent news found for this player.',
        articles: [],
        lastUpdated: new Date()
      };
    }

    // Prepare context for AI analysis
    const context = {
      player: {
        name: `${player.firstName} ${player.lastName}`,
        position: player.position
      },
      news: filteredNews.map(
        (article: {
          title: string;
          content: string | null;
          source: string;
          url: string | null;
          publishedAt: Date;
          sentiment: string | null;
        }) => ({
          title: article.title,
          content: article.content || '',
          source: article.source,
          url: article.url || '',
          publishedAt: article.publishedAt,
          sentiment: article.sentiment || 'Neutral'
        })
      )
    };

    // Generate AI news analysis
    const { object } = await generateObject({
      model: aiConfig.models.newsAnalysis,
      schema: NewsAnalysisSchema,
      prompt: `Analyze the recent news coverage for this football player to assess its impact on their sports card investment potential:

Player: ${context.player.name}
Position: ${context.player.position}

Recent News Articles:
${context.news
  .map(
    (article: {
      title: string;
      source: string;
      publishedAt: Date;
      content: string;
      url: string;
    }) => `
Title: ${article.title}
Source: ${article.source}
Published: ${article.publishedAt.toISOString().split('T')[0]}
Content: ${article.content?.substring(0, 500)}...
URL: ${article.url}
`
  )
  .join('\n')}

Please provide:
1. Overall sentiment analysis (Positive/Negative/Neutral)
2. Confidence level in the analysis (0-100)
3. Key topics and themes from the coverage
4. Impact score on card value (0-100)
5. Summary of the news coverage
6. Individual article sentiment analysis

Consider factors like:
- Performance-related news (good/bad games, injuries, etc.)
- Off-field issues or positive developments
- Draft stock changes
- Team success and playoff implications
- Media attention and hype
- Injury reports and health status
- Contract negotiations or transfers
- Social media presence and fan engagement`
    });

    return {
      playerId,
      sentiment: object.sentiment,
      confidence: object.confidence,
      keyTopics: object.keyTopics,
      impactScore: object.impactScore,
      summary: object.summary,
      articles: object.articles,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error analyzing player news:', error);
    throw new Error(
      `Failed to analyze player news: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getNewsAnalysis(playerId: string): Promise<NewsAnalysis | null> {
  return analyzePlayerNews(playerId);
}

export async function batchAnalyzeNews(playerIds: string[]): Promise<NewsAnalysis[]> {
  const analyses: NewsAnalysis[] = [];

  for (const playerId of playerIds) {
    try {
      const analysis = await analyzePlayerNews(playerId);
      analyses.push(analysis);
    } catch (error) {
      console.error(`Failed to analyze news for player ${playerId}:`, error);
      // Continue with other players even if one fails
    }
  }

  return analyses;
}

// Function to fetch and store news from external sources
export async function fetchAndStorePlayerNews(playerId: string): Promise<void> {
  // This would integrate with Tavily API or other news sources
  // For now, this is a placeholder
  console.log(`Fetching news for player ${playerId}`);

  // In production, you would:
  // 1. Call Tavily API with player name
  // 2. Process and clean the news articles
  // 3. Store them in the playerNews table
  // 4. Trigger news analysis
}
