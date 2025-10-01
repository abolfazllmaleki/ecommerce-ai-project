import { Types } from 'mongoose';
export  class CreateContactDto {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
  readonly phone?: string;
  readonly orderNumber?: string;
}

export class ContactResponseDto {
  readonly _id: Types.ObjectId;
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
  readonly phone?: string;
  readonly orderNumber?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly status: string;
}