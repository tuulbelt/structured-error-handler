#!/usr/bin/env node --import tsx
/**
 * Structured Error Handler Benchmarks
 *
 * Measures performance of core operations using tatami-ng for statistical rigor.
 *
 * Run: npm run bench
 *
 * See: /docs/BENCHMARKING_STANDARDS.md
 */

import { bench, baseline, group, run } from 'tatami-ng';
import { StructuredError, ErrorContext, toJSON, fromJSON } from '../src/index.ts';

// Prevent dead code elimination
let result: StructuredError | string | ErrorContext;

// Sample data for benchmarking
const simpleContext: ErrorContext = { operation: 'test' };
const richContext: ErrorContext = {
  operation: 'database.query',
  userId: 'user-123',
  requestId: 'req-456',
  timestamp: Date.now(),
  metadata: { table: 'users', query: 'SELECT * FROM users WHERE id = ?' },
};

// ============================================================================
// Core Operations Benchmarks
// ============================================================================

group('Error Creation', () => {
  baseline('create: simple error', () => {
    result = new StructuredError('Something went wrong', 'GENERIC_ERROR');
  });

  bench('create: with simple context', () => {
    result = new StructuredError('Operation failed', 'OP_FAILED', simpleContext);
  });

  bench('create: with rich context', () => {
    result = new StructuredError('Database query failed', 'DB_ERROR', richContext);
  });

  bench('create: with cause chain', () => {
    const cause = new Error('Connection timeout');
    result = new StructuredError('Database error', 'DB_ERROR', richContext, cause);
  });
});

group('Error Wrapping', () => {
  const nativeError = new Error('Native error message');

  baseline('wrap: native Error', () => {
    result = StructuredError.wrap(nativeError);
  });

  bench('wrap: with context', () => {
    result = StructuredError.wrap(nativeError, richContext);
  });

  bench('wrap: with code override', () => {
    result = StructuredError.wrap(nativeError, richContext, 'WRAPPED_ERROR');
  });
});

group('Serialization', () => {
  const error = new StructuredError('Test error', 'TEST', richContext);

  baseline('toJSON: serialize', () => {
    result = toJSON(error);
  });

  bench('fromJSON: deserialize', () => {
    const json = toJSON(error);
    result = fromJSON(json);
  });

  bench('round-trip: serialize + deserialize', () => {
    const json = toJSON(error);
    result = fromJSON(json);
  });
});

// ============================================================================
// Run Benchmarks
// ============================================================================

await run({
  units: false,
  silent: false,
  json: false,
});
