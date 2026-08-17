import { AddInteractionUseCase } from './add-interaction.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { AddInteractionDto } from '../../dto/add-interaction.dto';
import { NotFoundException } from '@nestjs/common';

describe('AddInteractionUseCase', () => {
  let usecase: AddInteractionUseCase;
  let repo: jest.Mocked<IUserRepository>;

  const dto: AddInteractionDto = {
    productId: 'product-1',
    interactionType: 'view',
  };

  beforeEach(() => {
    repo = {
      addInteraction: jest.fn(),
    } as any;

    usecase = new AddInteractionUseCase(repo);
  });

  it('should record the interaction and return the user', async () => {
    const user = { id: 'user-1' };

    repo.addInteraction.mockResolvedValue(user as any);

    await expect(
      usecase.execute('user-1', dto),
    ).resolves.toEqual(user);

    expect(repo.addInteraction).toHaveBeenCalledWith(
      'user-1',
      'product-1',
      'view',
    );
  });

  it('should throw NotFoundException when user does not exist', async () => {
    repo.addInteraction.mockRejectedValue(new Error('USER_NOT_FOUND'));

    await expect(
      usecase.execute('user-1', dto),
    ).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });

  it('should rethrow unexpected errors', async () => {
    repo.addInteraction.mockRejectedValue(new Error('DB down'));

    await expect(
      usecase.execute('user-1', dto),
    ).rejects.toThrow('DB down');
  });
});
