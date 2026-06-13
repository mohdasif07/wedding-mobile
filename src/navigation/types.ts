export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  GuestRsvp: { token: string };
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  Checklist: undefined;
  Timeline: undefined;
  Profile: undefined;
};

export type EventsStackParamList = {
  EventList: undefined;
  EventDetails: { eventId: number };
  EventForm: { eventId?: number };
  GuestList: { eventId: number; eventTitle: string };
  GuestDetails: { eventId: number; guestId: number };
  GuestForm: { eventId: number; guestId?: number };
  QrScanner: { eventId: number };
  AttendanceList: { eventId: number; eventTitle: string };
  PhotoViewer: { url: string; caption?: string };
};

export type VendorsStackParamList = {
  VendorList: undefined;
  VendorDetails: { vendorId: number };
  VendorForm: { vendorId?: number };
};

export type ExpensesStackParamList = {
  ExpenseDashboard: undefined;
  ExpenseList: undefined;
  ExpenseForm: { expenseId?: number };
};

export type PhotosStackParamList = {
  AlbumList: undefined;
  AlbumDetails: { albumId: number; title: string };
  AlbumForm: { albumId?: number; title?: string; description?: string };
  PhotoViewer: { url: string; caption?: string };
  PhotoUpload: { albumId?: number; eventId?: number };
};

export type MessagesStackParamList = {
  MessageList: undefined;
  ComposeMessage: { eventId?: number };
  MessageDetails: { messageId: number };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Events: undefined;
  Messages: undefined;
  Vendors: undefined;
  Expenses: undefined;
  Photos: undefined;
};
