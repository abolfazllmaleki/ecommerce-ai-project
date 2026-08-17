import { UpdateContactStatusUseCase } from './update-contact-status.usecase';
import { IContactRepository } from '../../domain/contact.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('UpdateContactStatusUseCase', () => {
  let usecase: UpdateContactStatusUseCase;
  let repo: jest.Mocked<IContactRepository>;

  beforeEach(() => {
    repo = {
      updateStatus: jest.fn(),
    } as any;

    usecase = new UpdateContactStatusUseCase(repo);
  });

  it('should update the contact status', async () => {
    const updatedContact = { id: 'contact-1', status: 'read' };

    repo.updateStatus.mockResolvedValue(updatedContact as any);

    await expect(
      usecase.execute('contact-1', 'read'),
    ).resolves.toEqual(updatedContact);

    expect(repo.updateStatus).toHaveBeenCalledWith('contact-1', 'read');
  });

  it('should throw NotFoundException when the contact does not exist', async () => {
    repo.updateStatus.mockResolvedValue(null);

    await expect(
      usecase.execute('contact-1', 'read'),
    ).rejects.toThrow(
      new NotFoundException('Contact with ID contact-1 not found'),
    );

    expect(repo.updateStatus).toHaveBeenCalledWith('contact-1', 'read');
  });
});
