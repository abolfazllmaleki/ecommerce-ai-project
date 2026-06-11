import { Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IUserRepository } from 'src/users/domain/user.repository.port';

export class ForgotPasswordUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(email: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      return; // جلوگیری از user enumeration
    }

    const token = uuid();

    user.setPasswordReset(
      token,
      new Date(Date.now() + 60 * 60 * 1000),
    );

    await this.userRepo.update(user);

    return token;
  }
}
