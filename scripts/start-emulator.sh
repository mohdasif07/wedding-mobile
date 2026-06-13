#!/usr/bin/env bash
# Start Android emulator in software mode (no KVM required).
# WARNING: Without VT-x/KVM this is very slow and may not finish booting.
# Prefer: npm start + Expo Go on a physical phone.

set -euo pipefail

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

AVD="${1:-Medium_Phone_API_36.1}"

if [ -e /dev/kvm ]; then
  echo "KVM detected — starting emulator with hardware acceleration..."
  exec emulator -avd "$AVD"
fi

echo "No KVM (/dev/kvm) — starting in slow software mode."
echo "This may take 5+ minutes to boot, or fail entirely."
echo "Recommended: use a physical phone with Expo Go instead (npm start)."
echo ""

exec emulator -avd "$AVD" \
  -accel off \
  -gpu swiftshader_indirect \
  -no-snapshot-load \
  -memory 2048
