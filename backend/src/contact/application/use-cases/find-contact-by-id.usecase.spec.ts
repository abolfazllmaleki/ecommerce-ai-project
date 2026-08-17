import { FindContactByIdUseCase } from './find-contact-by-id.usecase';
import { IContactRepository } from '../../domain/contact.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('FindContactByIdUseCase', () => {
  let usecase: FindContactByIdUseCase;
  let repo: jest.Mocked<IContactRepository>;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
    } as any;

    usecase = new FindContactByIdUseCase(repo);
  });

  it('should return the contact when found', async () => {
    const contact = { id: 'contact-1', name: 'John Doe' };

    repo.findById.mockResolvedValue(contact as any);

    await expect(usecase.execute('contact-1')).resolves.toEqual(contact);

    expect(repo.findById).toHaveBeenCalledWith('contact-1');
  });

  it('should throw NotFoundException when the contact does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(usecase.execute('contact-1')).rejects.toThrow(
      new NotFoundException('Contact with ID contact-1 not found'),
    );

    expect(repo.findById).toHaveBeenCalledWith('contact-1');
  });
});
