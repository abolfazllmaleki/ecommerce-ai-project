import { Injectable } from '@nestjs/common';

@Injectable()
export class RecommendationsService {
  async getRecommendations(userId: string): Promise<string[]> {
    // اینجا می‌توانید از یک مدل هوش مصنوعی یا الگوریتم‌های پیشنهاد استفاده کنید.
    return ['product1', 'product2', 'product3']; // مثال ساده
  }
}
