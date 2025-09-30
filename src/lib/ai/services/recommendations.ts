import { generateObject } from 'ai';
import { z } from 'zod';
import { aiConfig } from '../config';
import { AIRecommendation } from '../types';
import { db } from '../../db';
import { userPortfolios, watchlist } from '../../db/schema';
import { eq } from 'drizzle-orm';

// Zod schema for AI recommendations validation
const RecommendationSchema = z.object({
  type: z.enum(['Player', 'Card', 'Portfolio', 'Market']),
  priority: z.enum(['High', 'Medium', 'Low']),
  action: z.enum(['Buy', 'Sell', 'Hold', 'Watch']),
  target: z.string(),
  reasoning: z.string(),
  confidence: z.number().min(0).max(100),
  timeframe: z.string(),
  expectedReturn: z.number().optional(),
  riskLevel: z.enum(['Low', 'Medium', 'High'])
});

export async function generateRecommendations(userId: string): Promise<AIRecommendation[]> {
  try {
    // Fetch user's current portfolio and watchlist
    const userPortfolio = await db.query.userPortfolios.findMany({
      where: eq(userPortfolios.userId, userId),
      with: {
        card: {
          with: {
            player: true
          }
        }
      }
    });

    const userWatchlist = await db.query.watchlist.findMany({
      where: eq(watchlist.userId, userId),
      with: {
        player: true
      }
    });

    // Get market trends and recent data
    const marketTrends = await getMarketTrends();
    const topPlayers = await getTopPlayers();

    // Prepare context for AI recommendations
    const context = {
      portfolio: {
        totalValue: userPortfolio.reduce(
          (sum, item) => sum + parseFloat(item.currentValue || '0'),
          0
        ),
        totalInvested: userPortfolio.reduce((sum, item) => sum + parseFloat(item.purchasePrice), 0),
        cards: userPortfolio.map(item => ({
          player: `${item.card.player.firstName} ${item.card.player.lastName}`,
          card: item.card.cardName,
          currentValue: parseFloat(item.currentValue || '0'),
          purchasePrice: parseFloat(item.purchasePrice),
          roi:
            ((parseFloat(item.currentValue || '0') - parseFloat(item.purchasePrice)) /
              parseFloat(item.purchasePrice)) *
            100
        }))
      },
      watchlist: userWatchlist.map(item => ({
        player: `${item.player.firstName} ${item.player.lastName}`,
        position: item.player.position,
        addedAt: item.addedAt
      })),
      marketTrends,
      topPlayers: topPlayers.slice(0, 10)
    };

    // Generate AI recommendations
    const { object } = await generateObject({
      model: aiConfig.models.playerAnalysis,
      schema: z.object({
        recommendations: z.array(RecommendationSchema)
      }),
      prompt: `Generate personalized investment recommendations for this sports card investor:

Current Portfolio:
- Total Value: $${context.portfolio.totalValue.toFixed(2)}
- Total Invested: $${context.portfolio.totalInvested.toFixed(2)}
- ROI: ${(
        ((context.portfolio.totalValue - context.portfolio.totalInvested) /
          context.portfolio.totalInvested) *
        100
      ).toFixed(2)}%

Portfolio Cards:
${context.portfolio.cards
  .map(
    card => `
- ${card.player} (${card.card})
  Current: $${card.currentValue.toFixed(2)} | Invested: $${card.purchasePrice.toFixed(
      2
    )} | ROI: ${card.roi.toFixed(2)}%
`
  )
  .join('\n')}

Watchlist Players:
${context.watchlist
  .map(
    player => `
- ${player.player} (${player.position}) - Added: ${player.addedAt.toISOString().split('T')[0]}
`
  )
  .join('\n')}

Market Trends:
${context.marketTrends
  .map(
    trend => `
- ${trend.trendType}: ${trend.direction} (${trend.strength}/100)
`
  )
  .join('\n')}

Top Players to Consider:
${context.topPlayers
  .map(
    player => `
- ${player.name} (${player.position}) - ${player.rating} rating
`
  )
  .join('\n')}

Please generate personalized recommendations considering:
1. Current portfolio performance and diversification
2. Market trends and opportunities
3. Watchlist players and potential buys
4. Portfolio optimization and risk management
5. Emerging players and undervalued cards
6. Market timing and seasonal trends

For each recommendation, provide:
- Type (Player/Card/Portfolio/Market)
- Priority level (High/Medium/Low)
- Action (Buy/Sell/Hold/Watch)
- Target (player name, card name, etc.)
- Detailed reasoning
- Confidence level (0-100)
- Timeframe for the recommendation
- Expected return (if applicable)
- Risk level assessment

Focus on actionable, specific recommendations that align with the user's current holdings and investment goals.`
    });

    return object.recommendations.map((rec, index) => ({
      id: `rec-${userId}-${Date.now()}-${index}`,
      ...rec,
      createdAt: new Date()
    }));
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw new Error(
      `Failed to generate recommendations: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

async function getMarketTrends() {
  // This would fetch real market trend data
  // For now, return mock data
  return [
    { trendType: 'Position', direction: 'Rising', strength: 75, target: 'Quarterback' },
    { trendType: 'Conference', direction: 'Rising', strength: 80, target: 'SEC' },
    { trendType: 'Overall', direction: 'Stable', strength: 60, target: 'Football Cards' }
  ];
}

async function getTopPlayers() {
  // This would fetch top players based on ratings and performance
  // For now, return mock data
  return [
    { name: 'Caleb Williams', position: 'QB', rating: 95 },
    { name: 'Marvin Harrison Jr.', position: 'WR', rating: 92 },
    { name: 'Drake Maye', position: 'QB', rating: 90 }
  ];
}

export async function getRecommendations(userId: string): Promise<AIRecommendation[]> {
  return generateRecommendations(userId);
}
