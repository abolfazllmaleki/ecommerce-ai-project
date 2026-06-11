import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';
import { User } from '../../domain/user.entity';

@Injectable()
export class GetUsersByEngagementUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(minScore: number): Promise<User[]> {
    return this.repo.getUsersByEngagement(minScore);
  }
}
