export interface Booking {
  id: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  event_type: 'festival' | 'club' | 'private' | 'corporate' | 'wedding';
  event_date: string;
  venue_name: string;
  venue_city: string;
  expected_attendance?: number;
  budget_range?: 'under_1k' | '1k_3k' | '3k_5k' | '5k_10k' | 'over_10k';
  message?: string;
  status: 'new' | 'reviewing' | 'confirmed' | 'declined';
  created_at: string;
}

export const EVENT_TYPES = {
  festival: 'Music Festival',
  club: 'Club/Bar Venue',
  private: 'Private Party',
  corporate: 'Corporate Event',
  wedding: 'Wedding Reception'
} as const;

export const BUDGET_RANGES = {
  under_1k: 'Under $1,000',
  '1k_3k': '$1,000 - $3,000',
  '3k_5k': '$3,000 - $5,000',
  '5k_10k': '$5,000 - $10,000',
  over_10k: 'Over $10,000'
} as const;

export const BOOKING_STATUSES = {
  new: 'New Request',
  reviewing: 'Under Review',
  confirmed: 'Confirmed',
  declined: 'Declined'
} as const;