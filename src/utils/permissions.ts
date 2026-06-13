import { UserRole } from '../types';

/** Actions that can be gated in the mobile app (mirrors backend admin checks). */
export type Permission =
  | 'events.create'
  | 'events.edit'
  | 'events.delete'
  | 'guests.create'
  | 'guests.edit'
  | 'guests.invite'
  | 'guests.rsvp'
  | 'messages.compose'
  | 'vendors.create'
  | 'vendors.edit'
  | 'expenses.create'
  | 'expenses.edit'
  | 'photos.upload'
  | 'photos.download'
  | 'qr.checkin'
  | 'dashboard.view'
  | 'albums.view';

const ADMIN_PERMISSIONS: Permission[] = [
  'events.create',
  'events.edit',
  'events.delete',
  'guests.create',
  'guests.edit',
  'guests.invite',
  'guests.rsvp',
  'messages.compose',
  'vendors.create',
  'vendors.edit',
  'expenses.create',
  'expenses.edit',
  'photos.upload',
  'photos.download',
  'qr.checkin',
  'dashboard.view',
  'albums.view',
];

const FAMILY_PERMISSIONS: Permission[] = [
  'guests.rsvp',
  'photos.download',
  'dashboard.view',
  'albums.view',
];

/** Guest = invited person (no app login). They use QR invite link / WhatsApp. */
export const GUEST_CAPABILITIES = [
  'RSVP via invite link or family help',
  'View QR code for event check-in',
  'Receive email / WhatsApp invitations',
  'View shared photos (when link is sent)',
] as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  family_member: 'Family',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: 'Full control — create, edit, invite, and manage everything.',
  family_member: 'View wedding details, update RSVP, browse & download photos.',
};

export function can(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  if (role === 'admin') return ADMIN_PERMISSIONS.includes(permission);
  return FAMILY_PERMISSIONS.includes(permission);
}

export function getRolePermissions(role: UserRole): { label: string; allowed: string[]; restricted: string[] } {
  if (role === 'admin') {
    return {
      label: ROLE_LABELS.admin,
      allowed: [
        'All events, guests, vendors, expenses',
        'Send invites (email & WhatsApp)',
        'Compose messages & bulk invite',
        'Upload photos, QR check-in scan',
        'Create / edit / delete records',
      ],
      restricted: [],
    };
  }

  return {
    label: ROLE_LABELS.family_member,
    allowed: [
      'View dashboard, events, guests, vendors',
      'View expenses & budget charts',
      'Browse photo albums & download',
      'Read messages',
      'Update guest RSVP status',
    ],
    restricted: [
      'Cannot create events or guests',
      'Cannot send invites or messages',
      'Cannot upload photos or scan QR',
      'Cannot edit vendors / expenses',
    ],
  };
}
