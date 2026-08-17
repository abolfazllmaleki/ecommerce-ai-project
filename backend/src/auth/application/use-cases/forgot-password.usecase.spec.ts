import { ForgotPasswordUseCase } from './forgot-password.usecase';
import { IUserRepository } from 'src/users/domain/user.repository.port';

describe('ForgotPasswordUseCase', () => {
  let usecase: ForgotPasswordUseCase;
  let userRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      update: jest.fn(),
    } as any;

    usecase = new ForgotPasswordUseCase(userRepo);
  });

  it('should set a reset token and return it when the user exists', async () => {
    const user = {
      setPasswordReset: jest.fn(),
    };

    userRepo.findByEmail.mockResolvedValue(user as any);
    userRepo.update.mockResolvedValue(user as any);

    const token = await usecase.execute('john@example.com');

    expect(token).toEqual(expect.any(String));

    expect(userRepo.findByEmail).toHaveBeenCalledWith('john@example.com');

    expect(user.setPasswordReset).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Date),
    );

    expect(userRepo.update).toHaveBeenCalledWith(user);
  });

  it('should return undefined and not update when the user does not exist', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    const result = await usecase.execute('missing@example.com');

    expect(result).toBeUndefined();

    expect(userRepo.update).not.toHaveBeenCalled();
  });
});
