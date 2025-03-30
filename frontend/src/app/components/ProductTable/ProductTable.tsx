'use client';
import { useState } from 'react';
import { Product, CATEGORIES } from '../../types/types';

interface ProductTableProps {
  products: Product[];
  onUpdate: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductTable = ({ products, onUpdate, onDelete }: ProductTableProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => setEditingProduct(product);
  const handleSave = () => {
    if (editingProduct) {
      onUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Product</th>
            <th className="text-left p-3">Category</th>
            <th className="text-left p-3">Price</th>
            <th className="text-left p-3">Sizes</th>
            <th className="text-left p-3">Colors</th>
            <th className="text-left p-3">Images</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b">
              <td className="p-3">
                {editingProduct?._id === product._id ? (
                  <input
                    value={editingProduct?.name||''}
                    onChange={(e) =>
                      setEditingProduct((p) =>
                        p ? { ...p, name: e.target.value } : null
                      )
                    }
                    className="p-1 border rounded"
                  />
                ) : (
                  product.name
                )}
              </td>
              <td className="p-3">
                {editingProduct?._id === product._id ? (
                  <select
                    value={editingProduct?.category || ''}
                    onChange={(e) =>
                      setEditingProduct((p) =>
                        p ? { ...p, category: e.target.value } : null
                      )
                    }
                    className="p-1 border rounded"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                ) : (
                  product.category
                )}
              </td>
              <td className="p-3">
                {editingProduct?._id === product._id ? (
                  <input
                    type="number"
                    value={editingProduct?.price || 0}
                    onChange={(e) =>
                      setEditingProduct((p) =>
                        p ? { ...p, price: Number(e.target.value) } : null
                      )
                    }
                    className="w-24 p-1 border rounded"
                  />
                ) : (
                  `₦${product.price.toLocaleString()}`
                )}
              </td>
              <td className="p-3">
                {editingProduct?._id === product._id ? (
                  <input
                    value={editingProduct?.sizes?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingProduct((p) =>
                        p
                          ? {
                              ...p,
                              sizes: e.target.value
                                .split(',')
                                .map((s) => s.trim()),
                            }
                          : null
                      )
                    }
                    className="p-1 border rounded"
                  />
                ) : (
                  (product.sizes ?? []).join(', ')

                )}
              </td>
              <td className="p-3">
                <div className="flex gap-1">
                  {(product.colors || []).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </td>
              <td className="p-3">
                <div className="flex gap-1">
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Product ${index}`}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ))}
                </div>
              </td>
              <td className="p-3 space-x-2">
                {editingProduct?._id === product._id ? (
                  <button
                    className="text-[#DF2648] hover:underline"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="text-[#DF2648] hover:underline"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => onDelete(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
