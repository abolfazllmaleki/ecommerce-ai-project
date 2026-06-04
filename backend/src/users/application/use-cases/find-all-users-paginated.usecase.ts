import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  PaginatedUsers,
} from '../../domain/user.repository.port';

@Injectable()
export class FindAllUsersPaginatedUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(page: number, limit: number): Promise<PaginatedUsers> {
    return this.repo.findAllPaginated(page, limit);
  }
}
