'use client';
import { useState } from 'react';
import { Product, CATEGORIES } from '../../types/types';
import ProductForm from '../ProductForm/ProductForm';

interface ProductTableProps {
  products: Product[];
  onUpdate: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductTable = ({ products, onUpdate, onDelete }: ProductTableProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const handleEdit = (product: Product) => setEditingProduct({...product});
  const handleCancelEdit = () => setEditingProduct(null);

    const handleSave = (updatedProduct: Product) => {
    onUpdate(updatedProduct);
    setEditingProduct(null);
  };

  const toggleExpand = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  if (editingProduct) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <ProductForm
          onSubmit={handleSave}
          editingProduct={editingProduct}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <p className="text-gray-600 mt-1">Manage your product inventory</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 font-medium text-gray-700">Product</th>
              <th className="text-left p-4 font-medium text-gray-700">Category</th>
              <th className="text-left p-4 font-medium text-gray-700">Price</th>
              <th className="text-left p-4 font-medium text-gray-700">Stock</th>
              <th className="text-left p-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <>
                <tr 
                  key={product._id} 
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    editingProduct?._id === product._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      {product.images.length > 0 && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-3"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product?.category?.name} 
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">${product.price.toLocaleString()}</span>
                      {product.discount > 0 && (
                        <span className="ml-2 text-xs text-red-600 line-through">
                          ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.discount > 0 && (
                      <span className="inline-block mt-1 text-xs font-medium bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                        {product.discount}% off
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className={`font-medium ${
                        product.stock > 10 ? 'text-green-600' : 
                        product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {product.stock}
                      </span>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            product.stock > 10 ? 'bg-green-500' : 
                            product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      {editingProduct?._id === product._id ? (
                        <>
                          <button
                            className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                            // onClick={handleSave}
                            onClick={() => editingProduct && handleSave(editingProduct)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Save
                          </button>
                          <button
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                            // onClick={handleCancel}
                              onClick={handleCancelEdit}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                            onClick={() => handleEdit(product)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Edit
                          </button>
                          <button
                            className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                            onClick={() => onDelete(product._id)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Delete
                          </button>
                        </>
                      )}
                      <button
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        onClick={() => toggleExpand(product._id)}
                      >
                        <svg 
                          className={`w-4 h-4 transform transition-transform ${expandedProduct === product._id ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Details Row */}
                {expandedProduct === product._id && (
                  <tr className="border-b bg-gray-50">
                    <td colSpan={5} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-3">Product Details</h3>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Description:</span>
                              <p className="text-gray-700">{product.description || 'No description provided'}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Sizes:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {product.sizes && product.sizes.length > 0 ? (
                                  product.sizes.map((size, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md text-sm">
                                      {size}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-500">No sizes specified</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Colors:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {product.colors && product.colors.length > 0 ? (
                                  product.colors.map((color, index) => (
                                    <div key={index} className="flex items-center">
                                      <div 
                                        className="w-4 h-4 rounded-full border border-gray-300 mr-1"
                                        style={{ backgroundColor: color }}
                                      ></div>
                                      <span className="text-sm text-gray-700">{color}</span>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-gray-500">No colors specified</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Tags:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {product.tags && product.tags.length > 0 ? (
                                  product.tags.map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                      {tag}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-500">No tags</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-900 mb-3">Product Images</h3>
                          <div className="grid grid-cols-3 gap-3">
                            {product.images.length > 0 ? (
                              product.images.map((img, index) => (
                                <img
                                  key={index}
                                  src={img}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border"
                                />
                              ))
                            ) : (
                              <span className="text-gray-500">No images available</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                
                {/* Editing Row */}
                {editingProduct?._id === product._id && (
                  <tr className="border-b bg-blue-50">
                    <td colSpan={5} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-3">Edit Product</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                              <input
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct(p => p ? { ...p, name: e.target.value } : null)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                              <select
                                value={editingProduct.category}
                                onChange={(e) => setEditingProduct(p => p ? { ...p, category: e.target.value } : null)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                {CATEGORIES.map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input
                                  type="number"
                                  value={editingProduct.price}
                                  onChange={(e) => setEditingProduct(p => p ? { ...p, price: Number(e.target.value) } : null)}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                                <input
                                  type="number"
                                  value={editingProduct.discount}
                                  onChange={(e) => setEditingProduct(p => p ? { ...p, discount: Number(e.target.value) } : null)}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  min="0"
                                  max="100"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                              <input
                                type="number"
                                value={editingProduct.stock}
                                onChange={(e) => setEditingProduct(p => p ? { ...p, stock: Number(e.target.value) } : null)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-900 mb-3">Additional Details</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
                              <input
                                value={editingProduct.sizes?.join(', ') || ''}
                                onChange={(e) => setEditingProduct(p => p ? { ...p, sizes: e.target.value.split(',').map(s => s.trim()) } : null)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="S, M, L, XL"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
                              <input
                                value={editingProduct.colors?.join(', ') || ''}
                                onChange={(e) => setEditingProduct(p => p ? { ...p, colors: e.target.value.split(',').map(s => s.trim()) } : null)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="#FF0000, #00FF00, #0000FF"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                value={editingProduct.description}
                                onChange={(e) => setEditingProduct(p => p ? { ...p, description: e.target.value } : null)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;