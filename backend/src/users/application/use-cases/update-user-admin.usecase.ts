import {
    Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  IUserRepository,
  UpdateUserData,
} from '../../domain/user.repository.port';

@Injectable()
export class UpdateAdminUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    data: UpdateUserData,
  ) {
    const user = await this.userRepository.updateAdmin(
      userId,
      data,
    );

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return user.toPlainObject();
  }
}