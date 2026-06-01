import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository, SearchCriteria } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';
import { SearchProductsDto } from '../../dto/search-products.dto';

@Injectable()
export class SearchProductsUseCase {
  constructor(@Inject('IProductRepository') private readonly repo: IProductRepository) {}

  async execute(dto: SearchProductsDto): Promise<Product[]> {
    const criteria: SearchCriteria = {
      query: dto.q,
      minPrice: dto.minPrice,
      maxPrice: dto.maxPrice,
      minRating: dto.minRating,
      categories: dto.categories,
      sortBy: dto.sortBy,
    };

    const products = await this.repo.search(criteria);

    if (dto.limit && dto.limit > 0) return products.slice(0, dto.limit);

    return products;
  }
}
