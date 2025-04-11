'use client'
import { useEffect, useState } from 'react';
import ItemCard from '../ItemCard/ItemCard';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface Product {
  _id: string;
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
        const response = await fetch('http://localhost:3000/products/top-rated?limit=12');
        
        if (!response.ok) {
          throw new Error('خطا در دریافت محصولات');
        }
        
        const data = await response.json();
        setProducts(data.slice(0, 10)); // Get top 6 rated products
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold text-center mb-8">TOP PRODUCTS</h2>
      <div className="flex overflow-x-auto gap-6 px-4">
        {products.map((product) => (
          <ItemCard
            key={product._id}
            id={product._id}
            image={product.images?.[0] || '/placeholder.jpg'}
            name={product.name}
            currentPrice={product.price}
            originalPrice={product.discount ? Math.round(product.price / (1 - product.discount / 100)) : undefined}
            label={product.discount ? 'Sales' : undefined}
            rating={product.rating}
            reviews={product.numberOfReviews}
          />
        ))}
      </div>
    </section>
  );
}