import { Injectable } from '@nestjs/common';
import { SendPasswordResetEmailUseCase } from './application/use-cases/send-password-reset-email.usecase';
import { SendPasswordResetConfirmationUseCase } from './application/use-cases/send-password-reset-confirmation.usecase';

/** Facade kept for Auth module compatibility until auth is refactored. */
@Injectable()
export class EmailService {
  constructor(
    private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase,
    private readonly sendPasswordResetConfirmationUseCase: SendPasswordResetConfirmationUseCase,
  ) {}

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    return this.sendPasswordResetEmailUseCase.execute(email, token);
  }

  async sendPasswordResetConfirmation(email: string): Promise<void> {
    return this.sendPasswordResetConfirmationUseCase.execute(email);
  }
}
