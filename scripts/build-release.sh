#!/usr/bin/env bash
# Builds the three downloads into an empty dist/:
#   Security_Plus_Study_Lab-x86_64.AppImage   Linux (x86_64)
#   SecurityPlusStudyLab.exe                  Windows (x64)
#   SecurityPlusStudyLab-macOS.zip            macOS (Apple silicon and Intel)
# Requirements: Node 20+, npm dependencies installed (npm ci), gcc with static glibc, squashfs-tools, curl, python3.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

rm -rf dist
mkdir -p dist
node scripts/build-exe.js win
bash scripts/build-appimage.sh
bash scripts/build-mac.sh

# Fail if anything other than the three downloads ended up in dist/.
EXPECTED="Security_Plus_Study_Lab-x86_64.AppImage
SecurityPlusStudyLab-macOS.zip
SecurityPlusStudyLab.exe"
ACTUAL="$(ls -1 dist | LC_ALL=C sort)"
if [ "$ACTUAL" != "$(printf '%s\n' "$EXPECTED" | LC_ALL=C sort)" ]; then
  echo "Unexpected files in dist/:" >&2; echo "$ACTUAL" >&2; exit 1
fi
echo
echo "Release files:"
(cd dist && sha256sum * && ls -lh | tail -n +2)
