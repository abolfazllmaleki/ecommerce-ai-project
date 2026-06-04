import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NodemailerEmailSender } from './infrastructure/nodemailer-email.sender';
import { SendPasswordResetEmailUseCase } from './application/use-cases/send-password-reset-email.usecase';
import { SendPasswordResetConfirmationUseCase } from './application/use-cases/send-password-reset-confirmation.usecase';

@Module({
  providers: [
    { provide: 'IEmailSender', useClass: NodemailerEmailSender },
    SendPasswordResetEmailUseCase,
    SendPasswordResetConfirmationUseCase,
    EmailService,
  ],
  exports: [EmailService, 'IEmailSender'],
})
export class EmailModule {}
