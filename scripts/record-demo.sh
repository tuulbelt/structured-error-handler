#!/bin/bash
# Record Structured Error Handler demo
source "$(dirname "$0")/lib/demo-framework.sh"

TOOL_NAME="structured-error-handler"
SHORT_NAME="serr"
LANGUAGE="typescript"

# GIF parameters
GIF_COLS=100
GIF_ROWS=30
GIF_SPEED=1.0
GIF_FONT_SIZE=14

demo_commands() {
  # ═══════════════════════════════════════════
  # Structured Error Handler / serr - Tuulbelt
  # ═══════════════════════════════════════════

  # Step 1: Installation
  echo "# Step 1: Install globally"
  sleep 0.5
  echo "$ npm link"
  sleep 1

  # Step 2: View help
  echo ""
  echo "# Step 2: View available commands"
  sleep 0.5
  echo "$ serr --help"
  sleep 0.5
  serr --help
  sleep 3

  # Step 3: View demo
  echo ""
  echo "# Step 3: Interactive demo"
  sleep 0.5
  echo "$ serr demo --format text"
  sleep 0.5
  serr demo --format text
  sleep 3

  # Step 4: Parse JSON error
  echo ""
  echo "# Step 4: Parse structured error"
  sleep 0.5
  echo "$ serr parse '{\"message\":\"File not found\",\"context\":[{\"key\":\"path\",\"value\":\"/tmp/missing.txt\"}]}'"
  sleep 0.5
  serr parse '{"message":"File not found","context":[{"key":"path","value":"/tmp/missing.txt"}]}'
  sleep 2

  # Step 5: Validate error format
  echo ""
  echo "# Step 5: Validate error format"
  sleep 0.5
  echo "$ serr validate '{\"message\":\"Valid error\"}'"
  serr validate '{"message":"Valid error"}'
  sleep 1
  echo "$ serr validate '{\"invalid\":\"structure\"}'"
  serr validate '{"invalid":"structure"}' || echo "✓ Validation caught invalid format"
  sleep 2

  # Step 6: JSON output format
  echo ""
  echo "# Step 6: JSON output"
  sleep 0.5
  echo "$ serr demo --format json"
  sleep 0.5
  serr demo --format json
  sleep 2

  echo ""
  echo "# Done! Handle errors with: serr parse <error-json>"
  sleep 1
}

run_demo

# Demo regenerated 2025-12-30
