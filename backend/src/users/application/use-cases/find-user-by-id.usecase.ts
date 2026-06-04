import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';
import { User } from '../../domain/user.entity';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(
    id: string,
    options?: { populateWishlist?: boolean; populateRecommendations?: boolean },
  ): Promise<User | null> {
    return this.repo.findById(id, options);
  }
}
