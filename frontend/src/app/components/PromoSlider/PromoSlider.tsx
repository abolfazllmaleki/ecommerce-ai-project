'use client';

import { useState, useEffect } from 'react';

interface Product {
  name: string;
  discount: number;
  images: string[];
}

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [slides, setSlides] = useState<Product[]>([]);

  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/top-rated?limit=4`);
        const data: Product[] = await response.json();
        setSlides(data);
      } catch (error) {
        console.error('Error fetching top-rated products:', error);
      }
    };

    fetchTopRatedProducts();
  }, []);

  useEffect(() => {
    if (autoPlay && slides.length > 0) {
      const timer = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, autoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
  };

  return (
    <div className="relative w-full max-w-6xl h-[50vh] mx-auto rounded-2xl mt-6 overflow-hidden shadow-2xl group">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((product, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 relative h-full"
          >
            {/* Image Container with Improved Handling */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={product.images[0] || '/default-image.jpg'}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                style={{
                  objectPosition: 'center center',
                  filter: 'brightness(0.9) contrast(1.1)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
              <div className="text-white text-center space-y-4 bg-gradient-to-r from-black/60 to-black/40 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10 max-w-2xl">
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight drop-shadow-lg">
                  {product.name}
                </h1>
                <p className="text-lg sm:text-xl font-semibold">
                  <span className="text-yellow-300 animate-pulse">🔥 {product.discount}% OFF</span> Limited Time Offer
                </p>
                <button className="mt-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-gray-900 font-bold px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm sm:text-base">
                  Shop Now &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 p-3 rounded-full shadow-lg hover:bg-black/50 transition-all duration-300 text-white text-xl opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          &larr;
        </div>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 p-3 rounded-full shadow-lg hover:bg-black/50 transition-all duration-300 text-white text-xl opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          &rarr;
        </div>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setAutoPlay(false);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-amber-400 scale-125 ring-2 ring-white' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-amber-400 transition-all duration-1000 ease-linear" 
          style={{ 
            width: autoPlay ? '100%' : '0%',
            transitionDuration: autoPlay ? '5000ms' : '0ms' 
          }}
          key={currentSlide}
        />
      </div>
    </div>
  );
};

export default Slider;