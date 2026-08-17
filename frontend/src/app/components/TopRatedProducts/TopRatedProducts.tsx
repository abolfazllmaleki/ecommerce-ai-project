'use client'
import { useEffect, useState } from 'react';
import ItemCard from '../ItemCard/ItemCard';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { FaCrown, FaStar } from 'react-icons/fa';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  rating: number;
  numberOfReviews: number;
  images: string[];
  discount?: number;
}

export default function TopRatedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/top-rated?limit=12`);
        
        if (!response.ok) {
          throw new Error('Error fetching top products');
        }
        
        const data = await response.json();
        setProducts(data.slice(0, 10));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner  />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="my-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Premium Section Header - Now with Red Crown */}
        <div className="text-center mb-12 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-red-400 opacity-20">
            <FaCrown size={80} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 relative z-10">
            TOP RATED PRODUCTS
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Customer favorites with exceptional ratings
          </p>
          <div className="mt-4 flex justify-center">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 mx-1" />
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="relative">
          {/* Scrollable Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product, index) => (
              <div 
                key={product.id ?? product._id}
                className={`relative ${index < 3 ? 'order-first' : ''}`}
              >
                {index < 3 && (
                  <div className="absolute -top-3 -left-3 z-20 bg-red-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>
                )}
                <ItemCard
                  id={product.id ?? product._id}
                  image={product.images?.[0] || '/placeholder.jpg'}
                  name={product.name}
                  currentPrice={product.price}
                  originalPrice={product.discount ? Math.round(product.price / (1 - product.discount / 100)) : undefined}
                  label={index < 3 ? 'BESTSELLER' : product.discount ? 'SALE' : undefined}
                  rating={product.rating}
                  reviews={product.numberOfReviews}
                />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button - Now in Red */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-700 transition-colors duration-200">
            View All Top Products
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}