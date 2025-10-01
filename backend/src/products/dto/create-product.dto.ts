import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
export class CreateProductDto {
  readonly name: string;
  readonly description?: string;

  @Transform(({ value }) => new Types.ObjectId(value))
  readonly category: Types.ObjectId;
  
  readonly tags?: string[];
  readonly price: number;
  readonly stock?: number;
  readonly brand?: string;
  readonly images?: string[];
  readonly discount?: number;
  readonly similarProducts?: string[];
  readonly featureWeights?: Record<string, number>;
  readonly sizes?: string[];
  readonly colors?: string[];
}
