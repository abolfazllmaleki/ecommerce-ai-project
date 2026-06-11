import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RecaptchaService } from './recaptcha.service';
import { GoogleRecaptchaVerifier } from './infrastructure/google-recaptcha.verifier';
import { VerifyRecaptchaUseCase } from './application/use-cases/verify-recaptcha.usecase';

@Module({
  imports: [HttpModule],
  providers: [
    { provide: 'IRecaptchaVerifier', useClass: GoogleRecaptchaVerifier },
    VerifyRecaptchaUseCase,
    RecaptchaService,
  ],
  exports: [RecaptchaService, VerifyRecaptchaUseCase, 'IRecaptchaVerifier'],
})
export class RecaptchaModule {}
