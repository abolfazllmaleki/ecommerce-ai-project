import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IContactRepository } from '../../domain/contact.repository.port';
import { Contact } from '../../domain/contact.entity';

@Injectable()
export class FindContactByIdUseCase {
  constructor(
    @Inject('IContactRepository') private readonly repo: IContactRepository,
  ) {}

  async execute(id: string): Promise<Contact> {
    const contact = await this.repo.findById(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }
}
