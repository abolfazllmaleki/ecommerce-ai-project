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
