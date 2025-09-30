import { generateObject } from 'ai';
import { z } from 'zod';
import { aiConfig } from '../config';
import { PlayerAnalysis } from '../types';
import { db } from '../../db';
import { players } from '../../db/schema';
import { eq } from 'drizzle-orm';

// Zod schema for AI response validation
const PlayerAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  potential: z.enum(['High', 'Medium', 'Low']),
  riskLevel: z.enum(['Low', 'Medium', 'High']),
  recommendation: z.enum(['Buy', 'Hold', 'Sell', 'Watch']),
  reasoning: z.string(),
  keyMetrics: z.object({
    athleticism: z.number().min(0).max(100),
    production: z.number().min(0).max(100),
    consistency: z.number().min(0).max(100),
    upside: z.number().min(0).max(100)
  }),
  comparablePlayers: z.array(z.string())
});

export async function analyzePlayer(playerId: string): Promise<PlayerAnalysis> {
  try {
    // Fetch player data
    const player = await db.query.players.findFirst({
      where: eq(players.id, playerId),
      with: {
        ratings: true,
        stats: true,
        highSchoolProspects: true,
        teamRosters: {
          with: {
            team: true
          }
        }
      }
    });

    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    // Prepare context for AI analysis
    const context = {
      player: {
        name: `${player.firstName} ${player.lastName}`,
        position: player.position,
        height: player.height,
        weight: player.weight,
        year: player.year
      },
      ratings: player.ratings.map(rating => ({
        source: rating.source,
        rating: rating.rating,
        ranking: rating.ranking,
        positionRanking: rating.positionRanking,
        nationalRanking: rating.nationalRanking,
        evaluation: rating.evaluation
      })),
      stats: player.stats.map(stat => ({
        season: stat.season,
        stats: stat.stats
      })),
      highSchoolProspects: player.highSchoolProspects.map(prospect => ({
        highSchool: prospect.highSchool,
        state: prospect.state,
        class: prospect.class,
        rating: prospect.rating,
        nationalRanking: prospect.nationalRanking,
        positionRanking: prospect.positionRanking,
        stateRanking: prospect.stateRanking,
        evaluation: prospect.evaluation
      })),
      team: player.teamRosters[0]?.team
    };

    // Generate AI analysis
    const { object } = await generateObject({
      model: aiConfig.models.playerAnalysis,
      schema: PlayerAnalysisSchema,
      prompt: `Analyze this football player for sports card investment potential:

Player: ${context.player.name}
Position: ${context.player.position}
Height/Weight: ${context.player.height}, ${context.player.weight} lbs
Year: ${context.player.year}

Ratings:
${context.ratings
  .map(r => `- ${r.source}: ${r.rating} (${r.ranking} overall, ${r.positionRanking} at position)`)
  .join('\n')}

Statistics:
${context.stats.map(s => `- ${s.season}: ${JSON.stringify(s.stats)}`).join('\n')}

High School Prospects:
${context.highSchoolProspects
  .map(
    p => `- ${p.highSchool} (${p.state}): ${p.rating} rating, ${p.nationalRanking} national ranking`
  )
  .join('\n')}

Team: ${context.team?.name} (${context.team?.conference})

Please provide a comprehensive analysis focusing on:
1. Overall investment potential (0-100 score)
2. Key strengths and weaknesses
3. Risk assessment
4. Investment recommendation
5. Key metrics breakdown
6. Comparable players for reference

Consider factors like:
- Athletic ability and physical traits
- Statistical production and consistency
- Team context and coaching
- Market trends for the position
- Injury risk and durability
- Draft potential and NFL readiness`
    });

    return {
      playerId,
      ...object,
      comparablePlayers: object.comparablePlayers || [],
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error analyzing player:', error);
    throw new Error(
      `Failed to analyze player: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getPlayerAnalysis(playerId: string): Promise<PlayerAnalysis | null> {
  // In a real implementation, you might cache this in the database
  // For now, we'll generate it on-demand
  return analyzePlayer(playerId);
}

export async function batchAnalyzePlayers(playerIds: string[]): Promise<PlayerAnalysis[]> {
  const analyses: PlayerAnalysis[] = [];

  for (const playerId of playerIds) {
    try {
      const analysis = await analyzePlayer(playerId);
      analyses.push(analysis);
    } catch (error) {
      console.error(`Failed to analyze player ${playerId}:`, error);
      // Continue with other players even if one fails
    }
  }

  return analyses;
}
