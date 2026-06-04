import { Inject, Injectable } from '@nestjs/common';
import { IContactRepository } from '../../domain/contact.repository.port';
import { Contact } from '../../domain/contact.entity';
import { CreateContactDto } from '../../dto/contact.dto';

@Injectable()
export class CreateContactUseCase {
  constructor(
    @Inject('IContactRepository') private readonly repo: IContactRepository,
  ) {}

  async execute(dto: CreateContactDto): Promise<Contact> {
    const contact = new Contact({
      name: dto.name,
      email: dto.email,
      subject: dto.subject,
      message: dto.message,
      phone: dto.phone,
      orderNumber: dto.orderNumber,
    });
    return this.repo.create(contact);
  }
}
