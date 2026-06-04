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

    await doc.save();
    const populated = await this.model.populate(doc, { path: 'items.product' });
    return populated.toObject() as Record<string, unknown>;
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Record<string, unknown>> {
    const cart = await this.model
      .findOneAndUpdate(
        { user: userId, 'items.product': productId },
        { $set: { 'items.$.quantity': quantity } },
        { new: true },
      )
      .populate('items.product');

    if (!cart) throw new Error('CART_ITEM_NOT_FOUND');

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const saved = await cart.save();
    return saved.toObject() as Record<string, unknown>;
  }

  async removeItem(userId: string, productId: string): Promise<Record<string, unknown>> {
    const cart = await this.model
      .findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: productId } } },
        { new: true },
      )
      .populate('items.product');

    if (!cart) throw new Error('CART_NOT_FOUND');

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const saved = await cart.save();
    return saved.toObject() as Record<string, unknown>;
  }
}
