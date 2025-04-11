'use client';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { cart, total, loading, updateQuantity, removeItem } = useCart();
  const router = useRouter(); // Use Next.js router for navigation

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading cart...
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          Your cart is empty 🛒
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center border-b py-6"
              >
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                />
                <div className="ml-6 flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center mt-4">
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      className="px-3 py-1 border rounded-l bg-gray-100 hover:bg-gray-200 transition"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 border-t border-b text-gray-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      className="px-3 py-1 border rounded-r bg-gray-100 hover:bg-gray-200 transition"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
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
                  <span className="text-gray-800 font-semibold">$15.00</span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="text-gray-800 font-bold">Total:</span>
                  <span className="text-gray-800 font-bold">
                    ${(total + 15).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')} // Navigate to checkout page
                className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;