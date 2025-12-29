# Structured Error Handler Development Guide

This file provides Claude Code with context-specific guidance for working on this tool.

## Tool Overview

**Name:** Structured Error Handler / `serr`
**Short CLI:** `serr`
**Language:** TypeScript (Node.js 18+)
**Purpose:** Error format + serialization with context preservation
**Part of:** [Tuulbelt](https://github.com/tuulbelt/tuulbelt)

## Quick Commands

```bash
# Development
npm install        # Install dev dependencies
npm test           # Run tests (88 tests)
npm run build      # TypeScript compilation
npx tsc --noEmit   # Type check only

# Usage
serr --help        # Show CLI help
npm link           # Install globally for testing
```

## Architecture

### Core Components

1. **StructuredError class** (`src/index.ts`)
   - Main error class with context preservation
   - Implements serialization methods (toJSON, toString)
   - Supports cause chain tracking

2. **Types** (`src/index.ts`)
   - `ErrorContext`: Metadata object for error context
   - Fully typed with TypeScript strict mode

3. **CLI** (`src/index.ts`)
   - Short name: `serr`
   - Long name: `structured-error-handler`
   - JSON serialization of errors

### Design Principles

- **Zero dependencies**: Uses only Node.js standard library
- **Context preservation**: Errors maintain operation context
- **Clean serialization**: toJSON() produces clean JSON output
- **Cause chain**: Supports error wrapping with cause tracking
- **TypeScript strict**: Full type safety

## Testing Strategy

**88 tests covering:**
- Error creation and initialization
- Context preservation
- Serialization (JSON, string)
- Cause chain handling
- CLI behavior
- Edge cases (empty context, null values)

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch
```

## Common Tasks

### Adding a New Error Type

1. Extend `StructuredError` class if needed
2. Add tests in `test/index.test.ts`
3. Update SPEC.md with format details
4. Run tests: `npm test`

### Updating Serialization

1. Modify `toJSON()` or `toString()` methods
2. Add tests for new serialization behavior
3. Verify against SPEC.md format
4. Check dogfooding scripts still work

## Quality Standards

Before committing:

```bash
# Required checks
npx tsc --noEmit         # Type check
npm test                 # All tests pass
npm run build            # Build succeeds

# Verify zero dependencies
grep -q '"dependencies"' package.json && echo "FAIL: Has runtime deps!" || echo "PASS"
```

## Dogfooding

This tool validates its own error handling:

```bash
# Test flakiness detection
npm run test:dogfood
# Runs: test-flakiness-detector on this tool's test suite

# Output diffing (validates serialization consistency)
./scripts/dogfood-diff.sh
```

## Known Limitations

- Node.js 18+ required (uses import.meta features)
- Synchronous serialization only (no async support)
- Error stack traces are platform-dependent

## Related Tools

- **Test Flakiness Detector**: Validates test reliability
- **Output Diffing Utility**: Verifies serialization consistency
- **CLI Progress Reporting**: Can be integrated for batch error processing

## Links

- **Repository:** https://github.com/tuulbelt/structured-error-handler
- **Documentation:** https://tuulbelt.github.io/tuulbelt/tools/structured-error-handler/
- **Issues:** https://github.com/tuulbelt/tuulbelt/issues (meta repo)
- **Meta Repo:** https://github.com/tuulbelt/tuulbelt

## Version

**Current:** v0.1.0 (Initial release)
**Next:** TBD

---

*This CLAUDE.md file is automatically included in Claude Code's context when working in this repository.*
