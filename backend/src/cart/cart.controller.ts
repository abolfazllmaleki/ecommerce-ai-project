import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/users/schemas/user.schema';

@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(@Req() req, @Body() body: { productId: string }) {
    console.log('add to cart...........');
    const userId = req.user.sub; // Get user ID from JWT payload
    return this.cartService.addToCart(userId, body.productId);
  }

  @Patch()
  async updateCartItem(
    @Req() req,
    @Body() body: { productId: string; quantity: number },
  ) {
    const userId = req.user.sub;
    return this.cartService.updateCartItem(
      userId,
      body.productId,
      body.quantity,
    );
  }

  @Delete()
  async removeCartItem(@Req() req, @Query('productId') productId: string) {
    const userId = req.user.sub;
    return this.cartService.removeCartItem(userId, productId);
  }

  @Get()
  async getCart(@Req() req) {
    const userId = req.user.sub;
    return this.cartService.getCart(userId);
  }
}
