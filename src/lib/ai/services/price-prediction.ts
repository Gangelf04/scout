import { generateObject } from 'ai';
import { z } from 'zod';
import { aiConfig } from '../config';
import { PricePrediction } from '../types';
import { db } from '../../db';
import { cards, priceHistory } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

// Zod schema for price prediction validation
const PricePredictionSchema = z.object({
  currentPrice: z.number().min(0),
  predictedPrice: z.object({
    oneMonth: z.number().min(0),
    threeMonths: z.number().min(0),
    sixMonths: z.number().min(0),
    oneYear: z.number().min(0)
  }),
  confidence: z.number().min(0).max(100),
  factors: z.object({
    playerPerformance: z.number().min(0).max(100),
    marketTrends: z.number().min(0).max(100),
    teamSuccess: z.number().min(0).max(100),
    mediaAttention: z.number().min(0).max(100),
    injuryRisk: z.number().min(0).max(100)
  }),
  reasoning: z.string()
});

export async function predictCardPrice(cardId: string): Promise<PricePrediction> {
  try {
    // Fetch card and related data
    const card = await db.query.cards.findFirst({
      where: eq(cards.id, cardId),
      with: {
        player: {
          with: {
            stats: true,
            teamRosters: {
              with: {
                team: true
              }
            }
          }
        },
        priceHistory: {
          orderBy: [desc(priceHistory.createdAt)],
          limit: 30 // Last 30 price points
        }
      }
    });

    if (!card) {
      throw new Error(`Card with ID ${cardId} not found`);
    }

    // Get current price (most recent)
    const currentPrice = card.priceHistory[0]?.price ? parseFloat(card.priceHistory[0].price) : 0;

    // Calculate price trends
    const priceTrends = calculatePriceTrends(card.priceHistory);

    // Get player performance data
    const playerPerformance = await getPlayerPerformanceMetrics(card.player.id);

    // Prepare context for AI prediction
    const context = {
      card: {
        name: card.cardName,
        set: card.set,
        year: card.year,
        condition: card.condition
      },
      player: {
        name: `${card.player.firstName} ${card.player.lastName}`,
        position: card.player.position,
        team: card.player.teamRosters[0]?.team?.name
      },
      currentPrice,
      priceHistory: card.priceHistory.slice(0, 10).map(ph => ({
        price: parseFloat(ph.price),
        date: ph.createdAt,
        source: ph.source
      })),
      priceTrends,
      playerPerformance
    };

    // Generate AI price prediction
    const { object } = await generateObject({
      model: aiConfig.models.pricePrediction,
      schema: PricePredictionSchema,
      prompt: `Predict the future price of this sports card for investment purposes:

Card: ${context.card.name} (${context.card.set} ${context.card.year})
Condition: ${context.card.condition}
Current Price: $${context.currentPrice}

Player: ${context.player.name}
Position: ${context.player.position}
Team: ${context.player.team}

Recent Price History:
${context.priceHistory
  .map(ph => `- ${ph.date.toISOString().split('T')[0]}: $${ph.price} (${ph.source})`)
  .join('\n')}

Price Trends:
- 7-day change: ${context.priceTrends.weekChange}%
- 30-day change: ${context.priceTrends.monthChange}%
- Volatility: ${context.priceTrends.volatility}%

Player Performance Metrics:
${Object.entries(context.playerPerformance)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Please provide price predictions for 1 month, 3 months, 6 months, and 1 year, along with:
1. Confidence level (0-100)
2. Key factors influencing the price
3. Detailed reasoning for the predictions

Consider factors like:
- Player performance trends and potential
- Team success and playoff chances
- Market trends for the position/player
- Card rarity and condition
- Historical price patterns
- Media attention and hype
- Injury risk and durability
- Draft stock and NFL potential`
    });

    return {
      cardId,
      ...object,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error predicting card price:', error);
    throw new Error(
      `Failed to predict card price: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

function calculatePriceTrends(priceHistory: Array<{ price: string; createdAt: Date }>) {
  if (priceHistory.length < 2) {
    return {
      weekChange: 0,
      monthChange: 0,
      volatility: 0
    };
  }

  const prices = priceHistory.map(ph => parseFloat(ph.price));
  const currentPrice = prices[0];
  const weekAgoPrice = prices[Math.min(7, prices.length - 1)];
  const monthAgoPrice = prices[Math.min(30, prices.length - 1)];

  const weekChange = ((currentPrice - weekAgoPrice) / weekAgoPrice) * 100;
  const monthChange = ((currentPrice - monthAgoPrice) / monthAgoPrice) * 100;

  // Calculate volatility (standard deviation of price changes)
  const priceChanges = [];
  for (let i = 1; i < Math.min(prices.length, 30); i++) {
    const change = ((prices[i - 1] - prices[i]) / prices[i]) * 100;
    priceChanges.push(change);
  }

  const avgChange = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
  const variance =
    priceChanges.reduce((sum, change) => sum + Math.pow(change - avgChange, 2), 0) /
    priceChanges.length;
  const volatility = Math.sqrt(variance);

  return {
    weekChange: Math.round(weekChange * 100) / 100,
    monthChange: Math.round(monthChange * 100) / 100,
    volatility: Math.round(volatility * 100) / 100
  };
}

async function getPlayerPerformanceMetrics(_playerId: string) {
  // This would typically involve complex calculations based on player stats
  // For now, return mock data - in production, you'd calculate real metrics
  return {
    'Recent Performance': 'Above Average',
    'Consistency Score': 75,
    'Upside Potential': 85,
    'Injury Risk': 'Low',
    'Team Success': 'High'
  };
}

export async function getPricePrediction(cardId: string): Promise<PricePrediction | null> {
  // In a real implementation, you might cache this in the database
  return predictCardPrice(cardId);
}

export async function batchPredictPrices(cardIds: string[]): Promise<PricePrediction[]> {
  const predictions: PricePrediction[] = [];

  for (const cardId of cardIds) {
    try {
      const prediction = await predictCardPrice(cardId);
      predictions.push(prediction);
    } catch (error) {
      console.error(`Failed to predict price for card ${cardId}:`, error);
      // Continue with other cards even if one fails
    }
  }

  return predictions;
}
