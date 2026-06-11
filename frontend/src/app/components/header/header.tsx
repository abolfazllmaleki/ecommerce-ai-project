"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaTimes, FaTachometerAlt, FaTimesCircle } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const { cart } = useCart();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { token, user } = useAuth();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUserClick = () => {
    if (token) {
      router.push("/useraccount");
    } else {
      router.push("/login");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchInput)}`);
      setSearchInput("");
    }
  };

  return (
    <>
      {/* Admin Banner */}
      {isAdmin && (
        <div className="fixed top-0 left-0 w-full bg-gray-900 text-white z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-red-600 px-2 py-1 rounded-md text-xs font-semibold">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span>ADMIN MODE</span>
                </div>
                <span className="text-xs text-gray-300">Elevated privileges active</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link 
                  href="/manager" 
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <FaTachometerAlt className="w-3 h-3" />
                  <span>Dashboard</span>
                </Link>
                
                <button 
                  onClick={() => router.push("/manager")}
                  className="text-xs text-gray-400 hover:text-white transition-colors duration-200 underline"
                >
                  Manage Store
                </button>
              </div>
            </div>
          </div>
          
          {/* Animated border */}
          <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 animate-pulse"></div>
        </div>
      )}

      {/* Main Header */}
      <header 
        className={`fixed w-full z-40 transition-all duration-300 ${
          scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-md py-2" 
            : "bg-white/95 backdrop-blur-sm py-4 border-b border-gray-100"
        } ${isAdmin ? "mt-9" : "mt-0"}`} // Adjust margin top based on admin banner
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              href="/" 
              className="text-2xl font-bold relative group"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
                My Store
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className={`font-medium transition-colors duration-300 relative group ${
                  scrolled ? "text-gray-700 hover:text-red-500" : "text-gray-800 hover:text-red-500"
                }`}
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/search" 
                className={`font-medium transition-colors duration-300 relative group ${
                  scrolled ? "text-gray-700 hover:text-red-500" : "text-gray-800 hover:text-red-500"
                }`}
              >
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/about" 
                className={`font-medium transition-colors duration-300 relative group ${
                  scrolled ? "text-gray-700 hover:text-red-500" : "text-gray-800 hover:text-red-500"
                }`}
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/contact" 
                className={`font-medium transition-colors duration-300 relative group ${
                  scrolled ? "text-gray-700 hover:text-red-500" : "text-gray-800 hover:text-red-500"
                }`}
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Right Section - Search and Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <form 
                onSubmit={handleSearch} 
                className="relative hidden md:block"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className={`pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm ${
                    scrolled 
                      ? "border border-gray-300 focus:ring-red-300" 
                      : "border border-gray-200 bg-white/80 focus:ring-red-200"
                  }`}
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200"
                >
                  <FaSearch className={scrolled ? "text-gray-500 hover:text-red-500" : "text-gray-600 hover:text-red-500"} />
                </button>
              </form>

              {/* User & Cart Icons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleUserClick}
                  className="transition-colors duration-200 relative group"
                >
                  <FaUser className={`w-5 h-5 ${scrolled ? "text-gray-700 hover:text-red-500" : "text-gray-800 hover:text-red-500"}`} />
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-4"></span>
                </button>
                
                <Link 
                  href="/cart" 
                  className="relative transition-colors duration-200 group"
                >
                  <FaShoppingCart className={`w-5 h-5 ${scrolled ? "text-gray-700 hover:text-red-500" : "text-gray-800 hover:text-red-500"}`} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110">
                      {totalItems}
                    </span>
                  )}
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-4"></span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden ml-2"
              >
                {isMenuOpen ? (
                  <FaTimes className={`w-5 h-5 ${scrolled ? "text-gray-700" : "text-gray-800"}`} />
                ) : (
                  <FaBars className={`w-5 h-5 ${scrolled ? "text-gray-700" : "text-gray-800"}`} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full py-4 px-6 animate-fade-in-down">
            <div className="flex flex-col space-y-4">
              {/* Admin section in mobile menu */}
              {isAdmin && (
                <div className="bg-gray-900 text-white p-3 rounded-lg mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="bg-red-600 px-2 py-1 rounded text-xs font-semibold">
                        ADMIN MODE
                      </div>
                    </div>
                    <Link 
                      href="/manager" 
                      className="flex items-center space-x-1 bg-blue-600 px-2 py-1 rounded text-xs"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaTachometerAlt className="w-3 h-3" />
                      <span>Dashboard</span>
                    </Link>
                  </div>
                </div>
              )}

              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200 shadow-sm"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                >
                  <FaSearch />
                </button>
              </form>
              
              <Link 
                href="/" 
                className="text-gray-700 hover:text-red-500 font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/search" 
                className="text-gray-700 hover:text-red-500 font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-red-500 font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-red-500 font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => {
                    handleUserClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-gray-700 hover:text-red-500 font-medium"
                >
                  <FaUser className="mr-2" />
                  {token ? "Account" : "Sign In"}
                </button>
                
                <Link 
                  href="/cart" 
                  className="flex items-center text-gray-700 hover:text-red-500 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaShoppingCart className="mr-2" />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Animation CSS */}
        <style jsx>{`
          @keyframes fade-in-down {
            0% {
              opacity: 0;
              transform: translateY(-10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.3s ease-out forwards;
          }
        `}</style>
      </header>
    </>
  );
}