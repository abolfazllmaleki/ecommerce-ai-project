import { Inject, Injectable } from '@nestjs/common';
import { IEmailSender } from '../../domain/email-sender.port';

@Injectable()
export class SendPasswordResetConfirmationUseCase {
  constructor(@Inject('IEmailSender') private readonly sender: IEmailSender) {}

  async execute(email: string): Promise<void> {
    return this.sender.sendPasswordResetConfirmation(email);
  }
}
