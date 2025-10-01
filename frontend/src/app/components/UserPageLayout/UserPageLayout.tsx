// UserPageLayout.tsx
'use client';
import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const UserPageLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { logout } = useAuth(); 


  const handleLogout = () => {
    logout(); // Call the context logout function
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm sticky top-0 z-10"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            My Account
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <FiLogOut />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

export default UserPageLayout;