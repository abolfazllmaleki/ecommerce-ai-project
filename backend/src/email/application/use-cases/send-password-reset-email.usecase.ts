import { Inject, Injectable } from '@nestjs/common';
import { IEmailSender } from '../../domain/email-sender.port';

@Injectable()
export class SendPasswordResetEmailUseCase {
  constructor(@Inject('IEmailSender') private readonly sender: IEmailSender) {}

  async execute(email: string, token: string): Promise<void> {
    return this.sender.sendPasswordResetEmail(email, token);
  }
}
