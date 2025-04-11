import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddInteractionDto {
  productId: string;
  interactionType: string;
}
