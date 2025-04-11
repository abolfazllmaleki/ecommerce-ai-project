// components/WishList/WishList.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import ItemCard from '../ItemCard/ItemCard';
import { FiHeart, FiTrash2 } from 'react-icons/fi';

const WishList = () => {
  const { user, token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/me/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch wishlist');
        setWishlist(await response.json());
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    };

    user && token && fetchWishlist();
  }, [user, token]);

  const handleRemove = async (productId: string) => {
    try {
      await fetch('http://localhost:3000/users/me/wishlist/remove', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      setWishlist(wishlist.filter((item: any) => item._id !== productId));
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading wishlist...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-red-100 rounded-full">
          <FiHeart className="text-2xl text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">My Wishlist</h2>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FiHeart className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-lg">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product: any) => (
            <ItemCard
              key={product._id}
              id={product._id}
              image={product.images[0]}
              name={product.name}
              currentPrice={product.price}
              originalPrice={product.originalPrice}
              label={product.label}
              rating={product.rating}
              reviews={product.reviewsCount}
              actions={
                <button
                  className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-600 z-10 bg-white rounded-full shadow-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(product._id);
                  }}
                >
                  <FiTrash2 className="text-xl" />
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;