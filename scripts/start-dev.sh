#!/usr/bin/env bash
# Safe dev start — does NOT open Android emulator (broken without VT-x on this PC).

set -euo pipefail

cd "$(dirname "$0")/.."

echo ""
echo "=============================================="
echo "  Wedding Mobile — Dev Server"
echo "=============================================="
echo ""
echo "  Backend (run in another terminal):"
echo "    cd wedding-api && rails server"
echo ""
echo "  HOW TO OPEN THE APP:"
echo ""
echo "  [1] PHONE (recommended)"
echo "      • Install 'Expo Go' from Play Store"
echo "      • Same Wi-Fi as this PC"
echo "      • Scan QR code below"
echo ""
echo "  [2] WEB BROWSER"
echo "      • Run: npm run web"
echo ""
echo "  !! Do NOT press 'a' — emulator is not working !!"
echo "  !! Enable VT-x in BIOS to fix emulator       !!"
echo ""
echo "=============================================="
echo ""

# Don't pass --android; avoid auto-install Expo Go on stuck emulator
exec npx expo start --go
