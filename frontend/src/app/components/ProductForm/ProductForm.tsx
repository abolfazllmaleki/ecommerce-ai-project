'use client';
import { useState } from 'react';
import { Product, CATEGORIES, COLOR_OPTIONS } from '../../types/types';

interface ProductFormProps {
  onSubmit: (newProduct: Product) => void;
}

const ProductForm = ({ onSubmit }: ProductFormProps) => {
  const [newProduct, setNewProduct] = useState<Omit<Product, '_id'>>({
    name: '',
    price: 0,
    discount: 0,
    stock: 0,
    sizes: [],
    colors: [],
    images: [],
    description: '',
    category: '',
    brand: '',
    tags: [],
  });

  const [tempImages, setTempImages] = useState<File[]>([]);
  const [tempTag, setTempTag] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      setTempImages((prev) => [...prev, ...files].slice(0, 3));
    }
  };

  const handleColorSelect = (color: string) => {
    setNewProduct((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleAddTag = () => {
    const trimmedTag = tempTag.trim();
    if (trimmedTag && !newProduct.tags?.includes(trimmedTag)) {
      setNewProduct(prev => ({
        ...prev,
        tags: [...(prev.tags || []), trimmedTag]
      }));
      setTempTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewProduct(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const imagePromises = tempImages.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const images = await Promise.all(imagePromises);

    onSubmit({
      ...newProduct,
      images,
    });

    // Reset form
    setNewProduct({
      name: '',
      price: 0,
      discount: 0,
      stock: 0,
      sizes: [],
      colors: [],
      images: [],
      description: '',
      category: '',
      brand: '',
      tags: [],
    });
    setTempImages([]);
    setTempTag('');
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      {/* Product Name */}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          value={newProduct.name}
          onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))}
          required
        />
      </div>

      {/* Category */}
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          value={newProduct.category}
          onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))}
          required
        >
          <option value="">Select Category</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          value={newProduct.brand}
          onChange={(e) => setNewProduct(p => ({ ...p, brand: e.target.value }))}
          placeholder="Enter brand"
        />
      </div>

      {/* Price */}
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          value={newProduct.price || ''}
          onChange={(e) => setNewProduct(p => ({ ...p, price: +e.target.value }))}
          min="0"
          step="0.01"
          required
        />
      </div>

      {/* Discount */}
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          value={newProduct.discount || ''}
          onChange={(e) => setNewProduct(p => ({ ...p, discount: +e.target.value }))}
          min="0"
          max="100"
        />
      </div>

      {/* Stock */}
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          value={newProduct.stock || ''}
          onChange={(e) => setNewProduct(p => ({ ...p, stock: +e.target.value }))}
          min="0"
          required
        />
      </div>

      {/* Sizes */}
      <div className="col-span-2 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sizes (comma separated)</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          value={newProduct.sizes.join(', ')}
          onChange={(e) => setNewProduct(p => ({
            ...p,
            sizes: e.target.value.split(',').map(s => s.trim())
          }))}
          placeholder="S, M, L, XL"
        />
      </div>

      {/* Colors */}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
        <div className="grid grid-cols-5 gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorSelect(color)}
              className={`h-10 rounded-md border-2 transition-all ${
                newProduct.colors.includes(color)
                  ? 'ring-2 ring-offset-2 ring-red-500 scale-105'
                  : 'hover:opacity-90 hover:scale-95'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Selected: {newProduct.colors.join(', ') || 'None'}
        </div>
      </div>

      {/* Tags */}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={tempTag}
            onChange={(e) => setTempTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="Enter tag and press Add"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {newProduct.tags?.map((tag, index) => (
            <div
              key={index}
              className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-red-600 hover:text-red-700 text-lg"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (max 3)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
        />
        <div className="flex gap-2 mt-2">
          {tempImages.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => setTempImages(prev => prev.filter((_, i) => i !== index))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          value={newProduct.description}
          onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))}
          rows={4}
          placeholder="Enter product description..."
        />
      </div>

      {/* Submit Button */}
      <div className="col-span-2">
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors font-medium"
        >
          Add Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;