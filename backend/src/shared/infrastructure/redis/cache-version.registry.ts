import { CacheNamespace } from './cache.namespaces';

const CACHE_VERSION_REGISTRY: Record<CacheNamespace, string> = {
  'catalog:products': 'v1',
  'catalog:product': 'v1',
  'catalog:categories': 'v1',
};

export function getCacheVersion(namespace: CacheNamespace): string {
  return CACHE_VERSION_REGISTRY[namespace];
}