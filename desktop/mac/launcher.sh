#!/bin/sh
# Security+ Study Lab for macOS.
# The app is plain HTML, CSS and JavaScript, so it runs straight from the bundle with no server.
# It opens in its own window of a Chromium-based browser if one is installed (with a dedicated
# profile that keeps your progress), otherwise in your default browser.

RES="$(cd "$(dirname "$0")/../Resources" && pwd -P)"
INDEX="$RES/app/index.html"
if [ ! -f "$INDEX" ]; then
  osascript -e 'display alert "Security+ Study Lab" message "The app files are missing from this bundle. Download the app again."' >/dev/null 2>&1
  exit 1
fi

# Percent-encode characters that are not allowed literally in a file:// URL path.
ENCODED=$(printf '%s' "$INDEX" | sed -e 's/%/%25/g' -e 's/ /%20/g' -e 's/#/%23/g' -e 's/?/%3F/g' -e 's/"/%22/g')
URL="file://$ENCODED"

PROFILE="$HOME/Library/Application Support/Security Plus Study Lab/Browser"

# A browser can be chosen explicitly: SECPLUS_BROWSER="Firefox" open "Security+ Study Lab.app"
if [ -n "$SECPLUS_BROWSER" ]; then
  exec open -a "$SECPLUS_BROWSER" "$URL"
fi

for APP in "Google Chrome" "Microsoft Edge" "Brave Browser" "Chromium" "Vivaldi"; do
  if [ -d "/Applications/$APP.app" ] || [ -d "$HOME/Applications/$APP.app" ]; then
    mkdir -p "$PROFILE"
    exec open -na "$APP" --args --app="$URL" --user-data-dir="$PROFILE" --no-first-run --no-default-browser-check
  fi
done

exec open "$URL"
