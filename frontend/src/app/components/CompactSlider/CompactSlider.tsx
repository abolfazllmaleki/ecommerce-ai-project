'use client'
import { useState, useEffect } from 'react';

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
      cta: 'Shop Now →',
      background: 'bg-gradient-to-r from-blue-600 to-purple-600',
    },
    {
      title: 'New Arrivals',
      discount: '20%',
      voucherText: 'Special Offer',
      cta: 'Discover →',
      background: 'bg-gradient-to-r from-green-600 to-teal-600',
    },
    // Add more slides here
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
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Flash Sales Timer */}
          <div className="md:w-1/3 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Today's Flash Sales</h2>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(timeLeft).map(([label, value]) => (
                <div key={label} className="text-center">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <span className="block text-2xl font-bold text-blue-600">{value}</span>
                    <span className="text-xs text-gray-500 capitalize">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promo Slider */}
          <div className="md:w-2/3 relative">
            <div className={`${slides[currentSlide].background} rounded-lg p-6 h-full transition-all duration-500`}>
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">{slides[currentSlide].title}</h3>
                  <p className="text-lg text-white">
                    <span className="text-yellow-300">{slides[currentSlide].discount}</span>{' '}
                    {slides[currentSlide].voucherText}
                  </p>
                </div>
                <button className="self-start bg-white text-blue-600 px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
                  {slides[currentSlide].cta}
                </button>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
              <button
                onClick={prevSlide}
                className="bg-white/30 hover:bg-white/50 text-gray-800 rounded-full p-2 shadow-sm backdrop-blur-sm"
              >
                ←
              </button>
              <button
                onClick={nextSlide}
                className="bg-white/30 hover:bg-white/50 text-gray-800 rounded-full p-2 shadow-sm backdrop-blur-sm"
              >
                →
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactSlider;