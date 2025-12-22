// components/products/AddToCartButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Product, ProductColor } from '@/types/product';
import { ShoppingBag, Check } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  selectedColor?: ProductColor | null;
}

// ✅ UPDATED: Enhanced type guard for ProductColor
const isValidProductColor = (item: any): item is ProductColor => {
  return (
    item &&
    typeof item === 'object' &&
    'name' in item &&
    'stock' in item &&
    typeof item.name === 'string' &&
    typeof item.stock === 'number'
  );
};

// ✅ UPDATED: Check if product has valid colors array
const hasValidColors = (product: Product): boolean => {
  if (!product.colors) return false;
  if (!Array.isArray(product.colors)) return false;
  if (product.colors.length === 0) return false;
  
  // Check if it's an array of ProductColor objects
  return product.colors.every(isValidProductColor);
};

export default function AddToCartButton({ product, selectedColor: propSelectedColor }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [internalSelectedColor, setInternalSelectedColor] = useState<ProductColor | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart, loading, addingProductId, cart } = useCart();

  // Use prop if provided, otherwise use internal state
  const selectedColor = propSelectedColor !== undefined ? propSelectedColor : internalSelectedColor;
  
  const isAdding = loading && addingProductId === product._id;
  
  // ✅ UPDATED: Check if product has valid colors
  const hasColors = hasValidColors(product);

  // ✅ UPDATED: Available colors with stock > 0
  const availableColors = hasColors 
    ? product.colors!.filter((color: ProductColor) => color.stock > 0)
    : [];

  // ✅ UPDATED: Auto-select first available color on mount
  useEffect(() => {
    if (hasColors && availableColors.length > 0 && !selectedColor) {
      setInternalSelectedColor(availableColors[0]);
      console.log('🟢 Auto-selected first available color:', availableColors[0].name);
    }
  }, [hasColors, availableColors]);

  // ✅ FIXED: Better cart item detection
// ✅ FIXED: Better cart item detection
const isInCart = cart?.items?.some(item => {
  // Check if item exists and has product
  if (!item || !item.product || item.product._id !== product._id) return false;
  
  // For products with colors, check if the same color is in cart
  if (hasColors) {
    // ✅ FIX: Type-safe way to check selectedColor
    // First, check if item has selectedColor property
    const cartItemColor = 'selectedColor' in item ? 
      (item as any).selectedColor : 
      null;
    
    const selectedColorName = selectedColor?.name || 
      (typeof selectedColor === 'string' ? selectedColor : null);
    
    console.log('🛒 Cart item check:', {
      productId: item.product._id,
      cartItemColor,
      selectedColorName,
      itemStructure: item
    });
    
    // If both have colors, compare them
    if (cartItemColor && selectedColorName) {
      return cartItemColor === selectedColorName;
    }
    
    // If one has color and other doesn't, they're different
    return !cartItemColor && !selectedColorName;
  }
  
  // For products without colors, just check product ID
  return true;
}) || false;

  // ✅ UPDATED: Calculate max quantity based on selected color or product stock
  const getMaxQuantity = () => {
    if (hasColors && selectedColor) {
      return Math.max(0, selectedColor.stock);
    }
    return Math.max(0, product.stock);
  };

// In AddToCartButton.tsx - Update handleAddToCart function
const handleAddToCart = async () => {
  // For products with colors, use the selected color
  const finalSelectedColor = hasColors ? selectedColor : undefined;

  if (hasColors && !finalSelectedColor) {
    alert('Please select a color before adding to cart');
    return;
  }

  console.log('🛒 START - Adding to cart:', {
    productId: product._id,
    productName: product.name,
    quantity,
    color: finalSelectedColor?.name,
    hasColors,
    timestamp: new Date().toISOString()
  });

  try {
    // Pass selected color name to addToCart
    console.log('📤 Calling addToCart function...');
    const result = await addToCart(product, quantity, finalSelectedColor?.name);
    console.log('✅ addToCart result:', result);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    alert('Failed to add item to cart. Please try again.');
  }
};

  const handleColorSelect = (color: ProductColor) => {
    setInternalSelectedColor(color);
    // Reset quantity to 1 when color changes
    setQuantity(1);
  };

  const maxQuantity = getMaxQuantity();
  const isOutOfStock = hasColors ? availableColors.length === 0 : product.stock <= 0;

  // ✅ UPDATED: Render colors with proper handling - MADE SMALLER
  const renderColorSelection = () => {
    if (!hasColors) {
      console.log('🟡 Not rendering colors: hasColors = false');
      return null;
    }

    console.log('🟢 Rendering colors, available:', availableColors.length);

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-sm">Color:</span>
          {!selectedColor && availableColors.length > 0 && (
            <span className="text-red-500 text-xs">Please select a color</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {product.colors?.map((colorItem: ProductColor, index: number) => {
            // Additional safety check for each color item
            if (!isValidProductColor(colorItem)) {
              console.warn(`Invalid color item at index ${index}:`, colorItem);
              return null;
            }

            const isAvailable = colorItem.stock > 0;
            const isSelected = selectedColor?.name === colorItem.name;

            return (
              <button
                key={colorItem.name || `color-${index}`}
                type="button"
                onClick={() => handleColorSelect(colorItem)}
                disabled={!isAvailable}
                className={`border rounded-md p-1.5 flex items-center gap-1 transition-all cursor-pointer text-xs ${ // Smaller: p-1.5, text-xs
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-300'
                    : isAvailable
                    ? 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: colorItem.code || '#f0f0f0'
                }}
              >
                <div className="font-medium text-xs">{colorItem.name}</div> {/* Smaller text */}
                <div className={`text-[10px] px-1 rounded-full ${ // Smaller
                  isAvailable 
                    ? isSelected ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isAvailable ? colorItem.stock : '0'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3"> {/* Reduced from space-y-4 */}

      {/* Quantity Selector - Only show if product is in stock - MADE SMALLER */}
      {!isOutOfStock && (
        <div className="flex items-center gap-2"> {/* Reduced gap */}
          <span className="font-semibold text-sm">Qty:</span> {/* Smaller text */}
          <div className="flex items-center border border-gray-300 rounded">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer text-sm" // Smaller: px-2 py-1
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-2 py-1 min-w-8 text-center text-sm">{quantity}</span> {/* Smaller */}
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              className="px-2 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer text-sm" // Smaller: px-2 py-1
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
          {maxQuantity > 0 && (
            <span className="text-xs text-gray-500"> {/* Smaller text */}
              Max: {maxQuantity}
            </span>
          )}
        </div>
      )}

      {/* Add to Cart Button - MADE MUCH SMALLER */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAdding || (hasColors && !selectedColor)}
        className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed shadow cursor-pointer text-sm" // Smaller: py-2 px-4, rounded-lg, text-sm
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> {/* Smaller spinner */}
            Adding...
          </>
        ) : isOutOfStock ? (
          'Out of Stock'
        ) : isInCart ? (
          <>
            <Check size={16} /> {/* Smaller icon */}
            In Cart
          </>
        ) : (
          <>
            <ShoppingBag size={16} /> {/* Smaller icon */}
            Add to Cart
          </>
        )}
      </button>

      {/* Success Message - MADE SMALLER */}
      {showSuccess && (
        <div className="flex items-center gap-1 text-green-600 font-medium animate-pulse text-sm"> {/* Smaller text */}
          <Check size={16} /> {/* Smaller icon */}
          Added to cart!
        </div>
      )}

      {/* Color selection reminder - MADE SMALLER */}
      {hasColors && !selectedColor && !isOutOfStock && (
        <div className="text-orange-600 text-xs font-medium"> {/* Smaller text */}
          ⚠️ Select a color
        </div>
      )}
    </div>
  );
}