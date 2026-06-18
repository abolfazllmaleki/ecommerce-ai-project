export const CacheNamespaces = {
  PRODUCTS_LIST: 'catalog:products',
  PRODUCT_LIST_FEATURED: 'catalog:featuredproducts',
  PRODUCT_LIST_POPULAR: 'catalog:popularproducts',
  PRODUCT_LIST_TOP_RATED: 'catalog:topratedproducts',
  PRODUCT_LIST_DISCOUNT: 'catalog:discountproducts',
  PRODUCT_LIST_RELATED: 'catalog:relatedproducts',

  PRODUCT_DETAIL: 'catalog:product',
  CATEGORIES_LIST: 'catalog:categories',
} as const;

export type CacheNamespace =
  (typeof CacheNamespaces)[keyof typeof CacheNamespaces];
