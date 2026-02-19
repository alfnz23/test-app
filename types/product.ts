export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'apparel' | 'accessories' | 'vinyl' | 'digital' | 'gear';
  image_url?: string;
  in_stock: boolean;
  created_at: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  category: Product['category'];
  image_url?: string;
  in_stock: boolean;
}

export const PRODUCT_CATEGORIES = {
  apparel: 'Apparel',
  accessories: 'Accessories',
  vinyl: 'Vinyl Records',
  digital: 'Digital Downloads',
  gear: 'Studio Gear'
} as const;

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}