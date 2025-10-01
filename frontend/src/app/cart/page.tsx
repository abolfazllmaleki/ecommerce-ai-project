'use client';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { FiMinus, FiPlus, FiTrash2, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';

const CartPage = () => {
  const { cart, total, loading, updateQuantity, removeItem } = useCart();
  const router = useRouter();
  
  const shippingCost = total >= 100 ? 0 : 15;
  const orderTotal = total + shippingCost;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="text-gray-500 text-lg">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            Your Shopping Cart
          </h1>
          <p className="text-gray-500">Review and manage your items</p>
        </div>
        
        {cart.length > 0 && (
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 shadow-xs transition-all hover:shadow-sm"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {cart.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-100 p-12">
          <FiShoppingCart className="w-16 h-16 text-red-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 max-w-md mb-6">
            Looks like you haven't added anything to your cart yet. Start shopping to find amazing products!
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-sm"
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* Cart with Items */}
      {cart.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Cart Items</h3>
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex p-6 transition-all hover:bg-gray-50"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="rounded-lg object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    
                    <div className="ml-6 flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.product.name}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="text-red-500 hover:text-red-700 flex items-center"
                        >
                          <FiTrash2 className="mr-1" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                            className="p-2 rounded-l-md border border-gray-200 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="px-4 py-2 border-t border-b border-gray-200 text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="p-2 rounded-r-md border border-gray-200 hover:bg-gray-100"
                          >
                            <FiPlus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        
                        <p className="text-lg font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-100 shadow-xs p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4 text-gray-700 pb-2 border-b border-gray-200">
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800 font-semibold">
                    ${total.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-800 font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                {total < 100 && shippingCost > 0 && (
                  <div className="text-sm text-gray-500 bg-amber-50 p-2 rounded-lg border border-amber-100">
                    <span className="font-medium">Free shipping</span> on orders over $100
                  </div>
                )}
                
                <div className="flex justify-between border-t border-gray-200 pt-4 mt-2">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-xl font-bold text-red-600">
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => router.push('/checkout')}
                className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                Taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;