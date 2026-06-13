#!/usr/bin/env bash
set -euo pipefail

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

cd "$(dirname "$0")/.."

has_kvm() {
  [ -e /dev/kvm ]
}

is_android_ready() {
  local boot_completed bootanim
  boot_completed=$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')
  bootanim=$(adb shell getprop init.svc.bootanim 2>/dev/null | tr -d '\r')

  [ "$boot_completed" = "1" ] || return 1
  [ "$bootanim" = "stopped" ] || return 1
  adb shell pm path android 2>/dev/null | grep -q "package:" || return 1
  return 0
}

wait_for_android_ready() {
  local max_attempts="${1:-24}"
  local attempt=0

  echo "Waiting for Android to fully boot..."
  while [ "$attempt" -lt "$max_attempts" ]; do
    attempt=$((attempt + 1))
    if is_android_ready; then
      echo ""
      echo "Android boot completed."
      sleep 8
      return 0
    fi
    printf "  still booting (%s/%s)...\r" "$attempt" "$max_attempts"
    sleep 5
  done
  echo ""
  return 1
}

ensure_expo_go_installed() {
  if adb shell pm list packages --user 0 2>/dev/null | grep -q "host.exp.exponent"; then
    echo "Expo Go already installed."
    return 0
  fi

  local expo_apk
  expo_apk=$(ls -t "$HOME/.expo/android-apk-cache/"Expo-Go-*.apk 2>/dev/null | head -1 || true)
  [ -n "$expo_apk" ] || return 0

  echo "Installing Expo Go..."
  local attempt=0
  while [ "$attempt" -lt 20 ]; do
    attempt=$((attempt + 1))
    if adb install -r -d --user 0 "$expo_apk" 2>/dev/null; then
      echo "Expo Go installed."
      return 0
    fi
    sleep 10
  done
  return 1
}

start_metro_only() {
  echo ""
  echo "=============================================="
  echo "  Starting Metro (connect with phone or web)"
  echo "=============================================="
  echo ""
  echo "  Backend API: http://localhost:3000"
  echo "  Make sure:   cd wedding-api && rails server"
  echo ""
  echo "  OPTION 1 — Physical phone (recommended):"
  echo "    • Install 'Expo Go' from Play Store"
  echo "    • Same Wi-Fi as this PC"
  echo "    • Scan the QR code below"
  echo ""
  echo "  OPTION 2 — Web browser:"
  echo "    • Open another terminal: npm run web"
  echo ""
  echo "  Do NOT press 'a' — emulator is not working on this PC."
  echo "  (Enable VT-x in BIOS to fix emulator — see ANDROID_SETUP.md)"
  echo ""
  npx expo start
}

# --- No KVM: emulator will not boot reliably on this machine ---
if ! has_kvm; then
  echo "NOTE: /dev/kvm not found — Android emulator cannot boot on this PC."
  echo "Skipping emulator. Use a physical phone or web instead."
  echo ""
  # Stop stuck emulator processes that waste RAM
  pkill -f "emulator.*Medium_Phone" 2>/dev/null || true
  start_metro_only
  exit 0
fi

# --- KVM available: try emulator flow ---
if ! adb devices 2>/dev/null | grep -q "device$"; then
  echo "Starting emulator..."
  AVD="${ANDROID_AVD:-Medium_Phone_API_36.1}"
  emulator -avd "$AVD" -no-snapshot-load &
  adb wait-for-device
fi

if wait_for_android_ready 24 && ensure_expo_go_installed; then
  echo "Launching Expo on Android..."
  npx expo start --android
else
  echo ""
  echo "Emulator did not boot in time."
  start_metro_only
fi
