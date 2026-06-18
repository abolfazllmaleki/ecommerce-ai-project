'use client';
import { motion } from 'framer-motion';
import { FiStar, FiDollarSign, FiTrendingUp, FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface FilterControlsProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}


export const FilterControls = ({
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
}: FilterControlsProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
  >
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4 text-gray-700 flex items-center gap-2">
          <FiDollarSign className="text-red-500" />
          <span>Price Range</span>
        </h3>
        <div className="relative pt-2">
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-3">
            <span>$0</span>
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              Up to ${priceRange[1]}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4 text-gray-700 flex items-center gap-2">
          <FiStar className="text-red-500" />
          <span>Minimum Rating</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[0, 2, 3, 4].map((rating) => (
            <motion.button
              key={rating}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`py-2 px-3 rounded-lg text-sm flex items-center gap-1 ${
                minRating === rating
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setMinRating(rating)}
            >
              {rating === 0 ? 'All' : (
                <>
                  {rating}+
                  <FiStar className="fill-current" size={14} />
                </>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4 text-gray-700 flex items-center gap-2">
          <FiTrendingUp className="text-red-500" />
          <span>Sort By</span>
        </h3>
        <div className="space-y-2">
          {[
            { value: 'popularity', label: 'Popularity', icon: <FiTrendingUp /> },
            { value: 'price-asc', label: 'Price: Low to High', icon: <FiArrowUp /> },
            { value: 'price-desc', label: 'Price: High to Low', icon: <FiArrowDown /> },
            { value: 'rating', label: 'Rating', icon: <FiStar /> }
          ].map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ x: 5 }}
              className={`w-full text-left py-2 px-3 rounded-lg text-sm flex items-center gap-2 ${
                sortBy === option.value
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setSortBy(option.value)}
            >
              <span className={`${sortBy === option.value ? 'text-red-500' : 'text-gray-400'}`}>
                {option.icon}
              </span>
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);