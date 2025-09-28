// Football statistics types
export interface QBStats {
  // Passing stats
  passAttempts: number;
  passCompletions: number;
  passYards: number;
  passTouchdowns: number;
  interceptions: number;
  passLong: number;
  sacks: number;
  sackYards: number;
  // Rushing stats
  rushAttempts: number;
  rushYards: number;
  rushTouchdowns: number;
  rushLong: number;
  // Calculated stats
  completionPercentage?: number;
  yardsPerAttempt?: number;
  yardsPerCompletion?: number;
  passerRating?: number;
  qbr?: number; // ESPN QBR
}

export interface RBStats {
  // Rushing stats
  rushAttempts: number;
  rushYards: number;
  rushTouchdowns: number;
  rushLong: number;
  fumbles: number;
  fumblesLost: number;
  // Receiving stats
  receptions: number;
  receivingYards: number;
  receivingTouchdowns: number;
  receivingLong: number;
  // Calculated stats
  yardsPerRush?: number;
  yardsPerReception?: number;
  totalYards: number;
  totalTouchdowns: number;
}

export interface ReceiverStats {
  position: 'WR' | 'TE';
  // Receiving stats
  receptions: number;
  receivingYards: number;
  receivingTouchdowns: number;
  receivingLong: number;
  targets: number;
  drops: number;
  fumbles: number;
  fumblesLost: number;
  // Rushing stats (for WRs)
  rushAttempts: number;
  rushYards: number;
  rushTouchdowns: number;
  // Calculated stats
  yardsPerReception?: number;
  catchPercentage?: number;
  yardsPerTarget?: number;
  totalYards: number;
  totalTouchdowns: number;
}

export interface DefensiveStats {
  position: 'DE' | 'DT' | 'LB' | 'CB' | 'S' | 'OLB' | 'ILB' | 'FS' | 'SS' | 'NT';
  // Tackling stats
  totalTackles: number;
  soloTackles: number;
  assistedTackles: number;
  tacklesForLoss: number;
  // Pass rush stats
  sacks: number;
  quarterbackHits: number;
  // Coverage stats
  interceptions: number;
  interceptionYards: number;
  interceptionTouchdowns: number;
  passesDefended: number;
  // Special teams
  fumbleRecoveries: number;
  fumbleRecoveryYards: number;
  fumbleRecoveryTouchdowns: number;
  forcedFumbles: number;
  // Calculated stats
  tacklesPerGame?: number;
  sacksPerGame?: number;
}

export interface GameStats {
  playerId: string;
  teamId: string;
  opponentId?: string;
  gameDate: string;
  season: string;
  week?: number;
  position: string;
  // Game context
  isHome: boolean;
  isWin: boolean;
  teamScore: number;
  opponentScore: number;
  // Position-specific stats
  stats: QBStats | RBStats | ReceiverStats | DefensiveStats;
}

export interface FootballStats {
  playerId: string;
  season: string;
  teamId?: string;
  position: string;
  gamesPlayed: number;
  gamesStarted: number;
  // Position-specific stats will be in related tables
  qbStats?: QBStats;
  rbStats?: RBStats;
  receiverStats?: ReceiverStats;
  defensiveStats?: DefensiveStats;
}

// Utility types for queries
export type Position =
  | 'QB'
  | 'RB'
  | 'WR'
  | 'TE'
  | 'DE'
  | 'DT'
  | 'LB'
  | 'CB'
  | 'S'
  | 'OLB'
  | 'ILB'
  | 'FS'
  | 'SS'
  | 'NT';

export interface StatsQuery {
  playerId?: string;
  season?: string;
  teamId?: string;
  position?: Position;
  minGames?: number;
  sortBy?: keyof QBStats | keyof RBStats | keyof ReceiverStats | keyof DefensiveStats;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Calculated metrics for scouting
export interface ScoutingMetrics {
  // Efficiency metrics
  efficiency: number;
  // Consistency metrics
  consistency: number;
  // Big play ability
  bigPlayAbility: number;
  // Situational performance
  clutchPerformance: number;
  // Overall scouting score
  scoutingScore: number;
  // Position-specific metrics
  positionMetrics: Record<string, number>;
}
