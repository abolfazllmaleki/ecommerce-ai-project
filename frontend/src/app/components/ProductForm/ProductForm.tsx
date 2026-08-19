'use client';

import { useState, useRef, useEffect } from 'react';
import {
  FiPlus,
  FiX,
  FiMaximize2,
  FiMinimize2,
  FiPackage,
  FiTag,
  FiDollarSign,
  FiLayers,
  FiImage,
  FiFileText,
  FiSettings,
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiUploadCloud,
  FiTrash2,
} from 'react-icons/fi';

import { Product, Category } from '../../types/types';
import DescriptionEditor from '../DescriptionEditor/DescriptionEditor';

interface ProductFormProps {
  onSubmit: (newProduct: Product) => void;
  editingProduct?: Product | null;
  onCancel?: () => void;
}

interface ProductFormState {
  name: string;
  price: number;
  discount: number;
  stock: number;
  sizes: string[];
  colors: string[];
  images: string[];
  description: string;
  specifications: string;
  adminNote: string;
  categoryId: string;
  brand: string;
  tags: string[];
  details: { key: string; value: string }[];
}

const EMPTY_PRODUCT: ProductFormState = {
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
};

const commonColors = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#6b7280',
  '#000000',
];

const commonAdminNotes = [
  'Limited stock - only a few left',
  'Free shipping on this product',
  'Best seller - reorder soon',
  'New arrival - promote in marketing',
  'Seasonal product - will be discontinued after season',
  'On sale - limited time offer',
  'Custom order possible - contact for details',
  'Pre-order available - ships in 2-3 weeks',
];

const ProductForm = ({
  onSubmit,
  editingProduct = null,
  onCancel,
}: ProductFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [newProduct, setNewProduct] =
    useState<ProductFormState>(EMPTY_PRODUCT);

  const [tempImages, setTempImages] = useState<File[]>([]);
  const [tempTag, setTempTag] = useState('');
  const [customColor, setCustomColor] = useState('#3b82f6');

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAdminSuggestions, setShowAdminSuggestions] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [nameTouched, setNameTouched] = useState(false);

  const colorPickerRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /*
   * -----------------------------------------
   * Helpers
   * -----------------------------------------
   */

  const getInitialProduct = (): ProductFormState => {
    if (!editingProduct) {
      return {
        ...EMPTY_PRODUCT,
        sizes: [],
        colors: [],
        images: [],
        tags: [],
        details: [],
      };
    }

    const categoryValue =
      typeof editingProduct.category === 'object'
        ? editingProduct.category?._id
        : editingProduct.category;

    return {
      ...EMPTY_PRODUCT,
      ...(editingProduct as any),
      categoryId:
        categoryValue ||
        (editingProduct as any).categoryId ||
        '',
      sizes: editingProduct.sizes || [],
      colors: editingProduct.colors || [],
      images: editingProduct.images || [],
      tags: editingProduct.tags || [],
      // details: editingProduct.details || [],
    };
  };

  const setField = <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K]
  ) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const showError = (message: string) => {
    setError(message);

    window.setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const showSuccess = (message: string) => {
    setSuccess(message);

    window.setTimeout(() => {
      setSuccess(null);
    }, 4000);
  };

  /*
   * -----------------------------------------
   * Product Name Validation
   * -----------------------------------------
   */

  const trimmedProductName = newProduct.name.trim();

  const productNameError =
    nameTouched && trimmedProductName.length < 3
      ? 'Product name must contain at least 3 characters.'
      : '';

  const isProductNameValid = trimmedProductName.length >= 3;

  /*
   * -----------------------------------------
   * Fetch Categories
   * -----------------------------------------
   */

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        showError('Unable to load categories.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /*
   * -----------------------------------------
   * Reset / Edit Product
   * -----------------------------------------
   */

  useEffect(() => {
    setNewProduct(getInitialProduct());
    setTempImages([]);
    setTempTag('');
    setError(null);
    setSuccess(null);
    setNameTouched(false);
  }, [editingProduct]);

  /*
   * -----------------------------------------
   * Outside Click
   * -----------------------------------------
   */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(target)
      ) {
        setShowCategoryDropdown(false);
      }

      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(target)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /*
   * -----------------------------------------
   * Escape / Expanded Mode
   * -----------------------------------------
   */

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  /*
   * -----------------------------------------
   * Image Preview Cleanup
   * -----------------------------------------
   */

  useEffect(() => {
    const urls = tempImages.map((file) => URL.createObjectURL(file));

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [tempImages]);

  /*
   * -----------------------------------------
   * Category
   * -----------------------------------------
   */

  const handleCategorySelect = (categoryId: string) => {
    setField('categoryId', categoryId);
    setShowCategoryDropdown(false);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(
      (cat) => cat._id === categoryId
    );

    return category?.name || 'Select Category';
  };

  /*
   * -----------------------------------------
   * Images
   * -----------------------------------------
   */

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        showError(`${file.name} is not a valid image.`);
        return false;
      }

      if (file.size > 3 * 1024 * 1024) {
        showError(`${file.name} is larger than 3MB.`);
        return false;
      }

      return true;
    });

    setTempImages((prev) =>
      [...prev, ...validFiles].slice(0, 3)
    );

    e.target.value = '';
  };

  const removeTempImage = (index: number) => {
    setTempImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /*
   * -----------------------------------------
   * Colors
   * -----------------------------------------
   */

  const handleColorSelect = (color: string) => {
    setNewProduct((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleAddCustomColor = () => {
    if (!customColor) return;

    if (!newProduct.colors.includes(customColor)) {
      setNewProduct((prev) => ({
        ...prev,
        colors: [...prev.colors, customColor],
      }));
    }

    setShowColorPicker(false);
  };

  const handleRemoveColor = (color: string) => {
    setNewProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  /*
   * -----------------------------------------
   * Tags
   * -----------------------------------------
   */

  const handleAddTag = () => {
    const tag = tempTag.trim();

    if (!tag) return;

    if (newProduct.tags.includes(tag)) {
      setTempTag('');
      return;
    }

    setNewProduct((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    setTempTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setNewProduct((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  /*
   * -----------------------------------------
   * Description
   * -----------------------------------------
   */

  const handleDescriptionChange = (html: string) => {
    setField('description', html);
  };

  const handleSpecificationsChange = (html: string) => {
    setField('specifications', html);
  };

  /*
   * -----------------------------------------
   * Validation
   * -----------------------------------------
   */

  const validateForm = () => {
    const name = newProduct.name.trim();

    if (name.length < 3) {
      setNameTouched(true);
      showError(
        'Product name must contain at least 3 characters.'
      );

      return false;
    }

    if (!newProduct.categoryId) {
      showError('Please select a product category.');

      return false;
    }

    if (newProduct.price < 0) {
      showError('Price cannot be negative.');

      return false;
    }

    if (newProduct.discount < 0 || newProduct.discount > 100) {
      showError('Discount must be between 0 and 100.');

      return false;
    }

    if (newProduct.stock < 0) {
      showError('Stock cannot be negative.');

      return false;
    }

    return true;
  };

  /*
   * -----------------------------------------
   * Submit
   * -----------------------------------------
   */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setNameTouched(true);
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedUrls: string[] = [];

      if (tempImages.length > 0) {
        const formData = new FormData();

        tempImages.forEach((file) => {
          formData.append('images', file);
        });

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/images`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          throw new Error('Image upload failed');
        }

        const data = await uploadRes.json();

        uploadedUrls = Array.isArray(data.images)
          ? data.images
          : [];

        if (uploadedUrls.length === 0) {
          throw new Error(
            'Images were uploaded but no image URLs were returned.'
          );
        }
      }

      const allImages = [
        ...(editingProduct?.images || []),
        ...uploadedUrls,
      ].slice(0, 3);

      const productPayload = {
        ...newProduct,
        name: newProduct.name.trim(),
        brand: newProduct.brand.trim(),
        adminNote: newProduct.adminNote.trim(),
        categoryId: newProduct.categoryId,
        images: allImages,
      };

      onSubmit(productPayload as any);

      showSuccess(
        editingProduct
          ? 'Product updated successfully.'
          : 'Product created successfully.'
      );

      if (!editingProduct) {
        setNewProduct({
          ...EMPTY_PRODUCT,
          sizes: [],
          colors: [],
          images: [],
          tags: [],
          details: [],
        });

        setTempImages([]);
        setTempTag('');
        setNameTouched(false);
      }
    } catch (error) {
      console.error('Submit error:', error);

      showError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while saving the product.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * -----------------------------------------
   * UI Helpers
   * -----------------------------------------
   */

  const SectionHeader = ({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description?: string;
  }) => (
    <div className="flex items-start gap-3 mb-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#DF2648]">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900">
          {title}
        </h3>

        {description && (
          <p className="mt-0.5 text-xs text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  const inputClass = (
    hasError = false
  ) =>
    `w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition-all ${
      hasError
        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100'
        : 'border-gray-200 bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100'
    }`;

  /*
   * -----------------------------------------
   * Render
   * -----------------------------------------
   */

  return (
    <div
      className={
        isExpanded
          ? 'fixed inset-0 z-50 overflow-y-auto bg-gray-50 p-4 md:p-8'
          : 'relative'
      }
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`mx-auto ${
          isExpanded ? 'max-w-7xl' : 'max-w-5xl'
        }`}
      >
        {/* Header */}
        <header className="relative mb-6 overflow-hidden rounded-3xl border border-red-100 bg-white px-5 py-5 shadow-sm md:px-7 md:py-6">
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-100/60 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-40 w-40 rounded-full bg-red-50 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-[#DF2648] shadow-sm">
                <FiPackage size={22} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    {editingProduct
                      ? 'Edit Product'
                      : 'Add New Product'}
                  </h1>

                  <span className="hidden rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#DF2648] sm:inline-flex">
                    Admin
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {editingProduct
                    ? 'Update product information and inventory'
                    : 'Create and configure a new product'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#DF2648]"
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-[#DF2648]"
              >
                {isExpanded ? (
                  <>
                    <FiMinimize2 />
                    Collapse
                  </>
                ) : (
                  <>
                    <FiMaximize2 />
                    Expand
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Alerts */}
        {(error || success) && (
          <div className="mb-6 space-y-3">
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <FiAlertCircle className="mt-0.5 shrink-0 text-red-500" />

                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-700">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX />
                </button>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
                <FiCheckCircle className="mt-0.5 shrink-0 text-green-500" />

                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-700">
                    {success}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSuccess(null)}
                  className="text-green-500 hover:text-green-700"
                >
                  <FiX />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* LEFT / MAIN */}
          <div className="space-y-6 xl:col-span-2">
            {/* Basic Information */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
              <SectionHeader
                icon={<FiPackage />}
                title="Basic Information"
                description="Core information customers will see"
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">
                      Product Name <span className="text-red-500">*</span>
                    </label>

                    <span
                      className={`text-xs ${
                        isProductNameValid
                          ? 'text-gray-400'
                          : 'text-red-500'
                      }`}
                    >
                      {newProduct.name.length}/3+
                    </span>
                  </div>

                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setField('name', e.target.value)
                    }
                    onBlur={() => setNameTouched(true)}
                    placeholder="Enter product name"
                    className={inputClass(
                      !!productNameError
                    )}
                    maxLength={150}
                    aria-invalid={!!productNameError}
                  />

                  {productNameError ? (
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <FiAlertCircle />
                      {productNameError}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-gray-400">
                      Product name must contain at least 3 characters.
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>

                  <div
                    ref={categoryDropdownRef}
                    className="relative"
                  >
                    <button
                      type="button"
                      disabled={loadingCategories}
                      onClick={() =>
                        setShowCategoryDropdown(
                          !showCategoryDropdown
                        )
                      }
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left text-sm transition hover:border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                    >
                      <span
                        className={
                          newProduct.categoryId
                            ? 'text-gray-800'
                            : 'text-gray-400'
                        }
                      >
                        {loadingCategories
                          ? 'Loading categories...'
                          : getCategoryName(
                              newProduct.categoryId
                            )}
                      </span>

                      <FiChevronDown
                        className={`text-gray-400 transition-transform ${
                          showCategoryDropdown
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    </button>

                    {showCategoryDropdown &&
                      !loadingCategories && (
                        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-xl">
                          {categories.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                              No categories found.
                            </div>
                          ) : (
                            categories.map((category) => (
                              <button
                                key={category._id}
                                type="button"
                                onClick={() =>
                                  handleCategorySelect(
                                    category._id
                                  )
                                }
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                                  newProduct.categoryId ===
                                  category._id
                                    ? 'bg-red-50 font-semibold text-[#DF2648]'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {category.name}

                                {newProduct.categoryId ===
                                  category._id && (
                                  <FiCheckCircle />
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Brand
                  </label>

                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) =>
                      setField('brand', e.target.value)
                    }
                    placeholder="Enter brand name"
                    className={inputClass()}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Price ($) <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="number"
                      value={newProduct.price || ''}
                      onChange={(e) =>
                        setField(
                          'price',
                          Number(e.target.value)
                        )
                      }
                      min={0}
                      step="0.01"
                      className={`${inputClass()} pl-10`}
                    />
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Discount
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      value={newProduct.discount || ''}
                      onChange={(e) =>
                        setField(
                          'discount',
                          Number(e.target.value)
                        )
                      }
                      min={0}
                      max={100}
                      className={`${inputClass()} pr-10`}
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      %
                    </span>
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Stock <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <FiLayers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="number"
                      value={newProduct.stock || ''}
                      onChange={(e) =>
                        setField(
                          'stock',
                          Number(e.target.value)
                        )
                      }
                      min={0}
                      className={`${inputClass()} pl-10`}
                    />
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Sizes
                  </label>

                  <input
                    type="text"
                    value={newProduct.sizes.join(', ')}
                    onChange={(e) =>
                      setField(
                        'sizes',
                        e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    placeholder="S, M, L, XL"
                    className={inputClass()}
                  />

                  <p className="mt-1.5 text-xs text-gray-400">
                    Separate sizes with commas.
                  </p>
                </div>
              </div>
            </section>

            {/* Colors */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
              <SectionHeader
                icon={<FiTag />}
                title="Colors"
                description="Choose available product colors"
              />

              <div className="flex flex-wrap gap-2">
                {commonColors.map((color) => {
                  const selected =
                    newProduct.colors.includes(color);

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        handleColorSelect(color)
                      }
                      className={`group relative h-10 w-10 rounded-xl border-2 transition ${
                        selected
                          ? 'scale-105 border-[#DF2648] ring-2 ring-red-100'
                          : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: color,
                      }}
                      title={color}
                    >
                      {selected && (
                        <FiCheckCircle className="absolute inset-0 m-auto text-white drop-shadow" />
                      )}
                    </button>
                  );
                })}

                {/* Custom */}
                <div
                  ref={colorPickerRef}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setShowColorPicker(
                        !showColorPicker
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-500 transition hover:border-red-300 hover:text-[#DF2648]"
                    title="Custom color"
                  >
                    <FiPlus />
                  </button>

                  {showColorPicker && (
                    <div className="absolute left-0 top-12 z-20 w-64 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                      <p className="mb-3 text-sm font-semibold text-gray-700">
                        Custom Color
                      </p>

                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) =>
                          setCustomColor(
                            e.target.value
                          )
                        }
                        className="h-10 w-full cursor-pointer rounded-lg border"
                      />

                      <div className="mt-3 flex gap-2">
                        <input
                          value={customColor}
                          onChange={(e) =>
                            setCustomColor(
                              e.target.value
                            )
                          }
                          className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-2 text-xs"
                        />

                        <button
                          type="button"
                          onClick={
                            handleAddCustomColor
                          }
                          className="rounded-lg bg-[#DF2648] px-3 text-xs font-semibold text-white hover:bg-red-600"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected */}
              {newProduct.colors.length > 0 && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Selected Colors
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {newProduct.colors.map((color) => (
                      <div
                        key={color}
                        className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1 pl-1.5 pr-2"
                      >
                        <span
                          className="h-5 w-5 rounded-full border border-gray-200"
                          style={{
                            backgroundColor: color,
                          }}
                        />

                        <span className="text-xs text-gray-600">
                          {color}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveColor(color)
                          }
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Tags */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
              <SectionHeader
                icon={<FiTag />}
                title="Tags"
                description="Add searchable labels to the product"
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempTag}
                  onChange={(e) =>
                    setTempTag(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Type a tag and press Enter"
                  className={`${inputClass()} flex-1`}
                />

                <button
                  type="button"
                  onClick={handleAddTag}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#DF2648] px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  <FiPlus />
                  Add
                </button>
              </div>

              {newProduct.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {newProduct.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-[#DF2648]"
                    >
                      {tag}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTag(tag)
                        }
                        className="hover:text-red-800"
                      >
                        <FiX />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Description */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
              <SectionHeader
                icon={<FiFileText />}
                title="Product Content"
                description="Detailed product description and specifications"
              />

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Description
                  </label>

                  <DescriptionEditor
                    value={newProduct.description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter product description..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Specifications
                  </label>

                  <DescriptionEditor
                    value={
                      newProduct.specifications
                    }
                    onChange={
                      handleSpecificationsChange
                    }
                    placeholder="Enter product specifications..."
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* Product Status */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <SectionHeader
                icon={<FiSettings />}
                title="Product Overview"
                description="Quick summary"
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-500">
                    Category
                  </span>

                  <span className="max-w-[150px] truncate text-right text-sm font-semibold text-gray-800">
                    {getCategoryName(
                      newProduct.categoryId
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-500">
                    Price
                  </span>

                  <span className="text-sm font-semibold text-gray-800">
                    ${newProduct.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-500">
                    Stock
                  </span>

                  <span
                    className={`text-sm font-semibold ${
                      newProduct.stock === 0
                        ? 'text-red-600'
                        : 'text-gray-800'
                    }`}
                  >
                    {newProduct.stock}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-500">
                    Images
                  </span>

                  <span className="text-sm font-semibold text-gray-800">
                    {Math.min(
                      3,
                      (newProduct.images?.length || 0) +
                        tempImages.length
                    )}
                    /3
                  </span>
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <SectionHeader
                icon={<FiImage />}
                title="Product Images"
                description="Maximum 3 images, 3MB each"
              />

              <label
                htmlFor="image-upload"
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center transition hover:border-red-300 hover:bg-red-50/30"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm transition group-hover:text-[#DF2648]">
                  <FiUploadCloud size={24} />
                </div>

                <p className="text-sm font-semibold text-gray-700">
                  Click to upload
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  PNG, JPG, GIF up to 3MB
                </p>

                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={
                    newProduct.images.length +
                      tempImages.length >=
                    3
                  }
                  className="hidden"
                />
              </label>

              {(tempImages.length > 0 ||
                newProduct.images?.length > 0) && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {newProduct.images?.map(
                    (image: string, index: number) => (
                      <div
                        key={`existing-${index}`}
                        className="relative aspect-square overflow-hidden rounded-xl border border-gray-200"
                      >
                        <img
                          src={image}
                          alt={`Existing ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <span className="absolute left-1 top-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white">
                          Existing
                        </span>
                      </div>
                    )
                  )}

                  {tempImages.map((file, index) => {
                    const url =
                      URL.createObjectURL(file);

                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200"
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeTempImage(index)
                          }
                          className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-lg bg-red-500 text-white opacity-0 shadow transition group-hover:opacity-100"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Admin Note */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <SectionHeader
                icon={<FiSettings />}
                title="Admin Note"
                description="Visible to administrators only"
              />

              <button
                type="button"
                onClick={() =>
                  setShowAdminSuggestions(
                    !showAdminSuggestions
                  )
                }
                className="mb-3 text-xs font-semibold text-[#DF2648] hover:text-red-700"
              >
                {showAdminSuggestions
                  ? 'Hide suggestions'
                  : 'Show quick suggestions'}
              </button>

              {showAdminSuggestions && (
                <div className="mb-3 max-h-40 space-y-1.5 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-2">
                  {commonAdminNotes.map((note) => (
                    <button
                      key={note}
                      type="button"
                      onClick={() =>
                        setField(
                          'adminNote',
                          note
                        )
                      }
                      className="block w-full rounded-lg bg-white px-3 py-2 text-left text-xs text-gray-600 transition hover:bg-red-50 hover:text-[#DF2648]"
                    >
                      {note}
                    </button>
                  ))}
                </div>
              )}

              <textarea
                value={newProduct.adminNote}
                onChange={(e) =>
                  setField(
                    'adminNote',
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Internal note for administrators..."
                className={inputClass() + ' resize-none'}
              />
            </section>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Ready to save?
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                Make sure the product name contains at least 3
                characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={
                isSubmitting || !isProductNameValid
              }
              className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-[#DF2648] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <FiPlus />

                  {editingProduct
                    ? 'Update Product'
                    : 'Add Product'}
                </>
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="pb-8 pt-4 text-center text-xs text-gray-400">
            Press <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 font-medium">
              ESC
            </kbd>{' '}
            to exit expanded mode.
          </div>
        )}
      </form>
    </div>
  );
};

export default ProductForm;