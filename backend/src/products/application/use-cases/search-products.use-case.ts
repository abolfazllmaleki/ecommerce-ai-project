import { Injectable, BadRequestException } from '@nestjs/common';
import { Product } from '../../domain/product.entity';
import { IProductRepository } from '../../domain/product.repository.port';
import { SearchProductsDto } from '../../interfaces/product.dto'; // یک DTO جدید برای جستجو تعریف می‌کنیم
import { Types } from 'mongoose'; // برای کار با ObjectId

// فرض می‌کنیم این DTO برای پارامترهای جستجو داریم
// src/products/interfaces/product.dto.ts
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

    // 2. آماده‌سازی پارامترهای نهایی برای Repository (Repository خودش این کوئری‌ها رو می‌سازه)
    // اگر Repository ما نیاز به پارامترهای خاصی دارد، اینجا آماده می‌کنیم
    const repoParams = {
      query: searchParams.query,
      minPrice: searchParams.minPrice,
      maxPrice: searchParams.maxPrice,
      minRating: searchParams.minRating,
      categories: categoryIds,
      sortBy: searchParams.sortBy,
      limit: searchParams.limit,
    };

    // 3. فراخوانی متد مربوطه در Repository
    // ما قبلا متد `search` رو در Repository پیاده نکردیم، ولی باید اونجا باشه
    // یا متدهای جداگانه مثل getByCriteria رو صدا بزنیم
    // فعلا فرض می‌کنیم متدی به نام `search` وجود دارد:
    // return this.productRepository.search(repoParams);

    // اگر بخواهیم با متدهای موجود پیاده کنیم (مثلا با فیلتر کردن دستی):
    // این روش بهینه نیست و بهتر است Repository متد search اختصاصی داشته باشد
    // فعلا برای تکمیل، یک فراخوانی ساده انجام می‌دهیم:
    const allProducts = await this.productRepository.findAll(); // این قسمت باید بهینه شود!
    
    // فیلتر کردن دستی (این منطق باید در Repository یا Domain باشد)
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
    // **نکته مهم:** منطق فیلترینگ بالا باید به Repository منتقل شود تا جستجو در سمت دیتابیس انجام شود.
  }
}
