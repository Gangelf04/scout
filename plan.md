# Sports Card Scouting App - Development Plan

## Project Overview

A web application to scout High School and NCAA College football players to determine if we should buy their sports cards, finding players before others to maximize profits.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS v4, shadcn/ui, ESLint 9
- **Backend**: Postgres, Drizzle ORM
- **Infrastructure**: GitHub, Vercel, Sentry
- **Package Manager**: Bun
- **Authentication**: Google OAuth
- **APIs**: eBay API, Tavily Search API, COMC.com (research needed)
- **AI**: ai-sdk.dev for predictions and player search tools

## Phase 1: Foundation & Setup (Week 1-2)

### 1.1 Project Initialization

- [x] Initialize Next.js project with TypeScript
- [x] Set up Tailwind CSS v3 (switched from v4 for compatibility)
- [x] Configure ESLint 9
- [x] Set up shadcn/ui components
- [x] Initialize Git repository with proper .gitignore
- [x] Set up Bun package manager
- [x] Create basic project structure

### 1.2 Testing Foundation (Early Setup)

- [x] Set up Vitest and React Testing Library
- [x] Set up Playwright for E2E tests
- [ ] Configure test database for testing
- [x] Set up test utilities and helpers
- [x] Create basic test templates

### 1.3 Database Setup

- [ ] Set up PostgreSQL database (local + production)
- [x] Configure Drizzle ORM
- [x] Design initial database schema:
  - [x] Users table (Google OAuth integration)
  - [x] Sports table (football, basketball, baseball, etc. - future expansion)
  - [x] Players table (High School/NCAA, sport-agnostic)
  - [x] Teams table (schools, divisions, conferences, sport-agnostic)
  - [x] Team_rosters table (player-team relationships)
  - [x] Schedules table (team schedules and opponents)
  - [x] Cards table (sports cards, sport-agnostic)
  - [x] Price_history table (eBay/COMC prices)
  - [x] Watchlist table (user's tracked players)
  - [x] Player_ratings table (247Sports prospect rankings, sport-agnostic)
  - [x] Player_stats table (ESPN college statistics, sport-agnostic)
  - [x] High_school_prospects table (247Sports rankings and evaluations)
  - [x] Player_news table (Tavily real-time news and updates)
  - [x] Market_trends table (card market analysis and trends)
  - [x] User_portfolios table (user investment tracking)
  - [x] User_analytics table (user performance and ROI tracking)
  - [x] **ENHANCED**: Position-specific statistics tables (QB, RB, WR/TE, Defensive)
  - [x] **ENHANCED**: Game-level statistics for detailed analysis
  - [x] **ENHANCED**: Advanced scouting metrics and calculations
- [ ] Create database migrations
- [x] Set up database connection and environment variables

### 1.4 Authentication

- [x] Set up Google OAuth integration
- [x] Create user authentication flow
- [ ] Implement protected routes
- [x] Set up user session management
- [ ] Create user profile pages

### 1.5 Web Scraping Infrastructure

- [x] Set up web scraping tools (Puppeteer/Playwright)
- [ ] Create proxy rotation system for rate limiting
- [ ] Implement data extraction utilities
- [ ] Set up request caching and deduplication
- [ ] Create error handling and retry logic
- [ ] Add user-agent rotation and anti-detection measures

### 1.6 Basic UI Foundation

- [x] Create responsive layout components
- [x] Implement design system with warmer tones
- [x] Create navigation components
- [x] Set up routing structure
- [ ] Create loading states and error boundaries

### 1.7 Early Deployment Setup

- [ ] Set up Vercel deployment
- [ ] Configure production database
- [x] Set up environment variables
- [ ] Create CI/CD pipeline
- [ ] Deploy basic app to production

### 1.8 Phase 1 Success Metrics

- [ ] App successfully deploys to Vercel
- [x] User can authenticate with Google OAuth
- [x] Basic UI loads correctly on mobile and desktop
- [ ] Database connection works in production
- [x] All Phase 1 tests pass

### 1.9 Additional Enhancements Completed

- [x] **Enhanced Database Schema**: Added position-specific statistics tables (QB, RB, WR/TE, Defensive)
- [x] **Advanced Scouting Metrics**: Implemented calculation functions for passer rating, efficiency metrics, etc.
- [x] **Database Query Utilities**: Created comprehensive query functions for player statistics
- [x] **TypeScript Types**: Added detailed type definitions for statistics and scouting
- [x] **Fixed Testing Configuration**: Resolved Vitest globals issue for proper test execution

## Phase 2: Core Player Data (Week 3-4)

### 2.1 Data Source Research & Integration

- [ ] Research and identify data sources for High School players (247Sports rankings focus)
- [ ] Research and identify data sources for NCAA players (ESPN stats focus)
- [ ] Set up Tavily Search API for real-time data gathering
- [ ] Reverse engineer 247Sports network requests using dev tools
- [ ] Reverse engineer ESPN hidden API using dev tools and network analysis
- [ ] Reverse engineer COMC.com network requests using dev tools
- [ ] Document API endpoints and request patterns for all sources
- [ ] Create data extraction strategies for all sites
- [ ] Set up monitoring for API changes
- [ ] Create AI agent for ESPN API discovery and data extraction
- [ ] Integrate Tavily for player news, updates, and additional data enrichment

### 2.2 Player Data Management

- [ ] Set up 247Sports web scraping for prospect ratings and rankings
- [ ] Set up ESPN API integration for college player statistics
- [ ] Set up Tavily Search API integration for real-time data
- [ ] Create AI agent for ESPN data extraction and API discovery
- [ ] Create player data models and validation
- [ ] Implement player search functionality
- [ ] Create player detail pages
- [ ] Add college statistics tracking (ESPN)
- [ ] Add high school prospect rankings (247Sports)
- [ ] Add real-time player news and updates (Tavily)
- [ ] Add team context data (division, conference, schedule strength)

### 2.3 Player Search & Discovery

- [ ] Implement basic player search
- [ ] Add filtering by position, school, year, division
- [ ] Create player comparison tools
- [ ] Add player ranking/scoring system
- [ ] Implement player watchlist functionality
- [ ] Add team strength analysis integration

### 2.4 Team Context Analysis

- [ ] Create team data models (division, conference, schedule)
- [ ] Implement team strength scoring algorithms
- [ ] Add QB-WR chemistry analysis for skill positions
- [ ] Create offensive/defensive unit strength metrics
- [ ] Add schedule difficulty analysis
- [ ] Implement conference strength rankings
- [ ] Add team coaching staff analysis

### 2.5 Tavily Integration & Real-time Data

- [ ] Set up Tavily Search API client
- [ ] Create player news monitoring system
- [ ] Implement real-time data updates for tracked players
- [ ] Add Tavily-powered player research and discovery
- [ ] Create automated news alerts for player developments
- [ ] Set up Tavily for market trend analysis
- [ ] Implement Tavily for team news and coaching changes

### 2.6 Testing & Quality Assurance

- [ ] Write Vitest unit tests for player data logic
- [ ] Write Vitest unit tests for team analysis logic
- [ ] Write Vitest unit tests for Tavily integration
- [ ] Write Playwright E2E tests for player search functionality
- [ ] Write Playwright E2E tests for player detail pages
- [ ] Test data source integrations
- [ ] Validate data quality and accuracy

### 2.7 Phase 2 Deployment

- [ ] Deploy Phase 2 features to production
- [ ] Test production data integrations
- [ ] Monitor API performance and errors
- [ ] Update CI/CD pipeline for new features

### 2.8 Phase 2 Success Metrics

- [ ] User can search and find High School/NCAA players
- [ ] 247Sports prospect ratings are properly integrated
- [ ] System accurately analyzes team context (QB-WR chemistry, division strength)
- [ ] Tavily integration provides real-time player news
- [ ] All Phase 2 tests pass
- [ ] Data quality meets accuracy standards

## Phase 3: Price Integration (Week 5-6)

### 3.1 eBay API Integration

- [ ] Research eBay API documentation
- [ ] Set up eBay API credentials
- [ ] Implement eBay API client
- [ ] Create price fetching service
- [ ] Add price history tracking
- [ ] Implement price alerts

### 3.2 COMC.com Research & Integration

- [ ] Research COMC.com data access methods
- [ ] Set up COMC.com web scraping infrastructure
- [ ] Implement COMC price fetching via scraping/network requests
- [ ] Create price comparison tools
- [ ] Add price trend analysis

### 3.3 Price Analysis Tools

- [ ] Create price charts and graphs
- [ ] Implement price prediction algorithms
- [ ] Add market trend analysis
- [ ] Create price alert system
- [ ] Add profit/loss calculators

### 3.4 Card Market Analysis & Trends

- [ ] Create market trend analysis algorithms
- [ ] Implement card market sentiment tracking
- [ ] Add market volatility analysis
- [ ] Create market heat maps and visualizations
- [ ] Implement market prediction models
- [ ] Add card rarity and scarcity analysis
- [ ] Create market timing recommendations

### 3.5 Testing & Quality Assurance

- [ ] Write Vitest unit tests for price integration logic
- [ ] Write Vitest unit tests for market analysis algorithms
- [ ] Write Playwright E2E tests for price tracking functionality
- [ ] Test eBay API integration thoroughly
- [ ] Test COMC.com scraping reliability
- [ ] Validate price data accuracy

### 3.6 Phase 3 Deployment

- [ ] Deploy price integration features to production
- [ ] Test production price tracking
- [ ] Monitor API rate limits and performance
- [ ] Set up price alert notifications

### 3.7 Phase 3 Success Metrics

- [ ] User can view current card prices from eBay
- [ ] Price predictions are within reasonable accuracy
- [ ] Market trend analysis provides actionable insights
- [ ] Price alerts work correctly
- [ ] All Phase 3 tests pass
- [ ] Price data is updated in real-time

## Phase 4: AI Integration (Week 7-8)

### 4.1 AI SDK Setup

- [ ] Research and set up ai-sdk.dev
- [ ] Configure AI models for predictions
- [ ] Set up AI API keys and environment
- [ ] Create AI agent for ESPN API discovery and maintenance
- [ ] Set up AI agent for automated data extraction

### 4.2 AI-Powered Features

- [ ] Implement AI player search tools
- [ ] Create AI-powered player recommendations
- [ ] Add AI price predictions
- [ ] Implement AI market analysis
- [ ] Create AI-powered scouting reports
- [ ] Add AI team chemistry analysis (QB-WR, OL-QB, etc.)
- [ ] Implement AI schedule strength predictions
- [ ] Create AI conference strength analysis
- [ ] Add Tavily-powered AI research assistant
- [ ] Implement AI news analysis and sentiment tracking
- [ ] Create AI-powered market trend predictions using Tavily data

### 4.3 Advanced Analytics

- [ ] Add machine learning models for player evaluation
- [ ] Implement predictive analytics for card values
- [ ] Create AI-generated insights and recommendations
- [ ] Add automated scouting reports

### 4.4 Testing & Quality Assurance

- [ ] Write Vitest unit tests for AI integration logic
- [ ] Write Vitest unit tests for AI prediction models
- [ ] Write Playwright E2E tests for AI-powered features
- [ ] Test AI accuracy and performance
- [ ] Validate AI recommendations quality

### 4.5 Phase 4 Deployment

- [ ] Deploy AI features to production
- [ ] Test AI performance in production
- [ ] Monitor AI model accuracy
- [ ] Set up AI model monitoring and alerts

### 4.6 Phase 4 Success Metrics

- [ ] AI provides accurate player recommendations based on team factors
- [ ] AI-powered scouting reports are generated correctly
- [ ] AI news analysis provides valuable insights
- [ ] AI market trend predictions are accurate
- [ ] All Phase 4 tests pass
- [ ] AI features perform within acceptable response times

## Phase 5: Advanced Features (Week 9-10)

### 5.1 Portfolio Management

- [ ] Create user portfolio tracking
- [ ] Add investment tracking
- [ ] Implement profit/loss calculations
- [ ] Create portfolio analytics dashboard
- [ ] Add portfolio sharing features

### 5.2 Social Features

- [ ] Add user profiles
- [ ] Implement player discussions/forums
- [ ] Create sharing functionality
- [ ] Add user following system
- [ ] Implement community features

### 5.3 Advanced Search & Filtering

- [ ] Add advanced search filters
- [ ] Implement saved searches
- [ ] Create custom alerts
- [ ] Add bulk operations
- [ ] Implement data export features

### 5.4 User Analytics & Insights

- [ ] Create user portfolio tracking system
- [ ] Implement ROI calculation and tracking
- [ ] Add user performance analytics dashboard
- [ ] Create investment success rate tracking
- [ ] Implement user behavior analytics
- [ ] Add personalized insights and recommendations
- [ ] Create user performance reports
- [ ] Add portfolio comparison tools

### 5.5 Testing & Quality Assurance

- [ ] Write Vitest unit tests for portfolio management logic
- [ ] Write Vitest unit tests for user analytics
- [ ] Write Playwright E2E tests for advanced features
- [ ] Test social features functionality
- [ ] Validate analytics accuracy

### 5.6 Phase 5 Deployment

- [ ] Deploy advanced features to production
- [ ] Test production portfolio tracking
- [ ] Monitor user analytics performance
- [ ] Set up user feedback collection

### 5.7 Phase 5 Success Metrics

- [ ] User can track players on their watchlist
- [ ] User portfolio tracking shows accurate ROI calculations
- [ ] Social features work correctly
- [ ] Advanced search and filtering functions properly
- [ ] All Phase 5 tests pass
- [ ] User engagement metrics improve

## Phase 6: Production & Optimization (Week 11-12)

### 6.1 Performance Optimization

- [ ] Implement caching strategies
- [ ] Optimize database queries
- [ ] Add image optimization
- [ ] Implement lazy loading
- [ ] Add performance monitoring

### 6.2 Production Deployment

- [ ] Set up Vercel deployment
- [ ] Configure production database
- [ ] Set up Sentry error monitoring
- [ ] Implement CI/CD pipeline
- [ ] Add production monitoring

### 6.3 Security & Compliance

- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Set up security headers
- [ ] Implement data encryption
- [ ] Add audit logging

### 6.4 Testing & Quality Assurance

- [ ] Write Vitest unit tests for performance optimizations
- [ ] Write Vitest unit tests for security features
- [ ] Write Playwright E2E tests for production features
- [ ] Performance testing and load testing
- [ ] Security testing and penetration testing

### 6.5 Phase 6 Deployment

- [ ] Deploy optimizations to production
- [ ] Test production performance
- [ ] Monitor security and compliance
- [ ] Set up production monitoring and alerting

### 6.6 Phase 6 Success Metrics

- [ ] App performs well on mobile and desktop
- [ ] Security measures are properly implemented
- [ ] Performance meets target benchmarks
- [ ] All Phase 6 tests pass
- [ ] Production monitoring shows healthy metrics

## Phase 7: Future Sports Expansion (Week 13-14)

### 7.1 Multi-Sport Architecture

- [ ] Design sport-agnostic data models
- [ ] Create sport-specific data adapters
- [ ] Implement sport-specific rating systems
- [ ] Add sport-specific market analysis
- [ ] Create sport-specific card types and categories
- [ ] Implement sport-specific team and league data

### 7.2 Basketball Integration

- [ ] Research basketball prospect data sources
- [ ] Integrate basketball recruiting rankings
- [ ] Add basketball card market analysis
- [ ] Create basketball-specific AI models
- [ ] Implement basketball team chemistry analysis

### 7.3 Baseball Integration

- [ ] Research baseball prospect data sources
- [ ] Integrate baseball prospect rankings
- [ ] Add baseball card market analysis
- [ ] Create baseball-specific AI models
- [ ] Implement baseball team chemistry analysis

### 7.4 Testing & Quality Assurance

- [ ] Write Vitest unit tests for multi-sport architecture
- [ ] Write Vitest unit tests for basketball integration
- [ ] Write Vitest unit tests for baseball integration
- [ ] Write Playwright E2E tests for multi-sport features
- [ ] Test sport-specific functionality

### 7.5 Phase 7 Deployment

- [ ] Deploy multi-sport features to production
- [ ] Test production multi-sport functionality
- [ ] Monitor multi-sport performance
- [ ] Set up sport-specific monitoring

### 7.6 Phase 7 Success Metrics

- [ ] System supports multiple sports (football, basketball, baseball)
- [ ] Sport-specific features work correctly
- [ ] Multi-sport architecture is scalable
- [ ] All Phase 7 tests pass
- [ ] Users can switch between sports seamlessly

## Phase 8: Final Testing & Quality Assurance (Week 15-16)

### 8.1 Comprehensive Testing

- [ ] Complete Vitest unit test coverage across all phases
- [ ] Full Playwright E2E test suite for all user journeys
- [ ] Performance testing and load testing
- [ ] Security testing and penetration testing
- [ ] User acceptance testing
- [ ] Multi-sport testing
- [ ] Cross-browser and cross-device testing

### 8.2 Bug Fixes & Polish

- [ ] Fix identified bugs from comprehensive testing
- [ ] Improve user experience based on feedback
- [ ] Add accessibility features
- [ ] Optimize for mobile devices
- [ ] Final UI/UX polish

### 8.3 Final Deployment

- [ ] Deploy final version to production
- [ ] Test all production features
- [ ] Set up comprehensive monitoring
- [ ] Create user documentation

### 8.4 Phase 8 Success Metrics

- [ ] All core user journeys pass E2E tests
- [ ] App performs well on mobile and desktop
- [ ] Security measures are properly implemented
- [ ] Performance meets target benchmarks
- [ ] All Phase 8 tests pass
- [ ] Production monitoring shows healthy metrics
- [ ] User acceptance testing passes

## Open Questions Requiring Input

1. **Data Sources**:

   - **High School**: 247Sports prospect rankings and evaluations (no stats needed)
   - **College**: ESPN statistics via hidden API (preferred) or web scraping
   - **Cards**: eBay API + COMC.com scraping
   - **Real-time News**: Tavily Search API for player updates, news, and market trends

2. **247Sports Integration**: Focus on prospect rankings from [247Sports recruit rankings](https://247sports.com/season/2025-football/recruitrankings/). Should we scrape the rankings pages or try to reverse engineer their internal API calls?

3. **ESPN Integration**: Prefer using their hidden API. Should we create an AI agent to discover and maintain ESPN API endpoints, or focus on manual reverse engineering?

4. **COMC.com Integration**: Since no official API exists, we'll use web scraping. Should we focus on specific card types or try to reverse engineer their search/filtering API calls?

5. **Tavily Integration**: [Tavily](https://www.tavily.com/) offers real-time web search optimized for AI. Should we use it primarily for player news/updates, market research, or as a backup data source when other APIs fail?

6. **Team Analysis Depth**: How detailed should the team chemistry analysis be? Should we include coaching staff analysis, offensive/defensive scheme fits, etc.?

7. **Division/Conference Focus**: Should we prioritize certain conferences (SEC, Big Ten, etc.) or divisions initially, or analyze all levels equally?

8. **AI Model Selection**: Which specific AI models from ai-sdk.dev would you prefer for predictions and player analysis?

9. **Monetization**: Are there any monetization features you'd like to include (premium subscriptions, etc.)?

10. **User Limits**: Should there be any limits on the number of players users can track or API calls per user?

11. **Data Retention**: How long should we retain price history data? Any specific data retention policies?

12. **Geographic Focus**: Should we focus on specific regions or conferences initially, or go nationwide from the start?

13. **Web Scraping Strategy**: What's the preferred approach for handling rate limiting and avoiding detection? Should we use residential proxies, rotate user agents, or implement delays between requests?

14. **Future Sports Expansion**: Which sports should we prioritize after football? Basketball and baseball are planned, but should we consider others like hockey, soccer, or track & field?

## Risk Mitigation

- **API Rate Limits**: Implement proper rate limiting and caching
- **Web Scraping Detection**: Use proxy rotation, user-agent rotation, and request delays
- **Data Quality**: Validate all external data sources
- **Scraping Reliability**: Implement robust error handling and retry logic for web scraping
- **AI Accuracy**: Start with simple models and iterate
- **Performance**: Monitor and optimize database queries
- **Security**: Regular security audits and updates

---

_This plan will be updated as we progress through development phases. Check off completed items and add new requirements as they arise._
