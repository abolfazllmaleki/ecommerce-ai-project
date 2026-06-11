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
import { AuthGuard } from '@nestjs/passport';
import { GetCartUseCase } from '../application/use-cases/get-cart.usecase';
import { AddToCartUseCase } from '../application/use-cases/add-to-cart.usecase';
import { UpdateCartItemUseCase } from '../application/use-cases/update-cart-item.usecase';
import { RemoveCartItemUseCase } from '../application/use-cases/remove-cart-item.usecase';

@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
  constructor(
    private readonly getCart: GetCartUseCase,
    private readonly addToCart: AddToCartUseCase,
    private readonly updateCartItem: UpdateCartItemUseCase,
    private readonly removeCartItem: RemoveCartItemUseCase,
  ) {}

  private resolveUserId(req: { user: { userId?: string; sub?: string } }): string {
    return req.user.userId ?? req.user.sub ?? '';
  }

  @Post()
  async add(@Req() req, @Body() body: { productId: string }) {
    return this.addToCart.execute(this.resolveUserId(req), body.productId);
  }

  @Patch()
  async update(
    @Req() req,
    @Body() body: { productId: string; quantity: number },
  ) {
    return this.updateCartItem.execute(
      this.resolveUserId(req),
      body.productId,
      body.quantity,
    );
  }

  @Delete()
  async remove(@Req() req, @Query('productId') productId: string) {
    return this.removeCartItem.execute(this.resolveUserId(req), productId);
  }

  @Get()
  async get(@Req() req) {
    return this.getCart.execute(this.resolveUserId(req));
  }
}
