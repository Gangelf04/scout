import type { QBStats, RBStats, ReceiverStats, DefensiveStats } from '@/types/statistics';

// QB Statistics Calculations
export function calculateQBStats(stats: Omit<QBStats, 'completionPercentage' | 'yardsPerAttempt' | 'yardsPerCompletion' | 'passerRating' | 'qbr'>): QBStats {
  const completionPercentage = stats.passAttempts > 0 
    ? (stats.passCompletions / stats.passAttempts) * 100 
    : 0;

  const yardsPerAttempt = stats.passAttempts > 0 
    ? stats.passYards / stats.passAttempts 
    : 0;

  const yardsPerCompletion = stats.passCompletions > 0 
    ? stats.passYards / stats.passCompletions 
    : 0;

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
function calculatePasserRating({ completions, attempts, yards, touchdowns, interceptions }: {
  completions: number;
  attempts: number;
  yards: number;
  touchdowns: number;
  interceptions: number;
}): number {
  if (attempts === 0) return 0;

  const a = ((completions / attempts) - 0.3) * 5;
  const b = ((yards / attempts) - 3) * 0.25;
  const c = (touchdowns / attempts) * 20;
  const d = 2.375 - ((interceptions / attempts) * 25);

  const rating = ((Math.max(0, Math.min(2.375, a)) + 
                  Math.max(0, Math.min(2.375, b)) + 
                  Math.max(0, Math.min(2.375, c)) + 
                  Math.max(0, Math.min(2.375, d))) / 6 * 100;

  return rating;
}

// RB Statistics Calculations
export function calculateRBStats(stats: Omit<RBStats, 'yardsPerRush' | 'yardsPerReception' | 'totalYards' | 'totalTouchdowns'>): RBStats {
  const yardsPerRush = stats.rushAttempts > 0 
    ? stats.rushYards / stats.rushAttempts 
    : 0;

  const yardsPerReception = stats.receptions > 0 
    ? stats.receivingYards / stats.receptions 
    : 0;

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
export function calculateReceiverStats(stats: Omit<ReceiverStats, 'yardsPerReception' | 'catchPercentage' | 'yardsPerTarget' | 'totalYards' | 'totalTouchdowns'>): ReceiverStats {
  const yardsPerReception = stats.receptions > 0 
    ? stats.receivingYards / stats.receptions 
    : 0;

  const catchPercentage = stats.targets > 0 
    ? (stats.receptions / stats.targets) * 100 
    : 0;

  const yardsPerTarget = stats.targets > 0 
    ? stats.receivingYards / stats.targets 
    : 0;

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
export function calculateDefensiveStats(stats: Omit<DefensiveStats, 'tacklesPerGame' | 'sacksPerGame'>): DefensiveStats {
  const tacklesPerGame = stats.totalTackles > 0 ? stats.totalTackles : 0; // Would need games played
  const sacksPerGame = stats.sacks > 0 ? stats.sacks : 0; // Would need games played

  return {
    ...stats,
    tacklesPerGame: Math.round(tacklesPerGame * 100) / 100,
    sacksPerGame: Math.round(sacksPerGame * 100) / 100
  };
}

// Scouting Score Calculations
export function calculateScoutingScore(stats: QBStats | RBStats | ReceiverStats | DefensiveStats, position: string): number {
  let score = 0;

  switch (position) {
    case 'QB':
      const qbStats = stats as QBStats;
      score = calculateQBScoutingScore(qbStats);
      break;
    case 'RB':
      const rbStats = stats as RBStats;
      score = calculateRBScoutingScore(rbStats);
      break;
    case 'WR':
    case 'TE':
      const receiverStats = stats as ReceiverStats;
      score = calculateReceiverScoutingScore(receiverStats);
      break;
    default:
      const defensiveStats = stats as DefensiveStats;
      score = calculateDefensiveScoutingScore(defensiveStats);
  }

  return Math.min(100, Math.max(0, score));
}

function calculateQBScoutingScore(stats: QBStats): number {
  let score = 0;
  
  // Completion percentage (30% weight)
  score += Math.min(30, (stats.completionPercentage || 0) * 0.3);
  
  // Yards per attempt (25% weight)
  score += Math.min(25, (stats.yardsPerAttempt || 0) * 2.5);
  
  // TD/INT ratio (25% weight)
  const tdIntRatio = stats.interceptions > 0 ? stats.passTouchdowns / stats.interceptions : stats.passTouchdowns * 2;
  score += Math.min(25, tdIntRatio * 5);
  
  // Passer rating (20% weight)
  score += Math.min(20, (stats.passerRating || 0) * 0.2);

  return score;
}

function calculateRBScoutingScore(stats: RBStats): number {
  let score = 0;
  
  // Yards per rush (40% weight)
  score += Math.min(40, (stats.yardsPerRush || 0) * 10);
  
  // Total touchdowns (30% weight)
  score += Math.min(30, stats.totalTouchdowns * 3);
  
  // Receiving ability (20% weight)
  score += Math.min(20, (stats.yardsPerReception || 0) * 2);
  
  // Ball security (10% weight)
  const fumbleRate = stats.rushAttempts + stats.receptions > 0 
    ? stats.fumblesLost / (stats.rushAttempts + stats.receptions) 
    : 0;
  score += Math.min(10, (1 - fumbleRate * 100) * 10);

  return score;
}

function calculateReceiverScoutingScore(stats: ReceiverStats): number {
  let score = 0;
  
  // Yards per reception (35% weight)
  score += Math.min(35, (stats.yardsPerReception || 0) * 1.5);
  
  // Catch percentage (25% weight)
  score += Math.min(25, (stats.catchPercentage || 0) * 0.25);
  
  // Total touchdowns (25% weight)
  score += Math.min(25, stats.totalTouchdowns * 4);
  
  // Yards per target (15% weight)
  score += Math.min(15, (stats.yardsPerTarget || 0) * 1.5);

  return score;
}

function calculateDefensiveScoutingScore(stats: DefensiveStats): number {
  let score = 0;
  
  // Tackles per game (30% weight)
  score += Math.min(30, (stats.tacklesPerGame || 0) * 3);
  
  // Sacks per game (25% weight)
  score += Math.min(25, (stats.sacksPerGame || 0) * 10);
  
  // Interceptions (20% weight)
  score += Math.min(20, stats.interceptions * 5);
  
  // Passes defended (15% weight)
  score += Math.min(15, stats.passesDefended * 2);
  
  // Forced fumbles (10% weight)
  score += Math.min(10, stats.forcedFumbles * 5);

  return score;
}
