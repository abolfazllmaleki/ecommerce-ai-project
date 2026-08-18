'use client';

import React, { useState } from 'react';
import {
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiTag,
  FiImage,
  FiX,
  FiCheck,
} from 'react-icons/fi';

import { Product } from '../../types/types';
import ProductForm from '../ProductForm/ProductForm';

interface ProductTableProps {
  products: Product[];

  onUpdate: (
    product: Product,
  ) => void;

  onDelete: (
    productId: string,
  ) => void;
}

const ProductTable = ({
  products,
  onUpdate,
  onDelete,
}: ProductTableProps) => {
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [expandedProduct, setExpandedProduct] =
    useState<string | null>(null);

  // ==========================================================================
  // Edit
  // ==========================================================================

  const handleEdit = (
    product: Product,
  ) => {
    setEditingProduct({
      ...product,
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleSave = (
    updatedProduct: Product,
  ) => {
    onUpdate(updatedProduct);
    setEditingProduct(null);
  };

  // ==========================================================================
  // Expand
  // ==========================================================================

  const toggleExpand = (
    productId: string,
  ) => {
    setExpandedProduct((prev) =>
      prev === productId
        ? null
        : productId,
    );
  };

  // ==========================================================================
  // Editing
  // ==========================================================================

  if (editingProduct) {
    return (
      <div className="bg-white p-5 md:p-6">
        <div
          className="
            mb-5
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-red-100
            bg-red-50/50
            px-4
            py-3
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
              <FiEdit2 size={16} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Edit Product
              </p>

              <p className="text-xs text-gray-400">
                Update product information
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={handleCancelEdit}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-gray-400
              transition-colors
              hover:bg-red-100
              hover:text-[#DF2648]
            "
          >
            <FiX size={16} />
          </button>
        </div>

        <ProductForm
          onSubmit={handleSave}
          editingProduct={editingProduct}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  // ==========================================================================
  // Table
  // ==========================================================================

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">

        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}

        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70">

            <th
              className="
                w-[270px]
                px-4
                py-3
                text-left
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Product
            </th>

            <th
              className="
                w-[140px]
                px-4
                py-3
                text-left
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Category
            </th>

            <th
              className="
                w-[125px]
                px-4
                py-3
                text-left
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Price
            </th>

            <th
              className="
                w-[130px]
                px-4
                py-3
                text-left
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Stock
            </th>

            <th
              className="
                w-[165px]
                px-4
                py-3
                text-right
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Actions
            </th>

          </tr>
        </thead>

        {/* ================================================================= */}
        {/* BODY */}
        {/* ================================================================= */}

        <tbody className="divide-y divide-gray-100">

          {products.map((product) => {
            const productId =
              (product as Product & {
                _id?: string;
              })._id ||
              product.id;

            const isExpanded =
              expandedProduct ===
              productId;

            const category =
              typeof product.category ===
              'string'
                ? product.category
                : product.category?.name;

            return (
              <React.Fragment
                key={productId}
              >

                {/* ========================================================= */}
                {/* MAIN ROW */}
                {/* ========================================================= */}

                <tr
                  className={`
                    group
                    h-[68px]
                    transition-colors
                    duration-200
                    ${
                      isExpanded
                        ? 'bg-red-50/30'
                        : 'hover:bg-gray-50/70'
                    }
                  `}
                >

                  {/* PRODUCT */}

                  <td className="px-4 py-2">

                    <div className="flex items-center gap-3">

                      {product.images?.length ? (
                        <img
                          src={
                            product.images[0]
                          }
                          alt={
                            product.name
                          }
                          className="
                            h-10
                            w-10
                            shrink-0
                            rounded-xl
                            border
                            border-gray-100
                            object-cover
                            bg-gray-50
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-red-50
                            text-red-400
                          "
                        >
                          <FiPackage
                            size={17}
                          />
                        </div>
                      )}

                      <div className="min-w-0">

                        <p
                          className="
                            max-w-[190px]
                            truncate
                            text-sm
                            font-medium
                            text-gray-800
                          "
                          title={
                            product.name
                          }
                        >
                          {product.name}
                        </p>

                        <p
                          className="
                            max-w-[190px]
                            truncate
                            text-[11px]
                            text-gray-400
                          "
                        >
                          {product.brand ||
                            'No brand'}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* CATEGORY */}

                  <td className="px-4 py-2">

                    <span
                      className="
                        inline-flex
                        max-w-[120px]
                        items-center
                        gap-1.5
                        truncate
                        rounded-full
                        bg-red-50
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-[#DF2648]
                      "
                    >
                      <FiTag
                        size={11}
                        className="shrink-0"
                      />

                      <span className="truncate">
                        {category ||
                          'Uncategorized'}
                      </span>
                    </span>

                  </td>

                  {/* PRICE */}

                  <td className="px-4 py-2">

                    <div>
                      <span className="text-sm font-semibold text-gray-800">
                        $
                        {product.price?.toLocaleString()}
                      </span>

                      {product.discount >
                        0 && (
                        <div className="mt-0.5 flex items-center gap-1.5">

                          <span className="text-[10px] text-gray-400 line-through">
                            $
                            {(
                              product.price /
                              (1 -
                                product.discount /
                                  100)
                            ).toFixed(2)}
                          </span>

                          <span
                            className="
                              rounded-full
                              bg-red-50
                              px-1.5
                              py-0.5
                              text-[9px]
                              font-semibold
                              text-red-500
                            "
                          >
                            -
                            {
                              product.discount
                            }%
                          </span>

                        </div>
                      )}
                    </div>

                  </td>

                  {/* STOCK */}

                  <td className="px-4 py-2">

                    <div className="flex items-center gap-2">

                      <span
                        className={`
                          min-w-[22px]
                          text-sm
                          font-semibold
                          ${
                            product.stock >
                            10
                              ? 'text-emerald-600'
                              : product.stock >
                                  0
                              ? 'text-amber-600'
                              : 'text-red-500'
                          }
                        `}
                      >
                        {product.stock}
                      </span>

                      <div
                        className="
                          h-1.5
                          w-14
                          overflow-hidden
                          rounded-full
                          bg-gray-100
                        "
                      >
                        <div
                          className={`
                            h-full
                            rounded-full
                            ${
                              product.stock >
                              10
                                ? 'bg-emerald-500'
                                : product.stock >
                                    0
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }
                          `}
                          style={{
                            width: `${Math.min(
                              100,
                              (product.stock /
                                50) *
                                100,
                            )}%`,
                          }}
                        />
                      </div>

                    </div>

                  </td>

                  {/* ACTIONS */}

                  <td className="px-4 py-2">

                    <div className="flex items-center justify-end gap-1.5">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            product,
                          )
                        }
                        className="
                          inline-flex
                          h-8
                          items-center
                          justify-center
                          gap-1.5
                          rounded-lg
                          bg-red-50
                          px-2.5
                          text-xs
                          font-medium
                          text-red-500
                          transition-all
                          hover:bg-red-100
                          active:scale-95
                        "
                      >
                        <FiEdit2 size={13} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            productId
                          ) {
                            onDelete(
                              productId,
                            );
                          }
                        }}
                        className="
                          inline-flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-gray-50
                          text-gray-400
                          transition-all
                          hover:bg-red-50
                          hover:text-red-500
                          active:scale-95
                        "
                        title="Delete product"
                      >
                        <FiTrash2
                          size={14}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleExpand(
                            productId,
                          )
                        }
                        className={`
                          inline-flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          transition-all
                          active:scale-95
                          ${
                            isExpanded
                              ? 'bg-red-100 text-red-500'
                              : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500'
                          }
                        `}
                        title={
                          isExpanded
                            ? 'Hide details'
                            : 'Show details'
                        }
                      >
                        {isExpanded ? (
                          <FiChevronUp
                            size={15}
                          />
                        ) : (
                          <FiChevronDown
                            size={15}
                          />
                        )}
                      </button>

                    </div>

                  </td>
                </tr>

                {/* ========================================================= */}
                {/* DETAILS */}
                {/* ========================================================= */}

                {isExpanded && (
                  <tr className="border-b border-red-50 bg-red-50/20">

                    <td
                      colSpan={5}
                      className="px-5 py-5"
                    >

                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                        {/* DETAILS */}

                        <div
                          className="
                            rounded-2xl
                            border
                            border-red-100
                            bg-white
                            p-4
                            shadow-sm
                          "
                        >

                          <div className="mb-4 flex items-center gap-2">

                            <div
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-red-50
                                text-red-500
                              "
                            >
                              <FiPackage
                                size={15}
                              />
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold text-gray-800">
                                Product Details
                              </h3>

                              <p className="text-[11px] text-gray-400">
                                Additional information
                              </p>
                            </div>

                          </div>

                          <div className="space-y-4">

                            {/* DESCRIPTION */}

                            <div>
                              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                Description
                              </p>

                              <p className="text-sm leading-6 text-gray-600">
                                {product.description ||
                                  'No description provided'}
                              </p>
                            </div>

                            {/* SIZES */}

                            <div>
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                Sizes
                              </p>

                              <div className="flex flex-wrap gap-1.5">

                                {product.sizes?.length ? (
                                  product.sizes.map(
                                    (
                                      size,
                                      index,
                                    ) => (
                                      <span
                                        key={
                                          index
                                        }
                                        className="
                                          rounded-lg
                                          bg-gray-100
                                          px-2.5
                                          py-1
                                          text-xs
                                          font-medium
                                          text-gray-600
                                        "
                                      >
                                        {size}
                                      </span>
                                    ),
                                  )
                                ) : (
                                  <span className="text-xs text-gray-400">
                                    No sizes specified
                                  </span>
                                )}

                              </div>
                            </div>

                            {/* COLORS */}

                            <div>
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                Colors
                              </p>

                              <div className="flex flex-wrap gap-2">

                                {product.colors?.length ? (
                                  product.colors.map(
                                    (
                                      color,
                                      index,
                                    ) => (
                                      <div
                                        key={
                                          index
                                        }
                                        className="
                                          inline-flex
                                          items-center
                                          gap-1.5
                                          rounded-lg
                                          bg-gray-50
                                          px-2
                                          py-1
                                        "
                                      >
                                        <span
                                          className="
                                            h-3
                                            w-3
                                            rounded-full
                                            border
                                            border-gray-200
                                          "
                                          style={{
                                            backgroundColor:
                                              color,
                                          }}
                                        />

                                        <span className="text-xs text-gray-600">
                                          {color}
                                        </span>
                                      </div>
                                    ),
                                  )
                                ) : (
                                  <span className="text-xs text-gray-400">
                                    No colors specified
                                  </span>
                                )}

                              </div>
                            </div>

                            {/* TAGS */}

                            <div>
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                Tags
                              </p>

                              <div className="flex flex-wrap gap-1.5">

                                {product.tags?.length ? (
                                  product.tags.map(
                                    (
                                      tag,
                                      index,
                                    ) => (
                                      <span
                                        key={
                                          index
                                        }
                                        className="
                                          rounded-full
                                          bg-red-50
                                          px-2.5
                                          py-1
                                          text-[11px]
                                          font-medium
                                          text-red-500
                                        "
                                      >
                                        #
                                        {tag}
                                      </span>
                                    ),
                                  )
                                ) : (
                                  <span className="text-xs text-gray-400">
                                    No tags
                                  </span>
                                )}

                              </div>
                            </div>

                          </div>
                        </div>

                        {/* IMAGES */}

                        <div
                          className="
                            rounded-2xl
                            border
                            border-red-100
                            bg-white
                            p-4
                            shadow-sm
                          "
                        >

                          <div className="mb-4 flex items-center gap-2">

                            <div
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-red-50
                                text-red-500
                              "
                            >
                              <FiImage
                                size={15}
                              />
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold text-gray-800">
                                Product Images
                              </h3>

                              <p className="text-[11px] text-gray-400">
                                {product.images?.length ||
                                  0}{' '}
                                images
                              </p>
                            </div>

                          </div>

                          {product.images?.length ? (
                            <div className="grid grid-cols-3 gap-2">

                              {product.images.map(
                                (
                                  image,
                                  index,
                                ) => (
                                  <img
                                    key={
                                      index
                                    }
                                    src={image}
                                    alt={`${product.name} ${index + 1}`}
                                    className="
                                      aspect-square
                                      w-full
                                      rounded-xl
                                      border
                                      border-gray-100
                                      object-cover
                                      transition-transform
                                      duration-200
                                      hover:scale-[1.02]
                                    "
                                  />
                                ),
                              )}

                            </div>
                          ) : (
                            <div
                              className="
                                flex
                                min-h-[180px]
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                bg-gray-50
                                text-gray-400
                              "
                            >
                              <FiImage
                                size={25}
                              />

                              <p className="mt-2 text-xs">
                                No images available
                              </p>
                            </div>
                          )}

                        </div>

                      </div>
                    </td>
                  </tr>
                )}

              </React.Fragment>
            );
          })}

        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;