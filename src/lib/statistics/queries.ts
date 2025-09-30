import { db } from '@/lib/db';
import {
  footballStats,
  qbStats,
  rbStats,
  receiverStats,
  defensiveStats,
  gameStats,
  players,
  teams
} from '@/lib/db/schema';
import { eq, and, desc, asc, gte, sql } from 'drizzle-orm';
import type { StatsQuery, Position } from '@/types/statistics';

// Get player statistics by position and season
export async function getPlayerStats(playerId: string, season: string) {
  const baseStats = await db
    .select()
    .from(footballStats)
    .where(and(eq(footballStats.playerId, playerId), eq(footballStats.season, season)))
    .limit(1);

  if (baseStats.length === 0) return null;

  const position = baseStats[0].position;
  let positionStats = null;

  // Get position-specific stats
  switch (position) {
    case 'QB':
      positionStats = await db
        .select()
        .from(qbStats)
        .where(eq(qbStats.footballStatsId, baseStats[0].id))
        .limit(1);
      break;
    case 'RB':
      positionStats = await db
        .select()
        .from(rbStats)
        .where(eq(rbStats.footballStatsId, baseStats[0].id))
        .limit(1);
      break;
    case 'WR':
    case 'TE':
      positionStats = await db
        .select()
        .from(receiverStats)
        .where(eq(receiverStats.footballStatsId, baseStats[0].id))
        .limit(1);
      break;
    default:
      positionStats = await db
        .select()
        .from(defensiveStats)
        .where(eq(defensiveStats.footballStatsId, baseStats[0].id))
        .limit(1);
  }

  return {
    ...baseStats[0],
    positionStats: positionStats[0] || null
  };
}

// Get top performers by position and stat
export async function getTopPerformers(query: StatsQuery) {
  const { position, season, sortBy, sortOrder = 'desc', limit = 10, offset = 0 } = query;

  if (!position || !season) {
    throw new Error('Position and season are required');
  }

  let orderBy: unknown;
  let table;
  let selectFields;

  // Determine which table and field to sort by
  switch (position) {
    case 'QB':
      table = qbStats;
      selectFields = {
        playerId: footballStats.playerId,
        season: footballStats.season,
        teamId: footballStats.teamId,
        gamesPlayed: footballStats.gamesPlayed,
        gamesStarted: footballStats.gamesStarted,
        id: qbStats.id,
        footballStatsId: qbStats.footballStatsId,
        passAttempts: qbStats.passAttempts,
        passCompletions: qbStats.passCompletions,
        passYards: qbStats.passYards,
        passTouchdowns: qbStats.passTouchdowns,
        interceptions: qbStats.interceptions,
        passLong: qbStats.passLong,
        sacks: qbStats.sacks,
        sackYards: qbStats.sackYards,
        rushAttempts: qbStats.rushAttempts,
        rushYards: qbStats.rushYards,
        rushTouchdowns: qbStats.rushTouchdowns,
        rushLong: qbStats.rushLong,
        completionPercentage: qbStats.completionPercentage,
        yardsPerAttempt: qbStats.yardsPerAttempt,
        yardsPerCompletion: qbStats.yardsPerCompletion,
        passerRating: qbStats.passerRating,
        qbr: qbStats.qbr,
        createdAt: qbStats.createdAt,
        updatedAt: qbStats.updatedAt
      };
      orderBy = sortBy ? qbStats[sortBy as keyof typeof qbStats] : qbStats.passYards;
      break;
    case 'RB':
      table = rbStats;
      selectFields = {
        playerId: footballStats.playerId,
        season: footballStats.season,
        teamId: footballStats.teamId,
        gamesPlayed: footballStats.gamesPlayed,
        gamesStarted: footballStats.gamesStarted,
        id: rbStats.id,
        footballStatsId: rbStats.footballStatsId,
        rushAttempts: rbStats.rushAttempts,
        rushYards: rbStats.rushYards,
        rushTouchdowns: rbStats.rushTouchdowns,
        rushLong: rbStats.rushLong,
        fumbles: rbStats.fumbles,
        fumblesLost: rbStats.fumblesLost,
        receptions: rbStats.receptions,
        receivingYards: rbStats.receivingYards,
        receivingTouchdowns: rbStats.receivingTouchdowns,
        receivingLong: rbStats.receivingLong,
        yardsPerRush: rbStats.yardsPerRush,
        yardsPerReception: rbStats.yardsPerReception,
        totalYards: rbStats.totalYards,
        totalTouchdowns: rbStats.totalTouchdowns,
        createdAt: rbStats.createdAt,
        updatedAt: rbStats.updatedAt
      };
      orderBy = sortBy ? rbStats[sortBy as keyof typeof rbStats] : rbStats.rushYards;
      break;
    case 'WR':
    case 'TE':
      table = receiverStats;
      selectFields = {
        playerId: footballStats.playerId,
        season: footballStats.season,
        teamId: footballStats.teamId,
        gamesPlayed: footballStats.gamesPlayed,
        gamesStarted: footballStats.gamesStarted,
        id: receiverStats.id,
        footballStatsId: receiverStats.footballStatsId,
        position: receiverStats.position,
        receptions: receiverStats.receptions,
        receivingYards: receiverStats.receivingYards,
        receivingTouchdowns: receiverStats.receivingTouchdowns,
        receivingLong: receiverStats.receivingLong,
        targets: receiverStats.targets,
        drops: receiverStats.drops,
        fumbles: receiverStats.fumbles,
        fumblesLost: receiverStats.fumblesLost,
        rushAttempts: receiverStats.rushAttempts,
        rushYards: receiverStats.rushYards,
        rushTouchdowns: receiverStats.rushTouchdowns,
        yardsPerReception: receiverStats.yardsPerReception,
        catchPercentage: receiverStats.catchPercentage,
        yardsPerTarget: receiverStats.yardsPerTarget,
        totalYards: receiverStats.totalYards,
        totalTouchdowns: receiverStats.totalTouchdowns,
        createdAt: receiverStats.createdAt,
        updatedAt: receiverStats.updatedAt
      };
      orderBy = sortBy
        ? receiverStats[sortBy as keyof typeof receiverStats]
        : receiverStats.receivingYards;
      break;
    default:
      table = defensiveStats;
      selectFields = {
        playerId: footballStats.playerId,
        season: footballStats.season,
        teamId: footballStats.teamId,
        gamesPlayed: footballStats.gamesPlayed,
        gamesStarted: footballStats.gamesStarted,
        id: defensiveStats.id,
        footballStatsId: defensiveStats.footballStatsId,
        position: defensiveStats.position,
        totalTackles: defensiveStats.totalTackles,
        soloTackles: defensiveStats.soloTackles,
        assistedTackles: defensiveStats.assistedTackles,
        tacklesForLoss: defensiveStats.tacklesForLoss,
        sacks: defensiveStats.sacks,
        quarterbackHits: defensiveStats.quarterbackHits,
        interceptions: defensiveStats.interceptions,
        interceptionYards: defensiveStats.interceptionYards,
        interceptionTouchdowns: defensiveStats.interceptionTouchdowns,
        passesDefended: defensiveStats.passesDefended,
        fumbleRecoveries: defensiveStats.fumbleRecoveries,
        fumbleRecoveryYards: defensiveStats.fumbleRecoveryYards,
        fumbleRecoveryTouchdowns: defensiveStats.fumbleRecoveryTouchdowns,
        forcedFumbles: defensiveStats.forcedFumbles,
        tacklesPerGame: defensiveStats.tacklesPerGame,
        sacksPerGame: defensiveStats.sacksPerGame,
        createdAt: defensiveStats.createdAt,
        updatedAt: defensiveStats.updatedAt
      };
      orderBy = sortBy
        ? defensiveStats[sortBy as keyof typeof defensiveStats]
        : defensiveStats.totalTackles;
  }

  const results = await db
    .select(selectFields)
    .from(table)
    .innerJoin(footballStats, eq(table.footballStatsId, footballStats.id))
    .where(
      and(
        eq(footballStats.season, season),
        eq(footballStats.position, position),
        ...(query.minGames ? [gte(footballStats.gamesPlayed, query.minGames)] : [])
      )
    )
    .orderBy(sortOrder === 'desc' ? desc(orderBy!) : asc(orderBy!))
    .limit(limit)
    .offset(offset);

  return results;
}

// Get player's game-by-game stats
export async function getPlayerGameStats(playerId: string, season: string) {
  return await db
    .select()
    .from(gameStats)
    .where(and(eq(gameStats.playerId, playerId), eq(gameStats.season, season)))
    .orderBy(asc(gameStats.gameDate));
}

// Get team statistics for a season
export async function getTeamStats(teamId: string, season: string) {
  const teamStats = await db
    .select()
    .from(footballStats)
    .where(and(eq(footballStats.teamId, teamId), eq(footballStats.season, season)));

  // Group by position
  const statsByPosition = teamStats.reduce((acc, stat) => {
    if (!acc[stat.position]) {
      acc[stat.position] = [];
    }
    acc[stat.position].push(stat);
    return acc;
  }, {} as Record<string, typeof teamStats>);

  return statsByPosition;
}

// Get conference/division statistics
export async function getConferenceStats(conference: string, season: string) {
  const conferenceStats = await db
    .select({
      playerId: footballStats.playerId,
      season: footballStats.season,
      position: footballStats.position,
      gamesPlayed: footballStats.gamesPlayed,
      teamName: teams.name,
      teamConference: teams.conference
    })
    .from(footballStats)
    .innerJoin(teams, eq(footballStats.teamId, teams.id))
    .where(and(eq(footballStats.season, season), eq(teams.conference, conference)));

  return conferenceStats;
}

// Get player comparison data
export async function comparePlayers(playerIds: string[], season: string) {
  const comparisons = await Promise.all(
    playerIds.map(async playerId => {
      const stats = await getPlayerStats(playerId, season);
      const player = await db.select().from(players).where(eq(players.id, playerId)).limit(1);

      return {
        player: player[0],
        stats
      };
    })
  );

  return comparisons;
}

// Get trending players (improving performance)
export async function getTrendingPlayers(position: Position, season: string) {
  // This would require more complex logic to compare recent performance vs earlier in season
  // For now, return top performers
  return await getTopPerformers({
    position,
    season,
    sortBy: 'totalYards' as const,
    limit: 20
  });
}

// Get injury-prone players (based on games played vs games started)
export async function getInjuryPronePlayers(season: string, minGamesPlayed: number = 8) {
  const injuryProne = await db
    .select({
      playerId: footballStats.playerId,
      position: footballStats.position,
      gamesPlayed: footballStats.gamesPlayed,
      gamesStarted: footballStats.gamesStarted,
      injuryRate: sql<number>`(${footballStats.gamesPlayed} - ${footballStats.gamesStarted})::float / ${footballStats.gamesPlayed}`
    })
    .from(footballStats)
    .where(and(eq(footballStats.season, season), gte(footballStats.gamesPlayed, minGamesPlayed)))
    .orderBy(
      desc(
        sql`(${footballStats.gamesPlayed} - ${footballStats.gamesStarted})::float / ${footballStats.gamesPlayed}`
      )
    );

  return injuryProne;
}
