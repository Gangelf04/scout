import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  decimal,
  jsonb,
  varchar,
  date,
  primaryKey
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// NextAuth required tables
export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image')
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state')
  },
  account => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] })
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull()
  },
  vt => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
  })
);

// App-specific users table (for additional user data)
export const appUsers = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Sports table (football, basketball, baseball, etc. - future expansion)
export const sports = pgTable('sports', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  displayName: text('display_name').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Teams table (schools, divisions, conferences, sport-agnostic)
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  shortName: text('short_name'),
  division: text('division'),
  conference: text('conference'),
  sportId: uuid('sport_id').references(() => sports.id),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Players table (High School/NCAA, sport-agnostic)
export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  position: text('position'),
  height: text('height'),
  weight: integer('weight'),
  year: text('year'), // Freshman, Sophomore, Junior, Senior, etc.
  sportId: uuid('sport_id').references(() => sports.id),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Team_rosters table (player-team relationships)
export const teamRosters = pgTable('team_rosters', {
  id: uuid('id').primaryKey().defaultRandom(),
  playerId: uuid('player_id')
    .references(() => players.id)
    .notNull(),
  teamId: uuid('team_id')
    .references(() => teams.id)
    .notNull(),
  season: text('season').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Schedules table (team schedules and opponents)
export const schedules = pgTable('schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id')
    .references(() => teams.id)
    .notNull(),
  opponentId: uuid('opponent_id').references(() => teams.id),
  gameDate: date('game_date').notNull(),
  season: text('season').notNull(),
  isHome: boolean('is_home').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Cards table (sports cards, sport-agnostic)
export const cards = pgTable('cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  playerId: uuid('player_id')
    .references(() => players.id)
    .notNull(),
  cardName: text('card_name').notNull(),
  cardNumber: text('card_number'),
  set: text('set'),
  year: integer('year'),
  condition: text('condition'),
  sportId: uuid('sport_id').references(() => sports.id),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Price_history table (eBay/COMC prices)
export const priceHistory = pgTable('price_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  cardId: uuid('card_id')
    .references(() => cards.id)
    .notNull(),
  source: text('source').notNull(), // 'ebay', 'comc', etc.
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  condition: text('condition'),
  soldAt: timestamp('sold_at'),
  listingUrl: text('listing_url'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Watchlist table (user's tracked players)
export const watchlist = pgTable('watchlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => appUsers.id)
    .notNull(),
  playerId: uuid('player_id')
    .references(() => players.id)
    .notNull(),
  addedAt: timestamp('added_at').defaultNow().notNull()
});

// Player_ratings table (247Sports prospect rankings, sport-agnostic)
export const playerRatings = pgTable('player_ratings', {
  id: uuid('id').primaryKey().defaultRandom(),
  playerId: uuid('player_id')
    .references(() => players.id)
    .notNull(),
  source: text('source').notNull(), // '247sports', 'rivals', etc.
  rating: decimal('rating', { precision: 3, scale: 1 }),
  ranking: integer('ranking'),
  positionRanking: integer('position_ranking'),
  stateRanking: integer('state_ranking'),
  nationalRanking: integer('national_ranking'),
  evaluation: text('evaluation'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Player_stats table (ESPN college statistics, sport-agnostic)
export const playerStats = pgTable('player_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  playerId: uuid('player_id')
    .references(() => players.id)
    .notNull(),
  season: text('season').notNull(),
  teamId: uuid('team_id').references(() => teams.id),
  stats: jsonb('stats').notNull(), // Flexible JSON for different sports
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Football-specific statistics tables
export const footballStats = pgTable('football_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  playerId: uuid('player_id')
    .references(() => players.id)
    .notNull(),
  season: text('season').notNull(),
  teamId: uuid('team_id').references(() => teams.id),
  position: text('position').notNull(), // QB, RB, WR, TE, etc.
  gamesPlayed: integer('games_played').default(0).notNull(),
  gamesStarted: integer('games_started').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// QB-specific statistics
export const qbStats = pgTable('qb_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  footballStatsId: uuid('football_stats_id')
    .references(() => footballStats.id)
    .notNull(),
  // Passing stats
  passAttempts: integer('pass_attempts').default(0).notNull(),
  passCompletions: integer('pass_completions').default(0).notNull(),
  passYards: integer('pass_yards').default(0).notNull(),
  passTouchdowns: integer('pass_touchdowns').default(0).notNull(),
  interceptions: integer('interceptions').default(0).notNull(),
  passLong: integer('pass_long').default(0).notNull(),
  sacks: integer('sacks').default(0).notNull(),
  sackYards: integer('sack_yards').default(0).notNull(),
  // Rushing stats
  rushAttempts: integer('rush_attempts').default(0).notNull(),
  rushYards: integer('rush_yards').default(0).notNull(),
  rushTouchdowns: integer('rush_touchdowns').default(0).notNull(),
  rushLong: integer('rush_long').default(0).notNull(),
  // Calculated stats
  completionPercentage: decimal('completion_percentage', { precision: 5, scale: 2 }),
  yardsPerAttempt: decimal('yards_per_attempt', { precision: 5, scale: 2 }),
  yardsPerCompletion: decimal('yards_per_completion', { precision: 5, scale: 2 }),
  passerRating: decimal('passer_rating', { precision: 5, scale: 2 }),
  qbr: decimal('qbr', { precision: 5, scale: 2 }), // ESPN QBR
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// RB-specific statistics
export const rbStats = pgTable('rb_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  footballStatsId: uuid('football_stats_id')
    .references(() => footballStats.id)
    .notNull(),
  // Rushing stats
  rushAttempts: integer('rush_attempts').default(0).notNull(),
  rushYards: integer('rush_yards').default(0).notNull(),
  rushTouchdowns: integer('rush_touchdowns').default(0).notNull(),
  rushLong: integer('rush_long').default(0).notNull(),
  fumbles: integer('fumbles').default(0).notNull(),
  fumblesLost: integer('fumbles_lost').default(0).notNull(),
  // Receiving stats
  receptions: integer('receptions').default(0).notNull(),
  receivingYards: integer('receiving_yards').default(0).notNull(),
  receivingTouchdowns: integer('receiving_touchdowns').default(0).notNull(),
  receivingLong: integer('receiving_long').default(0).notNull(),
  // Calculated stats
  yardsPerRush: decimal('yards_per_rush', { precision: 5, scale: 2 }),
  yardsPerReception: decimal('yards_per_reception', { precision: 5, scale: 2 }),
  totalYards: integer('total_yards').default(0).notNull(),
  totalTouchdowns: integer('total_touchdowns').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// WR/TE-specific statistics
export const receiverStats = pgTable('receiver_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  footballStatsId: uuid('football_stats_id')
    .references(() => footballStats.id)
    .notNull(),
  position: text('position').notNull(), // WR, TE
  // Receiving stats
  receptions: integer('receptions').default(0).notNull(),
  receivingYards: integer('receiving_yards').default(0).notNull(),
  receivingTouchdowns: integer('receiving_touchdowns').default(0).notNull(),
  receivingLong: integer('receiving_long').default(0).notNull(),
  targets: integer('targets').default(0).notNull(),
  drops: integer('drops').default(0).notNull(),
  fumbles: integer('fumbles').default(0).notNull(),
  fumblesLost: integer('fumbles_lost').default(0).notNull(),
  // Rushing stats (for WRs)
  rushAttempts: integer('rush_attempts').default(0).notNull(),
  rushYards: integer('rush_yards').default(0).notNull(),
  rushTouchdowns: integer('rush_touchdowns').default(0).notNull(),
  // Calculated stats
  yardsPerReception: decimal('yards_per_reception', { precision: 5, scale: 2 }),
  catchPercentage: decimal('catch_percentage', { precision: 5, scale: 2 }),
  yardsPerTarget: decimal('yards_per_target', { precision: 5, scale: 2 }),
  totalYards: integer('total_yards').default(0).notNull(),
  totalTouchdowns: integer('total_touchdowns').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Defensive statistics
export const defensiveStats = pgTable('defensive_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  footballStatsId: uuid('football_stats_id')
    .references(() => footballStats.id)
    .notNull(),
  position: text('position').notNull(), // DE, DT, LB, CB, S, etc.
  // Tackling stats
  totalTackles: integer('total_tackles').default(0).notNull(),
  soloTackles: integer('solo_tackles').default(0).notNull(),
  assistedTackles: integer('assisted_tackles').default(0).notNull(),
  tacklesForLoss: integer('tackles_for_loss').default(0).notNull(),
  // Pass rush stats
  sacks: integer('sacks').default(0).notNull(),
  quarterbackHits: integer('quarterback_hits').default(0).notNull(),
  // Coverage stats
  interceptions: integer('interceptions').default(0).notNull(),
  interceptionYards: integer('interception_yards').default(0).notNull(),
  interceptionTouchdowns: integer('interception_touchdowns').default(0).notNull(),
  passesDefended: integer('passes_defended').default(0).notNull(),
  // Special teams
  fumbleRecoveries: integer('fumble_recoveries').default(0).notNull(),
  fumbleRecoveryYards: integer('fumble_recovery_yards').default(0).notNull(),
  fumbleRecoveryTouchdowns: integer('fumble_recovery_touchdowns').default(0).notNull(),
  forcedFumbles: integer('forced_fumbles').default(0).notNull(),
  // Calculated stats
  tacklesPerGame: decimal('tackles_per_game', { precision: 5, scale: 2 }),
  sacksPerGame: decimal('sacks_per_game', { precision: 5, scale: 2 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Game-level statistics (for detailed analysis)
export const gameStats = pgTable('game_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  playerId: uuid('player_id')
    .references(() => players.id)
    .notNull(),
  teamId: uuid('team_id').references(() => teams.id),
  opponentId: uuid('opponent_id').references(() => teams.id),
  gameDate: date('game_date').notNull(),
  season: text('season').notNull(),
  week: integer('week'),
  position: text('position').notNull(),
  // Game context
  isHome: boolean('is_home').default(true).notNull(),
  isWin: boolean('is_win').default(false).notNull(),
  teamScore: integer('team_score').default(0).notNull(),
  opponentScore: integer('opponent_score').default(0).notNull(),
  // Position-specific stats (stored as JSONB for flexibility)
  stats: jsonb('stats').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// High_school_prospects table (247Sports rankings and evaluations)
export const highSchoolProspects = pgTable('high_school_prospects', {
  id: uuid('id').primaryKey().defaultRandom(),
  playerId: uuid('player_id')
    .references(() => players.id)
    .notNull(),
  highSchool: text('high_school').notNull(),
  state: text('state').notNull(),
  class: text('class').notNull(), // 2025, 2026, etc.
  position: text('position').notNull(),
  height: text('height'),
  weight: integer('weight'),
  rating: decimal('rating', { precision: 3, scale: 1 }),
  nationalRanking: integer('national_ranking'),
  positionRanking: integer('position_ranking'),
  stateRanking: integer('state_ranking'),
  evaluation: text('evaluation'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Player_news table (Tavily real-time news and updates)
export const playerNews = pgTable('player_news', {
  id: uuid('id').primaryKey().defaultRandom(),
  playerId: uuid('player_id')
    .references(() => players.id)
    .notNull(),
  title: text('title').notNull(),
  content: text('content'),
  source: text('source').notNull(),
  url: text('url'),
  publishedAt: timestamp('published_at').notNull(),
  sentiment: text('sentiment'), // 'positive', 'negative', 'neutral'
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Market_trends table (card market analysis and trends)
export const marketTrends = pgTable('market_trends', {
  id: uuid('id').primaryKey().defaultRandom(),
  sportId: uuid('sport_id').references(() => sports.id),
  position: text('position'),
  trend: text('trend').notNull(), // 'rising', 'falling', 'stable'
  value: decimal('value', { precision: 10, scale: 2 }),
  changePercent: decimal('change_percent', { precision: 5, scale: 2 }),
  period: text('period').notNull(), // 'daily', 'weekly', 'monthly'
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// User_portfolios table (user investment tracking)
export const userPortfolios = pgTable('user_portfolios', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => appUsers.id)
    .notNull(),
  cardId: uuid('card_id')
    .references(() => cards.id)
    .notNull(),
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }).notNull(),
  purchaseDate: date('purchase_date').notNull(),
  quantity: integer('quantity').default(1).notNull(),
  currentValue: decimal('current_value', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// User_analytics table (user performance and ROI tracking)
export const userAnalytics = pgTable('user_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => appUsers.id)
    .notNull(),
  totalInvested: decimal('total_invested', { precision: 12, scale: 2 }).default('0').notNull(),
  totalValue: decimal('total_value', { precision: 12, scale: 2 }).default('0').notNull(),
  totalReturn: decimal('total_return', { precision: 12, scale: 2 }).default('0').notNull(),
  roiPercent: decimal('roi_percent', { precision: 5, scale: 2 }).default('0').notNull(),
  cardsTracked: integer('cards_tracked').default(0).notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  appUser: many(appUsers)
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id]
  })
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));

export const appUsersRelations = relations(appUsers, ({ one, many }) => ({
  user: one(users, {
    fields: [appUsers.userId],
    references: [users.id]
  }),
  watchlist: many(watchlist),
  portfolios: many(userPortfolios),
  analytics: many(userAnalytics)
}));

export const playersRelations = relations(players, ({ many, one }) => ({
  sport: one(sports, {
    fields: [players.sportId],
    references: [sports.id]
  }),
  teamRosters: many(teamRosters),
  cards: many(cards),
  watchlist: many(watchlist),
  ratings: many(playerRatings),
  stats: many(playerStats),
  footballStats: many(footballStats),
  gameStats: many(gameStats),
  highSchoolProspects: many(highSchoolProspects),
  news: many(playerNews)
}));

export const teamsRelations = relations(teams, ({ many, one }) => ({
  sport: one(sports, {
    fields: [teams.sportId],
    references: [sports.id]
  }),
  rosters: many(teamRosters),
  schedules: many(schedules),
  playerStats: many(playerStats)
}));

export const cardsRelations = relations(cards, ({ many, one }) => ({
  player: one(players, {
    fields: [cards.playerId],
    references: [players.id]
  }),
  sport: one(sports, {
    fields: [cards.sportId],
    references: [sports.id]
  }),
  priceHistory: many(priceHistory),
  portfolios: many(userPortfolios)
}));

export const priceHistoryRelations = relations(priceHistory, ({ one }) => ({
  card: one(cards, {
    fields: [priceHistory.cardId],
    references: [cards.id]
  })
}));

// Football statistics relations
export const footballStatsRelations = relations(footballStats, ({ one, many }) => ({
  player: one(players, {
    fields: [footballStats.playerId],
    references: [players.id]
  }),
  team: one(teams, {
    fields: [footballStats.teamId],
    references: [teams.id]
  }),
  qbStats: many(qbStats),
  rbStats: many(rbStats),
  receiverStats: many(receiverStats),
  defensiveStats: many(defensiveStats)
}));

export const qbStatsRelations = relations(qbStats, ({ one }) => ({
  footballStats: one(footballStats, {
    fields: [qbStats.footballStatsId],
    references: [footballStats.id]
  })
}));

export const rbStatsRelations = relations(rbStats, ({ one }) => ({
  footballStats: one(footballStats, {
    fields: [rbStats.footballStatsId],
    references: [footballStats.id]
  })
}));

export const receiverStatsRelations = relations(receiverStats, ({ one }) => ({
  footballStats: one(footballStats, {
    fields: [receiverStats.footballStatsId],
    references: [footballStats.id]
  })
}));

export const defensiveStatsRelations = relations(defensiveStats, ({ one }) => ({
  footballStats: one(footballStats, {
    fields: [defensiveStats.footballStatsId],
    references: [footballStats.id]
  })
}));

export const gameStatsRelations = relations(gameStats, ({ one }) => ({
  player: one(players, {
    fields: [gameStats.playerId],
    references: [players.id]
  }),
  team: one(teams, {
    fields: [gameStats.teamId],
    references: [teams.id]
  }),
  opponent: one(teams, {
    fields: [gameStats.opponentId],
    references: [teams.id]
  })
}));
