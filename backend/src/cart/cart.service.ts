import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { Product } from '../products/schemas/product.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  private async calculateTotal(items: any[]) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  async getCart(userId: string) {
    return this.cartModel
      .findOne({ user: userId })
      .populate('items.product', 'name price images stock')
      .lean();
  }

  async addToCart(userId: string, productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new this.cartModel({
        user: new Types.ObjectId(userId),
        items: [],
        total: 0,
      });
    }

    // Convert both IDs to strings for comparison
    const productIdObj = new Types.ObjectId(productId);
    const existingItem = cart.items.find(
      (item) =>
        item.product instanceof Types.ObjectId &&
        item.product.equals(productIdObj),
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: productIdObj, // Use the created ObjectId
        quantity: 1,
        price: product.price,
        addedAt: new Date(),
      });
    }

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await cart.save();
    return this.cartModel.populate(cart, { path: 'items.product' });
  }
  async updateCartItem(userId: string, productId: string, quantity: number) {
    const cart = await this.cartModel
      .findOneAndUpdate(
        {
          user: userId,
          'items.product': productId,
        },
        { $set: { 'items.$.quantity': quantity } },
        { new: true },
      )
      .populate('items.product');

    if (!cart) throw new NotFoundException('Cart item not found');

    cart.total = await this.calculateTotal(cart.items);
    return cart.save();
  }

  async removeCartItem(userId: string, productId: string) {
    const cart = await this.cartModel
      .findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: productId } } },
        { new: true },
      )
      .populate('items.product');

    if (!cart) throw new NotFoundException('Cart not found');

    cart.total = await this.calculateTotal(cart.items);
    return cart.save();
  }
}
