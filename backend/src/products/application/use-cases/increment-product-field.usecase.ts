import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';

@Injectable()
export class IncrementProductFieldUseCase {
  constructor(@Inject('IProductRepository') private readonly repo: IProductRepository) {}

  async execute(
    id: string,
    field: 'views' | 'purchases' | 'wishlistAdds',
  ): Promise<Product> {
    const allowed: Array<'views' | 'purchases' | 'wishlistAdds'> = ['views', 'purchases', 'wishlistAdds'];
    if (!allowed.includes(field)) {
      throw new BadRequestException('امکان افزایش این فیلد وجود ندارد');
    }

    const updated = await this.repo.incrementField(id, field);
    if (!updated) throw new NotFoundException('محصول یافت نشد');
    return updated;
  }
}
