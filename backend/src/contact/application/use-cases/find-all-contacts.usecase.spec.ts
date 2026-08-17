import { FindAllContactsUseCase } from './find-all-contacts.usecase';
import { IContactRepository } from '../../domain/contact.repository.port';

describe('FindAllContactsUseCase', () => {
  let usecase: FindAllContactsUseCase;
  let repo: jest.Mocked<IContactRepository>;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
    } as any;

    usecase = new FindAllContactsUseCase(repo);
  });

  it('should return all contacts', async () => {
    const contacts = [
      { id: 'contact-1', name: 'John Doe' },
      { id: 'contact-2', name: 'Jane Doe' },
    ];

    repo.findAll.mockResolvedValue(contacts as any);

    await expect(usecase.execute()).resolves.toEqual(contacts);

    expect(repo.findAll).toHaveBeenCalled();
  });
});
