'use client';

import ProductGrid from '@/components/products/ProductGrid';
import { Truck, Shield, Clock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Category } from '@/types/category';
import { fetchActiveCategories } from '@/lib/categoryService';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const heroRef = useRef(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const navigateToProducts = () => {
    router.push('/products');
  };

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await fetchActiveCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }

    loadCategories();
  }, []);

  const featuredCategories = categories.slice(0, 3);
  const allCategories = categories.slice(0, 6); // Show first 6 categories for the boxes

  const faqItems = [
    {
      question: "How can I track my order?",
      answer: "You can track your order from 'My Orders' section. There is a button 'Track Order' in front of each shipped order."
    },
    {
      question: "What is the standard delivery timings?",
      answer: "Normal delivery time is about 5-6 working days. Local Delivery time is 2-3 days."
    },
    {
      question: "Is free delivery available?",
      answer: "Yes, For free delivery minimum order amount should be Rs. 599."
    },
    {
      question: "Is COD available?",
      answer: "Yes, COD is available with extra Rs 35 as Cash Collection And Handling fees."
    },
    {
      question: "Are These Books New?",
      answer: "Yes, All Books Are Absolutely New."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Head>
        <link 
          rel="preload" 
          href="/images/a7.png" 
          as="image" 
          type="image/jpeg/png/jpg"
          fetchPriority="high"
        />
      </Head>

      {/* Reduced background element size */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-amber-100 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>
      </div>

      {/* Reduced hero section height */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center md:justify-start overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero4.jpg" 
            alt="Premium Collection Background"
            className="object-cover w-full h-full"
            style={{ 
              objectPosition: 'center'
            }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-16 h-16 bg-amber-300/10 rounded-full opacity-30 animate-float"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-amber-300/10 rounded-full opacity-40 animate-float delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-amber-300/10 rounded-full opacity-20 animate-float delay-500"></div>
        </div>

        {/* Mobile: center content, Desktop: left aligned */}
        <div className="relative z-10 w-full flex justify-center md:justify-start">
          <div className="text-center md:text-left w-full px-4 md:px-0 md:ml-8 lg:ml-12 xl:ml-16 2xl:ml-24">
            <div className="space-y-4 mb-6 max-w-3xl mx-auto md:mx-0">
              {/* Premium Collection text - Changed font sizes for desktop */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-2xl text-white">
                <span className="block animate-slide-in-left text-white">
                  Meet Your Next
                </span>
                <span className="block animate-slide-in-right delay-200 text-white">
                    Favorite Books
                </span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl animate-fade-in-up delay-400 drop-shadow-lg font-medium mx-auto md:mx-0 md:text-left">
              Discover excellence in every detail
              <span className="block text-white/90 mt-1 text-base md:text-lg">
                Elevate your experience with our curated selection
              </span>
            </p>

            {/* Buttons: center on mobile, left aligned on desktop */}
            <div className="flex flex-row flex-wrap gap-3 justify-center md:justify-start animate-fade-in-up delay-600">
              <button 
                onClick={navigateToProducts}
                className="bg-gradient-to-r from-amber-700 to-amber-800 text-white px-5 sm:px-10 py-3 rounded-2xl font-semibold transform hover:scale-105 transition-all cursor-pointer border-2 border-white/40 hover:border-white/80 hover:shadow-2xl shadow-lg text-sm sm:text-base min-w-[140px]"
              >
                Explore
              </button>
              <button className="bg-white/20 border-2 border-white/60 text-white px-5 sm:px-10 py-3 rounded-2xl font-semibold hover:bg-white/30 hover:border-white/90 transition-all backdrop-blur-sm text-sm sm:text-base min-w-[140px]">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Books By Categories Section */}
      <section className="py-12 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent mb-3">
              Shop Books By Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our wide range of book categories to find exactly what you're looking for
            </p>
          </div>

          {/* Updated mobile-responsive category buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 md:gap-4 max-w-6xl mx-auto">
            {allCategories.map((category, index) => (
              <div 
                key={category._id}
                className="group animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <button
                  onClick={() => router.push(`/products?category=${category.slug}`)}
                  className="w-full aspect-square bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 flex flex-col items-center justify-center border border-amber-200 sm:border-2 hover:border-amber-500 hover:shadow-md sm:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer group-hover:bg-gradient-to-br group-hover:from-amber-50 group-hover:to-white"
                >
                  {/* Category Icon/Image Placeholder - Much smaller on mobile */}
                  <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-1 sm:mb-2 md:mb-3 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-700">
                      {category.name.charAt(0)}
                    </div>
                  </div>
                  
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 group-hover:text-amber-800 transition-colors duration-300 line-clamp-2 text-center leading-tight sm:leading-normal">
                    {category.name}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reduced section padding and margins */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent mb-3">Explore Books</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated Books
            </p>
          </div>

          <div className="space-y-8">
            {featuredCategories.map((category, index) => (
              <div 
                key={category._id} 
                className="animate-fade-in-up" 
                style={{ 
                  animationDelay: `${index * 300}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Category Header: Title centered with gradient, small button on right */}
                <div className="relative flex items-center justify-center mb-4">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent text-center">
                    {category.name}
                  </h3>
                  <button 
                    onClick={() => router.push(`/products?category=${category.slug}`)}
                    className="absolute right-0 inline-flex items-center gap-0.5 sm:gap-1 bg-gradient-to-r from-amber-700 to-amber-800 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg font-medium transition-all duration-300 hover:from-amber-800 hover:to-amber-900 hover:shadow-md shadow-sm cursor-pointer text-xs sm:text-sm"
                  >
                    View More
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </div>

                <ProductGrid 
                  category={category._id} 
                  limit={6}
                  hideFilters={true}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reduced section padding and margins */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Reduced margins */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent mb-3">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best shopping experience
            </p>
          </div>

          {/* Reduced gap and padding */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { 
                icon: Truck, 
                color: 'amber',
                gradient: 'from-amber-600 to-amber-700',
                title: 'Free Shipping', 
                desc: 'Free delivery on all orders over ₹500. Fast and reliable shipping to your doorstep.',
                highlight: 'No hidden fees'
              },
              { 
                icon: Shield, 
                color: 'amber',
                gradient: 'from-amber-700 to-amber-800',
                title: 'Secure Payment', 
                desc: 'Your data is protected with bank-level security. Shop with complete peace of mind.',
                highlight: '100% secure'
              },
              { 
                icon: Clock, 
                color: 'amber',
                gradient: 'from-amber-800 to-amber-900',
                title: 'Easy Returns', 
                desc: 'Not happy? Return within 30 days for a full refund. No questions asked.',
                highlight: '30-day policy'
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 hover:border-white/40 overflow-hidden"
              >
                <div className="absolute inset-0 z-0">
                  <div className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{backgroundImage: 'url("/api/placeholder/1920/1080")'}}>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-700/70 to-amber-800/60"></div>
                  </div>
                </div>

                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-4 right-4 w-4 h-4 bg-amber-500 rounded-full opacity-40 animate-float"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-amber-600 rounded-full opacity-30 animate-float delay-1000"></div>
                </div>

                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`relative w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                    <feature.icon className="text-white" size={24} />
                    <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 text-center group-hover:text-amber-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-amber-100 text-center mb-3 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                  <div className="text-center">
                    <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full border border-white/30">
                      {feature.highlight}
                    </span>
                  </div>
                </div>

                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${feature.gradient} group-hover:w-3/4 transition-all duration-500 rounded-full z-10`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our books and services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqItems.map((faq, index) => (
              <div 
                key={index} 
                className="mb-4 border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:shadow-lg"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-amber-50 transition-colors duration-300"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-gray-800 text-lg">{faq.question}</span>
                  <span className="text-amber-700">
                    {openFaqIndex === index ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </span>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    openFaqIndex === index ? 'py-4 max-h-96' : 'max-h-0 py-0'
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }

        .delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}