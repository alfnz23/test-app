export interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  session_type: 'recording' | 'mixing' | 'mastering' | 'podcast' | 'rehearsal';
  studio_room: 'studio_a' | 'studio_b' | 'live_room';
  booking_date: string; // DATE format
  start_time: string; // TIME format
  duration_hours: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price?: number;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  session_type: Booking['session_type'];
  studio_room: Booking['studio_room'];
  booking_date: string;
  start_time: string;
  duration_hours: number;
  notes?: string;
}

export const SESSION_TYPES = {
  recording: 'Recording Session',
  mixing: 'Mixing Session',
  mastering: 'Mastering Session',
  podcast: 'Podcast Recording',
  rehearsal: 'Rehearsal Session'
} as const;

export const STUDIO_ROOMS = {
  studio_a: 'Studio A - Main Room',
  studio_b: 'Studio B - Vocal Booth',
  live_room: 'Live Room - Full Band'
} as const;

export const BOOKING_STATUS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed'
} as const;