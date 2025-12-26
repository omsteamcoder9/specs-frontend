import { Product, } from '@/types/product';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Star, ShoppingBag, Eye, Check, X } from 'lucide-react';
import { getProductImageUrl } from '@/lib/productService'; 
import { createPortal } from 'react-dom';

interface ProductCardProps {
  product: Product;
}

// ✅ Format price with commas for thousands
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [popupQuantity, setPopupQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [showQuantityPopup, setShowQuantityPopup] = useState(false);
  
  const { addToCart, loading, addingProductId, cart } = useCart();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.slug}?quickview=true`);
  };

  const handleImageError = () => {
    console.error('Image failed to load for product:', product.name);
    setImageError(true);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // For products with stock > 1, show quantity popup
    if (product.stock > 1) {
      setShowQuantityPopup(true);
      return;
    }
    
    // For products with stock = 1, add directly to cart
    try {
      await addToCart(product, 1);
      console.log('✅ Product added to cart!');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const handlePopupAddToCart = async () => {
    try {
      await addToCart(product, popupQuantity);
      console.log('✅ Product added to cart!');
      setShowQuantityPopup(false);
      setPopupQuantity(1);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const getMaxQuantity = () => {
    return Math.max(0, product.stock);
  };

  const isAddingThisProduct = loading && addingProductId === product._id;
  const isInCart = cart?.items?.some(item => 
    item.product._id === product._id
  ) || false;

  const maxQuantity = getMaxQuantity();
  const isOutOfStock = product.stock <= 0;

  // Quantity Popup Component
  const QuantityPopup = () => (
    <div className="fixed inset-0 z-[9999]">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          setShowQuantityPopup(false);
          setPopupQuantity(1);
        }}
      ></div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-transform duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Select Quantity</h3>
            <button 
              onClick={() => {
                setShowQuantityPopup(false);
                setPopupQuantity(1);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors transform hover:scale-110"
            >
              <X size={24} />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-4">
              <img 
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${product.images[0].image}`}
                alt={product.name}
                className="w-20 h-20 object-contain rounded-lg bg-gray-100 transform transition-transform duration-300 hover:scale-105"
              />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                <p className="text-lg font-bold text-gray-900">₹{formatPrice(product.price)}</p>
              </div>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border border-amber-300 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPopupQuantity(Math.max(1, popupQuantity - 1))}
                  className="px-4 py-2 hover:bg-amber-50 transition-colors disabled:opacity-50 transform hover:scale-110"
                  disabled={popupQuantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-12 text-center">{popupQuantity}</span>
                <button
                  type="button"
                  onClick={() => setPopupQuantity(Math.min(maxQuantity, popupQuantity + 1))}
                  className="px-4 py-2 hover:bg-amber-50 transition-colors disabled:opacity-50 transform hover:scale-110"
                  disabled={popupQuantity >= maxQuantity}
                >
                  +
                </button>
              </div>
              {maxQuantity > 0 && (
                <span className="text-sm text-amber-600">
                  Max: {maxQuantity}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 flex gap-3">
            <button
              onClick={() => {
                setShowQuantityPopup(false);
                setPopupQuantity(1);
              }}
              className="flex-1 py-3 px-4 border border-amber-300 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition-colors transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handlePopupAddToCart}
              disabled={isAddingThisProduct}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:from-amber-800 hover:to-amber-900 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isAddingThisProduct ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div 
        className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer font-sans transform hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Cart Badge - Top Right Corner */}
        {isInCart && (
          <div className="absolute top-2 right-2 z-10 bg-gradient-to-br from-amber-700 to-amber-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md font-sans">
            ✓
          </div>
        )}

        {/* Loading Overlay */}
        {isAddingThisProduct && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 rounded-lg font-sans">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">Adding to cart...</p>
            </div>
          </div>
        )}

        {/* Product Image Container */}
        <div className="relative p-3 sm:p-4 pb-0 overflow-hidden">
          <div className="relative h-32 xs:h-36 sm:h-40 md:h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${product.images[0].image}`}
              alt={product.name}
              className={`object-contain transition-all duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              } 
              max-h-28 xs:max-h-32 sm:max-h-32 md:max-h-40`}
              onError={handleImageError}
            />
            
            {/* Quick View Overlay - Hidden on mobile, shown on tablet+ */}
            <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } hidden sm:flex`}>
              <button 
                onClick={handleQuickView}
                className="bg-white text-gray-900 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 text-xs sm:text-sm font-sans"
              >
                <Eye size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Quick View</span>
              </button>
            </div>

            {imageError && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {/* Reduced padding and smaller product name */}
        <div className="p-3">
          {/* Product Name - Fixed height with ellipsis for long names */}
          <h3 className="font-semibold text-gray-900 mb-1 leading-tight line-clamp-2 text-xs font-sans h-8 overflow-hidden min-h-[2rem]">
            {product.name}
          </h3>
          
          {/* Price and Stock Info - Reduced margin */}
          <div className="flex items-center justify-between mb-2 flex-col xs:flex-row gap-1 sm:gap-0 font-sans">
            <div className="flex items-center gap-2 w-full xs:w-auto justify-between xs:justify-start">
              {/* Price display */}
              <span className="text-base xs:text-lg sm:text-lg font-bold text-gray-900 font-sans">
                ₹{formatPrice(product.price)}
              </span>
              
              {/* Stock badge - moved here for mobile */}
              <span className={`px-2 py-1 text-xs rounded-full font-medium xs:hidden font-sans ${
                !isOutOfStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {!isOutOfStock ? 'In stock' : 'Out of stock'}
              </span>
            </div>
            
            {/* Stock badge - hidden on mobile, shown on tablet+ */}
            <span className={`px-2 py-1 text-xs rounded-full font-medium hidden xs:inline-block font-sans ${
              !isOutOfStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {!isOutOfStock ? 'In stock' : 'Out of stock'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingThisProduct}
            className="w-full py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-amber-700 to-amber-800 text-white hover:from-amber-800 hover:to-amber-900 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-500/25 text-xs xs:text-sm sm:text-sm font-sans transform hover:scale-105"
          >
            {isAddingThisProduct ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 xs:h-4 xs:w-4 border-b-2 border-white"></div>
                <span className="text-xs xs:text-sm sm:text-sm">Adding...</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
                <span className="text-xs xs:text-sm sm:text-sm">
                  {!isOutOfStock ? 'Add to Cart' : 'Out of Stock'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Render quantity popup as portal */}
      {mounted && showQuantityPopup && createPortal(
        <QuantityPopup />,
        document.body
      )}
    </>
  );
}