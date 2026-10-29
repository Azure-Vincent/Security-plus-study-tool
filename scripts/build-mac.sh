#!/usr/bin/env bash
# Builds dist/SecurityPlusStudyLab-macOS.zip containing "Security+ Study Lab.app".
#
# The bundle's executable is a POSIX shell script (desktop/mac/launcher.sh), so the app needs no compiled
# code and no code signing, and it runs on both Apple silicon and Intel Macs. Builds on any OS with python3.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD="$ROOT/build/mac"
APP="$BUILD/Security+ Study Lab.app"
OUT="$ROOT/dist/SecurityPlusStudyLab-macOS.zip"
VERSION="$(node -p "require('$ROOT/package.json').version" 2>/dev/null || python3 -c "import json;print(json.load(open('$ROOT/package.json'))['version'])")"

rm -rf "$BUILD"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources/app" "$ROOT/dist"

cp "$ROOT/desktop/mac/launcher.sh" "$APP/Contents/MacOS/SecurityPlusStudyLab"
chmod 755 "$APP/Contents/MacOS/SecurityPlusStudyLab"
cp "$ROOT/index.html" "$APP/Contents/Resources/app/"
cp -r "$ROOT/css" "$ROOT/js" "$ROOT/fonts" "$APP/Contents/Resources/app/"

cat > "$APP/Contents/Info.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>Security+ Study Lab</string>
  <key>CFBundleDisplayName</key><string>Security+ Study Lab</string>
  <key>CFBundleIdentifier</key><string>io.github.azure-vincent.security-plus-study-lab</string>
  <key>CFBundleVersion</key><string>$VERSION</string>
  <key>CFBundleShortVersionString</key><string>$VERSION</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleExecutable</key><string>SecurityPlusStudyLab</string>
  <key>CFBundleIconFile</key><string>AppIcon</string>
  <key>LSMinimumSystemVersion</key><string>10.13</string>
  <key>LSApplicationCategoryType</key><string>public.app-category.education</string>
  <key>NSHighResolutionCapable</key><true/>
</dict>
</plist>
EOF

# Write an .icns icon (PNG-based entries) and the zip with Unix permissions preserved,
# so the launcher stays executable when macOS unzips it.
python3 - "$ROOT" "$APP" "$OUT" <<'PY'
import os, struct, sys, zipfile
root, app, out = sys.argv[1:4]
entries = [(b'ic07', 'icon-128.png'), (b'ic08', 'icon-256.png'), (b'ic09', 'icon-512.png')]
body = b''
for kind, name in entries:
    data = open(os.path.join(root, 'desktop', name), 'rb').read()
    body += kind + struct.pack('>I', len(data) + 8) + data
with open(os.path.join(app, 'Contents', 'Resources', 'AppIcon.icns'), 'wb') as f:
    f.write(b'icns' + struct.pack('>I', len(body) + 8) + body)

if os.path.exists(out):
    os.remove(out)
base = os.path.dirname(app)
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for dirpath, dirnames, filenames in os.walk(app):
        dirnames.sort()
        rel_dir = os.path.relpath(dirpath, base)
        info = zipfile.ZipInfo(rel_dir + '/')
        info.external_attr = (0o40755 << 16) | 0x10
        z.writestr(info, b'')
        for name in sorted(filenames):
            path = os.path.join(dirpath, name)
            info = zipfile.ZipInfo(os.path.join(rel_dir, name))
            mode = 0o755 if os.access(path, os.X_OK) else 0o644
            info.external_attr = (0o100000 | mode) << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            with open(path, 'rb') as fh:
                z.writestr(info, fh.read())
PY
echo "Built $OUT ($(du -h "$OUT" | cut -f1))"
