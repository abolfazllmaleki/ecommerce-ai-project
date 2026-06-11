import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IRecaptchaVerifier } from '../domain/recaptcha-verifier.port';

@Injectable()
export class GoogleRecaptchaVerifier implements IRecaptchaVerifier {
  constructor(private readonly httpService: HttpService) {}

  async verify(token: string): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    try {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      const response = await firstValueFrom(
        this.httpService.post(
          'https://www.google.com/recaptcha/api/siteverify',
          null,
          {
            params: {
              secret: secretKey,
              response: token,
            },
          },
        ),
      );

      return response.data.success;
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
  }
}
