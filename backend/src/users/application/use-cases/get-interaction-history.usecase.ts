import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';

@Injectable()
export class GetInteractionHistoryUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(userId: string): Promise<Record<string, unknown>[]> {
    return this.repo.getInteractionHistory(userId);
  }
}
