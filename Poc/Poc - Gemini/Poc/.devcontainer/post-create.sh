#!/usr/bin/env bash
set -euo pipefail

node --version
npm --version
nx --version || true
ng version || true

if [ -f package.json ]; then
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi
else
  echo "No package.json yet. Skipping dependency install."
fi
