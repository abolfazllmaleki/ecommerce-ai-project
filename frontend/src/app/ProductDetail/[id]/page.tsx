'use client';

import { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useParams } from 'next/navigation'; // ✅ Correct Next.js App Router import
import DynamicColor from '@/app/components/dynamicColor/DynamicColor';
import StarRating from '@/app/components/StarRating/StarRating';
import DynamicCounter from '@/app/components/DynamicCounter/DynamicCounter';
import DynamicSize from '@/app/components/DynamicSize/DynamicSize';
import ImageGallery from '@/app/components/ImageGallery/ImageGallery';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '@/app/components/LoadingSpinner/LoadingSpinner';
import { useCart } from '@/app/context/CartContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  category: string;
  sku: string;
  discount?: number;
  originalPrice?: number;
}

export default function ProductPage() {
  const { id } = useParams(); // ✅ Correct way to get the dynamic route param
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, updateUser } = useAuth();
  const { addToCart } = useCart();
  console.log(id)

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;

    try {
      await addToCart(product);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const incrementViews = async () => {
    try {
      await fetch(`/api/products/${id}/increment/view`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  useEffect(() => {
    const checkWishlistStatus = () => {
      if (!user || !product) {
        setIsFavorite(false);
        return;
      }

      const wishList = user.wishList || [];
      const productId = product._id?.toString();

      const isInWishlist = wishList.some((item) => item?._id?.toString() === productId);

      setIsFavorite(isInWishlist);
    };

    checkWishlistStatus();
  }, [user, product]);

  const handleWishlist = async () => {
    if (!user || !product) return;

    try {
      const endpoint = isFavorite ? 'remove' : 'add';
      setIsFavorite((prev) => !prev); // Optimistic UI update

      const response = await fetch(`/api/users/me/wishlist/${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const updatedUser = await response.json();
      updateUser({
        ...updatedUser,
        wishList: updatedUser.wishList || [],
      });
    } catch (error) {
      console.error('Error:', error);
      setIsFavorite((prev) => !prev); // Revert on error
      alert(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
        setSelectedColor(data.colors[0] || '');
        setSelectedSize(data.sizes[0] || '');
        await incrementViews();
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <LoadingSpinner />;;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <ImageGallery images={product.images} />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Product Title */}
          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>

          {/* Rating and Stock Status */}
          <div className="flex items-center gap-4">
            {user && (
              <StarRating
                userId={user._id}
                productId={product?._id || ''}
                initialRating={product?.rating || 0}
                onRatingUpdate={(newRating) => setProduct({ ...product, rating: newRating })}
              />
            )}
            <span className="text-gray-500">({product.reviewsCount} reviews)</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
            {product.discount && (
              <span className="text-gray-400 line-through ml-2 text-xl">
                ${product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Color Picker */}
          <DynamicColor
            colors={product.colors}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

          {/* Size Picker */}
          <DynamicSize
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
          />

          {/* Add to Cart and Wishlist */}
          <div className="flex gap-4 items-center">
            <DynamicCounter />
            <button
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              onClick={handleWishlist}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition duration-300"
            >
              <FaHeart className={isFavorite ? 'text-red-500' : 'text-gray-400'} size={24} />
            </button>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* Additional Details */}
          <div className="text-sm space-y-2 text-gray-600">
            <p>
              <span className="font-semibold">SKU:</span> {product.sku}
            </p>
            <p>
              <span className="font-semibold">Category:</span> {product.category}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}