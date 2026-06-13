# Wedding Planner Mobile App

React Native (Expo) mobile app for wedding event management.

## Stack

- Expo SDK 56
- React Navigation (tabs + stacks)
- React Native Paper
- TanStack React Query
- Axios
- Context API (auth)
- Expo Notifications, Camera, Image Picker

## Setup

```bash
npm install
npm start
```

Update API URL in `app.json` → `extra.apiUrl`.

### Android troubleshooting

If you see `Can't find service: package`, the emulator has not finished booting. On machines without KVM (`/dev/kvm`), the emulator often hangs.

**Quickest fix:** use a physical phone with [Expo Go](https://expo.dev/go) and run `npm start`.

See **[ANDROID_SETUP.md](ANDROID_SETUP.md)** for full instructions (phone, KVM, web, native build).

## Features

- JWT auth with secure token storage
- Dashboard with stats and countdown
- Events, guests, vendors, expenses CRUD
- Photo albums with upload and share
- RSVP management
- QR invitation and check-in scanner
- Expense charts (pie + bar)
- Push notification registration

## Folder structure

```
src/
├── api/          # Axios API clients
├── components/   # Reusable UI
├── context/      # Auth context
├── hooks/        # React Query hooks
├── navigation/   # Navigators
├── screens/      # App screens
├── services/     # Notifications
├── types/        # TypeScript types
└── utils/        # Helpers
```
