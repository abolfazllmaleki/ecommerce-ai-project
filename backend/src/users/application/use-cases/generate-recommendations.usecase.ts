import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';

@Injectable()
export class GenerateRecommendationsUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(userId: string, limit: number): Promise<string[]> {
    return this.repo.generateRecommendations(userId, limit);
  }
}
