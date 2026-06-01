import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';

@Injectable()
export class AddFeedbackKeywordsUseCase {
  constructor(@Inject('IProductRepository') private readonly repo: IProductRepository) {}

  async execute(id: string, keywords: string[]): Promise<Product> {
    const updated = await this.repo.addFeedbackKeywords(id, keywords);
    if (!updated) throw new NotFoundException('محصول یافت نشد');
    return updated;
  }
}
