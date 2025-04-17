// 'use client';

// import { useState, useEffect } from 'react';
// import { FaHeart, FaTruck, FaShieldAlt, FaRedoAlt } from 'react-icons/fa';
// import DynamicColor from '@/app/components/dynamicColor/DynamicColor';
// import StarRating from '@/app/components/StarRating/StarRating';
// import DynamicCounter from '@/app/components/DynamicCounter/DynamicCounter';
// import DynamicSize from '@/app/components/DynamicSize/DynamicSize';
// import ImageGallery from '@/app/components/ImageGallery/ImageGallery';
// import { useAuth } from '@/app/context/AuthContext';
// import { useCart } from '@/app/context/CartContext';
// import LoadingSpinner from '@/app/components/LoadingSpinner/LoadingSpinner';

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   images: string[];
//   colors: string[];
//   sizes: string[];
//   rating: number;
//   reviewsCount: number;
//   stock: number;
//   category: string;
//   sku: string;
//   discount?: number;
//   originalPrice?: number;
// }

// export default function ProductDetailClient({ initialProduct }: { initialProduct: Product }) {
//   const [product, setProduct] = useState<Product>(initialProduct);
//   const [selectedColor, setSelectedColor] = useState(initialProduct.colors[0] || '');
//   const [selectedSize, setSelectedSize] = useState(initialProduct.sizes[0] || '');
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const { user, updateUser } = useAuth();
//   const { addToCart } = useCart();

//   const showError = (message: string) => {
//     setError(message);
//     setTimeout(() => setError(null), 5000);
//   };

//   const showSuccess = (message: string) => {
//     setSuccess(message);
//     setTimeout(() => setSuccess(null), 5000);
//   };

//   const handleAddToCart = async () => {
//     if (!product || product.stock <= 0) return;

//     try {
//       setLoading(true);
//       await addToCart({ ...product, quantity, selectedColor, selectedSize });
//       showSuccess('Added to cart successfully!');
//     } catch (error) {
//       showError('Failed to add to cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const incrementViews = async () => {
//     try {
//       await fetch(`/api/products/${product._id}/increment/view`, {
//         method: 'PATCH',
//       });
//     } catch (error) {
//       console.error('Failed to increment views:', error);
//     }
//   };

//   useEffect(() => {
//     const checkWishlistStatus = () => {
//       if (!user || !product) {
//         setIsFavorite(false);
//         return;
//       }

//       const wishList = user.wishList || [];
//       const productId = product._id?.toString();

//       const isInWishlist = wishList.some((item) => item?._id?.toString() === productId);

//       setIsFavorite(isInWishlist);
//     };

//     checkWishlistStatus();
//     incrementViews();
//   }, [user, product]);

//   const handleWishlist = async () => {
//     if (!user || !product) return;

//     try {
//       const endpoint = isFavorite ? 'remove' : 'add';
//       setIsFavorite((prev) => !prev);

//       const response = await fetch(`/api/users/me/wishlist/${endpoint}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({ productId: product._id }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }

//       const updatedUser = await response.json();
//       updateUser({
//         ...updatedUser,
//         wishList: updatedUser.wishList || [],
//       });
//     } catch (error) {
//       console.error('Error:', error);
//       setIsFavorite((prev) => !prev);
//       showError(error instanceof Error ? error.message : 'Unknown error');
//     }
//   };

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h2>
//           <p className="text-gray-500">The product you're looking for doesn't exist</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* Success/Error Toasts */}
//       {error && (
//         <div className="animate-fade-in-up bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3 shadow-lg mb-6">
//           <div className="flex-1">
//             <p className="text-red-700 font-medium">{error}</p>
//           </div>
//           <button 
//             onClick={() => setError(null)}
//             className="text-red-500 hover:text-red-700"
//           >
//             &times;
//           </button>
//         </div>
//       )}

//       {success && (
//         <div className="animate-fade-in-up bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3 shadow-lg mb-6">
//           <div className="flex-1">
//             <p className="text-green-700 font-medium">{success}</p>
//           </div>
//           <button 
//             onClick={() => setSuccess(null)}
//             className="text-green-500 hover:text-green-700"
//           >
//             &times;
//           </button>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//         {/* Image Gallery */}
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
//           <ImageGallery images={product.images} />
//         </div>

//         {/* Product Details */}
//         <div className="space-y-6">
//           {/* Product Header */}
//           <div className="pb-2 border-b border-gray-100">
//             <span className="text-sm font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">
//               {product.category}
//             </span>
//             <h1 className="text-4xl font-bold text-gray-900 mt-3">{product.name}</h1>
            
//             <div className="flex items-center gap-4 mt-4">
//               <div className="flex items-center">
//                 <StarRating
//                   userId={user?._id || ''}
//                   productId={product._id}
//                   initialRating={product.rating}
//                   onRatingUpdate={(newRating) => setProduct({ ...product, rating: newRating })}
//                 />
//                 <span className="ml-2 text-gray-500 text-sm">({product.reviewsCount})</span>
//               </div>
//               <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
//                 product.stock > 0 
//                   ? 'bg-green-100 text-green-800' 
//                   : 'bg-gray-100 text-gray-800'
//               }`}>
//                 {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
//               </span>
//             </div>
//           </div>

//           {/* Price Section */}
//           <div className="py-4 border-b border-gray-100">
//             <div className="flex items-baseline gap-3">
//               <span className="text-3xl font-bold text-gray-900">
//                 ${product.price.toFixed(2)}
//               </span>
//               {product.discount && (
//                 <>
//                   <span className="text-xl text-gray-400 line-through">
//                     ${product.originalPrice?.toFixed(2)}
//                   </span>
//                   <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">
//                     {product.discount}% OFF
//                   </span>
//                 </>
//               )}
//             </div>
//             <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
//               <FaTruck className="text-gray-400" />
//               Free shipping on orders over $50
//             </p>
//           </div>

//           {/* Description */}
//           <div className="prose max-w-none text-gray-600">
//             <p>{product.description}</p>
//           </div>

//           {/* Color Picker */}
//           <div className="pt-2">
//             <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
//             <DynamicColor
//               colors={product.colors}
//               selectedColor={selectedColor}
//               onColorChange={setSelectedColor}
//             />
//           </div>

//           {/* Size Picker */}
//           <div className="pt-2">
//             <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
//             <DynamicSize
//               sizes={product.sizes}
//               selectedSize={selectedSize}
//               onSizeChange={setSelectedSize}
//             />
//           </div>

//           {/* Quantity and Add to Cart */}
//           <div className="pt-4">
//             <div className="flex items-center gap-4">
//               <DynamicCounter 
//               />
//               <button
//                 onClick={handleAddToCart}
//                 disabled={product.stock <= 0 || loading}
//                 className={`flex-1 px-6 py-4 rounded-xl font-bold text-white transition-all duration-300 ${
//                   product.stock > 0 && !loading
//                     ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl'
//                     : 'bg-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <LoadingSpinner />
//                     Adding...
//                   </span>
//                 ) : product.stock > 0 ? (
//                   'Add to Cart'
//                 ) : (
//                   'Out of Stock'
//                 )}
//               </button>
//               <button
//                 onClick={handleWishlist}
//                 className={`p-4 rounded-full border transition-all duration-300 ${
//                   isFavorite
//                     ? 'bg-red-50 border-red-100 text-red-500'
//                     : 'border-gray-200 hover:bg-gray-50 text-gray-400'
//                 }`}
//               >
//                 <FaHeart className={isFavorite ? 'fill-current' : ''} />
//               </button>
//             </div>
//           </div>

//           {/* Trust Badges */}
//           <div className="grid grid-cols-2 gap-3 pt-6">
//             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//               <FaShieldAlt className="text-gray-500 flex-shrink-0" />
//               <span className="text-sm text-gray-600">1-Year Warranty</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//               <FaRedoAlt className="text-gray-500 flex-shrink-0" />
//               <span className="text-sm text-gray-600">30-Day Returns</span>
//             </div>
//           </div>

//           {/* Product Details */}
//           <div className="pt-6">
//             <h3 className="text-sm font-medium text-gray-900 mb-3">Product Details</h3>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <p className="text-gray-500">SKU</p>
//                 <p className="font-medium">{product.sku}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Category</p>
//                 <p className="font-medium capitalize">{product.category}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Custom Animation CSS */}
//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in-up {
//           animation: fadeInUp 0.3s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }