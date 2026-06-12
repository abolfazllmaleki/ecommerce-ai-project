export const CacheNamespaces = {
  PRODUCTS_LIST: 'catalog:products',
  PRODUCT_DETAIL: 'catalog:product',
  CATEGORIES_LIST: 'catalog:categories',
} as const;

export type CacheNamespace =
  (typeof CacheNamespaces)[keyof typeof CacheNamespaces];