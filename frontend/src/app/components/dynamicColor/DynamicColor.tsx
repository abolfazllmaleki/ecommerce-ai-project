'use client';
import { motion } from 'framer-motion';

const DynamicColor = ({ colors, selectedColor, onColorChange }: any) => {
  return (
    <div className="my-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">COLOR:</h3>
      <div className="flex gap-3">
        {colors.map((color: any, index: any) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-10 h-10 rounded-full relative transition-all duration-200 shadow-md ${
              selectedColor === color 
                ? 'ring-2 ring-offset-2 ring-gray-900' 
                : 'hover:ring-1 hover:ring-gray-300'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
          >
            {selectedColor === color && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DynamicColor;