import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { UpdateProductDto } from '../../dto/update-product.dto';
import { Product } from '../../domain/product.entity';

@Injectable()
export class UpdateProductUseCase {
  constructor(@Inject('IProductRepository') private readonly repo: IProductRepository) {}

  async execute(id: string, dto: UpdateProductDto): Promise<Product> {
    // نکته: اینجا ساده‌ترین راه: محصول را می‌خوانیم و سپس تغییرات را اعمال می‌کنیم.
    // (اگر خواستی میشه بدون read هم انجام داد، ولی DDD-friendly اینه)
    const current = await this.repo.findById(id);
    if (!current) throw new NotFoundException('محصول مورد نظر یافت نشد');

    const updatedEntity = new Product(
      current.id,
      dto.name ?? current.name,
      dto.price ?? current.price,
      dto.category ?? current.category,
      dto.stock ?? current.stock,
      {
        // اگر entity شما این فیلدهای opt را دارد:
        description: dto.description ?? current.description,
        tags: dto.tags ?? current.tags,
        brand: dto.brand ?? current.brand,
        images: dto.images ?? current.images,
        colors: dto.colors ?? current.colors,
        sizes: dto.sizes ?? current.sizes,
        discount: dto.discount ?? current.discount,
        isFeatured: dto.isFeatured ?? current.isFeatured,
      } as any,
    );

    const saved = await this.repo.update(updatedEntity);
    if (!saved) throw new NotFoundException('محصول مورد نظر یافت نشد');
    return saved;
  }
}
