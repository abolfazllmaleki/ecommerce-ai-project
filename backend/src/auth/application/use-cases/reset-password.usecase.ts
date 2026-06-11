import { BadRequestException, Inject } from '@nestjs/common';
import { IUserRepository } from 'src/users/domain/user.repository.port';
import { PasswordHasherPort } from '../../domain/services/password-hasher.port';

export class ResetPasswordUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,

    @Inject('PasswordHasherPort')
    private readonly hasher: PasswordHasherPort,

  ) {}

  async execute(token: string, newPassword: string) {
    const user = await this.userRepo.findByResetToken(token);

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    if (
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new BadRequestException('Token expired');
    }

    const hashed = await this.hasher.hash(newPassword);

    user.setPassword(hashed);
    user.clearPasswordReset();

    await this.userRepo.update(user);
  }
}
