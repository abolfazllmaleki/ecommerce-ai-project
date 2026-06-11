import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { RecommendationsController } from './interface/recommendations.controller';
import { GetRecommendationsUseCase } from './application/use-cases/get-recommendations.usecase';

@Module({
  imports: [UsersModule],
  controllers: [RecommendationsController],
  providers: [GetRecommendationsUseCase],
})
export class RecommendationsModule {}
