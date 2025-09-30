import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

// AI Model Configuration using Vercel AI Gateway
// Vercel AI Gateway automatically handles routing, caching, and optimization
export const aiConfig = {
  // OpenAI models for general analysis and predictions
  openai: {
    model: openai('gpt-4o-mini'),
    temperature: 0.7,
    maxTokens: 2000
  },

  // Anthropic models for more complex reasoning
  anthropic: {
    model: anthropic('claude-3-5-sonnet-20241022'),
    temperature: 0.3,
    maxTokens: 4000
  },

  // Specialized models for different tasks
  models: {
    // Player analysis and scouting reports
    playerAnalysis: openai('gpt-4o-mini'),

    // Price predictions and market analysis
    pricePrediction: openai('gpt-4o-mini'),

    // News analysis and sentiment
    newsAnalysis: anthropic('claude-3-5-sonnet-20241022'),

    // Team chemistry analysis
    teamAnalysis: openai('gpt-4o-mini'),

    // General recommendations
    recommendations: openai('gpt-4o-mini')
  }
};

// AI Feature Flags
export const aiFeatures = {
  playerAnalysis: true,
  pricePrediction: true,
  newsAnalysis: true,
  teamAnalysis: true,
  recommendations: true,
  scoutingReports: true,
  marketTrends: true
} as const;

// AI Rate Limiting
export const aiRateLimits = {
  requestsPerMinute: 60,
  requestsPerHour: 1000,
  maxTokensPerRequest: 4000
} as const;
