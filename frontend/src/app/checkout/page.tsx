'use client';
import { useState } from 'react';
import { CartSummary } from '../components/CartSummary/CartSummary';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

const CheckoutPage = () => {
  const { cart, total } = useCart(); // Get cart details from context
  const { user } = useAuth(); // Get user details from context
  console.log(user?.email)

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '', // Pre-fill with user's first name
    companyName: '',
    streetAddress: '',
    apartment: '',
    city: '',
    phone:'', // Pre-fill with user's phone if available
    email: user?.email || '', // Pre-fill with user's email
    paymentMethod: 'visa',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        ...formData,
        cartItems: cart,
        total,
        userId: user?._id,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to place order');
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
        {/* Billing Details */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-700">Billing Details</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="First Name*"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Company Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Street Address*"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={formData.streetAddress}
              onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
            />
            <input
              type="text"
              placeholder="Apartment, floor, etc. (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={formData.apartment}
              onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
            />
            <input
              type="text"
              placeholder="Town/City*"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone Number*"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email Address*"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Order Summary</h2>

            {/* Cart Items */}
            <div className="mb-6 space-y-4">
              {cart.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-gray-800 font-medium">{item.product.name}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <CartSummary subtotal={total} />

            {/* Payment Method */}
            <div className="mt-6">
              <h3 className="font-bold mb-4 text-gray-700">Payment Method</h3>
              <div className="space-y-3">
                {['bank', 'visa', 'cod'].map((method) => (
                  <label
                    key={method}
                    className="flex items-center p-3 border border-gray-300 rounded-lg hover:border-red-500 transition-colors"
                  >
                    <input
                      type="radio"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={() => setFormData({ ...formData, paymentMethod: method })}
                      className="form-radio h-5 w-5 text-red-500"
                    />
                    <span className="ml-3 text-gray-700 capitalize">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;