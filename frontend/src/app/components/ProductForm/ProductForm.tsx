'use client';
import { useState, useRef, useEffect } from 'react';
import { Product, Category } from '../../types/types';
import DescriptionEditor from '../DescriptionEditor/DescriptionEditor';

interface ProductFormProps {
  onSubmit: (newProduct: Product) => void;
  editingProduct?: Product | null;
  onCancel?: () => void;
}

const ProductForm = ({ onSubmit, editingProduct = null, onCancel }: ProductFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
const [newProduct, setNewProduct] = useState<any>(editingProduct || {
  name: '',
  price: 0,
  discount: 0,
  stock: 0,
  sizes: [],
  colors: [],
  images: [],
  description: '',
  specifications: '',
  adminNote: '',
  categoryId: '', // Change from category to categoryId
  brand: '',
  tags: [],
  details: [],
});

  const [tempImages, setTempImages] = useState<File[]>([]);
  const [tempTag, setTempTag] = useState('');
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [detailKey, setDetailKey] = useState('');
  const [detailValue, setDetailValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [adminNoteSuggestions, setAdminNoteSuggestions] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const commonAdminNotes = [
    "Limited stock - only a few left",
    "Free shipping on this product",
    "Best seller - reorder soon",
    "New arrival - promote in marketing",
    "Seasonal product - will be discontinued after season",
    "On sale - limited time offer",
    "Custom order possible - contact for details",
    "Pre-order available - ships in 2-3 weeks"
  ];
   useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Reset form when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      // If editingProduct has a category object, extract the ID
      const categoryValue = typeof editingProduct.category === 'object' 
        ? editingProduct.category._id 
        : editingProduct.category;
      
      setNewProduct({
        ...editingProduct,
        category: categoryValue
      });
      setTempImages([]);
    } else {
setNewProduct({
  name: '',
  price: 0,
  discount: 0,
  stock: 0,
  sizes: [],
  colors: [],
  images: [],
  description: '',
  specifications: '',
  adminNote: '',
  categoryId: '', // Change from category to categoryId
  brand: '',
  tags: [],
  details: [],
});
      setTempImages([]);
      setTempTag('');
    }
  }, [editingProduct]);

const handleCategorySelect = (categoryId: string) => {
  setNewProduct(prev => ({ ...prev, categoryId: categoryId })); // Change to categoryId
  setShowCategoryDropdown(false);
};

// Update the display logic
const getCategoryName = (categoryId: string) => {
  const category = categories.find(cat => cat._id === categoryId);
  return category ? category.name : 'Select Category';
};

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isExpanded]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      setTempImages((prev) => [...prev, ...files].slice(0, 3));
    }
  };

  const handleAddCustomColor = () => {
    if (customColor && !newProduct.colors.includes(customColor)) {
      setNewProduct(prev => ({
        ...prev,
        colors: [...prev.colors, customColor]
      }));
    }
    setShowColorPicker(false);
  };

  const handleColorSelect = (color: string) => {
    setNewProduct((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleRemoveColor = (color: string) => {
    setNewProduct(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
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

  const handleAddDetail = () => {
    if (detailKey.trim() && detailValue.trim()) {
      setNewProduct(prev => ({
        ...prev,
        details: [...(prev.details || []), { key: detailKey.trim(), value: detailValue.trim() }]
      }));
      setDetailKey('');
      setDetailValue('');
    }
  };

  const handleRemoveDetail = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      details: prev.details?.filter((_, i) => i !== index) || []
    }));
  };

  const handleDescriptionChange = (html: string) => {
    setNewProduct(prev => ({ 
      ...prev, 
      description: html 
    }));
  };

  const handleSpecificationsChange = (html: string) => {
    setNewProduct(prev => ({ 
      ...prev, 
      specifications: html 
    }));
  };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // const imagePromises = tempImages.map((file) => {
//     //   return new Promise<string>((resolve) => {
//     //     const reader = new FileReader();
//     //     reader.onload = () => resolve(reader.result as string);
//     //     reader.readAsDataURL(file);
//     //   });
//     // });
//     const formData = new FormData();

//         tempImages.forEach((file) => {
//           formData.append("images", file);
//         });

//         const uploadRes = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/images`,
//           {
//             method: "POST",
//             body: formData,
//           }
//         );

//         const uploadedUrls = await uploadRes.json();

//     // const newImages = await Promise.all(imagePromises);
//     // const allImages = [...(editingProduct?.images || []), ...newImages].slice(0, 3);
//     console.log("UPLOAD RESPONSE:", data);
//     console.log("uploadedUrls:", uploadedUrls);


//     const allImages = [...(editingProduct?.images || []), ...uploadedUrls].slice(0, 3);

// onSubmit({
//   ...newProduct,
//   images: allImages,
// });

//     onSubmit({
//       ...newProduct,
//       images: allImages,
//     });

//     // Only reset if not in edit mode
//     if (!editingProduct) {
//       setNewProduct({
//         name: '',
//         price: 0,
//         discount: 0,
//         stock: 0,
//         sizes: [],
//         colors: [],
//         images: [],
//         description: '',
//         specifications: '',
//         adminNote: '',
//         category: '',
//         brand: '',
//         tags: [],
//         details: [],
//       });
//       setTempImages([]);
//       setTempTag('');
//     }
//   };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    let uploadedUrls: string[] = [];

    if (tempImages.length > 0) {
      const formData = new FormData();

      tempImages.forEach((file) => {
        formData.append("images", file);
      });

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/images`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        throw new Error("Image upload failed");
      }

      const data = await uploadRes.json();
      uploadedUrls = Array.isArray(data.images) ? data.images : [];

      console.log("UPLOAD RESPONSE:", data);
    }

    const allImages = [
      ...(editingProduct?.images || []),
      ...uploadedUrls,
    ].slice(0, 3);

    onSubmit({
      ...newProduct,
      images: allImages,
    });

    // reset form when creating
    if (!editingProduct) {
      setNewProduct({
        name: '',
        price: 0,
        discount: 0,
        stock: 0,
        sizes: [],
        colors: [],
        images: [],
        description: '',
        specifications: '',
        adminNote: '',
        categoryId: '',
        brand: '',
        tags: [],
        details: [],
      });

      setTempImages([]);
      setTempTag('');
    }

  } catch (error) {
    console.error("Submit error:", error);
  }
};

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && formRef.current) {
      // Scroll to top when expanding
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Common colors for quick selection
  const commonColors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', 
    '#6366f1', '#8b5cf6', '#ec4899', '#6b7280', '#000000'
  ];

  return (
    <div className={`${isExpanded ? 'fixed inset-0 z-50 bg-white overflow-y-auto p-4' : 'relative'}`}>
      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        className={`bg-white rounded-xl shadow-lg border border-gray-100 ${isExpanded ? 'max-w-6xl mx-auto p-8' : 'max-w-4xl mx-auto p-6'}`}
      >
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={toggleExpand}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={isExpanded ? 'Collapse form' : 'Expand form'}
            >
              {isExpanded ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-blue-700 text-sm">You are in expanded mode. Press Escape or click the close icon to exit.</p>
            </div>
          </div>
        )}
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
              value={newProduct.name}
              onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))}
              required
              placeholder="Enter product name"
            />
          </div>

          {/* Category - Modern Selector */}
   <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <div className="relative" ref={categoryDropdownRef}>
            <button
              type="button"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none text-left flex items-center justify-between bg-white"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              disabled={loadingCategories}
            >
              <div className="flex items-center">
                {loadingCategories ? (
                  <span className="text-gray-400">Loading categories...</span>
                ) : newProduct.category ? (
                  <span>{getCategoryName(newProduct.categoryId)}</span>
                ) : (
                  <span className="text-gray-400">Select Category</span>
                )}
              </div>
              {!loadingCategories && (
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              )}
            </button>
            
            {showCategoryDropdown && !loadingCategories && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                {categories.map(category => (
                  <button
                    key={category._id}
                    type="button"
                    className={`w-full text-left p-3 flex items-center hover:bg-gray-50 transition-colors ${
                      newProduct.category === category._id ? 'bg-red-50 text-red-700' : ''
                    }`}
                    onClick={() => handleCategorySelect(category._id)}
                  >
                    <span>{category.name}</span>
                    {newProduct.categoryId === category._id && (
                      <svg className="w-5 h-5 ml-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>


          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
              value={newProduct.brand}
              onChange={(e) => setNewProduct(p => ({ ...p, brand: e.target.value }))}
              placeholder="Enter brand name"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
                value={newProduct.price || ''}
                onChange={(e) => setNewProduct(p => ({ ...p, price: +e.target.value }))}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              <input
                type="number"
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
                value={newProduct.discount || ''}
                onChange={(e) => setNewProduct(p => ({ ...p, discount: +e.target.value }))}
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
              value={newProduct.stock || ''}
              onChange={(e) => setNewProduct(p => ({ ...p, stock: +e.target.value }))}
              min="0"
              required
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
              // value={newProduct.sizes.join(',')}
              onChange={(e) => setNewProduct(p => ({
                ...p,
                sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s)
              }))}
              placeholder="S, M, L, XL"
            />
            <p className="text-xs text-gray-500 mt-1">Separate sizes with commas</p>
          </div>

          {/* Colors */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
            
            {/* Custom Color Picker */}
            <div className="mb-4 flex items-center gap-3">
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-md cursor-pointer border border-gray-300 shadow-sm"
                  style={{ backgroundColor: customColor }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="absolute opacity-0 w-0 h-0"
                  id="color-picker"
                />
                {showColorPicker && (
                  <div className="absolute z-10 top-12 left-0 bg-white p-3 rounded-lg shadow-lg border border-gray-200" ref={colorPickerRef}>
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="block mb-2"
                    />
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="text-sm p-1 border rounded w-full"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomColor}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600">Click to choose custom color</span>
            </div>

            {/* Common Colors */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Common Colors</p>
              <div className="grid grid-cols-5 gap-2">
                {commonColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className={`h-10 rounded-md border-2 transition-all flex items-center justify-center ${
                      newProduct.colors.includes(color)
                        ? 'ring-2 ring-offset-2 ring-blue-500 scale-105 border-white'
                        : 'border-gray-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {newProduct.colors.includes(color) && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Colors */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Colors</p>
              {newProduct.colors.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {newProduct.colors.map((color, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-full pl-2 pr-1 py-1">
                      <div 
                        className="w-5 h-5 rounded-full mr-1 border border-gray-300"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-xs mr-1">{color}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="text-gray-500 hover:text-red-500 rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No colors selected yet</p>
              )}
            </div>
          </div>

          {/* Product Details */}
          {/* <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Details</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
                value={detailKey}
                onChange={(e) => setDetailKey(e.target.value)}
                placeholder="Detail name (e.g., Weight)"
              />
              <input
                type="text"
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
                value={detailValue}
                onChange={(e) => setDetailValue(e.target.value)}
                placeholder="Detail value (e.g., 500g)"
              />
              <button
                type="button"
                onClick={handleAddDetail}
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Add Detail
              </button>
            </div>
            
            {newProduct.details && newProduct.details.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                {newProduct.details.map((detail: {key: string, value: string}, index: number) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                    <span className="font-medium">{detail.key}:</span>
                    <div className="flex items-center">
                      <span className="mr-2">{detail.value}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDetail(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                  </div>
                  </div>
                ))}
              </div>
            )}
          </div> */}

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
                value={tempTag}
                onChange={(e) => setTempTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Enter tag and press Add"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {newProduct.tags?.map((tag, index) => (
                <div
                  key={index}
                  className="bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-colors hover:bg-red-100"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-700 hover:text-red-800 text-lg font-bold"
                    title="Remove tag"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Note Field */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Note
              <button
                type="button"
                onClick={() => setAdminNoteSuggestions(!adminNoteSuggestions)}
                className="ml-2 text-xs text-blue-500 hover:text-blue-700"
              >
                {adminNoteSuggestions ? 'Hide suggestions' : 'Show suggestions'}
              </button>
            </label>
            
            {adminNoteSuggestions && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {commonAdminNotes.map((note, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setNewProduct(prev => ({ ...prev, adminNote: note }))}
                      className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100 transition-colors"
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
              value={newProduct.adminNote}
              onChange={(e) => setNewProduct(p => ({ ...p, adminNote: e.target.value }))}
              placeholder="Internal note for administrators only"
              rows={2}
            />
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (max 3)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-colors hover:border-red-300">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="text-red-500 font-medium">Click to upload</span> or drag and drop
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 3MB each</p>
              </label>
            </div>
            <div className="flex gap-4 mt-4 flex-wrap">
              {tempImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setTempImages(prev => prev.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
              {newProduct.images?.map((image: string, index: number) => (
                <div key={`existing-${index}`} className="relative">
                  <img
                    src={image}
                    alt={`Existing ${index}`}
                    className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                  />
                  <span className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-1 rounded-bl-lg">
                    Existing
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description - Using the new Editor Component */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <DescriptionEditor
              value={newProduct.description}
              onChange={handleDescriptionChange}
              placeholder="Enter product description..."
            />
          </div>

          {/* Specifications - Using the same Editor Component */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
            <DescriptionEditor
              value={newProduct.specifications}
              onChange={handleSpecificationsChange}
              placeholder="Enter product specifications..."
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;