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
  FiChevronUp,
  FiShoppingBag,
  FiSearch,
} from 'react-icons/fi';

import { Order } from '../../types/types';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`;

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  const [statusFilter, setStatusFilter] =
    useState<string>('all');

  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState<string>('all');

  const [sortField, setSortField] =
    useState<string>('orderDate');

  const [sortDirection, setSortDirection] =
    useState<'asc' | 'desc'>('desc');

  const [searchQuery, setSearchQuery] =
    useState<string>('');

  // ==========================================================================
  // Notifications
  // ==========================================================================

  const showError = (message: string) => {
    setError(message);
    setSuccess(null);

    window.setTimeout(() => {
      setError(null);
    }, 4000);
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setError(null);

    window.setTimeout(() => {
      setSuccess(null);
    }, 3500);
  };

  // ==========================================================================
  // Fetch Orders
  // ==========================================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        throw new Error(
          'NEXT_PUBLIC_BACKEND_URL is not configured',
        );
      }

      const response = await axios.get<Order[]>(
        API_URL,
      );

      const ordersData = response.data ?? [];

      setOrders(ordersData);

      setStats({
        total: ordersData.length,

        pending: ordersData.filter(
          (o) => o.status === 'pending',
        ).length,

        processing: ordersData.filter(
          (o) => o.status === 'processing',
        ).length,

        shipped: ordersData.filter(
          (o) => o.status === 'shipped',
        ).length,

        delivered: ordersData.filter(
          (o) => o.status === 'delivered',
        ).length,

        cancelled: ordersData.filter(
          (o) => o.status === 'cancelled',
        ).length,
      });

      showSuccess('Orders loaded successfully');
    } catch (err) {
      showError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              'Failed to fetch orders'
          : err instanceof Error
            ? err.message
            : 'Failed to fetch orders',
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // Filters & Sorting
  // ==========================================================================

  const applyFiltersAndSorting = (
    ordersList: Order[],
  ) => {
    let filtered = [...ordersList];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (order) =>
          order.status === statusFilter,
      );
    }

    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(
        (order) =>
          order.paymentStatus ===
          paymentStatusFilter,
      );
    }

    if (searchQuery.trim()) {
      const query =
        searchQuery.toLowerCase().trim();

      filtered = filtered.filter((order) => {
        const orderId =
          order._id?.toLowerCase() ?? '';

        const firstName =
          order.shippingAddress?.firstName?.toLowerCase() ??
          '';

        const lastName =
          order.shippingAddress?.lastName?.toLowerCase() ??
          '';

        const email =
          order.contactInfo?.email?.toLowerCase() ??
          '';

        const products =
          order.products
            ?.map((p) =>
              p.name?.toLowerCase(),
            )
            .join(' ') ?? '';

        return (
          orderId.includes(query) ||
          firstName.includes(query) ||
          lastName.includes(query) ||
          email.includes(query) ||
          products.includes(query)
        );
      });
    }

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

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
          aValue = new Date(
            a.orderDate,
          ).getTime();

          bValue = new Date(
            b.orderDate,
          ).getTime();
      }

      if (
        typeof aValue === 'string' &&
        typeof bValue === 'string'
      ) {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting(orders);
  }, [
    orders,
    statusFilter,
    paymentStatusFilter,
    sortField,
    sortDirection,
    searchQuery,
  ]);

  // ==========================================================================
  // Update Order Status
  // ==========================================================================

  const handleUpdateStatus = async (
    orderId: string,
    status: string,
  ) => {
    try {
      const response =
        await axios.put<Order>(
          `${API_URL}/${orderId}/status`,
          { status },
        );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? response.data
            : order,
        ),
      );

      setSelectedOrder((prev) =>
        prev?._id === orderId
          ? response.data
          : prev,
      );

      setStats((prev) => {
        const oldOrder = orders.find(
          (order) =>
            order._id === orderId,
        );

        if (!oldOrder) return prev;

        return {
          ...prev,

          pending:
            prev.pending -
            (oldOrder.status === 'pending'
              ? 1
              : 0) +
            (status === 'pending' ? 1 : 0),

          processing:
            prev.processing -
            (oldOrder.status ===
            'processing'
              ? 1
              : 0) +
            (status === 'processing'
              ? 1
              : 0),

          shipped:
            prev.shipped -
            (oldOrder.status === 'shipped'
              ? 1
              : 0) +
            (status === 'shipped' ? 1 : 0),

          delivered:
            prev.delivered -
            (oldOrder.status ===
            'delivered'
              ? 1
              : 0) +
            (status === 'delivered'
              ? 1
              : 0),

          cancelled:
            prev.cancelled -
            (oldOrder.status ===
            'cancelled'
              ? 1
              : 0) +
            (status === 'cancelled'
              ? 1
              : 0),
        };
      });

      showSuccess(
        'Order status updated successfully',
      );
    } catch (err) {
      showError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              'Failed to update order status'
          : 'Failed to update order status',
      );
    }
  };

  // ==========================================================================
  // Update Payment Status
  // ==========================================================================

  const handleUpdatePaymentStatus = async (
    orderId: string,
    paymentStatus: string,
  ) => {
    try {
      const response =
        await axios.put<Order>(
          `${API_URL}/${orderId}/payment-status`,
          { paymentStatus },
        );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? response.data
            : order,
        ),
      );

      setSelectedOrder((prev) =>
        prev?._id === orderId
          ? response.data
          : prev,
      );

      showSuccess(
        'Payment status updated successfully',
      );
    } catch (err) {
      showError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              'Failed to update payment status'
          : 'Failed to update payment status',
      );
    }
  };

  // ==========================================================================
  // Delete Order
  // ==========================================================================

  const handleDeleteOrder = async (
    orderId: string,
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this order?',
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/${orderId}`,
      );

      setOrders((prev) =>
        prev.filter(
          (order) =>
            order._id !== orderId,
        ),
      );

      if (
        selectedOrder?._id === orderId
      ) {
        setSelectedOrder(null);
        setIsModalOpen(false);
      }

      setStats((prev) => ({
        ...prev,
        total: Math.max(
          0,
          prev.total - 1,
        ),
      }));

      showSuccess(
        'Order deleted successfully',
      );
    } catch (err) {
      showError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              'Failed to delete order'
          : 'Failed to delete order',
      );
    }
  };

  // ==========================================================================
  // View Order
  // ==========================================================================

  const handleViewOrder = (
    order: Order,
  ) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // ==========================================================================
  // Sorting
  // ==========================================================================

  const handleSort = (
    field: string,
  ) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === 'asc'
          ? 'desc'
          : 'asc',
      );
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // ==========================================================================
  // Helpers
  // ==========================================================================

  const formatDate = (
    date: Date | undefined,
  ) => {
    if (!date) return 'N/A';

    return new Date(
      date,
    ).toLocaleDateString();
  };

  const getStatusColor = (
    status: string,
  ) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';

      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';

      case 'shipped':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';

      case 'delivered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';

      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';

      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (
    status: string,
  ) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';

      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';

      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';

      case 'refunded':
        return 'bg-purple-100 text-purple-700 border-purple-200';

      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentMethodText = (
    method: string,
  ) => {
    switch (method) {
      case 'visa':
        return 'Visa';

      case 'mastercard':
        return 'Mastercard';

      case 'paypal':
        return 'PayPal';

      case 'cash_on_delivery':
        return 'Cash on Delivery';

      default:
        return method;
    }
  };

  const SortIcon = ({
    field,
  }: {
    field: string;
  }) => {
    if (sortField !== field) {
      return (
        <FiChevronDown className="opacity-30" />
      );
    }

    return sortDirection === 'asc' ? (
      <FiChevronUp />
    ) : (
      <FiChevronDown />
    );
  };

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="min-h-full bg-[#fff7f8] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}

        <header
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-red-100
            bg-white
            px-5
            py-5
            shadow-sm
            md:px-7
            md:py-6
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-52
              w-52
              rounded-full
              bg-red-100/60
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              left-1/3
              h-40
              w-40
              rounded-full
              bg-red-50
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-red-100
                  text-[#DF2648]
                  shadow-sm
                "
              >
                <FiShoppingBag size={22} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Orders Management
                  </h1>

                  <span
                    className="
                      hidden
                      rounded-full
                      bg-red-100
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#DF2648]
                      sm:inline-flex
                    "
                  >
                    Admin
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Manage and track all customer orders
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-100
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-gray-700
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-red-200
                hover:bg-red-50
                hover:text-[#DF2648]
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <FiRefreshCw
                size={16}
                className={
                  loading
                    ? 'animate-spin'
                    : 'transition-transform duration-300 group-hover:rotate-180'
                }
              />

              Refresh
            </button>
          </div>
        </header>

        {/* ================================================================= */}
        {/* NOTIFICATIONS */}
        {/* ================================================================= */}

        {(error || success) && (
          <div
            className={`
              flex
              items-center
              gap-3
              rounded-2xl
              border
              px-4
              py-3.5
              shadow-sm
              animate-fade-in
              ${
                error
                  ? 'border-red-100 bg-red-50 text-red-700'
                  : 'border-emerald-100 bg-emerald-50 text-emerald-700'
              }
            `}
          >
            {error ? (
              <FiAlertCircle
                size={18}
                className="shrink-0"
              />
            ) : (
              <FiCheckCircle
                size={18}
                className="shrink-0"
              />
            )}

            <p className="flex-1 text-sm font-medium">
              {error ?? success}
            </p>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setSuccess(null);
              }}
              className="rounded-lg p-1 transition-colors hover:bg-black/5"
            >
              <FiX size={17} />
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* STATS */}
        {/* ================================================================= */}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">

          <OrderStatCard
            title="Total Orders"
            value={stats.total}
            icon={<FiCalendar size={20} />}
            iconClass="bg-gray-100 text-gray-500"
            cardClass="border-gray-100 hover:border-gray-200"
          />

          <OrderStatCard
            title="Pending"
            value={stats.pending}
            icon={<FiAlertCircle size={20} />}
            iconClass="bg-amber-100 text-amber-600"
            cardClass="border-amber-100 hover:border-amber-200"
          />

          <OrderStatCard
            title="Processing"
            value={stats.processing}
            icon={<FiRefreshCw size={20} />}
            iconClass="bg-blue-100 text-blue-600"
            cardClass="border-blue-100 hover:border-blue-200"
          />

          <OrderStatCard
            title="Shipped"
            value={stats.shipped}
            icon={<FiTruck size={20} />}
            iconClass="bg-indigo-100 text-indigo-600"
            cardClass="border-indigo-100 hover:border-indigo-200"
          />

          <OrderStatCard
            title="Delivered"
            value={stats.delivered}
            icon={<FiCheckCircle size={20} />}
            iconClass="bg-emerald-100 text-emerald-600"
            cardClass="border-emerald-100 hover:border-emerald-200"
          />

          <OrderStatCard
            title="Cancelled"
            value={stats.cancelled}
            icon={<FiAlertCircle size={20} />}
            iconClass="bg-red-100 text-[#DF2648]"
            cardClass="border-red-100 hover:border-red-200"
          />

        </div>

        {/* ================================================================= */}
        {/* FILTERS */}
        {/* ================================================================= */}

        <section
          className="
            overflow-hidden
            rounded-3xl
            border
            border-red-100
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              border-b
              border-red-50
              bg-gradient-to-r
              from-red-50
              to-white
              px-5
              py-4
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-100
                  text-[#DF2648]
                "
              >
                <FiFilter size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Filters & Search
                </h2>

                <p className="text-xs text-gray-500">
                  Filter and find customer orders
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-3">

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                Order Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value,
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-3.5
                  py-3
                  text-sm
                  font-medium
                  text-gray-700
                  outline-none
                  transition-all
                  focus:border-red-200
                  focus:bg-white
                  focus:ring-4
                  focus:ring-red-100
                "
              >
                <option value="all">
                  All Statuses
                </option>
                <option value="pending">
                  Pending
                </option>
                <option value="processing">
                  Processing
                </option>
                <option value="shipped">
                  Shipped
                </option>
                <option value="delivered">
                  Delivered
                </option>
                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                Payment Status
              </label>

              <select
                value={paymentStatusFilter}
                onChange={(e) =>
                  setPaymentStatusFilter(
                    e.target.value,
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-3.5
                  py-3
                  text-sm
                  font-medium
                  text-gray-700
                  outline-none
                  transition-all
                  focus:border-red-200
                  focus:bg-white
                  focus:ring-4
                  focus:ring-red-100
                "
              >
                <option value="all">
                  All Payment Statuses
                </option>
                <option value="pending">
                  Payment Pending
                </option>
                <option value="completed">
                  Payment Completed
                </option>
                <option value="failed">
                  Payment Failed
                </option>
                <option value="refunded">
                  Refunded
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                Search
              </label>

              <div className="relative">
                <FiSearch
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  placeholder="Order ID, customer, email..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value,
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3
                    pl-10
                    pr-3.5
                    text-sm
                    font-medium
                    text-gray-800
                    placeholder:text-gray-300
                    outline-none
                    transition-all
                    focus:border-red-200
                    focus:bg-white
                    focus:ring-4
                    focus:ring-red-100
                  "
                />
              </div>
            </div>

          </div>
        </section>

        {/* ================================================================= */}
        {/* ORDER DIRECTORY */}
        {/* ================================================================= */}

        <section
          className="
            min-w-0
            overflow-hidden
            rounded-3xl
            border
            border-red-100
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              border-b
              border-red-50
              bg-gradient-to-r
              from-red-50/80
              via-white
              to-white
              px-5
              py-5
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-900">
                    Order Directory
                  </h2>

                  <span className="h-1.5 w-1.5 rounded-full bg-[#DF2648]" />
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Showing {filteredOrders.length} of{' '}
                  {orders.length} orders
                </p>
              </div>

              <span
                className="
                  w-fit
                  rounded-full
                  bg-red-100
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[#DF2648]
                "
              >
                {filteredOrders.length}{' '}
                {filteredOrders.length === 1
                  ? 'order'
                  : 'orders'}
              </span>
            </div>
          </div>

          <div className="relative">
            {loading ? (
              <LoadingState />
            ) : filteredOrders.length === 0 ? (
              <EmptyOrdersState />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <SortableHeader
                        label="Date"
                        field="orderDate"
                        sortField={sortField}
                        onSort={handleSort}
                      />

                      <SortableHeader
                        label="Customer"
                        field="customer"
                        sortField={sortField}
                        onSort={handleSort}
                      />

                      <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Products
                      </th>

                      <SortableHeader
                        label="Total"
                        field="totalPrice"
                        sortField={sortField}
                        onSort={handleSort}
                      />

                      <SortableHeader
                        label="Status"
                        field="status"
                        sortField={sortField}
                        onSort={handleSort}
                      />

                      <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Payment
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map(
                      (order) => (
                        <tr
                          key={order._id}
                          className="
                            cursor-pointer
                            transition-colors
                            hover:bg-red-50/30
                          "
                          onClick={() =>
                            handleViewOrder(
                              order,
                            )
                          }
                        >
                          <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                            {formatDate(
                              order.orderDate,
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {
                                  order
                                    .shippingAddress
                                    .firstName
                                }{' '}
                                {
                                  order
                                    .shippingAddress
                                    .lastName
                                }
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                {
                                  order
                                    .contactInfo
                                    .email
                                }
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-gray-700">
                              {
                                order.products
                                  .length
                              }{' '}
                              items
                            </p>

                            <p className="mt-1 max-w-[220px] truncate text-xs text-gray-400">
                              {order.products
                                .slice(0, 2)
                                .map(
                                  (p) =>
                                    p.name,
                                )
                                .join(
                                  ', ',
                                )}

                              {order.products
                                .length >
                                2 &&
                                '...'}
                            </p>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4">
                            <p className="text-sm font-bold text-gray-900">
                              $
                              {order.totalPrice.toFixed(
                                2,
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <select
                              value={
                                order.status
                              }
                              onChange={(e) =>
                                handleUpdateStatus(
                                  order._id,
                                  e.target
                                    .value,
                                )
                              }
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                              className={`
                                cursor-pointer
                                rounded-full
                                border
                                px-2.5
                                py-1.5
                                text-xs
                                font-semibold
                                outline-none
                                ${getStatusColor(
                                  order.status,
                                )}
                              `}
                            >
                              <option value="pending">
                                Pending
                              </option>

                              <option value="processing">
                                Processing
                              </option>

                              <option value="shipped">
                                Shipped
                              </option>

                              <option value="delivered">
                                Delivered
                              </option>

                              <option value="cancelled">
                                Cancelled
                              </option>
                            </select>
                          </td>

                          <td className="px-5 py-4">
                            <select
                              value={
                                order.paymentStatus
                              }
                              onChange={(e) =>
                                handleUpdatePaymentStatus(
                                  order._id,
                                  e.target
                                    .value,
                                )
                              }
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                              className={`
                                cursor-pointer
                                rounded-full
                                border
                                px-2.5
                                py-1.5
                                text-xs
                                font-semibold
                                outline-none
                                ${getPaymentStatusColor(
                                  order.paymentStatus,
                                )}
                              `}
                            >
                              <option value="pending">
                                Pending
                              </option>

                              <option value="completed">
                                Completed
                              </option>

                              <option value="failed">
                                Failed
                              </option>

                              <option value="refunded">
                                Refunded
                              </option>
                            </select>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOrder(
                                    order,
                                  );
                                }}
                                className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-xl
                                  border
                                  border-blue-100
                                  bg-blue-50
                                  text-blue-600
                                  transition-all
                                  hover:bg-blue-100
                                "
                                title="View order"
                              >
                                <FiEye
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOrder(
                                    order._id,
                                  );
                                }}
                                className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-xl
                                  border
                                  border-red-100
                                  bg-red-50
                                  text-[#DF2648]
                                  transition-all
                                  hover:bg-red-100
                                "
                                title="Delete order"
                              >
                                <FiX
                                  size={16}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ================================================================== */}
      {/* ORDER DETAILS MODAL */}
      {/* ================================================================== */}

      {isModalOpen &&
        selectedOrder && (
          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/40
              p-4
              backdrop-blur-[4px]
              animate-fade-in
            "
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                closeModal();
              }
            }}
          >
            <div
              className="
                w-full
                max-w-4xl
                max-h-[90vh]
                overflow-hidden
                rounded-3xl
                border
                border-red-100
                bg-white
                shadow-2xl
                animate-modal-in
              "
            >
              {/* Modal Header */}

              <div
                className="
                  sticky
                  top-0
                  z-10
                  flex
                  items-center
                  justify-between
                  border-b
                  border-red-50
                  bg-gradient-to-r
                  from-red-50
                  to-white
                  px-6
                  py-5
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-red-100
                      text-[#DF2648]
                    "
                  >
                    <FiShoppingBag
                      size={19}
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Order Details
                    </h2>

                    <p className="text-xs text-gray-500">
                      #{selectedOrder._id}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    text-gray-400
                    transition-all
                    hover:bg-red-100
                    hover:text-[#DF2648]
                  "
                >
                  <FiX size={19} />
                </button>
              </div>

              <div className="max-h-[calc(90vh-75px)] overflow-y-auto">
                <div className="space-y-6 p-6">

                  {/* ====================================================== */}
                  {/* SUMMARY */}
                  {/* ====================================================== */}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <DetailCard
                      icon={
                        <FiCalendar
                          size={17}
                        />
                      }
                      title="Order Information"
                    >
                      <DetailRow
                        label="Order ID"
                        value={`#${selectedOrder._id}`}
                      />

                      <DetailRow
                        label="Date"
                        value={formatDate(
                          selectedOrder.orderDate,
                        )}
                      />

                      <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-2.5">
                        <span className="text-xs font-medium text-gray-400">
                          Status
                        </span>

                        <span
                          className={`
                            rounded-full
                            border
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            ${getStatusColor(
                              selectedOrder.status,
                            )}
                          `}
                        >
                          {selectedOrder.status
                            .charAt(0)
                            .toUpperCase() +
                            selectedOrder.status.slice(
                              1,
                            )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-2.5">
                        <span className="text-xs font-medium text-gray-400">
                          Payment
                        </span>

                        <span
                          className={`
                            rounded-full
                            border
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            ${getPaymentStatusColor(
                              selectedOrder.paymentStatus,
                            )}
                          `}
                        >
                          {selectedOrder.paymentStatus
                            .charAt(0)
                            .toUpperCase() +
                            selectedOrder.paymentStatus.slice(
                              1,
                            )}
                        </span>
                      </div>

                      <DetailRow
                        label="Payment Method"
                        value={getPaymentMethodText(
                          selectedOrder.paymentMethod,
                        )}
                      />
                    </DetailCard>

                    <DetailCard
                      icon={
                        <FiDollarSign
                          size={17}
                        />
                      }
                      title="Payment Summary"
                    >
                      <DetailRow
                        label="Subtotal"
                        value={`$${(
                          selectedOrder.totalPrice *
                          0.9
                        ).toFixed(2)}`}
                      />

                      <DetailRow
                        label="Tax"
                        value={`$${(
                          selectedOrder.totalPrice *
                          0.1
                        ).toFixed(2)}`}
                      />

                      <div className="flex items-center justify-between pt-3">
                        <span className="text-sm font-semibold text-gray-700">
                          Total
                        </span>

                        <span className="text-xl font-bold text-[#DF2648]">
                          $
                          {selectedOrder.totalPrice.toFixed(
                            2,
                          )}
                        </span>
                      </div>
                    </DetailCard>

                  </div>

                  {/* ====================================================== */}
                  {/* SHIPPING */}
                  {/* ====================================================== */}

                  <DetailSection
                    icon={
                      <FiMapPin size={17} />
                    }
                    title="Shipping Address"
                  >
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 text-sm text-gray-600">
                      <p className="font-semibold text-gray-800">
                        {
                          selectedOrder
                            .shippingAddress
                            .firstName
                        }{' '}
                        {
                          selectedOrder
                            .shippingAddress
                            .lastName
                        }
                      </p>

                      {selectedOrder
                        .shippingAddress
                        .companyName && (
                        <p className="mt-1">
                          {
                            selectedOrder
                              .shippingAddress
                              .companyName
                          }
                        </p>
                      )}

                      <p className="mt-1">
                        {
                          selectedOrder
                            .shippingAddress
                            .streetAddress
                        }
                      </p>

                      {selectedOrder
                        .shippingAddress
                        .apartment && (
                        <p>
                          {
                            selectedOrder
                              .shippingAddress
                              .apartment
                          }
                        </p>
                      )}

                      <p className="mt-1">
                        {
                          selectedOrder
                            .shippingAddress
                            .city
                        }
                        {selectedOrder
                          .shippingAddress
                          .state &&
                          `, ${selectedOrder.shippingAddress.state}`}
                        {selectedOrder
                          .shippingAddress
                          .postalCode &&
                          `, ${selectedOrder.shippingAddress.postalCode}`}
                      </p>

                      {selectedOrder
                        .shippingAddress
                        .country && (
                        <p className="mt-1">
                          {
                            selectedOrder
                              .shippingAddress
                              .country
                          }
                        </p>
                      )}
                    </div>
                  </DetailSection>

                  {/* ====================================================== */}
                  {/* CONTACT */}
                  {/* ====================================================== */}

                  <DetailSection
                    title="Contact Information"
                  >
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-700">
                          {
                            selectedOrder
                              .contactInfo
                              .email
                          }
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {
                            selectedOrder
                              .contactInfo
                              .phone
                          }
                        </p>
                      </div>
                    </div>
                  </DetailSection>

                  {/* ====================================================== */}
                  {/* PRODUCTS */}
                  {/* ====================================================== */}

                  <DetailSection
                    icon={
                      <FiPackage size={17} />
                    }
                    title={`Products (${selectedOrder.products.length})`}
                  >
                    <div className="overflow-x-auto rounded-2xl border border-gray-100">
                      <table className="w-full min-w-[600px] text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">
                              Product
                            </th>

                            <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-gray-400">
                              Price
                            </th>

                            <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-gray-400">
                              Quantity
                            </th>

                            <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-gray-400">
                              Total
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                          {selectedOrder.products.map(
                            (
                              product,
                              index,
                            ) => (
                              <tr
                                key={index}
                                className="hover:bg-red-50/20"
                              >
                                <td className="px-4 py-3">
                                  <p className="font-semibold text-gray-800">
                                    {
                                      product.name
                                    }
                                  </p>

                                  <p className="mt-0.5 text-xs text-gray-400">
                                    ID:{' '}
                                    {product.productId.substring(
                                      0,
                                      8,
                                    )}
                                  </p>
                                </td>

                                <td className="px-4 py-3 text-right text-gray-600">
                                  $
                                  {product.price.toFixed(
                                    2,
                                  )}
                                </td>

                                <td className="px-4 py-3 text-right text-gray-600">
                                  {
                                    product.quantity
                                  }
                                </td>

                                <td className="px-4 py-3 text-right font-bold text-gray-800">
                                  $
                                  {(
                                    product.price *
                                    product.quantity
                                  ).toFixed(
                                    2,
                                  )}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </DetailSection>

                </div>

                {/* Modal Footer */}

                <div
                  className="
                    flex
                    justify-end
                    border-t
                    border-red-50
                    bg-red-50/30
                    px-6
                    py-4
                  "
                >
                  <button
                    type="button"
                    onClick={closeModal}
                    className="
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-gray-600
                      transition-all
                      hover:border-red-200
                      hover:bg-red-50
                      hover:text-[#DF2648]
                    "
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* ================================================================== */}
      {/* ANIMATIONS */}
      {/* ================================================================== */}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-modal-in {
          animation: modalIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrdersManagement;

// ============================================================================
// STAT CARD
// ============================================================================

interface OrderStatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  cardClass: string;
}

const OrderStatCard = ({
  title,
  value,
  icon,
  iconClass,
  cardClass,
}: OrderStatCardProps) => {
  return (
    <div
      className={`
        group
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        ${cardClass}
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-gray-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            transition-all
            duration-200
            group-hover:scale-105
            ${iconClass}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SORTABLE HEADER
// ============================================================================

interface SortableHeaderProps {
  label: string;
  field: string;
  sortField: string;
  onSort: (field: string) => void;
}

const SortableHeader = ({
  label,
  field,
  sortField,
  onSort,
}: SortableHeaderProps) => {
  return (
    <th
      className="
        cursor-pointer
        px-5
        py-3
        text-left
        text-[11px]
        font-bold
        uppercase
        tracking-wider
        text-gray-400
        transition-colors
        hover:bg-red-50/50
        hover:text-[#DF2648]
      "
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1.5">
        {label}

        {sortField === field ? (
          <SortActiveIcon />
        ) : (
          <FiChevronDown className="opacity-30" />
        )}
      </div>
    </th>
  );
};

const SortActiveIcon = () => {
  return null;
};

// ============================================================================
// DETAIL CARD
// ============================================================================

interface DetailCardProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const DetailCard = ({
  icon,
  title,
  children,
}: DetailCardProps) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        {icon && (
          <span className="text-[#DF2648]">
            {icon}
          </span>
        )}

        <h3 className="text-sm font-semibold text-gray-800">
          {title}
        </h3>
      </div>

      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// DETAIL ROW
// ============================================================================

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow = ({
  label,
  value,
}: DetailRowProps) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-2.5">
      <span className="text-xs font-medium text-gray-400">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-gray-700">
        {value}
      </span>
    </div>
  );
};

// ============================================================================
// DETAIL SECTION
// ============================================================================

interface DetailSectionProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const DetailSection = ({
  icon,
  title,
  children,
}: DetailSectionProps) => {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {icon && (
          <span className="text-[#DF2648]">
            {icon}
          </span>
        )}

        <h3 className="text-sm font-semibold text-gray-800">
          {title}
        </h3>
      </div>

      {children}
    </div>
  );
};

// ============================================================================
// LOADING
// ============================================================================

const LoadingState = () => {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-2 border-red-100" />

        <div
          className="
            absolute
            inset-0
            h-10
            w-10
            animate-spin
            rounded-full
            border-2
            border-transparent
            border-t-[#DF2648]
          "
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700">
          Loading orders
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Please wait a moment...
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// EMPTY
// ============================================================================

const EmptyOrdersState = () => {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
      <div
        className="
          mb-4
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-red-50
          text-[#DF2648]
        "
      >
        <FiShoppingBag size={24} />
      </div>

      <h3 className="font-semibold text-gray-800">
        No orders found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-gray-400">
        No orders match your current filters or
        search query.
      </p>
    </div>
  );
};