import { Injectable, BadRequestException } from '@nestjs/common';
import { Product } from '../../domain/product.entity';
import { IProductRepository } from '../../domain/product.repository.port';
import { Types } from 'mongoose'; // برای کار با ObjectId

export interface SearchProductsQuery {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  categories?: string[]; // رشته‌هایی از IDها
  sortBy?: string;
  limit?: number;
}

@Injectable()
export class SearchProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(searchParams: SearchProductsQuery): Promise<Product[]> {
    // 1. اعتبارسنجی و تبدیل پارامترها
    let categoryIds: Types.ObjectId[] = [];
    if (searchParams.categories) {
      try {
        categoryIds = searchParams.categories.map((id) => new Types.ObjectId(id));
      } catch (e) {
        // خطای بدتر: باید در Controller گرفته شود
        throw new BadRequestException('Invalid category ID format'); 
      }
    }

    const repoParams = {
      query: searchParams.query,
      minPrice: searchParams.minPrice,
      maxPrice: searchParams.maxPrice,
      minRating: searchParams.minRating,
      categories: categoryIds,
      sortBy: searchParams.sortBy,
      limit: searchParams.limit,
    };

    const allProducts = await this.productRepository.findAll(); // این قسمت باید بهینه شود!
    
    return allProducts.filter(product => {
        let match = true;
        if (searchParams.query && !product.name.toLowerCase().includes(searchParams.query.toLowerCase())) {
            match = false;
        }
        if (searchParams.minPrice && product.price < searchParams.minPrice) {
            match = false;
        }
        // ... بقیه فیلترها
        return match;
    });
  }
}
