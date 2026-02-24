export interface MerchProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: 'tees' | 'hoodies' | 'vinyl' | 'posters' | 'accessories';
  image_url?: string;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
}

export interface Show {
  id: string;
  venue_name: string;
  city: string;
  event_date: string;
  doors_time?: string;
  ticket_url?: string;
  is_sold_out: boolean;
  created_at: string;
}

export const MERCH_CATEGORIES = {
  tees: '👕 Tees',
  hoodies: '🧥 Hoodies',
  vinyl: '💿 Vinyl Records',
  posters: '🎨 Posters',
  accessories: '🎸 Accessories'
} as const;