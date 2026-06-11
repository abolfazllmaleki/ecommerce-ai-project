import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IContactRepository } from '../domain/contact.repository.port';
import { Contact as ContactEntity } from '../domain/contact.entity';
import { Contact, ContactDocument } from '../schemas/contact.schema';
import { ContactMapper } from './contact.mapper';

@Injectable()
export class ContactRepository implements IContactRepository {
  constructor(
    @InjectModel(Contact.name)
    private readonly model: Model<ContactDocument>,
  ) {}

  async create(contact: ContactEntity): Promise<ContactEntity> {
    const data = ContactMapper.toPersistenceOnCreate(contact);
    const created = new this.model(data);
    const saved = await created.save();
    return ContactMapper.toDomain(saved);
  }

  async findAll(): Promise<ContactEntity[]> {
    const docs = await this.model.find().sort({ createdAt: -1 }).exec();
    return docs.map(doc => ContactMapper.toDomain(doc));
  }

  async findById(id: string): Promise<ContactEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).exec();
    return doc ? ContactMapper.toDomain(doc) : null;
  }

  async updateStatus(id: string, status: string): Promise<ContactEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const updated = await this.model
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    return updated ? ContactMapper.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
