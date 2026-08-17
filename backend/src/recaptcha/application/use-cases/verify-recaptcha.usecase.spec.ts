import { VerifyRecaptchaUseCase } from './verify-recaptcha.usecase';
import { IRecaptchaVerifier } from '../../domain/recaptcha-verifier.port';

describe('VerifyRecaptchaUseCase', () => {
  let usecase: VerifyRecaptchaUseCase;
  let verifier: jest.Mocked<IRecaptchaVerifier>;

  beforeEach(() => {
    verifier = {
      verify: jest.fn(),
    } as any;

    usecase = new VerifyRecaptchaUseCase(verifier);
  });

  it('should return true when the token is valid', async () => {
    verifier.verify.mockResolvedValue(true);

    await expect(usecase.execute('valid-token')).resolves.toBe(true);

    expect(verifier.verify).toHaveBeenCalledWith('valid-token');
  });

  it('should return false when the token is invalid', async () => {
    verifier.verify.mockResolvedValue(false);

    await expect(usecase.execute('invalid-token')).resolves.toBe(false);

    expect(verifier.verify).toHaveBeenCalledWith('invalid-token');
  });
});
