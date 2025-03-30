import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get(':userId')
  async getRecommendations(@Param('userId') userId: string): Promise<string[]> {
    return this.recommendationsService.getRecommendations(userId);
  }
}
