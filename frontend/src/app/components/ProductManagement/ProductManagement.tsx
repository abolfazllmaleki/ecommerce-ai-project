'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../../types/types';
import ProductForm from '../ProductForm/ProductForm';
import ProductTable from '../ProductTable/ProductTable';

const API_URL = 'http://localhost:3000/products';

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(API_URL);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const response = await axios.post<Product>(API_URL, newProduct);
      setProducts((prev) => [...prev, response.data]);
    } catch (err) {
      setError('Failed to add product.');
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const response = await axios.put<Product>(
        `${API_URL}/${updatedProduct._id}`,
        updatedProduct
      );
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? response.data : p))
      );
    } catch (err) {
      setError('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await axios.delete(`${API_URL}/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  if (loading) return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-500 p-4 rounded-lg mt-6">
      {error}
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <ProductForm onSubmit={handleAddProduct} />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Products</h3>
        <ProductTable
          products={products}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
        />
      </div>
    </div>
  );
};

export default ProductManagement;