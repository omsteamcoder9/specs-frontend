'use client';

import { productAPI } from '@/lib/api';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/products/AddToCartButton';
import ProductCard from '@/components/ui/ProductCard';
import { Product, ProductColor } from '@/types/product';
import { useEffect, useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Ultra Compact Color Circle
const ColorCircle = ({ 
  colorItem, 
  isSelected, 
  onClick 
}: { 
  colorItem: ProductColor; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const colors = colorItem.code ? colorItem.code.split(',').map(c => c.trim()) : ['#f0f0f0'];
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-0.5 ${isSelected ? 'ring-1 ring-[#556B2F] rounded-md' : ''}`}
    >
      <div className="relative">
        <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200">
          {colors.length === 1 ? (
            <div className="w-full h-full" style={{ backgroundColor: colors[0] }} />
          ) : (
            <div className="w-full h-full flex">
              {colors.map((color, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </div>
          )}
        </div>
        {isSelected && (
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#556B2F] rounded-full flex items-center justify-center">
            <svg className="w-1.5 h-1.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <div className={`text-[8px] mt-0.5 px-1 py-0.5 rounded ${colorItem.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {colorItem.stock > 0 ? colorItem.stock : '0'}
      </div>
    </button>
  );
};

// Mobile Floating Button Component
interface MobileFloatingButtonProps {
  product: Product;
  selectedColor: ProductColor | null;
  isVisible: boolean;
  onAddToCart: (quantity: number) => Promise<void>;
}

const MobileFloatingButton = ({ 
  product, 
  selectedColor, 
  isVisible, 
  onAddToCart 
}: MobileFloatingButtonProps) => {
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToBuy, setAddingToBuy] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const isOutOfStock = selectedColor ? selectedColor.stock <= 0 : product.stock <= 0;
  
  const handleCartClick = async () => {
    if (isOutOfStock) return;
    
    try {
      setAddingToCart(true);
      await onAddToCart(quantity);
      
      setShowAddedMessage(true);
      setTimeout(() => {
        setShowAddedMessage(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };
  
  const handleBuyClick = async () => {
    if (isOutOfStock) return;
    
    try {
      setAddingToBuy(true);
      await onAddToCart(quantity);
      router.push('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToBuy(false);
    }
  };

  return (
    <div className={`
      lg:hidden fixed bottom-0 left-0 right-0 z-50 
      transform transition-transform duration-300 ease-in-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className="bg-white border-t border-gray-200">
        {/* QUANTITY ROW - COMPACT */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded-md text-gray-700 disabled:opacity-40"
            >
              -
            </button>
            <span className="text-sm font-medium w-6 text-center">{quantity}</span>
            <button
              onClick={() => {
                const maxStock = selectedColor?.stock || product.stock || 99;
                setQuantity(prev => Math.min(maxStock, prev + 1))
              }}
              disabled={isOutOfStock || quantity >= (selectedColor?.stock || product.stock || 99)}
              className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded-md text-gray-700 disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
        
        {/* ACTION BUTTONS ROW */}
        <div className="flex items-stretch h-10">
          {/* LEFT HALF - CART BUTTON */}
          <button
            onClick={handleCartClick}
            disabled={isOutOfStock || addingToCart}
            className={`
              flex-1
              flex items-center justify-center gap-1
              transition-all duration-300
              relative
              ${isOutOfStock || addingToCart
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-md shadow cursor-pointer'
              }
            `}
          >
            {addingToCart ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
            ) : showAddedMessage ? (
              <span className="text-xs font-medium animate-pulse">Added! ✓</span>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-xs font-medium">Cart</span>
              </>
            )}
          </button>
          
          {/* RIGHT HALF - BUY BUTTON */}
          <button
            onClick={handleBuyClick}
            disabled={isOutOfStock || addingToBuy}
            className={`
              flex-1
              flex items-center justify-center gap-1
              transition-colors duration-200
              ${isOutOfStock || addingToBuy
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
              }
            `}
          >
            {addingToBuy ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xs font-medium">Buy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProductDetailPage(props: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { addToCart } = useCart();

  const getRandomProducts = async (currentProductId: string, limit = 4) => {
    try {
      const response = await productAPI.getAll({});
      if (response.success && response.data) {
        const otherProducts = response.data.filter(product => product._id !== currentProductId);
        const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
      }
      return [];
    } catch (error) {
      console.error('Error fetching random products:', error);
      return [];
    }
  };

  // Handle scroll to show/hide floating button
  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const isScrollingUp = currentScrollY < lastScrollY;
      const isPastThreshold = currentScrollY > 100;
      const isNotAtBottom = currentScrollY < documentHeight - windowHeight - 100;
      
      setShowFloatingButton(isScrollingUp && isPastThreshold && isNotAtBottom);
      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const params = await props.params;
        
        const response = await productAPI.getBySlug(params.slug);
        
        if (!response.success || !response.data) {
          notFound();
        }
        
        const productData = response.data;
        setProduct(productData);
        
        if (productData.colors && Array.isArray(productData.colors) && productData.colors.length > 0 && productData.colors[0]?.name) {
          setSelectedColor(productData.colors[0]);
        } else {
          setSelectedColor(null);
        }

        const randomProductsData = await getRandomProducts(productData._id, 4);
        setRandomProducts(randomProductsData);
      } catch (error: any) {
        notFound();
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [props.params]);

  const handleMobileAddToCart = async (quantity: number) => {
    if (!product) {
      alert('Product not found');
      return;
    }
    
    try {
      const colorName = selectedColor?.name;
      await addToCart(product, quantity, colorName);
      return;
    } catch (error) {
      console.error('❌ Mobile - Error adding to cart:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#556B2F]"></div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const getStockDisplay = () => {
    if (selectedColor) {
      return selectedColor.stock;
    }
    if (product.colors && Array.isArray(product.colors)) {
      const validColors = product.colors.filter(color => color && color.name && color.name.trim() !== '');
      if (validColors.length > 0) {
        return validColors.reduce((sum, color) => sum + color.stock, 0);
      }
    }
    return product.stock || 0;
  };

  const hasValidColors = () => {
    if (!product.colors || !Array.isArray(product.colors)) return false;
    const validColors = product.colors.filter(color => color && color.name && color.name.trim() !== '');
    return validColors.length > 0;
  };

  const getValidColors = () => {
    if (!product.colors || !Array.isArray(product.colors)) return [];
    return product.colors.filter(color => color && color.name && color.name.trim() !== '');
  };

  const validColors = getValidColors();
  const productHasColors = hasValidColors();
  const stock = getStockDisplay();

  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">
      <div className="mx-auto">
        {/* Product Section - ULTRA COMPACT */}
        <div className="bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
            {/* Product Images - NO EXTRA SPACE */}
            <div className="w-full">
              <div className="relative w-full overflow-hidden rounded-lg mt-2">
                <div className="relative w-full" style={{ height: '45vh', minHeight: '300px' }}>
                  {product.images && product.images.length > 0 && product.images[0]?.image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${product.images[0].image}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="100vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details - ULTRA TIGHT */}
            <div className="space-y-3 p-3 sm:p-4">
              {/* Product Name */}
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* Price and Stock - BELOW THE NAME */}
              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {stock > 0 ? `In Stock (${stock})` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Color Selection - COMPACT */}
              {productHasColors && validColors.length > 0 && (
                <div className="pt-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Colors</h3>
                  <div className="flex flex-wrap gap-1">
                    {validColors.map((colorItem, index) => (
                      <ColorCircle
                        key={index}
                        colorItem={colorItem}
                        isSelected={selectedColor?.name === colorItem.name}
                        onClick={() => setSelectedColor(colorItem)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart - COMPACT */}
              <div className="pt-2">
                <div className="max-w-sm">
                  {/* Desktop Add to Cart Button */}
                  <div className="hidden lg:block">
                    <AddToCartButton product={product} selectedColor={selectedColor} />
                  </div>
                  
                  {/* Mobile Add to Cart Button */}
                  <div className="lg:hidden">
                    <div className="space-y-2">
                      <AddToCartButton product={product} selectedColor={selectedColor} />
                      
                      {/* Mobile Buy Now Button */}
                      <button
                        onClick={() => window.location.href = '/checkout'}
                        disabled={stock <= 0}
                        className={`
                          w-full py-3 rounded-lg font-semibold text-sm
                          transition-colors duration-200 flex items-center justify-center gap-1.5
                          ${stock <= 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-black text-white hover:bg-gray-800'
                          }
                        `}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details - COMPACT */}
              <div className="space-y-3 pt-2">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Description</h3>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{product.description}</p>
                </div>

                {/* Specifications */}
                {product.specifications && product.specifications.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Specs</h3>
                    <div className="space-y-1">
                      {product.specifications.slice(0, 3).map((spec, index) => (
                        <div key={index} className="flex text-sm">
                          <span className="font-medium text-gray-700 w-1/3">{spec.key}:</span>
                          <span className="text-gray-600 w-2/3">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products - TIGHT */}
        {randomProducts.length > 0 && (
          <div className="p-3 sm:p-4 mt-2 border-t border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-2">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {randomProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="scale-95">
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Floating Button - Appears when scrolling up */}
      {product && (
        <MobileFloatingButton 
          product={product} 
          selectedColor={selectedColor} 
          isVisible={showFloatingButton}
          onAddToCart={handleMobileAddToCart}
        />
      )}
    </div>
  );
}