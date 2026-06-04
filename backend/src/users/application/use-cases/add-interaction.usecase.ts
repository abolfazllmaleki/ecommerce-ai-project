import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';
import { User } from '../../domain/user.entity';
import { AddInteractionDto } from '../../dto/add-interaction.dto';

@Injectable()
export class AddInteractionUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(userId: string, dto: AddInteractionDto): Promise<User> {
    try {
      return await this.repo.addInteraction(
        userId,
        dto.productId,
        dto.interactionType,
      );
    } catch (error) {
      if ((error as Error).message === 'USER_NOT_FOUND') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}
