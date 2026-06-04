import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';
import { IProductRepository } from '../../../products/domain/product.repository.port';
import { User } from '../../domain/user.entity';
import { RateProductDto } from '../../dto/rate-product.dto';

@Injectable()
export class RateProductUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    @Inject('IProductRepository') private readonly productRepo: IProductRepository,
  ) {}

  async execute(userId: string, dto: RateProductDto): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productRepo.findById(dto.productId);
    if (!product) throw new NotFoundException('Product not found');

    user.rateProduct(dto.productId, dto.rating);
    await this.userRepo.saveUserRatings(user);

    const aggregate = await this.userRepo.getProductRatingAggregate(dto.productId);
    await this.productRepo.updateRatingStats(
      dto.productId,
      aggregate.averageRating,
      aggregate.count,
    );

    const updated = await this.userRepo.findById(userId);
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }
}
