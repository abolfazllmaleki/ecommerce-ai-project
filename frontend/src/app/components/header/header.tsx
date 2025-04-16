"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";

export default function Header() {
  const { cart } = useCart();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Logo and Navigation Links - Grouped together */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link 
              href="/" 
              className="text-xl font-bold text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              My Store
            </Link>

            {/* Navigation Links */}
            <nav className="hidden sm:flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-red-500 transition-colors duration-200"
              >
                Home
              </Link>
              <Link 
                href="/search" 
                className="text-gray-700 hover:text-red-500 transition-colors duration-200"
              >
                Search
              </Link>
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-red-500 transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="text-gray-700 hover:text-red-500 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </nav>
          </div>

          {/* Search Bar and User Icons - Grouped together */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 transition-all duration-200"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FaSearch />
              </button>
            </form>

            {/* User & Cart Icons */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/useraccount" 
                className="text-gray-700 hover:text-red-500 transition-colors duration-200"
              >
                <FaUser className="w-6 h-6" />
              </Link>
              <Link 
                href="/cart" 
                className="relative text-gray-700 hover:text-red-500 transition-colors duration-200"
              >
                <FaShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-200">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}