import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICartRepository } from '../domain/cart.repository.port';
import { Cart as CartEntity } from '../domain/cart.entity';
import { Cart, CartDocument } from '../schemas/cart.schema';

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(
    @InjectModel(Cart.name)
    private readonly model: Model<CartDocument>,
  ) {}

  async getCartPopulated(userId: string): Promise<Record<string, unknown> | null> {
    const doc = await this.model
      .findOne({ user: userId })
      .populate('items.product', 'name price images stock')
      .lean();

    return doc as Record<string, unknown> | null;
  }

  async findByUserId(userId: string): Promise<CartEntity | null> {
    const doc = await this.model.findOne({ user: userId }).exec();
    return doc ? CartEntity.fromPersistence(doc) : null;
  }

  async save(cart: CartEntity): Promise<Record<string, unknown>> {
    let doc = cart.id
      ? await this.model.findById(cart.id)
      : await this.model.findOne({ user: cart.userId });

    if (!doc) {
      doc = new this.model({
        user: new Types.ObjectId(cart.userId),
        items: [],
        total: 0,
      });
    }

    doc.items = cart.items.map(item => ({
      product: new Types.ObjectId(item.productId),
      quantity: item.quantity,
      price: item.price,
      addedAt: item.addedAt,
    })) as any;

    doc.total = cart.total;

    const saved = await doc.save();

    const populated = await this.model
      .findById(saved._id)
      .populate('items.product', 'name price images stock')
      .lean();

    if (!populated) {
      throw new Error('CART_SAVE_FAILED');
    }

    return populated as Record<string, unknown>;
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Record<string, unknown>> {
    const cart = await this.model.findOne({
      user: userId,
      'items.product': productId,
    });

    if (!cart) {
      throw new Error('CART_ITEM_NOT_FOUND');
    }

    const item = cart.items.find(
      i => i.product.toString() === productId,
    );

    if (!item) {
      throw new Error('CART_ITEM_NOT_FOUND');
    }

    item.quantity = quantity;

    cart.total = cart.items.reduce(
      (sum, current) => sum + current.price * current.quantity,
      0,
    );

    const saved = await cart.save();

    const populated = await this.model
      .findById(saved._id)
      .populate('items.product', 'name price images stock')
      .lean();

    if (!populated) {
      throw new Error('CART_NOT_FOUND_AFTER_UPDATE');
    }

    return populated as Record<string, unknown>;
  }

  async removeItem(
    userId: string,
    productId: string,
  ): Promise<Record<string, unknown>> {
    const cart = await this.model.findOne({ user: userId });

    if (!cart) {
      throw new Error('CART_NOT_FOUND');
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId,
    ) as any;

    cart.total = cart.items.reduce(
      (sum, current) => sum + current.price * current.quantity,
      0,
    );

    const saved = await cart.save();

    const populated = await this.model
      .findById(saved._id)
      .populate('items.product', 'name price images stock')
      .lean();

    if (!populated) {
      throw new Error('CART_NOT_FOUND_AFTER_REMOVE');
    }

    return populated as Record<string, unknown>;
  }
}
