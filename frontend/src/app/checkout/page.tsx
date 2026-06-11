'use client';
import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { FiLock, FiCreditCard, FiTruck, FiCheckCircle, FiAlertCircle, FiHome } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    companyName: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
    email: user?.email || '',
    paymentMethod: 'visa',
  });

  const shippingCost = total >= 100 ? 0 : 15;
  const orderTotal = total + shippingCost;

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccessAndRedirect = (message: string) => {
    setSuccess(message);
    setShowSuccessModal(true);
    
    // Redirect to home page after 5 seconds
    setTimeout(() => {
      router.push('/');
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare products array in the format expected by the backend
      const products = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name
      }));

      // Prepare order data matching the CreateOrderDto interface
      const orderData = {
        userId: user?.id,
        products:products,
        totalPrice: orderTotal,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName,
          streetAddress: formData.streetAddress,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        contactInfo: {
          phone: formData.phone,
          email: formData.email
        },
        paymentMethod: formData.paymentMethod
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to place order (${response.status})`);
      }
      
      const result = await response.json();
      
      showSuccessAndRedirect('Payment successful! Your order has been placed.');
      clearCart();
    } catch (error: any) {
      console.error('Error placing order:', error);
      showError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImmediateRedirect = () => {
    setShowSuccessModal(false);
    router.push('/');
  };


  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="text-green-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. You will be redirected to the home page shortly.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleImmediateRedirect}
                className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <FiHome className="text-lg" />
                Go to Home Now
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-500 hover:text-gray-700 py-2"
              >
                Stay on this page
              </button>
            </div>
            <div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-5000 ease-linear"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            Secure Checkout
          </h1>
          <p className="text-gray-500">Complete your purchase with confidence</p>
        </div>
      </div>

      {/* Status Toasts */}
     {error && (
        <div className="animate-fade-in-up bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3 shadow-lg mb-6">
          <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            &times;
          </button>
        </div>
      )}

      {success && !showSuccessModal && (
        <div className="animate-fade-in-up bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3 shadow-lg mb-6">
          <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
          <button 
            onClick={() => setSuccess(null)}
            className="text-green-500 hover:text-green-700"
          >
            &times;
          </button>
        </div>
      )}

      {success && (
        <div className="animate-fade-in-up bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3 shadow-lg mb-6">
          <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
          <button 
            onClick={() => setSuccess(null)}
            className="text-green-500 hover:text-green-700"
          >
            &times;
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
        {/* Billing Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiLock className="text-red-500" />
                <span>Billing Details</span>
              </h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2 font-medium">Email Address*</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2 font-medium">Company Name (Optional)</label>
                <input
                  type="text"
                  name="companyName"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2 font-medium">Street Address*</label>
                <input
                  type="text"
                  name="streetAddress"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2 font-medium">Apartment, floor, etc. (optional)</label>
                <input
                  type="text"
                  name="apartment"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.apartment}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">City*</label>
                <input
                  type="text"
                  name="city"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">State/Province</label>
                <input
                  type="text"
                  name="state"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Country</label>
                <select
                  name="country"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiCreditCard className="text-red-500" />
                <span>Payment Method</span>
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              {[
                { id: 'visa', name: 'Credit/Debit Card', icon: <FiCreditCard /> },
                { id: 'mastercard', name: 'Mastercard', icon: <FiCreditCard /> },
                { id: 'paypal', name: 'PayPal', icon: <FiCreditCard /> },
                { id: 'cash_on_delivery', name: 'Cash on Delivery', icon: <FiTruck /> }
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${
                    formData.paymentMethod === method.id
                      ? 'border-red-500 bg-red-50 shadow-xs'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={handleInputChange}
                    className="form-radio h-5 w-5 text-red-500"
                  />
                  <div className="flex items-center gap-3 ml-3 text-gray-700">
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                  </div>
                </label>
              ))}
              
              {formData.paymentMethod === 'visa' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2 font-medium">Card Number*</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Expiry Date*</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">CVV*</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2 font-medium">Cardholder Name*</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
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
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
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
              
              <div className="space-y-3 pt-4 border-t border-gray-200">
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
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className={`w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold transition-all shadow-sm flex items-center justify-center ${
                isSubmitting || cart.length === 0
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:from-red-600 hover:to-red-700 hover:shadow-md'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                cart.length === 0 ? 'Cart is empty' : 'Place Order'
              )}
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm">
              <FiLock className="flex-shrink-0" />
              <span>Secure payment. Your data is encrypted.</span>
            </div>
          </div>
        </div>
      </form>

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
};

export default CheckoutPage;