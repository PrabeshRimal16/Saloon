export interface Service {
  id: string;
  name: string;
  price: number | null;
  price_display: string;
  duration: string;
  duration_minutes: number;
  category: 'hair' | 'waxing' | 'lashes' | 'facials';
  description: string;
  image_url?: string;
  active: boolean;
  display_order: number;
  created_at: string;
}

export interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  services: BookingService[];
  date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  notes?: string;
  created_at: string;
}

export interface BookingService {
  service_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'bundle';
  discount_value: number;
  code: string;
  active: boolean;
  valid_until: string;
  created_at: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  image_url?: string;
  bio: string;
  available_hours: Record<string, { start: string; end: string }>;
  services: string[];
  active: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}
