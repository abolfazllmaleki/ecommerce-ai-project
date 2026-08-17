import { CreateContactUseCase } from './create-contact.usecase';
import { IContactRepository } from '../../domain/contact.repository.port';

describe('CreateContactUseCase', () => {
  let usecase: CreateContactUseCase;
  let repo: jest.Mocked<IContactRepository>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
    } as any;

    usecase = new CreateContactUseCase(repo);
  });

  it('should create a contact from the dto', async () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Order issue',
      message: 'I have a problem with my order',
      phone: '1234567890',
      orderNumber: 'ORD-1',
    };

    const savedContact = {
      id: 'contact-1',
      name: 'John Doe',
    };

    repo.create.mockResolvedValue(savedContact as any);

    await expect(usecase.execute(dto as any)).resolves.toEqual(savedContact);

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Order issue',
        message: 'I have a problem with my order',
        phone: '1234567890',
        orderNumber: 'ORD-1',
      }),
    );
  });
});
