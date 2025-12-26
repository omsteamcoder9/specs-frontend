// CartContext.tsx - Fix the isGuest logic
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/product';
import { Cart, CartItem } from '@/types/cart';
import * as cartAPI from '@/lib/cart';
import { useAuth } from '@/context/AuthContext';

interface CartContextType {
  cart: Cart;
  loading: boolean;
  addingProductId: string | null;
  isGuest: boolean;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const initialCart: Cart = {
  _id: 'guest-cart',
  user: '',
  items: [],
  totalPrice: 0,
  totalItems: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [loading, setLoading] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  // ✅ FIX: Properly determine if user is guest (check both user and token)
  const isGuest = !user;

  console.log('🛒 CartProvider state:', { 
    user: user ? 'authenticated' : 'guest', 
    isGuest, 
    authLoading 
  });

  // Load guest cart from localStorage on initial load
  useEffect(() => {
    if (isGuest && !authLoading) {
      console.log('🛒 Loading guest cart on mount');
      loadGuestCart();
    }
  }, [isGuest, authLoading]);

  const loadGuestCart = () => {
    try {
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (!parsedCart.items) {
          parsedCart.items = [];
        }
        setCart(parsedCart);
        console.log('🛒 Loaded guest cart from localStorage:', parsedCart);
      } else {
        setCart(initialCart);
        console.log('🛒 No saved guest cart, using initial cart');
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
      setCart(initialCart);
    }
  };

  const saveGuestCart = (guestCart: Cart) => {
    try {
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      console.log('🛒 Saved guest cart to localStorage:', guestCart);
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  const refreshCart = async () => {
    console.log('🔄 refreshCart called, isGuest:', isGuest, 'authLoading:', authLoading);
    
    if (authLoading) {
      console.log('🔄 Waiting for auth to finish loading');
      return;
    }

    try {
      if (!isGuest && user) {
        // ✅ User is authenticated - fetch from API
        console.log('🔄 Fetching user cart via API');
        const cartData = await cartAPI.getCart();
        setCart(cartData);
        console.log('🛒 Loaded user cart from API:', cartData);
      } else {
        // ✅ User is guest - load from localStorage
        console.log('🔄 Loading guest cart (user is guest)');
        loadGuestCart();
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (isGuest) {
        console.log('🔄 Falling back to guest cart due to error');
        loadGuestCart();
      }
    }
  };

  // Refresh cart when auth state changes
  useEffect(() => {
    console.log('🔄 Auth state changed, refreshing cart');
    refreshCart();
  }, [user, authLoading]);

  // ✅ FIXED: Guest cart functions
  const handleGuestAddToCart = (product: Product, quantity: number): Cart => {
    console.log('🛒 handleGuestAddToCart called for product:', product._id);
    
    const guestCart = { 
      ...cart,
      items: cart.items ? [...cart.items] : []
    };
    
    const existingItemIndex = guestCart.items.findIndex(
      item => item && item.product && item.product._id === product._id
    );
    
    if (existingItemIndex > -1) {
      guestCart.items[existingItemIndex].quantity += quantity;
      guestCart.items[existingItemIndex].updatedAt = new Date().toISOString();
      console.log('🛒 Updated existing item');
    } else {
      const guestItemId = `guest-${product._id}-${Date.now()}`;
      
      const newItem: CartItem = {
        _id: guestItemId,
        product,
        quantity,
        price: product.price,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      guestCart.items.push(newItem);
      console.log('🛒 Added new item');
    }
    
    // Recalculate totals
    guestCart.totalItems = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
    guestCart.totalPrice = guestCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    guestCart.updatedAt = new Date().toISOString();
    
    // Save to localStorage
    saveGuestCart(guestCart);
    
    return guestCart;
  };

  const handleGuestUpdateCartItem = (itemId: string, quantity: number): Cart => {
    const guestCart = { 
      ...cart,
      items: cart.items ? [...cart.items] : []
    };
    const itemIndex = guestCart.items.findIndex(item => item._id === itemId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        guestCart.items.splice(itemIndex, 1);
      } else {
        guestCart.items[itemIndex].quantity = quantity;
        guestCart.items[itemIndex].updatedAt = new Date().toISOString();
      }
      
      guestCart.totalItems = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
      guestCart.totalPrice = guestCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      guestCart.updatedAt = new Date().toISOString();
      
      saveGuestCart(guestCart);
    }
    
    return guestCart;
  };

  const handleGuestRemoveFromCart = (itemId: string): Cart => {
    const guestCart = { 
      ...cart,
      items: cart.items ? [...cart.items] : []
    };
    guestCart.items = guestCart.items.filter(item => item._id !== itemId);
    
    guestCart.totalItems = guestCart.items.reduce((sum, item) => sum + item.quantity, 0);
    guestCart.totalPrice = guestCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    guestCart.updatedAt = new Date().toISOString();
    
    saveGuestCart(guestCart);
    
    return guestCart;
  };

  const handleGuestClearCart = (): Cart => {
    const emptyCart = { ...initialCart };
    emptyCart.updatedAt = new Date().toISOString();
    saveGuestCart(emptyCart);
    return emptyCart;
  };

  // ✅ FIXED: addToCart function with proper guest detection
  const addToCart = async (product: Product, quantity: number) => {
    console.log('🛒 addToCart called, isGuest:', isGuest);
    
    try {
      setAddingProductId(product._id);
      setLoading(true);
      
      if (isGuest) {
        console.log('🛒 Using guest cart handler');
        const updatedCart = handleGuestAddToCart(product, quantity);
        setCart(updatedCart);
      } else {
        console.log('🛒 Using API cart handler');
        const updatedCart = await cartAPI.addToCart({
          productId: product._id,
          quantity
        });
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('❌ Error in addToCart:', error);
      throw error;
    } finally {
      setLoading(false);
      setAddingProductId(null);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      
      if (isGuest) {
        setCart(handleGuestUpdateCartItem(itemId, quantity));
      } else {
        await cartAPI.updateCartItem(itemId, { quantity });
        const updatedCart = await cartAPI.getCart();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true);
      
      if (isGuest) {
        setCart(handleGuestRemoveFromCart(itemId));
      } else {
        await cartAPI.removeFromCart(itemId);
        const updatedCart = await cartAPI.getCart();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      
      if (isGuest) {
        const updatedCart = handleGuestClearCart();
        setCart(updatedCart);
      } else {
        await cartAPI.clearCart();
        setCart(initialCart);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    loading,
    addingProductId,
    isGuest,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};