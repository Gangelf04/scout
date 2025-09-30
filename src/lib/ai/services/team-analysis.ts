import { generateObject } from 'ai';
import { z } from 'zod';
import { aiConfig } from '../config';
import { TeamAnalysis } from '../types';
import { db } from '../../db';
import { teams, schedules } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

// Zod schema for team analysis validation
const TeamAnalysisSchema = z.object({
  overallStrength: z.number().min(0).max(100),
  offensiveStrength: z.number().min(0).max(100),
  defensiveStrength: z.number().min(0).max(100),
  specialTeamsStrength: z.number().min(0).max(100),
  coachingQuality: z.number().min(0).max(100),
  scheduleDifficulty: z.number().min(0).max(100),
  chemistry: z.object({
    qbWr: z.number().min(0).max(100),
    offensiveLine: z.number().min(0).max(100),
    defensiveUnit: z.number().min(0).max(100)
  }),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  keyPlayers: z.array(z.string())
});

export async function analyzeTeam(teamId: string): Promise<TeamAnalysis> {
  try {
    // Fetch team and related data
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
      with: {
        rosters: {
          with: {
            player: {
              with: {
                stats: true,
                ratings: true
              }
            }
          }
        },
        schedules: {
          orderBy: [desc(schedules.gameDate)],
          limit: 12 // Last 12 games
        }
      }
    });

    if (!team) {
      throw new Error(`Team with ID ${teamId} not found`);
    }

    // Calculate team metrics
    const teamMetrics = calculateTeamMetrics(team);
    const scheduleMetrics = calculateScheduleDifficulty(team.schedules);

    // Prepare context for AI analysis
    const context = {
      team: {
        name: team.name,
        shortName: team.shortName,
        division: team.division,
        conference: team.conference
      },
      roster: team.rosters.map(roster => ({
        player: {
          name: `${roster.player.firstName} ${roster.player.lastName}`,
          position: roster.player.position,
          year: roster.player.year
        },
        stats: roster.player.stats,
        ratings: roster.player.ratings
      })),
      recentGames: team.schedules.slice(0, 6).map(game => ({
        opponent: game.opponentId,
        date: game.gameDate,
        isHome: game.isHome
      })),
      metrics: teamMetrics,
      schedule: scheduleMetrics
    };

    // Generate AI team analysis
    const { object } = await generateObject({
      model: aiConfig.models.playerAnalysis,
      schema: TeamAnalysisSchema,
      prompt: `Analyze this football team's overall strength and how it affects individual player card values:

Team: ${context.team.name} (${context.team.conference})
Division: ${context.team.division}

Roster Analysis:
${context.roster
  .map(
    player => `
- ${player.player.name} (${player.player.position}, ${player.player.year})
  Stats: ${JSON.stringify(player.stats[0]?.stats || {})}
  Ratings: ${player.ratings.map(r => `${r.source}: ${r.rating}`).join(', ')}
`
  )
  .join('\n')}

Recent Games:
${context.recentGames
  .map(game => `- vs ${game.opponent} (${game.date}) - ${game.isHome ? 'Home' : 'Away'}`)
  .join('\n')}

Team Metrics:
- Offensive Production: ${context.metrics.offensiveProduction}
- Defensive Performance: ${context.metrics.defensivePerformance}
- Special Teams: ${context.metrics.specialTeams}
- Depth: ${context.metrics.depth}

Schedule Difficulty: ${context.schedule.difficulty}/100

Please provide:
1. Overall team strength (0-100)
2. Offensive, defensive, and special teams strength
3. Coaching quality assessment
4. Schedule difficulty rating
5. Team chemistry analysis (QB-WR, O-line, defense)
6. Key strengths and weaknesses
7. Most important players for card value

Consider factors like:
- Individual player talent and potential
- Team depth and roster construction
- Coaching staff and scheme fit
- Schedule strength and playoff chances
- Conference and division competition
- Recent performance trends
- Team chemistry and cohesion
- Draft prospects and NFL potential`
    });

    return {
      teamId,
      ...object,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error analyzing team:', error);
    throw new Error(
      `Failed to analyze team: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

function calculateTeamMetrics(_team: unknown) {
  // This would involve complex calculations based on player stats and ratings
  // For now, return mock data - in production, you'd calculate real metrics
  return {
    offensiveProduction: 75,
    defensivePerformance: 80,
    specialTeams: 70,
    depth: 85
  };
}

function calculateScheduleDifficulty(schedules: Array<{ isHome: boolean }>) {
  // This would analyze opponent strength and home/away splits
  // For now, return mock data
  return {
    difficulty: 75,
    homeGames: schedules.filter(s => s.isHome).length,
    awayGames: schedules.filter(s => !s.isHome).length
  };
}

export async function getTeamAnalysis(teamId: string): Promise<TeamAnalysis | null> {
  return analyzeTeam(teamId);
}

export async function batchAnalyzeTeams(teamIds: string[]): Promise<TeamAnalysis[]> {
  const analyses: TeamAnalysis[] = [];

  for (const teamId of teamIds) {
    try {
      const analysis = await analyzeTeam(teamId);
      analyses.push(analysis);
    } catch (error) {
      console.error(`Failed to analyze team ${teamId}:`, error);
      // Continue with other teams even if one fails
    }
  }

  return analyses;
}
