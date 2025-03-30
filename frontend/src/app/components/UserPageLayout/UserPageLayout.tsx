'use client';
import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';

interface LayoutProps {
  children: ReactNode;
}

const UserPageLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Account</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

export default UserPageLayout;
