import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IContactRepository } from '../../domain/contact.repository.port';

@Injectable()
export class DeleteContactUseCase {
  constructor(
    @Inject('IContactRepository') private readonly repo: IContactRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
  }
}
