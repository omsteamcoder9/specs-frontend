import { Product } from './product';

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number; // ✅ IMPORTANT: Add price field
  // ✅ UPDATED: Changed from selectedSize to selectedColor
  selectedColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  // ✅ UPDATED: Changed from size to color
  color?: string;
}

export interface UpdateCartItemData {
  quantity: number;
  // ✅ UPDATED: Changed from size to color
  color?: string;
}

// ✅ ADDED: For guest cart (when user is not logged in)
export interface GuestCartItem {
  product: Product;
  quantity: number;
  price: number;
  selectedColor?: string;
}

export interface GuestCart {
  items: GuestCartItem[];
  totalPrice: number;
  totalItems: number;
}