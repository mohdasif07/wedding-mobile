import { Linking, Platform } from 'react-native';

export async function shareWhatsAppMessage(phone: string | undefined, text: string) {
  const encoded = encodeURIComponent(text);
  let url: string;

  if (phone) {
    const digits = phone.replace(/\D/g, '');
    const withCountry = digits.startsWith('91') ? digits : `91${digits}`;
    url = `https://wa.me/${withCountry}?text=${encoded}`;
  } else {
    url = Platform.OS === 'ios'
      ? `whatsapp://send?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
  }

  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    throw new Error('WhatsApp is not installed on this device');
  }
  await Linking.openURL(url);
}

export function buildInviteText(guestName: string, eventTitle: string, eventDate: string, venue: string, qrToken: string) {
  return (
    `Dear ${guestName},\n\n` +
    `You are cordially invited to *${eventTitle}*!\n` +
    `Date: ${eventDate}\n` +
    `Venue: ${venue || 'TBA'}\n\n` +
    `Please RSVP for our celebration.\n` +
    `Your invitation code: ${qrToken}\n\n` +
    `With love,\nWedding Planner Team`
  );
}
