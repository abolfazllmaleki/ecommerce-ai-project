'use client';

import { useState, useEffect, useCallback } from 'react';

interface Product {
  name: string;
  discount: number;
  images: string[];
  price?: number;
  previousPrice?: number;
  adminNote:string;
}

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [slides, setSlides] = useState<Product[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/top-rated?limit=5`
        );
        const data = await response.json();
        setSlides(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Error fetching top-rated products:", error);
        // Fallback demo data
        // setSlides([
        //   {
        //     name: "Premium Wireless Headphones",
        //     discount: 25,
        //     images: ["/api/placeholder/800/500"],
        //     price: 199,
        //     previousPrice: 259
        //   },
        //   {
        //     name: "Smart Watch Series X",
        //     discount: 30,
        //     images: ["/api/placeholder/800/500"],
        //     price: 249,
        //     previousPrice: 349
        //   },
        //   {
        //     name: "Ultra HD Camera Drone",
        //     discount: 20,
        //     images: ["/api/placeholder/800/500"],
        //     price: 399,
        //     previousPrice: 499
        //   }
        // ]);
      }
    };

    fetchTopRatedProducts();
  }, []);

  useEffect(() => {
    if (autoPlay && slides.length > 0 && !isHovered) {
      const timer = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, autoPlay, slides.length, isHovered]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  if (slides.length === 0) {
    return (
      <div className="w-full max-w-6xl h-[60vh] mx-auto rounded-2xl mt-6 bg-gradient-to-r from-gray-900 to-black animate-pulse flex items-center justify-center">
        <div className="text-gray-500 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading featured products...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full max-w-6xl h-[60vh] mx-auto rounded-2xl mt-10 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0"></div>
      
      {/* Glowing accent elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-600/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <div className="flex h-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((product, index) => (
          <div key={index} className="w-full flex-shrink-0 relative h-full">
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={product.images[0] || '/default-image.jpg'}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-between p-12">
              {/* Product Info */}
              <div className="text-white space-y-6 max-w-lg z-10">
                <div className="inline-block bg-gradient-to-r from-amber-500 to-red-600 text-black font-bold px-4 py-1 rounded-full text-sm mb-2">
                  🔥 SALE: {product.discount}% OFF
                </div>
                <h1 className="text-5xl font-bold leading-tight">{product.name}</h1>
                
                {product.price && (
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-amber-400">${product.price}</span>
                    {product.previousPrice && (
                      <span className="text-xl text-gray-400 line-through">$555</span>
                    )}
                  </div>
                )}
                
                <p className="text-gray-300 text-lg">{product.adminNote}</p>
                
                <div className="flex gap-4 mt-6">
                  <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                    Shop Now <span className="text-lg">→</span>
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 border border-white/20">
                    View Details
                  </button>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="relative hidden lg:block">
                <div className="w-72 h-72 rounded-full bg-amber-500/5 absolute -right-10 top-1/2 -translate-y-1/2 blur-xl"></div>
                <div className="w-64 h-64 border-2 border-amber-500/30 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border border-amber-500/10 animate-ping-slow"></div>
                  <div className="text-amber-400 text-center">
                    <span className="text-6xl font-bold">{product.discount}%</span>
                    <p className="text-sm mt-2">OFF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 p-4 rounded-full shadow-2xl hover:bg-amber-600 transition-all duration-300 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 z-20"
        aria-label="Previous slide"
      >
        <div className="w-6 h-6 flex items-center justify-center text-xl">
          ←
        </div>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 p-4 rounded-full shadow-2xl hover:bg-amber-600 transition-all duration-300 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 z-20"
        aria-label="Next slide"
      >
        <div className="w-6 h-6 flex items-center justify-center text-xl">
          →
        </div>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? 'bg-amber-400 scale-125 ring-2 ring-amber-200' 
                : 'bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-100 ease-linear" 
          style={{ 
            width: autoPlay && !isHovered ? '100%' : '0%',
            transitionDuration: autoPlay && !isHovered ? '5000ms' : '0ms' 
          }}
          key={currentSlide}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 bg-black/40 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm z-20">
        {currentSlide + 1} / {slides.length}
      </div>

      <style jsx global>{`
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Slider;