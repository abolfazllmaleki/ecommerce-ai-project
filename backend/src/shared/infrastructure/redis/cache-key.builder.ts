import * as crypto from 'crypto';
import { CACHE_APP_PREFIX, CACHE_HASH_LENGTH } from './cache.constants';
import { CacheNamespace } from './cache.namespaces';

export class CacheKeyBuilder {
  /**
   * Generic list/search cache key
   * example:
   * shop:products:v2:ab21cd
   */
  static build(
    namespace: CacheNamespace,
    version: number,
    params?: Record<string, unknown>,
  ): string {
    const baseKey = this.base(namespace, version);

    if (!params || Object.keys(params).length === 0) {
      return baseKey;
    }

    const normalized = this.normalize(params);
    const hashed = this.hash(normalized);

    return `${baseKey}:${hashed}`;
  }

  /**
   * Entity cache key
   * example:
   * shop:product:v1:123
   */
  static entity(
    namespace: CacheNamespace,
    version: number,
    id: string | number,
  ): string {
    return `${this.base(namespace, version)}:${id}`;
  }

  /**
   * Product detail key helper
   */
  static product(id: string | number, version = 1): string {
    return `${CACHE_APP_PREFIX}:product:v${version}:${id}`;
  }

  /**
   * Version key for product list
   */
  static productListVersion(): string {
    return `${CACHE_APP_PREFIX}:version:products`;
  }

  /**
   * Base key format
   */
  private static base(namespace: CacheNamespace, version: number): string {
    return `${CACHE_APP_PREFIX}:${namespace}:v${version}`;
  }

  /**
   * Normalize params (stable order)
   */
  private static normalize(params: Record<string, unknown>): string {
    const sortedKeys = Object.keys(params).sort();

    const normalizedObject: Record<string, unknown> = {};

    for (const key of sortedKeys) {
      normalizedObject[key] = params[key];
    }

    return JSON.stringify(normalizedObject);
  }

  /**
   * Short SHA256 hash
   */
  private static hash(value: string): string {
    return crypto
      .createHash('sha256')
      .update(value)
      .digest('hex')
      .substring(0, CACHE_HASH_LENGTH);
  }
}
