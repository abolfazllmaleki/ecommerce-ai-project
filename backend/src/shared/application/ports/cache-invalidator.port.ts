export const CACHE_INVALIDATOR_PORT = Symbol('CACHE_INVALIDATOR_PORT');

export interface CacheInvalidatorPort {
  invalidateProduct(productId: string): Promise<void>;

  invalidateProductLists(): Promise<void>;
}
