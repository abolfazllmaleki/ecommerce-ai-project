import { Inject, Injectable } from '@nestjs/common';
import { IRecaptchaVerifier } from '../../domain/recaptcha-verifier.port';

@Injectable()
export class VerifyRecaptchaUseCase {
  constructor(
    @Inject('IRecaptchaVerifier') private readonly verifier: IRecaptchaVerifier,
  ) {}

  async execute(token: string): Promise<boolean> {
    return this.verifier.verify(token);
  }
}
