import { SendPasswordResetEmailUseCase } from './send-password-reset-email.usecase';
import { IEmailSender } from '../../domain/email-sender.port';

describe('SendPasswordResetEmailUseCase', () => {
  let usecase: SendPasswordResetEmailUseCase;
  let sender: jest.Mocked<IEmailSender>;

  beforeEach(() => {
    sender = {
      sendPasswordResetEmail: jest.fn(),
    } as any;

    usecase = new SendPasswordResetEmailUseCase(sender);
  });

  it('should delegate to the email sender with the email and token', async () => {
    sender.sendPasswordResetEmail.mockResolvedValue(undefined);

    await expect(
      usecase.execute('john@example.com', 'reset-token'),
    ).resolves.toBeUndefined();

    expect(sender.sendPasswordResetEmail).toHaveBeenCalledWith(
      'john@example.com',
      'reset-token',
    );
  });

  it('should propagate errors thrown by the email sender', async () => {
    sender.sendPasswordResetEmail.mockRejectedValue(new Error('SMTP down'));

    await expect(
      usecase.execute('john@example.com', 'reset-token'),
    ).rejects.toThrow('SMTP down');
  });
});
