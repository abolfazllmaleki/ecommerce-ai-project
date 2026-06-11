import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartController } from './interface/cart.controller';
import { CartRepository } from './infrastructure/cart.repository';
import { ProductsModule } from '../products/products.module';
import { GetCartUseCase } from './application/use-cases/get-cart.usecase';
import { AddToCartUseCase } from './application/use-cases/add-to-cart.usecase';
import { UpdateCartItemUseCase } from './application/use-cases/update-cart-item.usecase';
import { RemoveCartItemUseCase } from './application/use-cases/remove-cart-item.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule,
  ],
  controllers: [CartController],
  providers: [
    { provide: 'ICartRepository', useClass: CartRepository },
    GetCartUseCase,
    AddToCartUseCase,
    UpdateCartItemUseCase,
    RemoveCartItemUseCase,
  ],
  exports: ['ICartRepository'],
})
export class CartModule {}
