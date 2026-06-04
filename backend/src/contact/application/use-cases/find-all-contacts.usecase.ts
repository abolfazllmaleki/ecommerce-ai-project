import { Inject, Injectable } from '@nestjs/common';
import { IContactRepository } from '../../domain/contact.repository.port';
import { Contact } from '../../domain/contact.entity';

@Injectable()
export class FindAllContactsUseCase {
  constructor(
    @Inject('IContactRepository') private readonly repo: IContactRepository,
  ) {}

  async execute(): Promise<Contact[]> {
    return this.repo.findAll();
  }
}
