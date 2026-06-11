import { Injectable } from '@nestjs/common';
import { GenerateRecommendationsUseCase } from '../../../users/application/use-cases/generate-recommendations.usecase';

@Injectable()
export class GetRecommendationsUseCase {
  constructor(
    private readonly generateRecommendations: GenerateRecommendationsUseCase,
  ) {}

  async execute(userId: string, limit = 5): Promise<string[]> {
    return this.generateRecommendations.execute(userId, limit);
  }
}
