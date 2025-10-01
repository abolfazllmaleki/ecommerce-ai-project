// src/recaptcha/recaptcha.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RecaptchaService {
  constructor(private readonly httpService: HttpService) {}

  async verifyRecaptcha(token: string): Promise<boolean> {
    // برای محیط توسعه، اعتبارسنجی را دور می‌زنیم
    if (process.env.NODE_ENV === 'development') {
      console.log('تست reCAPTCHA در محیط توسعه - اعتبارسنجی انجام نشد');
      return true;
    }

    try {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      const response = await firstValueFrom(
        this.httpService.post(
          `https://www.google.com/recaptcha/api/siteverify`,
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
      console.error('خطا در تأیید reCAPTCHA:', error);
      return false;
    }
  }
}