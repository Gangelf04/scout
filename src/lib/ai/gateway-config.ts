// Vercel AI Gateway Configuration
// This file contains the configuration for using Vercel's AI Gateway
// The AI SDK automatically uses Vercel AI Gateway when deployed on Vercel

export const gatewayConfig = {
  // Gateway-specific settings
  settings: {
    // Enable caching for better performance
    enableCaching: true,

    // Cache TTL in seconds (1 hour for player analysis, 30 minutes for price predictions)
    cacheTTL: {
      playerAnalysis: 3600,
      pricePrediction: 1800,
      newsAnalysis: 900, // 15 minutes for news
      teamAnalysis: 3600,
      recommendations: 1800
    },

    // Rate limiting settings
    rateLimits: {
      requestsPerMinute: 100,
      requestsPerHour: 1000,
      requestsPerDay: 10000
    },

    // Retry configuration
    retry: {
      maxAttempts: 3,
      backoffMultiplier: 2,
      initialDelay: 1000 // 1 second
    },

    // Timeout settings
    timeouts: {
      default: 30000, // 30 seconds
      playerAnalysis: 45000, // 45 seconds for complex analysis
      pricePrediction: 30000,
      newsAnalysis: 20000,
      teamAnalysis: 45000,
      recommendations: 30000
    }
  },

  // Model-specific configurations
  models: {
    'gpt-4o-mini': {
      provider: 'openai',
      maxTokens: 2000,
      temperature: 0.7,
      costPerToken: 0.00015 // $0.15 per 1M tokens
    },
    'claude-3-5-sonnet-20241022': {
      provider: 'anthropic',
      maxTokens: 4000,
      temperature: 0.3,
      costPerToken: 0.003 // $3.00 per 1M tokens
    }
  }
};

// Helper function to get cache TTL for a specific service
export function getCacheTTL(service: keyof typeof gatewayConfig.settings.cacheTTL): number {
  return gatewayConfig.settings.cacheTTL[service];
}

// Helper function to get timeout for a specific service
export function getTimeout(service: keyof typeof gatewayConfig.settings.timeouts): number {
  return gatewayConfig.settings.timeouts[service];
}
