// app/components/orders/orders.tsx
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle,
  FiEye,
  FiCalendar,
  FiDollarSign
} from 'react-icons/fi';
import { Order } from '../../types/types';
import { useAuth } from '@/app/context/AuthContext';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`;

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Use the auth context to get user information
  const { user, token } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      if (!user || !user._id) {
        setError('User not authenticated');
        return;
      }

      const response = await axios.get<Order[]>(`${API_URL}/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const ordersData = response.data;
      setOrders(ordersData);
      applyFilters(ordersData);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (ordersList: Order[]) => {
    let filtered = [...ordersList];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    applyFilters(orders);
  }, [orders, statusFilter]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FiClock className="text-yellow-500" />;
      case 'processing': return <FiPackage className="text-blue-500" />;
      case 'shipped': return <FiTruck className="text-indigo-500" />;
      case 'delivered': return <FiCheckCircle className="text-green-500" />;
      case 'cancelled': return <FiXCircle className="text-red-500" />;
      default: return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'visa': return 'Visa';
      case 'mastercard': return 'Mastercard';
      case 'paypal': return 'PayPal';
      case 'cash_on_delivery': return 'Cash on Delivery';
      default: return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
          <p className="text-gray-500">View your order history and track shipments</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 shadow-xs transition-all hover:shadow-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
          <div className="flex-1">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            &times;
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-2 text-gray-500">
            {statusFilter === 'all' 
              ? "You haven't placed any orders yet." 
              : `You don't have any ${statusFilter} orders.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-500">Order #:</span>
                      <span className="font-mono">{order._id.substring(0, 8)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-gray-400" />
                      <span className="text-sm text-gray-500">{formatDate(order.orderDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Products</h4>
                    <ul className="text-sm text-gray-600">
                      {order.products.slice(0, 3).map((product, index) => (
                        <li key={index} className="truncate">
                          {product.quantity} × {product.name}
                        </li>
                      ))}
                      {order.products.length > 3 && (
                        <li className="text-gray-500">+{order.products.length - 3} more items</li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                    <div className="text-sm text-gray-600">
                      <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                      <p>{order.shippingAddress.streetAddress}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Order Total</h4>
                    <div className="flex items-baseline gap-1">
                      <FiDollarSign className="text-gray-500" />
                      <span className="text-xl font-bold text-gray-800">{order.totalPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{order.products.length} items</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
                  >
                    <FiEye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0">
              <h3 className="font-semibold text-gray-800 text-lg">Order Details</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Order ID:</span> #{selectedOrder._id}</p>
                    <p><span className="font-medium">Date:</span> {formatDate(selectedOrder.orderDate)}</p>
                    <p>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Payment:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                      </span>
                    </p>
                    <p><span className="font-medium">Payment Method:</span> {getPaymentMethodText(selectedOrder.paymentMethod)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Subtotal:</span> ${(selectedOrder.totalPrice * 0.9).toFixed(2)}</p>
                    <p><span className="font-medium">Tax:</span> ${(selectedOrder.totalPrice * 0.1).toFixed(2)}</p>
                    <p className="font-medium text-lg"><span className="font-medium">Total:</span> ${selectedOrder.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Shipping Address</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p className="font-medium">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                  {selectedOrder.shippingAddress.companyName && (
                    <p>{selectedOrder.shippingAddress.companyName}</p>
                  )}
                  <p>{selectedOrder.shippingAddress.streetAddress}</p>
                  {selectedOrder.shippingAddress.apartment && (
                    <p>{selectedOrder.shippingAddress.apartment}</p>
                  )}
                  <p>
                    {selectedOrder.shippingAddress.city}, 
                    {selectedOrder.shippingAddress.state && ` ${selectedOrder.shippingAddress.state},`}
                    {selectedOrder.shippingAddress.postalCode && ` ${selectedOrder.shippingAddress.postalCode}`}
                  </p>
                  {selectedOrder.shippingAddress.country && (
                    <p>{selectedOrder.shippingAddress.country}</p>
                  )}
                </div>
              </div>
              
              {/* Contact Information */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Contact Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p><span className="font-medium">Email:</span> {selectedOrder.contactInfo.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.contactInfo.phone}</p>
                </div>
              </div>
              
              {/* Products */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Products ({selectedOrder.products.length})</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">Product</th>
                        <th className="px-4 py-2 text-right font-medium">Price</th>
                        <th className="px-4 py-2 text-right font-medium">Quantity</th>
                        <th className="px-4 py-2 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.products.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-gray-500 text-xs">ID: {product.productId.substring(0, 8)}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">${product.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{product.quantity}</td>
                          <td className="px-4 py-3 text-right font-medium">
                            ${(product.price * product.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;