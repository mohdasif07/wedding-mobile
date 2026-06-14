#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export JAVA_HOME="${JAVA_HOME:-/snap/android-studio/current/jbr}"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

IP=$(hostname -I | awk '{print $1}')
echo "Building APK with API: http://${IP}:3000/api/v1"
echo "Phone and PC must be on same Wi-Fi. Start backend: cd wedding-api && rails server"
echo ""

if [ ! -d android ]; then
  npx expo prebuild --platform android --clean
fi

# Gradle 9.x fails on this setup; 8.14.2 works with Expo SDK 56.
GRADLE_PROPS="android/gradle/wrapper/gradle-wrapper.properties"
if grep -q 'gradle-9' "$GRADLE_PROPS" 2>/dev/null; then
  sed -i 's|gradle-9[^"]*|gradle-8.14.2-bin.zip|' "$GRADLE_PROPS"
fi

cd android
./gradlew assembleDebug --no-daemon

OUT="../dist/wedding-planner.apk"
mkdir -p ../dist
cp app/build/outputs/apk/debug/app-debug.apk "$OUT"

echo ""
echo "APK ready: $OUT"
echo "Install on phone: adb install -r $OUT"
echo "Or copy the file to your phone and open it (enable 'Install unknown apps')."
