'use client'
import ItemCard from '../ItemCard/ItemCard';
import { useState, useEffect } from 'react';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  images: string[];
  price: number;
  originalPrice?: number;
  label?: string;
  rating?: number;
  reviewCount?: number;
}

interface RelatedProductsProps {
  products: any;
  title?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  products, 
  title = "Related Products" 
}) => {
  const [productsArray, setProductsArray] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!products) {
      setIsLoading(false);
      return;
    }

    let processedProducts: Product[] = [];
    
    if (Array.isArray(products)) {
      processedProducts = products;
    } else if (typeof products === 'object' && products !== null) {
      if (products._id || products.id) {
        processedProducts = [products];
      } 
      else if (products.products && Array.isArray(products.products)) {
        processedProducts = products.products;
      }
      else if (products.data && Array.isArray(products.data)) {
        processedProducts = products.data;
      }
    }

    const timer = setTimeout(() => {
      setProductsArray(processedProducts);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [products]);

  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-7 bg-gray-200 rounded w-1/4 mb-6 mx-auto"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-3 h-72">
                  <div className="h-36 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (productsArray.length === 0) {
    return null;
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 relative inline-block">
            {title}
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-red-500 rounded-full"></span>
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Discover more items that complement your selection
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productsArray.map((product) => (
              <div key={product.id ?? product._id} className="transform transition-all duration-300 hover:-translate-y-1">
                <ItemCard
                  id={product.id ?? product._id}
                  image={product.images?.[0] || '/placeholder-image.jpg'}
                  name={product.name}
                  currentPrice={product.price}
                  originalPrice={product.originalPrice}
                  label={product.label}
                  rating={product.rating}
                  reviews={product.reviewCount}
                //   compact={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;