import type { QBStats, RBStats, ReceiverStats, DefensiveStats } from '@/types/statistics';

// QB Statistics Calculations
export function calculateQBStats(
  stats: Omit<
    QBStats,
    'completionPercentage' | 'yardsPerAttempt' | 'yardsPerCompletion' | 'passerRating' | 'qbr'
  >
): QBStats {
  const completionPercentage =
    stats.passAttempts > 0 ? (stats.passCompletions / stats.passAttempts) * 100 : 0;

  const yardsPerAttempt = stats.passAttempts > 0 ? stats.passYards / stats.passAttempts : 0;

  const yardsPerCompletion =
    stats.passCompletions > 0 ? stats.passYards / stats.passCompletions : 0;

  // Passer Rating calculation (simplified version)
  const passerRating = calculatePasserRating({
    completions: stats.passCompletions,
    attempts: stats.passAttempts,
    yards: stats.passYards,
    touchdowns: stats.passTouchdowns,
    interceptions: stats.interceptions
  });

  return {
    ...stats,
    completionPercentage: Math.round(completionPercentage * 100) / 100,
    yardsPerAttempt: Math.round(yardsPerAttempt * 100) / 100,
    yardsPerCompletion: Math.round(yardsPerCompletion * 100) / 100,
    passerRating: Math.round(passerRating * 100) / 100,
    qbr: 0 // Would need ESPN's proprietary calculation
  };
}

// Passer Rating calculation (NFL formula)
function calculatePasserRating({
  completions,
  attempts,
  yards,
  touchdowns,
  interceptions
}: {
  completions: number;
  attempts: number;
  yards: number;
  touchdowns: number;
  interceptions: number;
}): number {
  if (attempts === 0) return 0;

  const a = (completions / attempts - 0.3) * 5;
  const b = (yards / attempts - 3) * 0.25;
  const c = (touchdowns / attempts) * 20;
  const d = 2.375 - (interceptions / attempts) * 25;

  const rating =
    ((Math.max(0, Math.min(2.375, a)) +
      Math.max(0, Math.min(2.375, b)) +
      Math.max(0, Math.min(2.375, c)) +
      Math.max(0, Math.min(2.375, d))) /
      6) *
    100;

  return rating;
}

// RB Statistics Calculations
export function calculateRBStats(
  stats: Omit<RBStats, 'yardsPerRush' | 'yardsPerReception' | 'totalYards' | 'totalTouchdowns'>
): RBStats {
  const yardsPerRush = stats.rushAttempts > 0 ? stats.rushYards / stats.rushAttempts : 0;

  const yardsPerReception = stats.receptions > 0 ? stats.receivingYards / stats.receptions : 0;

  const totalYards = stats.rushYards + stats.receivingYards;
  const totalTouchdowns = stats.rushTouchdowns + stats.receivingTouchdowns;

  return {
    ...stats,
    yardsPerRush: Math.round(yardsPerRush * 100) / 100,
    yardsPerReception: Math.round(yardsPerReception * 100) / 100,
    totalYards,
    totalTouchdowns
  };
}

// Receiver Statistics Calculations
export function calculateReceiverStats(
  stats: Omit<
    ReceiverStats,
    'yardsPerReception' | 'catchPercentage' | 'yardsPerTarget' | 'totalYards' | 'totalTouchdowns'
  >
): ReceiverStats {
  const yardsPerReception = stats.receptions > 0 ? stats.receivingYards / stats.receptions : 0;

  const catchPercentage = stats.targets > 0 ? (stats.receptions / stats.targets) * 100 : 0;

  const yardsPerTarget = stats.targets > 0 ? stats.receivingYards / stats.targets : 0;

  const totalYards = stats.receivingYards + stats.rushYards;
  const totalTouchdowns = stats.receivingTouchdowns + stats.rushTouchdowns;

  return {
    ...stats,
    yardsPerReception: Math.round(yardsPerReception * 100) / 100,
    catchPercentage: Math.round(catchPercentage * 100) / 100,
    yardsPerTarget: Math.round(yardsPerTarget * 100) / 100,
    totalYards,
    totalTouchdowns
  };
}

// Defensive Statistics Calculations
export function calculateDefensiveStats(
  stats: Omit<DefensiveStats, 'tacklesPerGame' | 'sacksPerGame'> & { gamesPlayed: number }
): DefensiveStats {
  const tacklesPerGame = stats.gamesPlayed > 0 ? stats.totalTackles / stats.gamesPlayed : 0;

  const sacksPerGame = stats.gamesPlayed > 0 ? stats.sacks / stats.gamesPlayed : 0;

  return {
    ...stats,
    tacklesPerGame: Math.round(tacklesPerGame * 100) / 100,
    sacksPerGame: Math.round(sacksPerGame * 100) / 100
  };
}

// Efficiency Metrics
export function calculateEfficiencyMetrics(stats: {
  completions: number;
  attempts: number;
  yards: number;
  touchdowns: number;
  interceptions: number;
}) {
  const completionRate = stats.attempts > 0 ? (stats.completions / stats.attempts) * 100 : 0;
  const yardsPerAttempt = stats.attempts > 0 ? stats.yards / stats.attempts : 0;
  const touchdownRate = stats.attempts > 0 ? (stats.touchdowns / stats.attempts) * 100 : 0;
  const interceptionRate = stats.attempts > 0 ? (stats.interceptions / stats.attempts) * 100 : 0;

  return {
    completionRate: Math.round(completionRate * 100) / 100,
    yardsPerAttempt: Math.round(yardsPerAttempt * 100) / 100,
    touchdownRate: Math.round(touchdownRate * 100) / 100,
    interceptionRate: Math.round(interceptionRate * 100) / 100
  };
}

// Advanced Scouting Metrics
export function calculateAdvancedMetrics(stats: {
  gamesPlayed: number;
  gamesStarted: number;
  totalYards: number;
  totalTouchdowns: number;
  fumbles: number;
  fumblesLost: number;
}) {
  const gamesPerStart = stats.gamesStarted > 0 ? stats.gamesPlayed / stats.gamesStarted : 0;
  const yardsPerGame = stats.gamesPlayed > 0 ? stats.totalYards / stats.gamesPlayed : 0;
  const touchdownsPerGame = stats.gamesPlayed > 0 ? stats.totalTouchdowns / stats.gamesPlayed : 0;
  const fumbleRate = stats.gamesPlayed > 0 ? (stats.fumbles / stats.gamesPlayed) * 100 : 0;
  const fumbleLossRate = stats.fumbles > 0 ? (stats.fumblesLost / stats.fumbles) * 100 : 0;

  return {
    gamesPerStart: Math.round(gamesPerStart * 100) / 100,
    yardsPerGame: Math.round(yardsPerGame * 100) / 100,
    touchdownsPerGame: Math.round(touchdownsPerGame * 100) / 100,
    fumbleRate: Math.round(fumbleRate * 100) / 100,
    fumbleLossRate: Math.round(fumbleLossRate * 100) / 100
  };
}

// Team Chemistry Metrics (for QB-WR analysis)
export function calculateTeamChemistry(
  qbStats: QBStats,
  wrStats: ReceiverStats[],
  teamGames: number
) {
  if (teamGames === 0) return { chemistryScore: 0, efficiency: 0 };

  const totalTargets = wrStats.reduce((sum, wr) => sum + wr.targets, 0);
  const totalReceptions = wrStats.reduce((sum, wr) => sum + wr.receptions, 0);
  const totalYards = wrStats.reduce((sum, wr) => sum + wr.receivingYards, 0);
  const totalTouchdowns = wrStats.reduce((sum, wr) => sum + wr.receivingTouchdowns, 0);

  const targetDistribution = wrStats.map(wr => wr.targets / totalTargets);
  const efficiency = totalTargets > 0 ? (totalReceptions / totalTargets) * 100 : 0;
  const yardsPerTarget = totalTargets > 0 ? totalYards / totalTargets : 0;
  const touchdownRate = totalTargets > 0 ? (totalTouchdowns / totalTargets) * 100 : 0;

  // Chemistry score based on distribution and efficiency
  const chemistryScore = efficiency * 0.4 + yardsPerTarget * 0.3 + touchdownRate * 0.3;

  return {
    chemistryScore: Math.round(chemistryScore * 100) / 100,
    efficiency: Math.round(efficiency * 100) / 100,
    yardsPerTarget: Math.round(yardsPerTarget * 100) / 100,
    touchdownRate: Math.round(touchdownRate * 100) / 100,
    targetDistribution
  };
}
