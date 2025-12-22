'use client';

import { productAPI } from '@/lib/api';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/products/AddToCartButton';
import ProductCard from '@/components/ui/ProductCard';
import { Product, ProductColor } from '@/types/product';
import { useEffect, useState, useCallback } from 'react';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Color Circle Component
interface ColorCircleProps {
  colorItem: ProductColor;
  isSelected: boolean;
  onClick: () => void;
}

const SimpleColorCircle = ({ colorItem, isSelected, onClick }: ColorCircleProps) => {
  const colors = colorItem.code ? colorItem.code.split(',').map(c => c.trim()) : ['#f0f0f0'];
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-[#556B2F] ring-offset-2 bg-gray-50' 
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="relative">
        {/* Color Circle */}
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm relative">
          {colors.length === 1 ? (
            // Single color - full circle
            <div 
              className="w-full h-full"
              style={{ backgroundColor: colors[0] }}
            />
          ) : (
            // Multiple colors - pie chart style
            <div className="w-full h-full relative">
              {/* Background for safety */}
              <div className="absolute inset-0 bg-gray-200" />
              
              {/* Create pie slices */}
              {colors.map((color, index) => {
                const totalSlices = colors.length;
                const sliceAngle = 360 / totalSlices;
                const startAngle = sliceAngle * index;
                const endAngle = startAngle + sliceAngle;
                
                // Convert angles to coordinates
                const startX = 50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
                const startY = 50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
                const endX = 50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
                const endY = 50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
                
                const largeArc = sliceAngle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 50 50`,
                  `L ${startX} ${startY}`,
                  `A 50 50 0 ${largeArc} 1 ${endX} ${endY}`,
                  `Z`
                ].join(' ');
                
                return (
                  <svg
                    key={index}
                    className="absolute inset-0"
                    viewBox="0 0 100 100"
                  >
                    <path
                      d={pathData}
                      fill={color}
                      stroke="white"
                      strokeWidth="1"
                    />
                  </svg>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#556B2F] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Color Name and Stock - Only show stock badge */}
      <div className="text-center">
        <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          colorItem.stock > 0 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {colorItem.stock > 0 ? `${colorItem.stock} left` : 'Sold out'}
        </div>
      </div>
    </button>
  );
};

// Mobile Floating Button Component
interface MobileFloatingButtonProps {
  product: Product;
  selectedColor: ProductColor | null;
  isVisible: boolean;
}

const MobileFloatingButton = ({ product, selectedColor, isVisible }: MobileFloatingButtonProps) => {
  const router = useRouter();
  
  const handleAddToCart = () => {
    // Logic for adding to cart would go here
    // For now, we'll just redirect to cart page
    router.push('/cart');
  };
  
  const handleBuyNow = () => {
    // Add to cart and redirect to checkout
    router.push('/checkout');
  };
  
  const getStockDisplay = () => {
    if (selectedColor) {
      return selectedColor.stock;
    }
    
    if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
      const validColors = product.colors.filter(color => 
        color && color.name && color.name.trim() !== ''
      );
      if (validColors.length > 0) {
        return product.colors.reduce((sum, color) => sum + color.stock, 0);
      }
    }
    
    return product.stock || 0;
  };
  
  const stock = getStockDisplay();
  const isOutOfStock = stock <= 0;

  return (
    <div className={`
      lg:hidden fixed bottom-0 left-0 right-0 z-50 
      transform transition-transform duration-300 ease-in-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Price Display */}
            <div className="flex-1">
              <div className="text-lg font-bold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
              <div className={`text-xs font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                {isOutOfStock ? 'Out of Stock' : `${stock} available`}
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-2">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`
                  px-4 py-3 rounded-lg font-medium text-sm
                  transition-colors duration-200 flex items-center gap-2
                  ${isOutOfStock 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#556B2F] text-white hover:bg-[#445522]'
                  }
                `}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Cart</span>
              </button>
              
              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`
                  px-6 py-3 rounded-lg font-medium text-sm
                  transition-colors duration-200 flex items-center gap-2
                  ${isOutOfStock 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800'
                  }
                `}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductDetailPage(props: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Function to get 4 random products (excluding current product)
  const getRandomProducts = async (currentProductId: string, limit = 4) => {
    try {
      const response = await productAPI.getAll({});
      
      if (response.success && response.data) {
        // Filter out current product and get random products
        const otherProducts = response.data.filter(product => product._id !== currentProductId);
        
        // Shuffle array and get first 4
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
      
      // Show button when:
      // 1. Scrolling up (currentScrollY < lastScrollY)
      // 2. User has scrolled past a certain point (e.g., 100px from top)
      // 3. Not at the very bottom of the page
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
        setSlug(params.slug);
        
        console.log(`Fetching product with slug: ${params.slug}`);
        
        const response = await productAPI.getBySlug(params.slug);
        
        if (!response.success || !response.data) {
          console.warn(`Product not found for slug: ${params.slug}`);
          notFound();
        }
        
        const productData = response.data;
        setProduct(productData);
        
        // ✅ Set default color only if colors exist and are not empty
        if (productData.colors && 
            Array.isArray(productData.colors) && 
            productData.colors.length > 0 &&
            productData.colors[0]?.name) {
          setSelectedColor(productData.colors[0]);
        } else {
          setSelectedColor(null);
        }
        
        console.log(`Product found:`, {
          name: productData.name,
          
          colors: productData.colors
        });

        // Get 4 random products
        const randomProductsData = await getRandomProducts(productData._id, 4);
        setRandomProducts(randomProductsData);
      } catch (error: any) {
        console.error('Error fetching product for slug:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [props.params]);

  const handleColorSelect = (color: ProductColor) => {
    setSelectedColor(color);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[white] py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#556B2F]"></div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  // ✅ Calculate stock based on available data
  const getStockDisplay = () => {
    // If colors exist and are selected, show color stock
    if (selectedColor) {
      return selectedColor.stock;
    }
    
    // If colors exist but none selected, show total colors stock
    if (hasValidColors()) {
      
    }
    
    // No colors, show main stock
    return product.stock || 0;
  };

  // ✅ Check if product has valid colors
  const hasValidColors = () => {
    if (!product.colors || !Array.isArray(product.colors)) return false;
    
    // Filter out empty/invalid colors
    const validColors = product.colors.filter(color => 
      color && color.name && color.name.trim() !== ''
    );
    
    return validColors.length > 0;
  };

  // ✅ Get valid colors array
  const getValidColors = () => {
    if (!product.colors || !Array.isArray(product.colors)) return [];
    
    // Filter out empty/invalid colors
    return product.colors.filter(color => 
      color && color.name && color.name.trim() !== ''
    );
  };

  const validColors = getValidColors();
  const productHasColors = hasValidColors();

  return (
    <div className="min-h-screen bg-[white] pb-16 lg:pb-0">
      <div className="container mx-auto">
        {/* Product Section */}
        <div className="bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
            {/* Product Images */}
            <div className="w-full lg:sticky lg:top-0 lg:h-screen lg:overflow-auto">
              <div className="space-y-0 lg:space-y-4 lg:p-8">
                {/* Main Image Container - Optimized height based on colors */}
                <div className="relative w-full bg-gray-50 overflow-hidden rounded-[2rem] lg:rounded-3xl mt-7">
                  <div 
                    className="relative w-full overflow-hidden rounded-b-[2rem] lg:rounded-3xl"
                    style={{ 
                      // Dynamic height: taller when no colors, shorter when colors present
                      height: productHasColors ? '50vh' : '60vh',
                      minHeight: productHasColors ? '400px' : '450px',
                      maxHeight: productHasColors ? '600px' : '700px'
                    }}
                  >
                    {product.images && product.images.length > 0 && product.images[0]?.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${product.images[0].image}`}
                        alt={product.name}
                        fill
                        className="object-cover rounded-b-[2rem] lg:rounded-3xl"
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-b-[2rem] lg:rounded-3xl">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6 bg-white p-4 sm:p-6 lg:p-8 lg:pr-12">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
              </div>

              {/* Price and Stock - Optimized layout */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {(() => {
                  const stock = getStockDisplay();
                  return stock > 0 ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium self-start sm:self-auto">
                      In Stock ({stock} available)
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium self-start sm:self-auto">
                      Out of Stock
                    </span>
                  );
                })()}
              </div>

              {/* ✅ Color Selection - Only show if product has colors */}
              {productHasColors && validColors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg lg:text-xl">
                    Available Colors
                  </h3>
                  <div className="flex flex-wrap gap-3 lg:gap-4">
                    {validColors.map((colorItem, index) => (
                      <SimpleColorCircle
                        key={index}
                        colorItem={colorItem}
                        isSelected={selectedColor?.name === colorItem.name}
                        onClick={() => handleColorSelect(colorItem)}
                      />
                    ))}
                  </div>
                  
                  {/* Selected Color Info - Only show name if color selected */}
                  {selectedColor && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full border border-gray-300 overflow-hidden">
                            {selectedColor.code && selectedColor.code.includes(',') ? (
                              <div className="w-full h-full flex">
                                {selectedColor.code.split(',').map((colorCode, i) => (
                                  <div 
                                    key={i}
                                    className="flex-1"
                                    style={{ backgroundColor: colorCode.trim() }}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div 
                                className="w-full h-full"
                                style={{ backgroundColor: selectedColor.code || '#f0f0f0' }}
                              />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              Selected: <span className="font-semibold text-gray-900">{selectedColor.name}</span>
                            </div>
                            <div className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${
                              selectedColor.stock > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {selectedColor.stock > 0 
                                ? `${selectedColor.stock} units available` 
                                : 'Currently unavailable'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ Add to Cart Section - Adjusts based on colors presence */}
              <div className={`${productHasColors ? 'pt-2' : 'pt-6'} lg:pt-8`}>
                <div className="max-w-md">
                  {/* Desktop Add to Cart Button */}
                  <div className="hidden lg:block">
                    <AddToCartButton product={product} selectedColor={selectedColor} />
                  </div>
                  
                  {/* Mobile Add to Cart Button */}
                  <div className="lg:hidden">
                    <div className="space-y-3">
                      <AddToCartButton product={product} selectedColor={selectedColor} />
                      
                      {/* Mobile Buy Now Button */}
                      <button
                        onClick={() => window.location.href = '/checkout'}
                        disabled={getStockDisplay() <= 0}
                        className={`
                          w-full py-4 rounded-xl font-semibold text-base
                          transition-colors duration-200 flex items-center justify-center gap-2
                          ${getStockDisplay() <= 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-black text-white hover:bg-gray-800'
                          }
                        `}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ Product Details - Adjust spacing based on colors presence */}
              <div className={`space-y-6 lg:space-y-8 ${!productHasColors ? 'mt-6' : ''}`}>
                {/* Product Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-xl lg:text-2xl">Description</h3>
                  <p className="text-gray-700 text-base lg:text-lg leading-relaxed">{product.description}</p>
                </div>

                {/* Specifications - Only show if they exist */}
                {product.specifications && product.specifications.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg lg:text-xl">Specifications</h3>
                    <div className="space-y-2">
                      {product.specifications.map((spec, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-start">
                          <span className="font-medium text-gray-700 w-full sm:w-1/3 mb-1 sm:mb-0">
                            {spec.key}:
                          </span>
                          <span className="text-gray-600 w-full sm:w-2/3">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section - Only show if there are related products */}
        {randomProducts.length > 0 && (
          <div className="mt-8 lg:mt-16 px-4 lg:px-8 py-8 lg:py-12 bg-gray-50 rounded-t-3xl lg:rounded-3xl">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {randomProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct._id} product={relatedProduct} />
                ))}
              </div>
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
        />
      )}
    </div>
  );
}