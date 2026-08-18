import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  PaginatedAdminUsers,
} from '../../domain/user.repository.port';

@Injectable()
export class FindAllAdminUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedAdminUsers> {
    if (page < 1) {
      page = 1;
    }

    if (limit < 1) {
      limit = 20;
    }

    if (limit > 100) {
      limit = 100;
    }

    return this.userRepository.findAdminUsers(
      page,
      limit,
    );
  }
}