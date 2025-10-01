// src/contact/contact.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {


  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  phone: string;

  @Prop()
  orderNumber: string;

  @Prop({ default: 'new' })
  status: string;


}

export const ContactSchema = SchemaFactory.createForClass(Contact);