#!/usr/bin/env npx tsx
/**
 * Dogfood: Output Consistency Validation
 *
 * Verifies that StructuredError serialization produces identical output for identical input.
 * This proves the tool is deterministic - same input always produces same output.
 */

import { StructuredError, type StructuredErrorOptions } from '../src/index.ts';

// Test cases with various error scenarios
const testCases: Array<{ message: string; options?: StructuredErrorOptions }> = [
  { message: 'Simple error' },
  { message: 'Error with code', options: { code: 'ERR_CODE' } },
  { message: 'Error with category', options: { category: 'validation' } },
  { message: 'Error with operation', options: { operation: 'readFile', component: 'FileLoader' } },
  { message: 'Error with metadata', options: { metadata: { userId: '123', file: 'test.ts', line: 42 } } },
  { message: 'Error with all fields', options: { code: 'ERR_FULL', category: 'io', operation: 'write', component: 'DB', metadata: { table: 'users' } } },
  { message: 'Complex metadata', options: { metadata: { nested: { deep: { value: true } }, array: [1, 2, 3] } } },
  { message: '', options: { code: 'EMPTY_MSG' } }, // Edge case: empty message
  { message: 'Unicode: 日本語 🎉', options: { code: 'UNICODE' } }, // Unicode handling
];

const RUNS = 100;

console.log('Dogfood: Output Consistency Validation');
console.log(`Running ${testCases.length} test cases × ${RUNS} iterations = ${testCases.length * RUNS} comparisons\n`);

let passed = 0;
let failed = 0;

for (let i = 0; i < testCases.length; i++) {
  const { message, options } = testCases[i];
  const label = `Test case ${i + 1}: "${message.slice(0, 30)}${message.length > 30 ? '...' : ''}"`;

  // Helper to strip non-deterministic fields for comparison
  function stripNonDeterministic(data: Record<string, unknown>): Record<string, unknown> {
    const cleaned = { ...data };
    delete cleaned.stack; // Stack traces differ due to line numbers
    // Strip timestamps from context entries
    if (Array.isArray(cleaned.context)) {
      cleaned.context = cleaned.context.map((ctx: Record<string, unknown>) => {
        const { timestamp, ...rest } = ctx;
        return rest;
      });
    }
    return cleaned;
  }

  // Get baseline result - create error and serialize (exclude non-deterministic fields)
  const baselineError = new StructuredError(message, options);
  const baselineData = stripNonDeterministic(baselineError.toJSON());
  const baselineJson = JSON.stringify(baselineData);

  // Run multiple times and compare
  let allMatch = true;
  for (let run = 0; run < RUNS; run++) {
    const resultError = new StructuredError(message, options);
    const resultData = stripNonDeterministic(resultError.toJSON());
    const resultJson = JSON.stringify(resultData);

    if (baselineJson !== resultJson) {
      allMatch = false;
      console.error(`FAIL: ${label} - toJSON mismatch at run ${run}`);
      console.error(`  Baseline: ${baselineJson}`);
      console.error(`  Run ${run}: ${resultJson}`);
      break;
    }
  }

  if (allMatch) {
    passed++;
    console.log(`✓ ${label} - ${RUNS} runs identical`);
  } else {
    failed++;
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Results: ${passed}/${testCases.length} passed, ${failed} failed`);

if (failed > 0) {
  console.error('\n❌ OUTPUT CONSISTENCY VALIDATION FAILED');
  console.error('The tool produced different output for identical input.');
  process.exit(1);
}

console.log('\n✅ OUTPUT CONSISTENCY VALIDATED');
console.log('All test cases produced identical output across all runs.');
process.exit(0);
