'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiRefreshCw, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiTruck,
  FiDollarSign,
  FiCalendar,
  FiMapPin,
  FiX,
  FiEye,
  FiPackage,
  FiFilter,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { Order } from '../../types/types';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`;

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  // Filter and sort states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('orderDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Order[]>(API_URL);
      const ordersData = response.data;
      setOrders(ordersData);
      applyFiltersAndSorting(ordersData);
      
      setStats({
        total: ordersData.length,
        pending: ordersData.filter(o => o.status === 'pending').length,
        processing: ordersData.filter(o => o.status === 'processing').length,
        shipped: ordersData.filter(o => o.status === 'shipped').length,
        delivered: ordersData.filter(o => o.status === 'delivered').length,
        cancelled: ordersData.filter(o => o.status === 'cancelled').length
      });
      
      showSuccess('Orders loaded successfully');
    } catch (err) {
      showError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSorting = (ordersList: Order[]) => {
    let filtered = [...ordersList];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply payment status filter
    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentStatusFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(query) ||
        order.shippingAddress.firstName.toLowerCase().includes(query) ||
        order.shippingAddress.lastName.toLowerCase().includes(query) ||
        order.contactInfo.email.toLowerCase().includes(query) ||
        order.products.some(p => p.name.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'totalPrice':
          aValue = a.totalPrice;
          bValue = b.totalPrice;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'customer':
          aValue = `${a.shippingAddress.firstName} ${a.shippingAddress.lastName}`;
          bValue = `${b.shippingAddress.firstName} ${b.shippingAddress.lastName}`;
          break;
        default:
          aValue = new Date(a.orderDate).getTime();
          bValue = new Date(b.orderDate).getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? (aValue as number) - (bValue as number) 
          : (bValue as number) - (aValue as number);
      }
    });
    
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting(orders);
  }, [orders, statusFilter, paymentStatusFilter, sortField, sortDirection, searchQuery]);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const response = await axios.put<Order>(
        `${API_URL}/${orderId}/status`,
        { status }
      );
      setOrders(prev => prev.map(o => o._id === orderId ? response.data : o));
      showSuccess('Order status updated successfully');
    } catch (err) {
      showError('Failed to update order status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const response = await axios.put<Order>(
        `${API_URL}/${orderId}/payment-status`,
        { paymentStatus }
      );
      setOrders(prev => prev.map(o => o._id === orderId ? response.data : o));
      showSuccess('Payment status updated successfully');
    } catch (err) {
      showError('Failed to update payment status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await axios.delete(`${API_URL}/${orderId}`);
      setOrders(prev => prev.filter(o => o._id !== orderId));
      showSuccess('Order deleted successfully');
    } catch (err) {
      showError('Failed to delete order');
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
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

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <FiChevronDown className="opacity-30" />;
    return sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Orders Management</h2>
          <p className="text-gray-500 text-sm">Manage and track all customer orders</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 shadow-xs transition-all hover:shadow-sm"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Payment Statuses</option>
              <option value="pending">Payment Pending</option>
              <option value="completed">Payment Completed</option>
              <option value="failed">Payment Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <FiCalendar className="text-gray-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-white p-5 rounded-xl border border-yellow-100 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold mt-1">{stats.pending}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiAlertCircle className="text-yellow-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Processing</p>
              <h3 className="text-2xl font-bold mt-1">{stats.processing}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiRefreshCw className="text-blue-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Shipped</p>
              <h3 className="text-2xl font-bold mt-1">{stats.shipped}</h3>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FiTruck className="text-indigo-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <h3 className="text-2xl font-bold mt-1">{stats.delivered}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCheckCircle className="text-green-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-white p-5 rounded-xl border border-red-100 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Cancelled</p>
              <h3 className="text-2xl font-bold mt-1">{stats.cancelled}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FiAlertCircle className="text-red-500 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="animate-fade-in-up bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3 shadow-lg">
          <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            &times;
          </button>
        </div>
      )}

      {success && (
        <div className="animate-fade-in-up bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3 shadow-lg">
          <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
          <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
            &times;
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800">Order Management</h3>
            <p className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
            {filteredOrders.length} orders
          </span>
        </div>
        <div className="p-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('orderDate')}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        <SortIcon field="orderDate" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('customer')}
                    >
                      <div className="flex items-center gap-1">
                        Customer
                        <SortIcon field="customer" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('totalPrice')}
                    >
                      <div className="flex items-center gap-1">
                        Total
                        <SortIcon field="totalPrice" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        <SortIcon field="status" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewOrder(order)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
                          <div className="text-xs">{order.contactInfo.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.products.length} items
                        <div className="text-xs mt-1">
                          {order.products.slice(0, 2).map(p => p.name).join(', ')}
                          {order.products.length > 2 && '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => handleUpdatePaymentStatus(order._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOrder(order._id);
                          }}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOrder(order);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEye className="inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredOrders.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                  No orders found matching your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0">
              <h3 className="font-semibold text-gray-800 text-lg">Order Details</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <FiCalendar className="text-red-500" />
                    Order Information
                  </h4>
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
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                      </span>
                    </p>
                    <p><span className="font-medium">Payment Method:</span> {getPaymentMethodText(selectedOrder.paymentMethod)}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <FiDollarSign className="text-red-500" />
                    Payment Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Subtotal:</span> ${(selectedOrder.totalPrice * 0.9).toFixed(2)}</p>
                    <p><span className="font-medium">Tax:</span> ${(selectedOrder.totalPrice * 0.1).toFixed(2)}</p>
                    <p className="font-medium text-lg"><span className="font-medium">Total:</span> ${selectedOrder.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <FiMapPin className="text-red-500" />
                  Shipping Address
                </h4>
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
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <FiPackage className="text-red-500" />
                  Products ({selectedOrder.products.length})
                </h4>
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

export default OrdersManagement;