import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, unique: true, index: 'text' })
  name: string;

  @Prop({ index: 'text' })
  description: string;

  @Prop({ index: 'text' })
  Specifications: string;

  // جایگزین category: string
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop()
  brand: string;

  @Prop({ type: [String], default: [] })
  colors: string[];

  // جایگزین sizes: string
  @Prop({ type: [String], default: [] })
  sizes: string[];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  numberOfReviews: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  purchases: number;

  @Prop({ default: 0 })
  wishlistAdds: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ type: [String], default: [] })
  similarProducts: string[];

  @Prop({ type: Map, of: Number, default: {} })
  featureWeights: Map<string, number>;

  @Prop({ type: [String], default: [] })
  userFeedbackKeywords: string[];

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: new Date() })
  lastUpdated: Date;

  @Prop({ type: String, maxlength: 60, default: '' })
  adminNote: string;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);

// Text index
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Compound indexes
ProductSchema.index({ categoryId: 1, price: 1, rating: 1 });
ProductSchema.index({ price: 1, rating: 1 });
ProductSchema.index({ views: -1, purchases: -1 });
