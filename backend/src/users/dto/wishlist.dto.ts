import { IsMongoId } from 'class-validator';

export class UpdateWishlistDto {
  @IsMongoId()
  productId: string;
}
