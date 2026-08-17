import { DeleteContactUseCase } from './delete-contact.usecase';
import { IContactRepository } from '../../domain/contact.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('DeleteContactUseCase', () => {
  let usecase: DeleteContactUseCase;
  let repo: jest.Mocked<IContactRepository>;

  beforeEach(() => {
    repo = {
      delete: jest.fn(),
    } as any;

    usecase = new DeleteContactUseCase(repo);
  });

  it('should delete the contact by id', async () => {
    repo.delete.mockResolvedValue(true);

    await expect(usecase.execute('contact-1')).resolves.toBeUndefined();

    expect(repo.delete).toHaveBeenCalledWith('contact-1');
  });

  it('should throw NotFoundException when the contact does not exist', async () => {
    repo.delete.mockResolvedValue(false);

    await expect(usecase.execute('contact-1')).rejects.toThrow(
      new NotFoundException('Contact with ID contact-1 not found'),
    );

    expect(repo.delete).toHaveBeenCalledWith('contact-1');
  });
});
