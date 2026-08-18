import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AddInteractionDto } from '../dto/add-interaction.dto';
import { RateProductDto } from '../dto/rate-product.dto';
import { UpdateWishlistDto } from '../dto/wishlist.dto';
import { CreateUserUseCase } from '../application/use-cases/create-user.usecase';
import { FindAllUsersPaginatedUseCase } from '../application/use-cases/find-all-users-paginated.usecase';
import { FindUserByIdUseCase } from '../application/use-cases/find-user-by-id.usecase';
import { UpdateUserUseCase } from '../application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.usecase';
import { AddInteractionUseCase } from '../application/use-cases/add-interaction.usecase';
import { AddToWishlistUseCase } from '../application/use-cases/add-to-wishlist.usecase';
import { RemoveFromWishlistUseCase } from '../application/use-cases/remove-from-wishlist.usecase';
import { GetWishlistUseCase } from '../application/use-cases/get-wishlist.usecase';
import { RateProductUseCase } from '../application/use-cases/rate-product.usecase';
import { GenerateRecommendationsUseCase } from '../application/use-cases/generate-recommendations.usecase';
import { AddPreferredCategoryUseCase } from '../application/use-cases/add-preferred-category.usecase';
import { RemovePreferredCategoryUseCase } from '../application/use-cases/remove-preferred-category.usecase';
import { GetUserProductRatingUseCase } from '../application/use-cases/get-user-product-rating.usecase';
import { UpdateAdminUserUseCase } from '../application/use-cases/update-user-admin.usecase';
import { FindAllAdminUsersUseCase } from '../application/use-cases/Find-all-user-admin-usecase';
import { UpdateAdminUserDto } from '../dto/update-admin-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findAllUsersPaginated: FindAllUsersPaginatedUseCase,
    private readonly findUserById: FindUserByIdUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
    private readonly addInteraction: AddInteractionUseCase,
    private readonly addToWishlist: AddToWishlistUseCase,
    private readonly removeFromWishlist: RemoveFromWishlistUseCase,
    private readonly getWishlist: GetWishlistUseCase,
    private readonly rateProduct: RateProductUseCase,
    private readonly generateRecommendations: GenerateRecommendationsUseCase,
    private readonly addPreferredCategory: AddPreferredCategoryUseCase,
    private readonly removePreferredCategory: RemovePreferredCategoryUseCase,
    private readonly getUserProductRating: GetUserProductRatingUseCase,
    private readonly findAllAdminUsersUseCase: FindAllAdminUsersUseCase,
    private readonly updateAdminUserUseCase: UpdateAdminUserUseCase,
  ) {}

  @Get('admin')
  async adminFindAll(
    @Query(
      'page',
      new ParseIntPipe({
        optional: true,
      }),
    )
    page = 1,

    @Query(
      'limit',
      new ParseIntPipe({
        optional: true,
      }),
    )
    limit = 20,
  ) {
    return this.findAllAdminUsersUseCase.execute(
      page,
      limit,
    );
  }

  @Patch('admin/:id')
  async adminUpdate(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
  ) {
    return this.updateAdminUserUseCase.execute(
      id,
      dto,
    );
  }
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUser.execute(createUserDto);
    return user.toPlainObject();
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const result = await this.findAllUsersPaginated.execute(+page, +limit);
    return {
      data: result.items.map(u => u.toPlainObject()),
      total: result.total,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async findMe(@Request() req) {
    const user = await this.findUserById.execute(req.user.userId, {
      populateWishlist: true,
      populateRecommendations: true,
    });
    if (!user) throw new NotFoundException('User not found');
    return user.toPlainObject();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.findUserById.execute(id, {
      populateWishlist: true,
      populateRecommendations: true,
    });
    if (!user) throw new NotFoundException('User not found');
    return user.toPlainObject();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.updateUser.execute(id, updateUserDto);
    return user.toPlainObject();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deleteUser.execute(id);
    return { message: 'User successfully deleted' };
  }

  @Post(':id/interactions')
  async addInteractionHandler(
    @Param('id') userId: string,
    @Body() addInteractionDto: AddInteractionDto,
  ) {
    const user = await this.addInteraction.execute(userId, addInteractionDto);
    return user.toPlainObject();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/wishlist/add')
  async addToWishlistHandler(@Request() req, @Body() dto: UpdateWishlistDto) {
    const user = await this.addToWishlist.execute(req.user.userId, dto.productId);
    return user.toPlainObject();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/wishlist/remove')
  async removeFromWishlistHandler(
    @Request() req,
    @Body() dto: UpdateWishlistDto,
  ) {
    const user = await this.removeFromWishlist.execute(
      req.user.userId,
      dto.productId,
    );
    return user.toPlainObject();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/wishlist')
  async getWishlistHandler(@Request() req) {
    return this.getWishlist.execute(req.user.userId);
  }

  @Patch('user/:id/ratings')
  async rateProductHandler(
    @Param('id') userId: string,
    @Body() rateProductDto: RateProductDto,
  ) {
    const user = await this.rateProduct.execute(userId, rateProductDto);
    return user.toPlainObject();
  }

  @Get(':id/recommendations')
  async getRecommendations(
    @Param('id') userId: string,
    @Query('limit') limit = 5,
  ) {
    return this.generateRecommendations.execute(userId, +limit);
  }

  @Patch(':id/preferences/add')
  async addPreferredCategoryHandler(
    @Param('id') userId: string,
    @Body('category') category: string,
  ) {
    const user = await this.addPreferredCategory.execute(userId, category);
    return user.toPlainObject();
  }

  @Patch(':id/preferences/remove')
  async removePreferredCategoryHandler(
    @Param('id') userId: string,
    @Body('category') category: string,
  ) {
    const user = await this.removePreferredCategory.execute(userId, category);
    return user.toPlainObject();
  }

  @Get(':id/product/:productId')
  async getUserProductRatingHandler(
    @Param('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.getUserProductRating.execute(userId, productId);
  }



}
