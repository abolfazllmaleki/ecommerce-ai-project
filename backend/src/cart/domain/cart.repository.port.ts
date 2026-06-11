import { Cart } from './cart.entity';

export interface ICartRepository {
  getCartPopulated(userId: string): Promise<Record<string, unknown> | null>;
  findByUserId(userId: string): Promise<Cart | null>;
  save(cart: Cart): Promise<Record<string, unknown>>;
  updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Record<string, unknown>>;
  removeItem(userId: string, productId: string): Promise<Record<string, unknown>>;
}
