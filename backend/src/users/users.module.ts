import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './interface/users.controller';
import { UserRepository } from './infrastructure/user.repository';
import { ProductsModule } from '../products/products.module';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.usecase';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.usecase';
import { FindAllUsersPaginatedUseCase } from './application/use-cases/find-all-users-paginated.usecase';
import { UpdateUserUseCase } from './application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from './application/use-cases/delete-user.usecase';
import { AddToWishlistUseCase } from './application/use-cases/add-to-wishlist.usecase';
import { RemoveFromWishlistUseCase } from './application/use-cases/remove-from-wishlist.usecase';
import { GetWishlistUseCase } from './application/use-cases/get-wishlist.usecase';
import { AddInteractionUseCase } from './application/use-cases/add-interaction.usecase';
import { RateProductUseCase } from './application/use-cases/rate-product.usecase';
import { UpdatePasswordUseCase } from './application/use-cases/update-password.usecase';
import { CreatePasswordResetTokenUseCase } from './application/use-cases/create-password-reset-token.usecase';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.usecase';
import { FindUserByResetTokenUseCase } from './application/use-cases/find-user-by-reset-token.usecase';
import { GenerateRecommendationsUseCase } from './application/use-cases/generate-recommendations.usecase';
import { AddPreferredCategoryUseCase } from './application/use-cases/add-preferred-category.usecase';
import { RemovePreferredCategoryUseCase } from './application/use-cases/remove-preferred-category.usecase';
import { GetUsersByEngagementUseCase } from './application/use-cases/get-users-by-engagement.usecase';
import { GetInteractionHistoryUseCase } from './application/use-cases/get-interaction-history.usecase';
import { GetUserProductRatingUseCase } from './application/use-cases/get-user-product-rating.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ProductsModule,
  ],
  controllers: [UsersController],
  providers: [
    { provide: 'IUserRepository', useClass: UserRepository },
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
    FindAllUsersPaginatedUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    AddToWishlistUseCase,
    RemoveFromWishlistUseCase,
    GetWishlistUseCase,
    AddInteractionUseCase,
    RateProductUseCase,
    UpdatePasswordUseCase,
    CreatePasswordResetTokenUseCase,
    ResetPasswordUseCase,
    FindUserByResetTokenUseCase,
    GenerateRecommendationsUseCase,
    AddPreferredCategoryUseCase,
    RemovePreferredCategoryUseCase,
    GetUsersByEngagementUseCase,
    GetInteractionHistoryUseCase,
    GetUserProductRatingUseCase,
  ],
  exports: [
    'IUserRepository',
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
    UpdatePasswordUseCase,
    CreatePasswordResetTokenUseCase,
    ResetPasswordUseCase,
    FindUserByResetTokenUseCase,
    GenerateRecommendationsUseCase,
  ],
})
export class UsersModule {}
