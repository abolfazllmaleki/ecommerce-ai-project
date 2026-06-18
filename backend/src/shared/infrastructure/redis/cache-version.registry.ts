import { CacheNamespace } from './cache.namespaces';

const CACHE_VERSION_REGISTRY: Record<CacheNamespace, string> = {
  'catalog:products': 'v1',
  'catalog:featuredproducts': 'v1',
  'catalog:popularproducts': 'v1',
  'catalog:topratedproducts': 'v1',
  'catalog:discountproducts': 'v1',
  'catalog:relatedproducts': 'v1',

  'catalog:product': 'v1',
  'catalog:categories': 'v1',
};

export function getCacheVersion(namespace: CacheNamespace): string {
  return CACHE_VERSION_REGISTRY[namespace];
}
