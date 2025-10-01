'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiRefreshCw, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { Product } from '../../types/types';
import ProductForm from '../ProductForm/ProductForm';
import ProductTable from '../ProductTable/ProductTable';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    outOfStock: 0
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>(API_URL);
      setProducts(response.data);
      
      setStats({
        total: response.data.length,
        active: response.data.filter(p => p.stock > 0).length,
        outOfStock: response.data.filter(p => p.stock === 0).length
      });
      
      showSuccess('Products loaded successfully');
    } catch (err) {
      showError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // const handleAddProduct = async (newProduct: Product) => {
  //   try {
  //     const response = await axios.post<Product>(API_URL, newProduct);
  //     setProducts(prev => [...prev, response.data]);
  //     showSuccess('Product added successfully');
  //   } catch (err) {
  //     showError('Failed to add product');
  //   }
  // };

  // const handleUpdateProduct = async (updatedProduct: Product) => {
  //   try {
  //     const response = await axios.put<Product>(
  //       `${API_URL}/${updatedProduct._id}`,
  //       updatedProduct
  //     );
  //     setProducts(prev => prev.map(p => p._id === updatedProduct._id ? response.data : p));
  //     showSuccess('Product updated successfully');
  //   } catch (err) {
  //     showError('Failed to update product');
  //   }
  // };
  const handleAddProduct = async (newProduct: Product) => {
  try {
    // Ensure category is sent as object ID string
    const productToSend = {
      ...newProduct,
      category: newProduct.category // This should be the category ID string
    };
    
    const response = await axios.post<Product>(API_URL, productToSend);
    setProducts(prev => [...prev, response.data]);
    showSuccess('Product added successfully');
  } catch (err) {
    showError('Failed to add product');
  }
};

const handleUpdateProduct = async (updatedProduct: Product) => {
  try {
    // Ensure category is sent as object ID string
    const productToSend = {
      ...updatedProduct,
      category: updatedProduct.category // This should be the category ID string
    };
    
    const response = await axios.put<Product>(
      `${API_URL}/${updatedProduct._id}`,
      productToSend
    );
    setProducts(prev => prev.map(p => p._id === updatedProduct._id ? response.data : p));
    showSuccess('Product updated successfully');
  } catch (err) {
    showError('Failed to update product');
  }
};

  const handleDeleteProduct = async (productId: string) => {
    try {
      await axios.delete(`${API_URL}/${productId}`);
      setProducts(prev => prev.filter(p => p._id !== productId));
      showSuccess('Product deleted successfully');
    } catch (err) {
      showError('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div></div>
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 shadow-xs transition-all hover:shadow-sm"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-white p-5 rounded-xl border border-red-100 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FiPlus className="text-red-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Active Products</p>
              <h3 className="text-2xl font-bold mt-1">{stats.active}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCheckCircle className="text-green-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <h3 className="text-2xl font-bold mt-1">{stats.outOfStock}</h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <FiAlertCircle className="text-amber-500 w-5 h-5" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FiPlus className="text-red-500" />
              <span>Add New Product</span>
            </h3>
          </div>
          <div className="p-6">
            <ProductForm onSubmit={handleAddProduct} />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Product Inventory</h3>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
              {products.length} items
            </span>
          </div>
          <div className="p-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : (
              <ProductTable
                products={products}
                onUpdate={handleUpdateProduct}
                onDelete={handleDeleteProduct}
              />
            )}
          </div>
        </div>
      </div>

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

export default ProductManagement;
