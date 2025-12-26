// components/products/AddToCartButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { ShoppingBag, Check } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart, loading, addingProductId, cart } = useCart();

  const isAdding = loading && addingProductId === product._id;

  // ✅ FIXED: Simple cart item detection (no color check)
  const isInCart = cart?.items?.some(item => 
    item && item.product && item.product._id === product._id
  ) || false;

  // ✅ FIXED: Calculate max quantity based on product stock
  const getMaxQuantity = () => {
    return Math.max(0, product.stock);
  };

  const handleAddToCart = async () => {
    console.log('🛒 START - Adding to cart:', {
      productId: product._id,
      productName: product.name,
      quantity,
      timestamp: new Date().toISOString()
    });

    try {
      // ✅ FIXED: Call addToCart without color parameter
      console.log('📤 Calling addToCart function...');
      const result = await addToCart(product, quantity);
      console.log('✅ addToCart result:', result);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const maxQuantity = getMaxQuantity();
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-3">
      {/* Quantity Selector - Only show if product is in stock */}
      {!isOutOfStock && (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Qty:</span>
          <div className="flex items-center border border-amber-300 rounded">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 py-1 hover:bg-amber-50 transition-colors disabled:opacity-50 cursor-pointer text-sm"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-2 py-1 min-w-8 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              className="px-2 py-1 hover:bg-amber-50 transition-colors disabled:opacity-50 cursor-pointer text-sm"
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
          {maxQuantity > 0 && (
            <span className="text-xs text-amber-600">
              Max: {maxQuantity}
            </span>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAdding}
        className="w-full py-2 px-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:from-amber-800 hover:to-amber-900 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed shadow cursor-pointer text-sm"
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Adding...
          </>
        ) : isOutOfStock ? (
          'Out of Stock'
        ) : isInCart ? (
          <>
            <Check size={16} />
            In Cart
          </>
        ) : (
          <>
            <ShoppingBag size={16} />
            Add to Cart
          </>
        )}
      </button>

      {/* Success Message */}
      {showSuccess && (
        <div className="flex items-center gap-1 text-green-600 font-medium animate-pulse text-sm">
          <Check size={16} />
          Added to cart!
        </div>
      )}
    </div>
  );
}