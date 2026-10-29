#!/usr/bin/env bash
# Builds dist/Security_Plus_Study_Lab-x86_64.AppImage
#
# An AppImage is the AppImage runtime (a small ELF program) followed by a SquashFS image of the app
# directory. This script builds the SquashFS with mksquashfs and appends it to the official type 2 runtime,
# so it never needs to run downloaded tools.
#
#   Requirements: gcc with static glibc, mksquashfs with zstd (Debian/Ubuntu: build-essential squashfs-tools), curl.
#   The runtime is downloaded once into build/cache. Set RUNTIME_FILE=/path/to/runtime-x86_64 to use your own copy.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD="$ROOT/build"
CACHE="$BUILD/cache"
APPDIR="$BUILD/AppDir"
NAME="security-plus-study-lab"
OUT="$ROOT/dist/Security_Plus_Study_Lab-x86_64.AppImage"
RUNTIME_URL="https://github.com/AppImage/type2-runtime/releases/download/continuous/runtime-x86_64"

command -v mksquashfs >/dev/null || { echo "mksquashfs not found. Install squashfs-tools." >&2; exit 1; }
mkdir -p "$CACHE" "$ROOT/dist"
rm -rf "$APPDIR"
mkdir -p "$APPDIR/usr/bin" "$APPDIR/usr/share/$NAME/app" "$APPDIR/usr/share/applications" "$APPDIR/usr/share/icons/hicolor/256x256/apps"

echo "Compiling the launcher"
gcc -static -Os -s -Wall -Wextra -o "$APPDIR/usr/bin/$NAME" "$ROOT/desktop/linux/launcher.c"

echo "Copying app files"
cp "$ROOT/index.html" "$APPDIR/usr/share/$NAME/app/"
cp -r "$ROOT/css" "$ROOT/js" "$ROOT/fonts" "$APPDIR/usr/share/$NAME/app/"

cat > "$APPDIR/$NAME.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=Security+ Study Lab
Comment=Study for the CompTIA Security+ SY0-701 exam
Exec=$NAME
Icon=$NAME
Categories=Education;
Keywords=security;comptia;exam;study;flashcards;
Terminal=false
StartupWMClass=SecurityPlusStudyLab
EOF
cp "$APPDIR/$NAME.desktop" "$APPDIR/usr/share/applications/"
cp "$ROOT/desktop/icon-256.png" "$APPDIR/$NAME.png"
cp "$ROOT/desktop/icon-256.png" "$APPDIR/usr/share/icons/hicolor/256x256/apps/$NAME.png"
ln -sf "$NAME.png" "$APPDIR/.DirIcon"
cat > "$APPDIR/AppRun" <<'EOF'
#!/bin/sh
HERE="$(dirname "$(readlink -f "$0")")"
exec "$HERE/usr/bin/security-plus-study-lab" "$@"
EOF
chmod +x "$APPDIR/AppRun"

if [ -z "${RUNTIME_FILE:-}" ]; then
  RUNTIME_FILE="$CACHE/runtime-x86_64"
  if [ ! -s "$RUNTIME_FILE" ]; then
    echo "Downloading the AppImage runtime"
    curl -fsSL --retry 3 -o "$RUNTIME_FILE.part" "$RUNTIME_URL"
    mv "$RUNTIME_FILE.part" "$RUNTIME_FILE"
  fi
fi
head -c 4 "$RUNTIME_FILE" | grep -q "ELF" || { echo "The runtime file is not an ELF executable." >&2; exit 1; }
echo "Runtime SHA-256: $(sha256sum "$RUNTIME_FILE" | cut -d' ' -f1)"

echo "Building the SquashFS image"
SQFS="$BUILD/app.squashfs"
rm -f "$SQFS"
mksquashfs "$APPDIR" "$SQFS" -root-owned -noappend -comp zstd -Xcompression-level 19 -b 1M -quiet -no-progress

cat "$RUNTIME_FILE" "$SQFS" > "$OUT"
chmod +x "$OUT"
echo "Built $OUT ($(du -h "$OUT" | cut -f1))"
echo "SHA-256: $(sha256sum "$OUT" | cut -d' ' -f1)"
