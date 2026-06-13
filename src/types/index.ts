export type UserRole = 'admin' | 'family_member';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  full_name: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  venue?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  status: string;
  guests_count?: number;
  photos_count?: number;
  guests?: Guest[];
  photos?: Photo[];
}

export interface Guest {
  id: number;
  event_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  email?: string;
  family_name?: string;
  side: string;
  rsvp_status: string;
  address?: string;
  qr_code_token: string;
  invited_at?: string;
  invite_count?: number;
}

export interface Message {
  id: number;
  subject: string;
  body: string;
  message_type: string;
  event_id?: number;
  recipients_count?: number;
  sent_count?: number;
  created_at: string;
}

export interface Vendor {
  id: number;
  vendor_name: string;
  vendor_type: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  contract_amount: number;
  paid_amount: number;
  balance_due: number;
  notes?: string;
}

export interface Expense {
  id: number;
  title: string;
  category: string;
  estimated_amount: number;
  actual_amount: number;
  payment_status: string;
  remarks?: string;
}

export interface ExpenseSummary {
  estimated_budget: number;
  actual_spend: number;
  remaining_budget: number;
  by_category: Record<string, number>;
  monthly: Record<string, number>;
}

export interface Album {
  id: number;
  title: string;
  description?: string;
  photos_count?: number;
  photos?: Photo[];
}

export interface Photo {
  id: number;
  caption?: string;
  event_id?: number;
  album_id?: number;
  image_url?: string;
  thumbnail_url?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  category: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  position: number;
}

export interface Attendance {
  id: number;
  guest_id: number;
  event_id: number;
  checked_in_at: string;
  guest?: Guest;
}

export interface DashboardStats {
  total_guests: number;
  confirmed_guests: number;
  pending_guests: number;
  total_vendors: number;
  total_events: number;
  total_expenses: number;
  budget_used: number;
  estimated_budget: number;
  upcoming_events: Array<{
    id: number;
    title: string;
    venue?: string;
    event_date: string;
    start_time?: string;
    days_until: number;
  }>;
}

export interface PaginatedMeta {
  totalCount: number;
  page: number;
  perPage: number;
}
