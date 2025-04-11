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
        const response = await fetch('http://localhost:3000/products/top-rated?limit=4');
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
    <div className="relative w-[50vw] h-[35vh] sm:h-[40vh] md:h-[45vh] mx-auto rounded-xl mt-6 overflow-hidden shadow-lg">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((product, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 relative h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${product.images[0] || '/default-image.jpg'})`,
            }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
              <div className="text-white text-center space-y-3 bg-white/10 p-4 sm:p-6 rounded-xl shadow-lg">
                <h1 className="text-lg sm:text-xl font-bold">{product.name}</h1>
                <p className="text-sm sm:text-base font-semibold">
                  <span className="text-yellow-400">Up to {product.discount}%</span> off Voucher
                </p>
                <button className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-1 rounded-lg shadow-md transition-all duration-300 text-sm">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 p-1 rounded-full shadow-md hover:bg-white/30 transition text-white text-lg"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 p-1 rounded-full shadow-md hover:bg-white/30 transition text-white text-lg"
      >
        ❯
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setAutoPlay(false);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
