import { UpdateUserUseCase } from './update-user.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserRole } from '../../domain/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateUserUseCase', () => {
  let usecase: UpdateUserUseCase;
  let repo: jest.Mocked<IUserRepository>;

  const dto: UpdateUserDto = {
    name: 'Jane',
    lastname: 'Doe',
    email: 'jane@example.com',
    role: UserRole.ADMIN,
  };

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    usecase = new UpdateUserUseCase(repo);
  });

  it('should update the user profile and return the persisted entity', async () => {
    const current = { id: 'user-1', updateProfile: jest.fn() };
    const updated = { id: 'user-1', name: 'Jane', email: 'jane@example.com' };

    repo.findById.mockResolvedValue(current as any);
    repo.update.mockResolvedValue(updated as any);

    await expect(usecase.execute('user-1', dto)).resolves.toEqual(updated);

    expect(repo.findById).toHaveBeenCalledWith('user-1');

    expect(current.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jane',
        lastname: 'Doe',
        email: 'jane@example.com',
        role: UserRole.ADMIN,
      }),
    );

    expect(repo.update).toHaveBeenCalledWith(current);
  });

  it('should throw NotFoundException when the user does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(usecase.execute('user-1', dto)).rejects.toThrow(
      new NotFoundException('User not found'),
    );

    expect(repo.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when the update fails', async () => {
    const current = { id: 'user-1', updateProfile: jest.fn() };

    repo.findById.mockResolvedValue(current as any);
    repo.update.mockResolvedValue(null);

    await expect(usecase.execute('user-1', dto)).rejects.toThrow(
      new NotFoundException('User not found'),
    );

    expect(current.updateProfile).toHaveBeenCalled();

    expect(repo.update).toHaveBeenCalledWith(current);
  });
});
