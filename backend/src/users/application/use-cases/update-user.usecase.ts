import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';
import { User } from '../../domain/user.entity';
import { UpdateUserDto } from '../../dto/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    const current = await this.repo.findById(id);
    if (!current) throw new NotFoundException('User not found');

    current.updateProfile({
      name: dto.name,
      lastname: (dto as any).lastname,
      email: dto.email,
      role: dto.role,
      isEmailVerified: (dto as any).isEmailVerified,
    });

    const updated = await this.repo.update(current);
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }
}
