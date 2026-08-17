import { CreateUserUseCase } from './create-user.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserRole } from '../../domain/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

describe('CreateUserUseCase', () => {
  let usecase: CreateUserUseCase;
  let repo: jest.Mocked<IUserRepository>;

  const dto: CreateUserDto = {
    name: 'John',
    email: 'john@example.com',
    password: 'hashed-password',
    role: UserRole.USER,
    isEmailVerified: false,
    verificationToken: 'verify-token',
  };

  beforeEach(() => {
    repo = {
      create: jest.fn(),
    } as any;

    usecase = new CreateUserUseCase(repo);
  });

  it('should create a user and return the persisted entity', async () => {
    const savedUser = { id: 'user-1', name: 'John', email: 'john@example.com' };

    repo.create.mockResolvedValue(savedUser as any);

    await expect(usecase.execute(dto)).resolves.toEqual(savedUser);

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John',
        email: 'john@example.com',
        role: UserRole.USER,
        isEmailVerified: false,
        verificationToken: 'verify-token',
      }),
    );
  });

  it('should throw InternalServerErrorException when persistence fails', async () => {
    repo.create.mockRejectedValue(new Error('DB down'));

    await expect(usecase.execute(dto)).rejects.toThrow(
      new InternalServerErrorException('Error creating user'),
    );
  });

  it('should throw InternalServerErrorException when the entity is invalid', async () => {
    const invalidDto = { ...dto, name: '' };

    await expect(usecase.execute(invalidDto)).rejects.toThrow(
      new InternalServerErrorException('Error creating user'),
    );

    expect(repo.create).not.toHaveBeenCalled();
  });
});
