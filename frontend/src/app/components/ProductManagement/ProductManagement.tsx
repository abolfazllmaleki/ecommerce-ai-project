'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiPlus,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiPackage,
  FiX,
  FiBox,
} from 'react-icons/fi';

import { Product } from '../../types/types';
import ProductForm from '../ProductForm/ProductForm';
import ProductTable from '../ProductTable/ProductTable';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;

type ProductWithOptionalId = Product & {
  id?: string;
  _id?: string;
};

const ProductManagement = () => {
  const [products, setProducts] = useState<ProductWithOptionalId[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    outOfStock: 0,
  });

  // ==========================================================================
  // Helpers
  // ==========================================================================

  const getProductId = (
    product: ProductWithOptionalId,
  ) => {
    return product._id || product.id || '';
  };

  const normalizeProduct = (
    product: ProductWithOptionalId,
  ): ProductWithOptionalId => {
    const id =
      product._id ||
      product.id ||
      '';

    return {
      ...product,
      _id: id,
      id,
    };
  };

  const updateStats = (
    items: ProductWithOptionalId[],
  ) => {
    setStats({
      total: items.length,

      active: items.filter(
        (product) => product.stock > 0,
      ).length,

      outOfStock: items.filter(
        (product) => product.stock === 0,
      ).length,
    });
  };

  // ==========================================================================
  // Notifications
  // ==========================================================================

  const showError = (message: string) => {
    setError(message);
    setSuccess(null);

    window.setTimeout(() => {
      setError(null);
    }, 4500);
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setError(null);

    window.setTimeout(() => {
      setSuccess(null);
    }, 3500);
  };

  // ==========================================================================
  // Fetch Products
  // ==========================================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await axios.get<ProductWithOptionalId[]>(
          API_URL,
        );

      const normalizedProducts =
        response.data.map(normalizeProduct);

      setProducts(normalizedProducts);
      updateStats(normalizedProducts);
    } catch (err) {
      console.error(
        'Failed to fetch products:',
        err,
      );

      showError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              'Failed to fetch products'
          : 'Failed to fetch products',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================================================
  // Add Product
  // ==========================================================================

  const handleAddProduct = async (
    newProduct: Product,
  ) => {
    try {
      setSaving(true);

      const response =
        await axios.post<ProductWithOptionalId>(
          API_URL,
          {
            ...newProduct,
            category: newProduct.category,
          },
        );

      const createdProduct =
        normalizeProduct(response.data);

      setProducts((prev) => {
        const updated = [
          ...prev,
          createdProduct,
        ];

        updateStats(updated);

        return updated;
      });

      showSuccess(
        'Product added successfully',
      );
    } catch (err) {
      console.error(
        'Failed to add product:',
        err,
      );

      showError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              'Failed to add product'
          : 'Failed to add product',
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================================
  // Update Product
  // ==========================================================================

  const handleUpdateProduct = async (
    updatedProduct: Product,
  ) => {
    try {
      setSaving(true);

      const productId = getProductId(
        updatedProduct as ProductWithOptionalId,
      );

      if (!productId) {
        showError(
          'Product ID is missing for update',
        );
        return;
      }

      const response =
        await axios.put<ProductWithOptionalId>(
          `${API_URL}/${productId}`,
          {
            ...updatedProduct,
            category:
              updatedProduct.category,
          },
        );

      const normalizedUpdatedProduct =
        normalizeProduct(response.data);

      setProducts((prev) => {
        const updated = prev.map((product) =>
          getProductId(product) === productId
            ? normalizedUpdatedProduct
            : product,
        );

        updateStats(updated);

        return updated;
      });

      showSuccess(
        'Product updated successfully',
      );
    } catch (err) {
      console.error(
        'Failed to update product:',
        err,
      );

      showError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              'Failed to update product'
          : 'Failed to update product',
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================================
  // Delete Product
  // ==========================================================================

  const handleDeleteProduct = async (
    productId: string,
  ) => {
    if (!productId) {
      showError(
        'Product ID is missing for delete',
      );
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this product?',
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      await axios.delete(
        `${API_URL}/${productId}`,
      );

      setProducts((prev) => {
        const updated = prev.filter(
          (product) =>
            getProductId(product) !==
            productId,
        );

        updateStats(updated);

        return updated;
      });

      showSuccess(
        'Product deleted successfully',
      );
    } catch (err) {
      console.error(
        'Failed to delete product:',
        err,
      );

      showError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              'Failed to delete product'
          : 'Failed to delete product',
      );
    } finally {
      setSaving(false);
    }
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
                <FiPackage size={22} />
              </div>

              <div>
                <div className="flex items-center gap-2">

                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Product Management
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
                  Manage products, inventory and pricing
                </p>
              </div>
            </div>

            <button
              onClick={fetchProducts}
              disabled={loading || saving}
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
        {/* NOTIFICATION */}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <StatCard
            title="Total Products"
            value={stats.total}
            icon={<FiPackage size={20} />}
            iconClass="bg-red-100 text-[#DF2648]"
            cardClass="border-red-100 hover:border-red-200"
          />

          <StatCard
            title="Active Products"
            value={stats.active}
            icon={<FiCheckCircle size={20} />}
            iconClass="bg-emerald-100 text-emerald-600"
            cardClass="border-emerald-100 hover:border-emerald-200"
          />

          <StatCard
            title="Out of Stock"
            value={stats.outOfStock}
            icon={<FiAlertCircle size={20} />}
            iconClass="bg-amber-100 text-amber-600"
            cardClass="border-amber-100 hover:border-amber-200"
          />

        </div>

        {/* ================================================================= */}
        {/* MAIN */}
        {/* ================================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-[340px_minmax(0,1fr)]
          "
        >

          {/* =============================================================== */}
          {/* ADD PRODUCT */}
          {/* =============================================================== */}

          <section
            className="
              h-fit
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
                py-5
              "
            >
              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-100
                    text-[#DF2648]
                  "
                >
                  <FiPlus size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Add New Product
                  </h2>

                  <p className="text-xs text-gray-500">
                    Create a new product
                  </p>
                </div>

              </div>
            </div>

            <div className="p-5">
              <ProductForm
                onSubmit={handleAddProduct}
              />
            </div>
          </section>

          {/* =============================================================== */}
          {/* PRODUCT INVENTORY */}
          {/* =============================================================== */}

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
                      Product Inventory
                    </h2>

                    <span className="h-1.5 w-1.5 rounded-full bg-[#DF2648]" />

                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Manage existing products
                  </p>
                </div>

                <div className="flex items-center gap-2">

                  <span
                    className="
                      rounded-full
                      bg-gray-100
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      text-gray-600
                    "
                  >
                    {products.length}{' '}
                    {products.length === 1
                      ? 'product'
                      : 'products'}
                  </span>

                  {saving && (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-red-100
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-[#DF2648]
                      "
                    >
                      <FiRefreshCw
                        size={11}
                        className="animate-spin"
                      />
                      Saving
                    </span>
                  )}

                </div>
              </div>
            </div>

            <div className="relative">

              {loading ? (
                <LoadingState />
              ) : products.length === 0 ? (
                <EmptyState />
              ) : (
                <ProductTable
                  products={
                    products as Product[]
                  }
                  onUpdate={
                    handleUpdateProduct
                  }
                  onDelete={
                    handleDeleteProduct
                  }
                />
              )}

            </div>
          </section>
        </div>
      </div>

      {/* ================================================================= */}
      {/* ANIMATIONS */}
      {/* ================================================================= */}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductManagement;

// ============================================================================
// STAT CARD
// ============================================================================

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  cardClass: string;
}

const StatCard = ({
  title,
  value,
  icon,
  iconClass,
  cardClass,
}: StatCardProps) => {
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
      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        <div
          className={`
            flex
            h-12
            w-12
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
          Loading products
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

const EmptyState = () => {
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
        <FiBox size={24} />
      </div>

      <h3 className="font-semibold text-gray-800">
        No products found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-gray-400">
        There are no products available.
      </p>

    </div>
  );
};