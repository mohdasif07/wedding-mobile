import { format, formatDistanceToNow } from 'date-fns';

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (date: string) => format(new Date(date), 'MMM dd, yyyy');

export const formatTime = (time?: string) => (time ? time.slice(0, 5) : '');

export const countdownLabel = (date: string) => {
  const target = new Date(date);
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Past event';
  if (diff === 0) return 'Today!';
  return `${diff} days`;
};

export const titleCase = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
