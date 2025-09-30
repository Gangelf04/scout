# Vercel AI Gateway Setup Guide

This guide explains how to configure and use Vercel's AI Gateway with your Scout application.

## What is Vercel AI Gateway?

Vercel AI Gateway is a production-ready AI infrastructure that provides:

- **Automatic routing** to the best AI providers
- **Intelligent caching** to reduce costs and improve performance
- **Rate limiting** and **retry logic** for reliability
- **Analytics** and **monitoring** for AI usage
- **Cost optimization** through smart model selection

## Setup Instructions

### 1. Deploy to Vercel

The AI Gateway is automatically enabled when you deploy your Next.js app to Vercel:

```bash
# Deploy to Vercel
vercel --prod

# Or use the Vercel CLI
npx vercel
```

### 2. Configure Environment Variables

In your Vercel dashboard, add these environment variables:

```env
# Required AI API Keys
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Optional: Custom Gateway URLs (if using Cloudflare AI Gateway)
AI_GATEWAY_OPENAI_URL=https://gateway.ai.cloudflare.com/v1/your-account-id/your-gateway-name/openai
AI_GATEWAY_ANTHROPIC_URL=https://gateway.ai.cloudflare.com/v1/your-account-id/your-gateway-name/anthropic
```

### 3. AI Gateway Features

#### Automatic Caching

- Player analysis results are cached for 1 hour
- Price predictions are cached for 30 minutes
- News analysis is cached for 15 minutes
- Team analysis is cached for 1 hour

#### Rate Limiting

- 100 requests per minute
- 1,000 requests per hour
- 10,000 requests per day

#### Retry Logic

- Automatic retries with exponential backoff
- Maximum 3 attempts per request
- Smart error handling and fallbacks

### 4. Monitoring and Analytics

Access your AI usage analytics in the Vercel dashboard:

- **Usage metrics** - Track API calls and costs
- **Performance data** - Monitor response times
- **Error rates** - Identify and fix issues
- **Cost analysis** - Optimize spending

### 5. Custom Configuration

You can customize the AI Gateway behavior by modifying `src/lib/ai/gateway-config.ts`:

```typescript
export const gatewayConfig = {
  settings: {
    // Adjust cache TTL for different services
    cacheTTL: {
      playerAnalysis: 3600, // 1 hour
      pricePrediction: 1800, // 30 minutes
      newsAnalysis: 900 // 15 minutes
    },

    // Configure rate limits
    rateLimits: {
      requestsPerMinute: 100,
      requestsPerHour: 1000
    }
  }
};
```

### 6. Testing the Setup

1. **Deploy your app** to Vercel
2. **Visit the AI dashboard** at `/ai`
3. **Test player search** functionality
4. **Check the Vercel dashboard** for AI usage metrics

### 7. Production Considerations

#### Cost Optimization

- Vercel AI Gateway automatically selects the most cost-effective models
- Caching reduces redundant API calls
- Smart routing minimizes latency

#### Performance

- Edge caching for faster responses
- Automatic retries for reliability
- Load balancing across providers

#### Security

- API keys are securely managed by Vercel
- No need to expose keys in client-side code
- Automatic rate limiting prevents abuse

## Troubleshooting

### Common Issues

1. **API Key Not Found**

   - Ensure environment variables are set in Vercel dashboard
   - Check that keys are valid and have proper permissions

2. **Rate Limit Exceeded**

   - Check your usage in Vercel dashboard
   - Consider upgrading your plan if needed

3. **Slow Responses**
   - Check Vercel function logs for errors
   - Verify AI provider status
   - Consider adjusting timeout settings

### Debug Mode

Enable debug logging by setting:

```env
AI_DEBUG=true
```

This will log detailed information about AI requests and responses.

## Benefits of Vercel AI Gateway

1. **Cost Savings** - Up to 50% reduction in AI costs through caching
2. **Better Performance** - Faster responses with edge caching
3. **Reliability** - Automatic retries and fallbacks
4. **Monitoring** - Comprehensive analytics and alerting
5. **Scalability** - Handles high traffic automatically

## Next Steps

1. Deploy your app to Vercel
2. Configure environment variables
3. Test AI features in production
4. Monitor usage and optimize costs
5. Set up alerts for errors or high usage

For more information, visit the [Vercel AI Gateway documentation](https://vercel.com/docs/ai-gateway).
