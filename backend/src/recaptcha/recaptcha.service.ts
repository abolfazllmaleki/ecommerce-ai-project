import { Injectable } from '@nestjs/common';
import { VerifyRecaptchaUseCase } from './application/use-cases/verify-recaptcha.usecase';

/** Facade for modules that still inject RecaptchaService directly. */
@Injectable()
export class RecaptchaService {
  constructor(private readonly verifyRecaptchaUseCase: VerifyRecaptchaUseCase) {}

  async verifyRecaptcha(token: string): Promise<boolean> {
    return this.verifyRecaptchaUseCase.execute(token);
  }
}
