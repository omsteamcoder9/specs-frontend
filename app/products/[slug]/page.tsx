'use client';

import { productAPI } from '@/lib/api';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/products/AddToCartButton';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/types/product';
import { useEffect, useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Mobile Floating Button Component
interface MobileFloatingButtonProps {
  product: Product;
  isVisible: boolean;
  onAddToCart: (quantity: number) => Promise<void>;
}

const MobileFloatingButton = ({ 
  product, 
  isVisible, 
  onAddToCart 
}: MobileFloatingButtonProps) => {
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToBuy, setAddingToBuy] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const isOutOfStock = product.stock <= 0;
  
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
        <div className="flex items-center justify-between px-3 py-1.5 bg-amber-50 border-b border-amber-100">
          <span className="text-xs font-medium text-amber-800">Quantity:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-6 h-6 flex items-center justify-center bg-white border border-amber-300 rounded-md text-amber-800 disabled:opacity-40 hover:bg-amber-50"
            >
              -
            </button>
            <span className="text-sm font-medium w-6 text-center text-amber-900">{quantity}</span>
            <button
              onClick={() => {
                const maxStock = product.stock || 99;
                setQuantity(prev => Math.min(maxStock, prev + 1))
              }}
              disabled={isOutOfStock || quantity >= (product.stock || 99)}
              className="w-6 h-6 flex items-center justify-center bg-white border border-amber-300 rounded-md text-amber-800 disabled:opacity-40 hover:bg-amber-50"
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
                : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 hover:shadow-md shadow cursor-pointer'
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
                : 'bg-amber-900 text-white hover:bg-amber-800'
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
      await addToCart(product, quantity);
      return;
    } catch (error) {
      console.error('❌ Mobile - Error adding to cart:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const stock = product.stock || 0;

  // Group specifications by category for better display
  const groupedSpecifications = () => {
    if (!product.specifications || !Array.isArray(product.specifications)) {
      return [];
    }

    const groups: { [key: string]: Array<{ key: string; value: string }> } = {};
    
    product.specifications.forEach(spec => {
      // Determine category based on key
      let category = 'General';
      
      if (spec.key.toLowerCase().includes('author') || 
          spec.key.toLowerCase().includes('isbn') || 
          spec.key.toLowerCase().includes('publisher') ||
          spec.key.toLowerCase().includes('pages')) {
        category = 'Book Details';
      } else if (spec.key.toLowerCase().includes('brand') || 
                spec.key.toLowerCase().includes('model') ||
                spec.key.toLowerCase().includes('processor') ||
                spec.key.toLowerCase().includes('ram')) {
        category = 'Technical Specifications';
      } else if (spec.key.toLowerCase().includes('material') || 
                spec.key.toLowerCase().includes('size') ||
                spec.key.toLowerCase().includes('color') ||
                spec.key.toLowerCase().includes('fit')) {
        category = 'Product Details';
      } else if (spec.key.toLowerCase().includes('weight') || 
                spec.key.toLowerCase().includes('dimensions')) {
        category = 'Physical Specifications';
      }
      
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(spec);
    });
    
    return Object.entries(groups);
  };

  const specGroups = groupedSpecifications();

  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">
      <div className="mx-auto">
        {/* Product Section - ULTRA COMPACT */}
        <div className="bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
            {/* Product Images - FULL HEIGHT */}
            <div className="w-full">
              <div className="relative w-full overflow-hidden rounded-lg mt-5">
                <div className="relative w-full h-auto min-h-[400px] lg:min-h-[500px]">
                  {product.images && product.images.length > 0 && product.images[0]?.image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${product.images[0].image}`}
                      alt={product.name}
                      fill
                      className="object-contain" 
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
                <span className="text-xl sm:text-2xl font-bold text-amber-800">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {stock > 0 ? `In Stock (${stock})` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Add to Cart - COMPACT */}
              <div className="pt-2">
                <div className="max-w-sm">
                  {/* Desktop Add to Cart Button */}
                  <div className="hidden lg:block">
                    <AddToCartButton product={product} />
                  </div>
                  
                  {/* Mobile Add to Cart Button */}
                  <div className="lg:hidden">
                    <div className="space-y-2">
                      <AddToCartButton product={product} />
                      
                      {/* Mobile Buy Now Button */}
                      <button
                        onClick={() => window.location.href = '/checkout'}
                        disabled={stock <= 0}
                        className={`
                          w-full py-3 rounded-lg font-semibold text-sm
                          transition-colors duration-200 flex items-center justify-center gap-1.5
                          ${stock <= 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-amber-900 text-white hover:bg-amber-800'
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
                  <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
                </div>

                {/* Specifications - Grouped by category */}
                {specGroups.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">Specifications</h3>
                    {specGroups.map(([category, specs], groupIndex) => (
                      <div key={groupIndex} className="space-y-1">
                        <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wide">{category}</h4>
                        <div className="space-y-1">
                          {specs.map((spec, index) => (
                            <div key={index} className="flex text-sm">
                              <span className="font-medium text-gray-700 w-2/5">{spec.key}:</span>
                              <span className="text-gray-600 w-3/5">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Additional Product Info */}
                <div className="space-y-2 pt-2 border-t border-amber-100">
                  {product.category && (
                    <div className="flex text-sm">
                      <span className="font-medium text-amber-800 w-2/5">Category:</span>
                      <span className="text-amber-900 w-3/5">{typeof product.category === 'object' ? product.category.name : 'Unknown'}</span>
                    </div>
                  )}
                  
                  {product.seller && (
                    <div className="flex text-sm">
                      <span className="font-medium text-amber-800 w-2/5">Seller:</span>
                      <span className="text-amber-900 w-3/5">{product.seller}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products - TIGHT */}
        {randomProducts.length > 0 && (
          <div className="p-3 sm:p-4 mt-2 border-t border-amber-100">
            <h2 className="text-base font-bold text-amber-800 mb-2">Related Products</h2>
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
          isVisible={showFloatingButton}
          onAddToCart={handleMobileAddToCart}
        />
      )}
    </div>
  );
}