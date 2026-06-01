import { Product } from './product.entity';

export type ProductSortBy =
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'popularity'
  | 'newest';

export interface SearchCriteria {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  categories?: string[];
  sortBy?: ProductSortBy;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(product: Product): Promise<Product | null>;
  delete(id: string): Promise<boolean>;

  getTopRated(limit: number): Promise<Product[]>;
  getHighestDiscount(limit: number): Promise<Product[]>;
  getFeatured(): Promise<Product[]>;
  getPopular(limit: number): Promise<Product[]>;

  search(criteria: SearchCriteria): Promise<PaginatedProducts>;

  incrementField(
    id: string,
    field: 'views' | 'purchases' | 'wishlistAdds',
  ): Promise<Product | null>;

  updateSimilarProducts(
    id: string,
    similarProducts: string[],
  ): Promise<Product | null>;

  getRelated(id: string, limit: number): Promise<Product[]>;

  addFeedbackKeywords(
    id: string,
    keywords: string[],
  ): Promise<Product | null>;
}
