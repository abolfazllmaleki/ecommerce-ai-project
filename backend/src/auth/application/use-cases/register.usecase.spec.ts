import { RegisterUseCase } from './register.usecase';
import { IUserRepository } from 'src/users/domain/user.repository.port';
import { PasswordHasherPort } from '../../domain/services/password-hasher.port';
import { ConflictException } from '@nestjs/common';

// register.usecase.ts imports `User`/`UserRole` as runtime values via the bare
// `src/users/domain/user.entity` specifier, which Jest cannot resolve at runtime
// under this project's config (no moduleNameMapper). Map that specifier to the
// real module via a relative path so the use case runs unchanged.
jest.mock(
  'src/users/domain/user.entity',
  () => jest.requireActual('../../../users/domain/user.entity'),
  { virtual: true },
);

describe('RegisterUseCase', () => {
  let usecase: RegisterUseCase;
  let userRepo: jest.Mocked<IUserRepository>;
  let hasher: jest.Mocked<PasswordHasherPort>;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as any;

    hasher = {
      hash: jest.fn(),
    } as any;

    usecase = new RegisterUseCase(userRepo, hasher);
  });

  it('should create a new user with a hashed password', async () => {
    const savedUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'USER',
    };

    userRepo.findByEmail.mockResolvedValue(null);
    hasher.hash.mockResolvedValue('hashed-password');
    userRepo.create.mockResolvedValue(savedUser as any);

    await expect(
      usecase.execute('John Doe', 'john@example.com', 'plain-password'),
    ).resolves.toEqual(savedUser);

    expect(userRepo.findByEmail).toHaveBeenCalledWith('john@example.com');

    expect(hasher.hash).toHaveBeenCalledWith('plain-password');

    expect(userRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
      }),
    );

    const created = userRepo.create.mock.calls[0][0];
    expect(created.password).toBe('hashed-password');
  });

  it('should throw ConflictException when the user already exists', async () => {
    userRepo.findByEmail.mockResolvedValue({ id: 'user-1' } as any);

    await expect(
      usecase.execute('John Doe', 'john@example.com', 'plain-password'),
    ).rejects.toThrow(new ConflictException('User already exists'));

    expect(hasher.hash).not.toHaveBeenCalled();
    expect(userRepo.create).not.toHaveBeenCalled();
  });
});
