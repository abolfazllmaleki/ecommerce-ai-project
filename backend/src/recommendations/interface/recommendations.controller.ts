import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetRecommendationsUseCase } from '../application/use-cases/get-recommendations.usecase';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly getRecommendations: GetRecommendationsUseCase,
  ) {}

  @Get(':userId')
  async get(
    @Param('userId') userId: string,
    @Query('limit') limit = 5,
  ): Promise<string[]> {
    return this.getRecommendations.execute(userId, +limit);
  }
}
