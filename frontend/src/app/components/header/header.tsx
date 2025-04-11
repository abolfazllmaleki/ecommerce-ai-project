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

  // Calculate total quantity of items in cart
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
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 hover:text-gray-900">
              My Store
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-4 sm:space-x-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link href="/search" className="text-gray-700 hover:text-gray-900">search</Link>
            <Link href="/login" className="text-gray-700 hover:text-gray-900">login</Link>
            <Link href="/signup" className="text-gray-700 hover:text-gray-900">Sign Up</Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative flex items-center space-x-2">
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <button type="submit" className="absolute right-3">
              <FaSearch className="text-gray-400" />
            </button>
          </form>

          {/* User & Cart Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/useraccount" className="text-gray-700 hover:text-gray-900">
              <FaUser className="w-6 h-6" />
            </Link>
            <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
              <FaShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
