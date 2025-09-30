// AI Analysis Types
export interface PlayerAnalysis {
  playerId: string;
  overallScore: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  potential: 'High' | 'Medium' | 'Low';
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendation: 'Buy' | 'Hold' | 'Sell' | 'Watch';
  reasoning: string;
  keyMetrics: {
    athleticism: number;
    production: number;
    consistency: number;
    upside: number;
  };
  comparablePlayers: string[]; // Player IDs
  lastUpdated: Date;
}

export interface PricePrediction {
  cardId: string;
  currentPrice: number;
  predictedPrice: {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
  };
  confidence: number; // 0-100
  factors: {
    playerPerformance: number;
    marketTrends: number;
    teamSuccess: number;
    mediaAttention: number;
    injuryRisk: number;
  };
  reasoning: string;
  lastUpdated: Date;
}

export interface NewsAnalysis {
  playerId: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  confidence: number; // 0-100
  keyTopics: string[];
  impactScore: number; // 0-100
  summary: string;
  articles: {
    title: string;
    url: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    publishedAt: Date;
  }[];
  lastUpdated: Date;
}

export interface TeamAnalysis {
  teamId: string;
  overallStrength: number; // 0-100
  offensiveStrength: number;
  defensiveStrength: number;
  specialTeamsStrength: number;
  coachingQuality: number;
  scheduleDifficulty: number;
  chemistry: {
    qbWr: number;
    offensiveLine: number;
    defensiveUnit: number;
  };
  strengths: string[];
  weaknesses: string[];
  keyPlayers: string[]; // Player IDs
  lastUpdated: Date;
}

export interface ScoutingReport {
  playerId: string;
  reportType: 'Comprehensive' | 'Quick' | 'Deep Dive';
  sections: {
    overview: string;
    strengths: string;
    weaknesses: string;
    projection: string;
    comparison: string;
    recommendation: string;
  };
  grade: {
    overall: string; // A+, A, A-, B+, etc.
    athleticism: string;
    production: string;
    consistency: string;
    upside: string;
  };
  lastUpdated: Date;
}

export interface MarketTrend {
  trendType: 'Position' | 'Conference' | 'Overall' | 'Specific Player';
  target: string; // Position name, conference, or player ID
  direction: 'Rising' | 'Falling' | 'Stable';
  strength: number; // 0-100
  timeframe: 'Daily' | 'Weekly' | 'Monthly' | 'Seasonal';
  factors: string[];
  prediction: string;
  confidence: number; // 0-100
  lastUpdated: Date;
}

export interface AIRecommendation {
  id: string;
  type: 'Player' | 'Card' | 'Portfolio' | 'Market';
  priority: 'High' | 'Medium' | 'Low';
  action: 'Buy' | 'Sell' | 'Hold' | 'Watch';
  target: string; // Player ID, Card ID, etc.
  reasoning: string;
  confidence: number; // 0-100
  timeframe: string;
  expectedReturn?: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  createdAt: Date;
}

// AI Request/Response Types
export interface AIAnalysisRequest {
  type: 'player' | 'price' | 'news' | 'team' | 'scouting' | 'market';
  targetId: string;
  options?: {
    includeComparisons?: boolean;
    includeProjections?: boolean;
    includeRisks?: boolean;
    timeframe?: string;
  };
}

export interface AIAnalysisResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  processingTime: number;
  model: string;
  timestamp: Date;
}
