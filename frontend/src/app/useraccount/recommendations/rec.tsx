"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import ItemCard from "@/app/components/ItemCard/ItemCard";

interface Product {
  _id: string;
  name: string;
  image?: string;
  currentPrice: number;
  originalPrice?: number;
  category: string;
  views: number;
}

const Recommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?._id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        // Step 1: Fetch the list of recommended product IDs
        const response = await fetch(`http://localhost:8000/recommend/${user._id}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
        }

        const productIds: string[] = await response.json();

        if (productIds.length === 0) {
          setError("No recommended products available");
          setLoading(false);
          return;
        }

        // Step 2: Fetch product details for each product ID
        const productDetails = await Promise.all(
          productIds.map(async (id) => {
            const productResponse = await fetch(`http://localhost:3000/products/${id}`);
            if (!productResponse.ok) {
              throw new Error(`Failed to fetch product details for ID: ${id}`);
            }
            const productData: Product = await productResponse.json();
            return productData;
          })
        );

        setRecommendations(productDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user?._id]);

  if (loading) return <div className="text-center py-8">Loading recommendations...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (recommendations.length === 0) return <div className="text-gray-500 text-center py-8">No recommendations available.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recommendations.map((product) => (
        <ItemCard
          key={product._id}
          id={product._id}
          image={product.images[0]}
          name={product.name}
          currentPrice={product.price}
          originalPrice={product.price}
          label={product.views > 100 ? "HOT" : "NEW"}
          rating={4.5} // Fetch real rating if available
          reviews={Math.floor(Math.random() * 100)}
        />
      ))}
    </div>
  );
};

export default Recommendations;
