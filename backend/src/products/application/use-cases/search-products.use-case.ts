import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import {
  IProductRepository,
  ProductSortBy,
  PaginatedProducts,
} from '../../domain/product.repository.port';

export interface SearchProductsQuery {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  categories?: string[];
  sortBy?: ProductSortBy;
  limit?: number;
  page?: number;
}

@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(params: SearchProductsQuery): Promise<PaginatedProducts> {
    if (params.minPrice && params.maxPrice && params.minPrice > params.maxPrice) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }

    return this.productRepository.search(params);
  }
}
