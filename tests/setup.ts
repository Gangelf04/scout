import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { setupTestDb, cleanupTestDb } from './test-db';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Setup test database before all tests
beforeAll(async () => {
  await setupTestDb();
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Cleanup test database after all tests
afterAll(async () => {
  await cleanupTestDb();
});
