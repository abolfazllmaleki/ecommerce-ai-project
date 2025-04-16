'use client'
import { useState, useEffect } from 'react';
import { FiArrowLeft, FiArrowRight, FiClock } from 'react-icons/fi';

interface CompactSliderProps {
  endDate: Date;
}

const CompactSlider = ({ endDate }: CompactSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  const slides = [
    {
      title: 'iPhone 14 Series',
      discount: 'Up to 10%',
      voucherText: 'off Voucher',
      cta: 'Shop Now',
      background: 'bg-gradient-to-r from-red-600 to-red-500',
      highlight: 'text-yellow-300'
    },
    {
      title: 'New Arrivals',
      discount: '20%',
      voucherText: 'Special Offer',
      cta: 'Discover',
      background: 'bg-gradient-to-r from-blue-600 to-blue-500',
      highlight: 'text-yellow-300'
    },
  ];

  const calculateTimeLeft = () => {
    const difference = endDate.getTime() - new Date().getTime();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
        minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
        seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0')
      };
    }
    
    return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Flash Sales Timer */}
          <div className="md:w-1/3 p-6 bg-gradient-to-br from-gray-50 to-white flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <FiClock className="text-red-500 text-xl" />
              <h2 className="text-xl font-bold text-gray-800">Flash Sales Ending Soon!</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(timeLeft).map(([label, value]) => (
                <div key={label} className="text-center">
                  <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                    <span className="block text-2xl font-bold text-gray-900">{value}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              View All Deals
            </button>
          </div>

          {/* Promo Slider */}
          <div className="md:w-2/3 relative min-h-[250px]">
            <div className={`${slides[currentSlide].background} h-full transition-all duration-500 relative`}>
              <div className="p-8 h-full flex flex-col justify-between">
                {/* Content */}
                <div className="space-y-3 z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                    {slides[currentSlide].title}
                  </h3>
                  <p className="text-lg md:text-xl text-white">
                    <span className={`${slides[currentSlide].highlight} font-bold`}>
                      {slides[currentSlide].discount}
                    </span>{' '}
                    {slides[currentSlide].voucherText}
                  </p>
                </div>
                
                <div className="flex justify-between items-end z-10">
                  <button className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300 hover:scale-105 flex items-center gap-2">
                    {slides[currentSlide].cta}
                    <FiArrowRight className="w-4 h-4" />
                  </button>

                  {/* Slide Indicators - moved here for better mobile layout */}
                  <div className="flex gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                <button
                  onClick={prevSlide}
                  className="bg-white/80 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all hover:scale-110"
                  aria-label="Previous slide"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-white/80 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all hover:scale-110"
                  aria-label="Next slide"
                >
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactSlider;