import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, unique: true, index: 'text' })
  name: string;

  @Prop({ index: 'text' })
  description: string;

  @Prop({ required: true })
  category: string;

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
  @Prop()
  sizes: string[];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  numberOfReviews: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 0 })
  views: number;

  // @Prop({ default: 0 })
  // purchases: number;

  @Prop({ default: 0 })
  wishlistAdds: number;

  @Prop({ default: 0 })
  discount: number;

  // @Prop({ type: [String], default: [] })
  // similarProducts: string[];

  // @Prop({ type: Map, of: Number, default: {} })
  // featureWeights: Map<string, number>;

  // @Prop({ type: [String], default: [] })
  // userFeedbackKeywords: string[];

  // @Prop({ default: false })
  // isFeatured: boolean;

  // @Prop({ default: new Date() })
  // lastUpdated: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 'text', description: 'text' });
