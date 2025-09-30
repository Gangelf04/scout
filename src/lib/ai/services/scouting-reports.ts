import { generateObject } from 'ai';
import { z } from 'zod';
import { aiConfig } from '../config';
import { ScoutingReport } from '../types';
import { db } from '../../db';
import { players } from '../../db/schema';
import { eq } from 'drizzle-orm';

// Zod schema for scouting report validation
const ScoutingReportSchema = z.object({
  reportType: z.enum(['Comprehensive', 'Quick', 'Deep Dive']),
  sections: z.object({
    overview: z.string(),
    strengths: z.string(),
    weaknesses: z.string(),
    projection: z.string(),
    comparison: z.string(),
    recommendation: z.string()
  }),
  grade: z.object({
    overall: z.string(),
    athleticism: z.string(),
    production: z.string(),
    consistency: z.string(),
    upside: z.string()
  })
});

export async function generateScoutingReport(
  playerId: string,
  reportType: 'Comprehensive' | 'Quick' | 'Deep Dive' = 'Comprehensive'
): Promise<ScoutingReport> {
  try {
    // Fetch comprehensive player data
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

    // Prepare comprehensive context for AI analysis
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
        stateRanking: rating.stateRanking,
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

    // Generate comprehensive scouting report
    const { object } = await generateObject({
      model: aiConfig.models.playerAnalysis,
      schema: ScoutingReportSchema,
      prompt: `Generate a ${reportType.toLowerCase()} scouting report for this football player:

Player: ${context.player.name}
Position: ${context.player.position}
Height/Weight: ${context.player.height}, ${context.player.weight} lbs
Year: ${context.player.year}
Team: ${context.team?.name} (${context.team?.conference})

Recruiting Rankings:
${context.ratings
  .map(
    r =>
      `- ${r.source}: ${r.rating} (${r.ranking} overall, ${r.positionRanking} at position, ${r.nationalRanking} national)`
  )
  .join('\n')}

Statistics:
${context.stats.map(s => `- ${s.season}: ${JSON.stringify(s.stats)}`).join('\n')}

High School Evaluation:
${context.highSchoolProspects
  .map(
    p =>
      `- ${p.highSchool} (${p.state}): ${p.rating} rating, ${p.nationalRanking} national ranking, ${p.evaluation}`
  )
  .join('\n')}

Please generate a detailed scouting report with the following sections:

1. **Overview**: Brief summary of the player's profile and current status
2. **Strengths**: Key positive attributes and skills
3. **Weaknesses**: Areas for improvement and concerns
4. **Projection**: Future potential and development trajectory
5. **Comparison**: Similar players and style comparisons
6. **Recommendation**: Investment advice and card value outlook

Also provide letter grades (A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F) for:
- Overall potential
- Athleticism
- Production/Statistics
- Consistency
- Upside/Development

Consider factors like:
- Physical attributes and measurables
- Statistical production and efficiency
- Consistency and reliability
- Team context and coaching
- Injury history and durability
- Character and work ethic
- Draft stock and NFL potential
- Market trends for the position
- Comparable players and their card values
- Risk factors and potential concerns

Write in a professional scouting style that would be useful for sports card investors.`
    });

    return {
      playerId,
      ...object,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error generating scouting report:', error);
    throw new Error(
      `Failed to generate scouting report: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

export async function getScoutingReport(
  playerId: string,
  reportType: 'Comprehensive' | 'Quick' | 'Deep Dive' = 'Comprehensive'
): Promise<ScoutingReport | null> {
  return generateScoutingReport(playerId, reportType);
}

export async function batchGenerateReports(
  playerIds: string[],
  reportType: 'Comprehensive' | 'Quick' | 'Deep Dive' = 'Comprehensive'
): Promise<ScoutingReport[]> {
  const reports: ScoutingReport[] = [];

  for (const playerId of playerIds) {
    try {
      const report = await generateScoutingReport(playerId, reportType);
      reports.push(report);
    } catch (error) {
      console.error(`Failed to generate scouting report for player ${playerId}:`, error);
      // Continue with other players even if one fails
    }
  }

  return reports;
}
