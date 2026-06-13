# Android Development Setup

## The error you saw

```
cmd: Can't find service: package
pm list packages ... host.exp.exponent exited with non-zero code: 20
```

This means the **emulator has not finished booting** (Android Package Manager is not running yet), or the emulator is **stuck** because **KVM/hardware acceleration is disabled** on your machine.

Check KVM:

```bash
ls /dev/kvm
```

If missing, the emulator on your ThinkPad will be unreliable or hang during boot.

---

## Option 1: Physical Android phone (recommended)

This is the fastest way to run the app without fixing the emulator.

### Steps

1. **Install Expo Go** on your phone from Google Play Store.

2. **Enable USB debugging** on the phone (Settings → Developer options).

3. **Connect phone via USB** (or use same Wi‑Fi):

   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$ANDROID_HOME/platform-tools:$PATH
   adb devices   # should show your phone
   ```

4. **Start the Rails API** (separate terminal):

   ```bash
   cd wedding-api
   rails server -b 0.0.0.0
   ```

5. **Set API URL to your PC's LAN IP** in `app.json`:

   ```json
   "extra": {
     "apiUrl": "http://192.168.1.51:3000/api/v1"
   }
   ```

   Replace `192.168.1.51` with your machine's IP (`hostname -I`).

6. **Start Expo**:

   ```bash
   cd wedding-mobile
   npm start
   ```

7. Press **`a`** to open on the connected phone, or scan the QR code with Expo Go.

---

## Option 2: Enable KVM (fix emulator permanently)

Your ThinkPad E14 Gen 2 supports Intel VT-x, but it appears disabled.

1. Reboot → enter BIOS (F1 on ThinkPad).
2. Enable **Intel Virtualization Technology** (VT-x).
3. Boot Linux, then run:

   ```bash
   sudo apt update
   sudo apt install qemu-kvm
   sudo usermod -aG kvm $USER
   # log out and back in
   ls -la /dev/kvm   # should exist now
   ```

4. Start emulator normally from Android Studio, then:

   ```bash
   npm run android:dev
   ```

---

## Option 3: Web browser (quick UI testing)

```bash
cd wedding-mobile
npm run web
```

Note: camera, QR scanner, and some native features won't work on web.

---

## Option 4: Native build (no Expo Go needed)

Requires Java 17:

```bash
sudo apt install openjdk-17-jdk
cd wedding-mobile
npx expo prebuild --platform android
npx expo run:android
```

This installs the app directly on a connected device/emulator. The emulator must still boot successfully.

---

## Environment variables

Already added to `~/.bashrc`. Apply in your current terminal:

```bash
source ~/.bashrc
```

Or for one session only:

```bash
source scripts/android-env.sh
```

Verify:

```bash
emulator -list-avds
adb devices
```
