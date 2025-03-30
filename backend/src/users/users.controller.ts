// users.controller.ts
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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddInteractionDto } from './dto/add-interaction.dto';
import { RateProductDto } from './dto/rate-product.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { Request } from '@nestjs/common/decorators';
import { UpdateWishlistDto } from './dto/wishlist.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ data: User[]; total: number }> {
    return this.usersService.findAllPaginated(page, limit);
  }
  @UseGuards(AuthGuard('jwt')) // Apply JWT guard
  @Get('me')
  async findMe(@Request() req): Promise<User> {
    const userId = req.user.userId; // Corrected from req.user.id to req.user.sub
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const deletedUser = await this.usersService.delete(id);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User successfully deleted' };
  }

  // Interaction History Endpoints
  @Post(':id/interactions')
  async addInteraction(
    @Param('id') userId: string,
    @Body() addInteractionDto: AddInteractionDto,
  ): Promise<User> {
    return this.usersService.addInteraction(userId, addInteractionDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('me/wishlist/add')
  async addToWishlist(
    @Request() req,
    @Body() dto: UpdateWishlistDto,
  ): Promise<User> {
    return this.usersService.addToWishlist(req.user.userId, dto.productId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/wishlist/remove')
  async removeFromWishlist(
    @Request() req,
    @Body() dto: UpdateWishlistDto,
  ): Promise<User> {
    return this.usersService.removeFromWishlist(req.user.userId, dto.productId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('me/wishlist')
  async getWishlist(@Request() req) {
    return this.usersService.getWishlist(req.user.userId);
  }

  // Rating Endpoints
  @Patch('user/:id/ratings')
  async rateProduct(
    @Param('id') userId: string,
    @Body() rateProductDto: RateProductDto,
  ): Promise<User> {
    console.log('rating controller');

    return this.usersService.rateProduct(userId, rateProductDto);
  }

  // AI Recommendations Endpoints
  @Get(':id/recommendations')
  async getRecommendations(
    @Param('id') userId: string,
    @Query('limit') limit = 5,
  ): Promise<string[]> {
    return this.usersService.generateRecommendations(userId, limit);
  }

  // Engagement Scoring Endpoint
  // @Get(':id/engagement')
  // async calculateEngagementScore(@Param('id') userId: string): Promise<number> {
  //   return this.usersService.calculateEngagementScore(userId);
  // }

  // Preferred Categories Endpoints
  @Patch(':id/preferences/add')
  async addPreferredCategory(
    @Param('id') userId: string,
    @Body('category') category: string,
  ): Promise<User> {
    return this.usersService.addPreferredCategory(userId, category);
  }

  @Patch(':id/preferences/remove')
  async removePreferredCategory(
    @Param('id') userId: string,
    @Body('category') category: string,
  ): Promise<User> {
    return this.usersService.removePreferredCategory(userId, category);
  }
}
