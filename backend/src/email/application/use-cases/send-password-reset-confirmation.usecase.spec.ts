import { SendPasswordResetConfirmationUseCase } from './send-password-reset-confirmation.usecase';
import { IEmailSender } from '../../domain/email-sender.port';

describe('SendPasswordResetConfirmationUseCase', () => {
  let usecase: SendPasswordResetConfirmationUseCase;
  let sender: jest.Mocked<IEmailSender>;

  beforeEach(() => {
    sender = {
      sendPasswordResetConfirmation: jest.fn(),
    } as any;

    usecase = new SendPasswordResetConfirmationUseCase(sender);
  });

  it('should delegate to the email sender with the email', async () => {
    sender.sendPasswordResetConfirmation.mockResolvedValue(undefined);

    await expect(
      usecase.execute('john@example.com'),
    ).resolves.toBeUndefined();

    expect(sender.sendPasswordResetConfirmation).toHaveBeenCalledWith(
      'john@example.com',
    );
  });

  it('should propagate errors thrown by the email sender', async () => {
    sender.sendPasswordResetConfirmation.mockRejectedValue(
      new Error('SMTP down'),
    );

    await expect(
      usecase.execute('john@example.com'),
    ).rejects.toThrow('SMTP down');
  });
});
