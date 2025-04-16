'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="relative max-w-3xl mx-auto mb-8"
  >
    <div className="relative">
      <motion.input
        type="text"
        placeholder="Discover amazing products..."
        className="w-full px-5 py-4 pl-14 pr-12 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 shadow-sm hover:shadow-md transition-all duration-300"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        whileFocus={{
          boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.1)",
          borderColor: "#ef4444"
        }}
      />
      
      <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
      
      <AnimatePresence>
        {searchQuery && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => setSearchQuery('')}
          >
            <FiX className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-red-500"
        initial={{ width: 0 }}
        animate={{ width: searchQuery ? '100%' : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
    
    <motion.div 
      className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200 to-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: searchQuery ? 1 : 0 }}
    />
    
    <style jsx>{`
      input::placeholder {
        color: #9CA3AF;
        transition: all 0.3s ease;
      }
      input:focus::placeholder {
        transform: translateX(5px);
        opacity: 0.5;
      }
    `}</style>
  </motion.div>
);