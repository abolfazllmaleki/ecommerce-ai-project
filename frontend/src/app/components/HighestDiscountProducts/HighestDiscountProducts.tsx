'use client'
import { useEffect, useState } from 'react';
import ItemCard from '../ItemCard/ItemCard';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

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

export default function HighestDiscountProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/highest-discount?limit=10`);
        
        if (!response.ok) {
          throw new Error('Error fetching products');
        }
        
        const data = await response.json();
        setProducts(data); 
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
      <div className="py-16 flex justify-center">
        <LoadingSpinner />
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
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 relative inline-block">
            <span className="relative z-10">
              BIGGEST DISCOUNTS
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-red-100 z-0 opacity-70"></span>
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't miss these limited-time offers with massive savings
          </p>
        </div>

        {/* Products Grid */}
        <div className="relative">
          {/* Scrollable Container */}
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 hide-scrollbar gap-6">
            {products.map((product) => (
              <div key={product.id ?? product._id} className="flex-none w-64 sm:w-72">
                <ItemCard
                  id={product.id ?? product._id}
                  image={product.images?.[0] || '/placeholder.jpg'}
                  name={product.name}
                  currentPrice={product.price}
                  originalPrice={product.discount ? Math.round(product.price / (1 - product.discount / 100)) : undefined}
                  label={product.discount ? `-${product.discount}%` : 'SALE'}
                  rating={product.rating}
                  reviews={product.numberOfReviews}
                />
              </div>
            ))}
          </div>

          {/* Gradient Fade Effects */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent"></div>
        </div>

        {/* View All Button (optional) */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-700 transition-colors duration-200">
            View All Discounted Items
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}