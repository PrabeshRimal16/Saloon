// ─── Core Domain Types ────────────────────────────────────────────────────────

/** Roles supported in this application */
export type UserRole = 'customer' | 'admin';

/** A user profile stored in the public.users table */
export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

// ─── Booking Types ────────────────────────────────────────────────────────────

/** All possible booking statuses */
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

/** Available salon services */
export type SalonService =
  | 'Haircut & Styling'
  | 'Hair Coloring'
  | 'Highlights & Balayage'
  | 'Keratin Treatment'
  | 'Bridal Package'
  | 'Facial & Skincare'
  | 'Manicure & Pedicure'
  | 'Eyebrow Shaping'
  | 'Waxing'
  | 'Makeup Application';

/** A booking record from the public.bookings table */
export interface Booking {
  id: string;
  user_id: string;
  service: SalonService;
  date: string;        // ISO date string 'YYYY-MM-DD'
  time: string;        // HH:MM 24-hour
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  // Joined field from the users table (admin view)
  users?: Pick<UserProfile, 'full_name' | 'email' | 'phone'>;
}

// ─── API Payload Types ────────────────────────────────────────────────────────

export interface CreateBookingPayload {
  service: SalonService;
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateBookingPayload {
  status?: BookingStatus;
  service?: SalonService;
  date?: string;
  time?: string;
  notes?: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  profile: UserProfile | null;
}
