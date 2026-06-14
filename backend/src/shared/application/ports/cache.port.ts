export const CACHE_PORT = Symbol('CACHE_PORT');


export interface CachePort {
  get<T>(key: string): Promise<T | null>;

  set<T>(
    key: string,
    value: T,
    options?: {
      ttlSeconds?: number;
    },
  ): Promise<void>;

  delete(key: string): Promise<void>;

  increment(key: string): Promise<number>;

}
