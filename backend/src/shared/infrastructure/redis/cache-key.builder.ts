import crypto from 'crypto';
import { CACHE_APP_PREFIX, CACHE_HASH_LENGTH } from './cache.constants';
import { CacheNamespace } from './cache.namespaces';
import { getCacheVersion } from './cache-version.registry';

export class CacheKeyBuilder {
  static build(
    namespace: CacheNamespace,
    params?: Record<string, unknown>,
  ): string {
    const version = getCacheVersion(namespace);

    const baseKey = `${CACHE_APP_PREFIX}:${namespace}:${version}`;

    if (!params || Object.keys(params).length === 0) {
      return baseKey;
    }

    const normalized = this.normalize(params);
    const hashed = this.hash(normalized);

    return `${baseKey}:${hashed}`;
  }

  static buildEntityKey(
    namespace: CacheNamespace,
    id: string | number,
  ): string {
    const version = getCacheVersion(namespace);

    return `${CACHE_APP_PREFIX}:${namespace}:${version}:${id}`;
  }

  private static normalize(params: Record<string, unknown>): string {
    const sortedKeys = Object.keys(params).sort();

    const normalizedObject: Record<string, unknown> = {};

    for (const key of sortedKeys) {
      normalizedObject[key] = params[key];
    }

    return JSON.stringify(normalizedObject);
  }

  private static hash(value: string): string {
    return crypto
      .createHash('sha256')
      .update(value)
      .digest('hex')
      .substring(0, CACHE_HASH_LENGTH);
  }
}