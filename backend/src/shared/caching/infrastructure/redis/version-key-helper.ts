import { CACHE_APP_PREFIX } from './cache.constants';
import { CacheNamespace } from './cache.namespaces';

export class CacheVersionKeyBuilder {
  static build(namespace: CacheNamespace): string {
    return `${CACHE_APP_PREFIX}:version:${namespace}`;
  }
}
