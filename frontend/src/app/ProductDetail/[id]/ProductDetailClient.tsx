'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaTruck, FaShieldAlt, FaRedoAlt } from 'react-icons/fa';
import DynamicColor from '@/app/components/dynamicColor/DynamicColor';
import StarRating from '@/app/components/StarRating/StarRating';
import DynamicCounter from '@/app/components/DynamicCounter/DynamicCounter';
import DynamicSize from '@/app/components/DynamicSize/DynamicSize';
import ImageGallery from '@/app/components/ImageGallery/ImageGallery';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import LoadingSpinner from '@/app/components/LoadingSpinner/LoadingSpinner';
import ProductDescription from '@/app/components/productDescription/ProductDescription';

interface Product {
  _id: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  tags:string[];
  numberOfReviews: number;
  stock: number;
  categoryId: any;
  adminNote: string;
  brand: string;
  discount?: number;
  originalPrice?: number;
  details?: Array<{key: string, value: string}>;
}

export default function ProductDetailClient({ initialProduct }: { initialProduct: Product }) {
  const [product, setProduct] = useState<Product>({
    ...initialProduct,
    _id: initialProduct._id || initialProduct.id || '',
  });
  const [selectedColor, setSelectedColor] = useState(initialProduct.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(initialProduct.sizes[0] || '');
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const { addToCart } = useCart();
  console.log(initialProduct)

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;

    try {
      setLoading(true);
      await addToCart({ ...product, quantity, selectedColor, selectedSize });
      showSuccess('Added to cart successfully!');
    } catch (error) {
      showError('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await fetch(`/api/products/${product._id}/increment/view`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  useEffect(() => {
const checkWishlistStatus = () => {
  if (!user || !product?.id) {
    setIsFavorite(false);
    return;
  }

  const isInWishlist = user.wishList?.some(
    item => item?.id === product.id,
  ) ?? false;

  setIsFavorite(isInWishlist);
};

    checkWishlistStatus();
    incrementViews();
  }, [user, product]);

  const handleWishlist = async () => {
    if (!user || !product) return;

    try {
      const endpoint = isFavorite ? 'remove' : 'add';
      setIsFavorite((prev) => !prev);

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
      setIsFavorite((prev) => !prev);
      showError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h2>
          <p className="text-gray-500">The product you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success/Error Toasts */}
      {error && (
        <div className="animate-fade-in-up bg-red-50 border-l-4 border-red-500 p-3 rounded-lg flex items-start gap-2 shadow-md mb-4">
          <div className="flex-1">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 text-lg"
          >
            &times;
          </button>
        </div>
      )}

      {success && (
        <div className="animate-fade-in-up bg-green-50 border-l-4 border-green-500 p-3 rounded-lg flex items-start gap-2 shadow-md mb-4">
          <div className="flex-1">
            <p className="text-green-700 text-sm font-medium">{success}</p>
          </div>
          <button 
            onClick={() => setSuccess(null)}
            className="text-green-500 hover:text-green-700 text-lg"
          >
            &times;
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <ImageGallery images={product.images}  productName={product.name} />
        </div>

        {/* Product Details */}
        <div className="space-y-5">
          {/* Product Header */}
          <div className="pb-2 border-b border-gray-100">
            <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
              {product.categoryId.name}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center">
                <StarRating
                  userId={user?._id || ''}
                  productId={product._id}
                  initialRating={product.rating}
                  onRatingUpdate={(newRating) => setProduct({ ...product, rating: newRating })}
                />
                <span className="ml-1.5 text-gray-500 text-xs">({product.numberOfReviews})</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>


          {/* Price Section */}

      <div className="py-3 border-b border-gray-100">
        <div className="flex items-baseline gap-2">
          {product.discount && product.discount > 0 ? (
            <>
              {/* Original price calculated from discount */}
              <span className="text-lg text-gray-400 line-through">
                ${((product.price * 100) / (100 - product.discount)).toFixed(2)}
              </span>
              {/* Discounted price */}
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {/* Discount badge */}
              <span className="ml-1.5 bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-xs font-bold">
                {product.discount}% OFF
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {product.adminNote && (
          <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
            <FaTruck className="text-gray-400 text-xs" />
            {product.adminNote}
          </p>
        )}
      </div>


          <div className="mt-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description
                .split(' ')
                .slice(0, 60)
                .join(' ')}
              {product.description.split(' ').length > 60 && '...'}
            </p>
          </div>

          {/* Color Picker */}
          <div className="pt-1">
            <DynamicColor
              colors={product.colors}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
            />
          </div>

          {/* Size Picker */}
          <div className="pt-1">
            <h3 className="text-xs font-medium text-gray-900 mb-2">Size</h3>
            <DynamicSize
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />
          </div>

          {/* Quantity and Add to Cart */}
          <div className="pt-3">
            <div className="flex items-center gap-3">
              <DynamicCounter />
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || loading}
                className={`flex-1 px-5 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                  product.stock > 0 && !loading
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-1.5 text-sm">
                    <LoadingSpinner />
                    Adding...
                  </span>
                ) : product.stock > 0 ? (
                  'Add to Cart'
                ) : (
                  'Out of Stock'
                )}
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-full border transition-all duration-300 ${
                  isFavorite
                    ? 'bg-red-50 border-red-100 text-red-500'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-400'
                }`}
              >
                <FaHeart className={isFavorite ? 'fill-current text-sm' : 'text-sm'} />
              </button>
            </div>
          </div>


<div className="pt-4">
  <p className="text-gray-500 font-semibold mb-2">Tags:</p>
  <div className="flex flex-wrap gap-2">
    {product.tags.map((tag, index) => (
      <span
        key={index}
        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
      >
        {tag}
      </span>
    ))}
  </div>
</div>



          {/* Product Details */}
          <div className="pt-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-500">Brand:</p>
                <p className="font-medium">{product.brand}</p>
              </div>
              <div>
                <p className="text-gray-500">Category:</p>
                <p className="font-medium capitalize">{product?.categoryId?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

 
      <ProductDescription 
  description={product.description} 
  details={product.details} 
/>

      {/* Product Specifications/Details Table */}
      {product.details && product.details.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-100">
                {product.details.map((detail, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                      {detail.key}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {detail.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Custom Animation CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
